<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <van-nav-bar title="工单详情" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
            <template #right>
                <van-icon @click="scanQRCodeEvent" name="scan" size="26" color="#fff" />
            </template>
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
            <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
            <div class="location task-number">
                <span>任务编号</span>
                <span>医院</span>
            </div>
            <div class="location">
                <span>所属任务集名称</span>
                <span>2022-10-32 12:09</span>
            </div>
            <div class="location">
                <span>所属任务集生成时间类型</span>
                <span>每天</span>
            </div>
            <div class="location task-create-time">
                <span>该任务生成时间</span>
                <span>2022-10-32 12:09</span>
            </div>
            <div class="patrol-site">
                <div>巡查地点</div>
                <div class="patrol-site-list-box">
                    <div class="patrol-site-list" v-for="(item,index) in patrolSiteList" :key="index" @click="patrolSiteEvent">
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-no-complete" @click="viewProblemItemsEvent">查看问题项</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "WorkOrderDetails",
  components: {
    NavBar
  },
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      loadText: '更新中',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      patrolSiteList: [
        {
            name: '肛肠洒洒水科',
            id: 1
        },
        {
            name: '肛肠现在科',
            id: 2
        },
        {
            name: '肛肠飒飒飒飒飒飒飒飒撒科',
            id: 3
        },
        {
            name: '肛肠现在科',
            id: 4
        },
        {
            name: '肛肠下科',
            id: 5
        },
        {
            name: '肛肠程序出错科',
            id: 6
        },
        {
            name: '肛肠踩踩踩法国科',
            id: 7
        },
        {
            name: '肛肠科反对反对反对',
            id: 8
        }
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/patrolTasklist",
        })
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","patrolTaskListMessage"]),
  },

  methods: {
    ...mapMutations([]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/patrolTasklist'})
    },

    // 巡查地点事件
    patrolSiteEvent () {
      this.$router.push({path: '/areaPatrolDetails'})
    },

    // 查看问题项事件
    viewProblemItemsEvent () {
      this.$router.push({path: '/QuestionList'})
    },

    // 扫码事件
    scanQRCodeEvent () {
      this.scanQRCode()
    },

    // 扫描二维码方法
    scanQRCode () {
      window.android.scanQRcode();
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {},

    // 任务状态转换
    stausTransfer (num) {
      switch(num) {
        case 1:
            return '未开始'
            break;
        case 2:
            return '进行中'
            break;
        case 3:
            return '复核中'
            break;
        case 4:
            return '已完成'
            break;
        case 5:
            return '已复核'
            break
      } 
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
        .location {
            padding: 14px 8px;
            box-sizing: border-box;
            display: flex;
            background: #fff;
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
        .task-number {
            .bottom-border-1px(#BEC7D1)
        };
        .task-create-time {
            margin-bottom: 6px;
        };
        .patrol-site {
            flex: 1;
            background: #fff;
            padding: 14px 8px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #101010;
            .patrol-site-list-box {
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;
                .patrol-site-list {
                    height: 32px;
                    line-height: 32px;
                    border-radius: 4px;
                    text-align: center;
                    padding: 0 6px;
                    color: #fff;
                    box-sizing: border-box;
                    background: #b1b1b1;
                    margin-right: 8px;
                    margin-bottom: 8px
                };
                .patrolSiteListStyle {
                    background: #1684FC
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
    align-items: center;
    justify-content: center;
    background: #fff;
    >div {
      width: 48%;
      height: 48px;
      font-size: 18px;
      line-height: 48px;
      background: #fff;
      text-align: center;
      border-radius: 30px;
      &:first-child {
        color: #1684FC;
        border: 1px solid #1684FC
      }
    }
  }
}
</style>