<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <NavBar path="/workOrderDetails" title="工单完成签名" />
    </div>
    <div class="content">
        <ElectronicSignature ref="mychild"></ElectronicSignature>
    </div>
    <div class="btn-area">
        <div class="cancel-btn" @click="cancel">取消</div>
        <div class="overwrite-btn" @click="rewrite">重写</div>
        <div class="sure-btn" @click="sure">确认</div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import ElectronicSignature from '@/components/ElectronicSignature'
import { mapGetters, mapMutations } from "vuex";
import { taskComplete } from '@/api/escortManagement.js'
import {getAliyunSign} from '@/api/login.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import axios from 'axios'
export default {
  name: "WorkOrderElectronicSignature",
  components: {
    NavBar,
    ElectronicSignature
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      isExpire: false,
      loadText: '提交中',
      imgOnlinePathArr: [],
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/workOrderDetails")
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","currentElectronicSignature","patrolTaskListMessage","ossMessage","timeMessage","originalSignature"])
  },

  methods: {
    ...mapMutations(["changeOssMessage","changeTimeMessage"]),

    // 签名重写
    rewrite () {
      this.$refs.mychild.overwrite()
    },

    // 签名确认
    async sure () {
      this.$refs.mychild.commitSure();
      if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
        this.$toast('签名不能为空');
        return
      };
      // 上传图片到阿里云服务器
      this.loadText ='提交中';
      this.overlayShow = true;
      this.loadingShow = true;
      if (Object.keys(this.timeMessage).length > 0) {
        // 判断签名信息是否过期
        if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
          await this.getSign();
          await this.uploadImageToOss(this.currentElectronicSignature)
        } else {
          await this.uploadImageToOss(this.currentElectronicSignature)
        }
      } else {
        await this.getSign();
        await this.uploadImageToOss(this.currentElectronicSignature)
      };
      // 完成任务接口
      taskComplete({
        taskId: this.patrolTaskListMessage.id, // 当前任务id
        signImage: this.imgOnlinePathArr[0], // 签名路径
        workerName: this.userInfo.name // 当前登陆员工
      }).then((res) => {
      if (res && res.data.code == 200) {
        this.loadingShow = false;
        this.overlayShow = false;
        this.$router.push({path: '/patrolTasklist'})
      } else {
        this.$toast({
          type: 'fail',
          message: res.data.msg
        })
      }
    })
    .catch((err) => {
      this.loadingShow = false;
      this.overlayShow = false;
      this.$toast({
        type: 'fail',
        message: err
      })
    });
    console.log('签名',this.currentElectronicSignature)
  },

    // 获取阿里云签名接口
    getSign (filePath = '') {
      return new Promise((resolve, reject) => {
        getAliyunSign().then((res) => {
          if (res && res.data.code == 200) {
            // 存储签名信息
            this.changeOssMessage(res.data.data);
            let temporaryTimeInfo = {};
            temporaryTimeInfo['expire'] = Number(res.data.data.expire);
            // 存储过期时间信息
            this.changeTimeMessage(temporaryTimeInfo);
            if (this.isExpire) {
              this.uploadImageToOss(filePath)
            };
            this.isExpire = false;
            resolve()
          } else {
            this.$toast({
                message: `${res.data.data.msg}`,
                type: 'fail'
            });
            reject()
          }
        })
        .catch((err) => {
          this.$toast({
              message: `${res.data.data.msg}`,
              type: 'fail'
          });
          reject()
        })
      })	
    },
    
    // 上传图片到阿里云服务器
    uploadImageToOss (filePath) {
      return new Promise((resolve, reject) => {
      // OSS地址
      const aliyunServerURL = this.ossMessage.host;
      // 存储路径(后台固定位置+随即数+文件格式)
      const aliyunFileKey = this.ossMessage.dir + new Date().getTime() + Math.floor(Math.random() * 100) + filePath.name;
      // 临时AccessKeyID0
      const OSSAccessKeyId = this.ossMessage.accessId;
      // 加密策略
      const policy = this.ossMessage.policy;
      // 签名
      const signature = this.ossMessage.signature;
      let formData = new FormData();
      formData.append('key',aliyunFileKey);
      formData.append('policy',policy);
      formData.append('OSSAccessKeyId',OSSAccessKeyId);
      formData.append('success_action_status','200');
      formData.append('Signature',signature);
      formData.append('file',filePath);
      axios({
          url: aliyunServerURL,
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
      }).then((res) => {
          this.imgOnlinePathArr.push(`${aliyunServerURL}/${aliyunFileKey}`);
          resolve();
          console.log(this.imgOnlinePathArr);
      })
      .catch((err) => {
          reject()
      })
      })
    },

    // 签名取消
    cancel () {
        this.$refs.mychild.overwrite();
        this.$router.push({
          path: "/workOrderDetails"
        })
    },
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  height: 0;
  .nav {
    width: 100%;
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: #101010 !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
            color: #101010 !important;
            font-size: 22px !important;
        }
        .van-nav-bar__title {
            color: #101010 !important;
            font-size: 16px !important;
        }
    }
  };
  .content {
    width: 96%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0;
    .signature {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        /deep/ .signatureBox {
            width: 100% !important;
            flex: 1
        }
    }
  };
  .btn-area {
    width: 96%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    >div {
        font-size: 14px;
        border-radius: 4px;
        margin-right: 20px;
        flex: 1;
        height: 35px;
        text-align: center;
        line-height: 35px;
    }
    .cancel-btn {
        background: #1684FC;
        color: #fff

    };
    .overwrite-btn {
        border: 1px solid #1684FC;
        color: #1684FC
    };
    .sure-btn {
        background: #E86F50;
        color: #fff;
        margin-right: 0
    }
  }
}
</style>