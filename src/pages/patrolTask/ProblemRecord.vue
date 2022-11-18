<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <van-nav-bar title="问题记录" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
            <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
            <div class="location task-number">
                <span>巡查项</span>
                <span>医院</span>
            </div>
            <div class="location">
                <span>地点</span>
                <span>2022-10-32 12:09</span>
            </div>
            <div class="location">
                <span>时间</span>
                <span>每天</span>
            </div>
            <div class="location issue-picture">
                <div>问题拍照</div>
                <div class="image-list">
                    <img :src="item" alt="" v-for="(item,index) in echoProblemPicturesEchoList" :key="index" @click="enlareEvent(item)">
                </div>
            </div>
            <div class="location problem-description">
                <div>问题描述</div>
                <div>{{ echoProblemDescription }}</div>
            </div>
            <div class="location remark">
                <div>备注</div>
                <div class="remark-content">
                    {{ echoNote }}
                </div>
            </div>
            <div class="location result-picture" v-show="enterProblemRecordMessage.isAllowOperation">
                <div>
                    问题拍照
                </div>
                <div class="image-list">
                <div v-for="(item, index) in problemPicturesList" :key='index'>
                    <img :src="item" />
                    <div class="icon-box" @click="issueDelete(index)">
                        <van-icon
                        name="delete"
                        color="#d70000"
                        />
                    </div>
                </div>
                <div @click="issueClickEvent">
                    <van-icon name="plus" size="30" color="#101010" />
                </div>
                </div>
            </div>
            <div class="location problem-description" v-show="enterProblemRecordMessage.isAllowOperation">
                <div>问题描述</div>
                <div>
                    <van-field
                        v-model="problemDescription"
                        rows="2"
                        autosize
                        type="textarea"
                        maxlength="2000"
                        placeholder="请输入问题描述"
                        show-word-limit
                    />
                </div>
            </div>
            <div class="location remark" v-show="enterProblemRecordMessage.isAllowOperation">
                <div>备注</div>
                <div class="remark-content">
                    <van-field
                        v-model="note"
                        rows="2"
                        autosize
                        type="textarea"
                        maxlength="2000"
                        placeholder="请输入备注"
                        show-word-limit
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-no-complete" v-show="enterProblemRecordMessage.isAllowOperation" v-preventReClick="[sureEvent]">确 认</div>
    </div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
    <div class="img-dislog-box">
        <van-dialog v-model="imgBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
            <img :src="currentImgUrl" />
        </van-dialog> 
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import { compress } from "@/common/js/utils";
export default {
  name: "ProblemRecord",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      photoBox: false,
      imgIndex: '',
      deleteInfoDialogShow: false,
      echoProblemDescription: 'SJAKLSAJS1',
      echoNote: 'DASADAD',
      problemDescription: '',
      note: '',
      loadText: '更新中',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      problemPicturesList: [],
      imgOnlinePathArr: [],
      imgBoxShow: false,
      currentImgUrl: '',
      temporaryFileArray: [],
      echoProblemPicturesEchoList: [require("@/common/images/home/status-background.png"),require("@/common/images/home/status-background.png")]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn(`${this.enterProblemRecordMessage['enterProblemRecordPageSource']}`)
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","enterProblemRecordMessage"])
  },

  methods: {
    ...mapMutations([]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: `${this.enterProblemRecordMessage['enterProblemRecordPageSource']}`})
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentImgUrl = item;
      this.imgBoxShow = true
    },

    // 任务完成事件
      async taskCompleteEvent () {
        if (this.resultImgList.length == 0) {
          this.$toast('结果图片不能为空');
          return
        };
        if (!this.enterRemark) {
          this.$toast('备注不能为空');
          return
        };
        // 上传图片到阿里云服务器
        if (this.resultImgList.length > 0) {
          this.loadText ='提交中';
          this.overlayShow = true;
          this.loadingShow = true;
          for (let imgI of this.temporaryFileArray) {
            if (Object.keys(this.timeMessage).length > 0) {
              // 判断签名信息是否过期
              if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
                await this.getSign();
                await this.uploadImageToOss(imgI)
              } else {
                await this.uploadImageToOss(imgI)
              }
            } else {
              await this.getSign();
              await this.uploadImageToOss(imgI)
            }
          };
          cleaningManageTaskComplete({
              id : this.cleanTaskDetails.id, // 任务id
              state: this.cleanTaskDetails.state,
              taskNumber: this.cleanTaskDetails.taskNumber, // 任务编号
              completeRemark: this.enterRemark, // 任务完成备注
              path: this.imgOnlinePathArr,
              proId: this.userInfo.hospitalList.length == 1 ? this.userInfo.hospitalList[0]['hospitalId'] : this.chooseProject['value'], // 项目id
              proName: this.userInfo.hospitalList.length == 1 ? this.userInfo.hospitalList[0]['hospitalName'] : this.chooseProject['text']  // 项目名称
            })
            .then((res) => {
              this.overlayShow = false;
              this.loadingShow = false;
              if (res && res.data.code == 200) {
                 this.$toast({
                  message: '任务已完成',
                  type: 'success'
                });
                this.$router.push({
                  path: "/cleaningTask"
                })
              } else {
                this.$toast({
                  message: `${res.data.msg}`,
                  type: 'fail'
                })
              }
            })
            .catch((err) => {
              this.overlayShow = false;
              this.loadingShow = false;
              this.$toast({
                message: `${err}`,
                type: 'fail'
              })
            })
        }
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


    // 图片上传预览
      previewFileOne() {
        let file = document.getElementById("demo1").files[0];
        this.temporaryFile = file;
        let _this = this;
        let reader = new FileReader();
        let isLt2M = file.size/1024/1024 < 16;
        if (!isLt2M) {
          this.$dialog.alert({
            message: '上传图片大小不能超过16MB!',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };  
        reader.addEventListener("load", function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.problemPicturesList.push(src);
            _this.temporaryFileArray.push(file);
            _this.photoBox = false;
            _this.overlayShow = false
          }
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        };
      },

      //拍照预览
      previewFileTwo() {
        let file = document.getElementById("demo2").files[0];
        let _this = this;
        let reader = new FileReader();
        let isLt2M = file.size/1024/1024 < 16;
        if (!isLt2M) {
          _this.$dialog.alert({
            message: '上传图片大小不能超过16MB!',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };  
        reader.addEventListener("load", function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.problemPicturesList.push(src);
            _this.temporaryFileArray.push(file);
            _this.photoBox = false;
            _this.overlayShow = false
          }
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        };
      },

    // 拍照点击
    issueClickEvent () {
        this.photoBox = true;
        this.overlayShow = true
    },

    // 拍照照片删除
    issueDelete (index) {
    this.deleteInfoDialogShow = true;
    this.imgIndex = index
    },

    // 确定删除提示框确定事件
    sureDeleteEvent () {
    this.problemPicturesList.splice(this.imgIndex, 1);
    this.temporaryFileArray.splice(this.imgIndex, 1)
    },

    // 拍照取消
    photoCancel () {
      this.photoBox = false;
      this.overlayShow = false
    },

    // 确认事件
    sureEvent () {
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  height: 0;
  .content-wrapper();
  .choose-photo-box {
    position: fixed;
    margin: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    font-size: 0;
    > div {
      width: 100%;
      text-align: center;
      font-size: 16px;
      background: #f6f6f6
    }
    .choose-photo {
      padding: 8px 10px;
      height: 30px;
      .bottom-border-1px(#cbcbcb);
      line-height: 30px;
      position: relative;
      cursor: pointer;
      color: @color-theme;
      overflow: hidden;
      display: inline-block;
      *display: inline;
      *zoom: 1;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 30px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer
      }
    };
    .photo-graph {
      position: relative;
      display: inline-block;
      height: 50px;
      overflow: hidden;
      .bottom-border-1px(#cbcbcb);
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 50px;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 50px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        height: 100%;
        top: 0;
        opacity: 0;
      }
    };
    .photo-cancel {
      position: relative;
      display: inline-block;
      padding: 8px 12px;
      overflow: hidden;
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 30px;
      font-weight: bold
    }
  };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        }
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  .img-dislog-box {
    .van-dialog {
        .van-dialog__content {
            >img {
                width: 100%
            }
        }
    }
  };
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        background: #F7F7F7;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 50px;
        overflow: auto;
        .location {
            padding: 14px 8px;
            box-sizing: border-box;
            display: flex;
            background: #fff;
            margin-top: 6px;
            justify-content: space-between;
            align-items: center;
            >span {
                font-size: 14px;
                display: inline-block;
                &:first-child {
                    color: #101010
                };
                &:last-child {
                color: #1684FC;
                flex: 1;
                text-align: right;
                line-height: 24px;
                padding-left: 8px;
                box-sizing: border-box;
                word-break: break-all
                }
            }
        };
        .issue-picture {
            padding: 14px 8px;
            margin-bottom: 6px;
            box-sizing: border-box;
            display: flex;
            background: #fff;
            justify-content: space-between;
            >div {
                font-size: 14px;
                color: #101010;
                &:first-child {

                };
                &:last-child {
                    flex: 1;
                    margin-left: 8px;
                    >img {
                        width: 31%;
                        height: 80px;
                        margin-right: 2%;
                        margin-bottom: 6px;
                        &:nth-child(3n+3) {
                            margin-right: 0
                        }
                    }
                }
            }
        };
        .problem-description {
            padding: 12px 8px;
            margin-bottom: 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            >div {
                font-size: 14px;
                line-height: 20px;
                &:first-child {
                    color: #101010
                };
                &:last-child {
                    margin-top: 8px;
                    flex: 1;
                    width: 100%;
                    min-height: 20px;
                    word-break: break-all;
                    padding: 6px;
                    box-sizing: border-box;
                    border: 1px solid #e4e3e3;
                    color: #a1a0a0;
                    /deep/ .van-cell {
                        padding: 0 !important
                    }
                }
            }  
        };
        .remark {
            padding: 12px 8px;
            margin-bottom: 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            >div {
                font-size: 14px;
                line-height: 20px;
                &:first-child {
                    color: #101010
                };
                &:last-child {
                    margin-top: 8px;
                    flex: 1;
                    width: 100%;
                    padding: 6px;
                    min-height: 20px;
                    word-break: break-all;
                    box-sizing: border-box;
                    border: 1px solid #e4e3e3;
                    color: #a1a0a0;
                    /deep/ .van-cell {
                        padding: 0 !important
                    }
                }
            }  
        };
        .task-number {
        };
        .task-create-time {
            margin-bottom: 6px;
        };
        .result-picture {
            padding: 14px 8px;
            margin-bottom: 6px;
            box-sizing: border-box;
            display: flex;
            background: #fff;
            justify-content: space-between;
            >div {
                font-size: 14px;
                color: #101010;
                &:first-child {

                };
                &:nth-child(2) {
                    margin-left: 8px;
                    flex: 1;
                    flex-wrap: wrap;
                    display: flex;
                    >div {
                        width: 31%;
                        height: 90px;
                        vertical-align: top;
                        margin-right: 2%;
                        margin-top: 2%;
                        position: relative;
                        &:nth-child(1) {
                            margin-top: 0;
                        };
                        &:nth-child(2) {
                            margin-top: 0;
                        };
                        &:nth-child(3) {
                            margin-top: 0;
                        };
                        &:nth-child(3n+3) {
                            margin-right: 0;
                        };
                        .icon-box {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            display: flex;
                            width: 100%;
                            padding: 2px 0;
                            box-sizing: border-box;
                            justify-content: center;
                            align-items: center;
                            background: #616161;
                            /deep/ .van-icon {
                            }  
                        };
                        img {
                            width: 100%;
                            height: 100%
                        };
                        &:last-child {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #f2f2f2;
                            /deep/ .van-icon{
                                position: relative;
                                top: 0;
                                right: 0;
                            }
                        }
                    }
                }
            }  
        }
    }    
  };
  .task-operation-box {
    height: 80px;
    display: flex;
    width: 100%;
    z-index: 100;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    background: #F7F7F7;
    >div {
      width: 70%;
      height: 48px;
      font-size: 18px;
      line-height: 48px;
      background: #fff;
      text-align: center;
      border-radius: 30px;
      font-weight: bold;
      color: #fff;
      background: linear-gradient(to right, #6cd2f8, #2390fe);
      box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
    }
  }
}
</style>