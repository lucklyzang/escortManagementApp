<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <van-nav-bar title="巡查任务" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
            <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
            <div class="current-area">
                <van-icon name="location" color="#1684FC" />
                <span>当前区域: 体检科</span>
            </div>
            <div class="patrol-item-box">
                <div class="patrol-item-list" v-for="(item, index) in patrolItemList" :key="index">
                    <div class="patrol-item-list-left">
                        <span>{{ index + 1}}</span>
                        <span>{{ item.itemName }}</span>
                    </div>
                    <div class="patrol-item-list-right">
                        <van-radio-group v-model="item.isChecked" direction="horizontal">
                            <van-radio name="1" @click="(event) => passEvent(event,item,index)">
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                                </template>
                            </van-radio>
                            <van-radio name="2" @click="(event) => noPassEvent(event,item,index)">
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                                </template>
                            </van-radio>
                        </van-radio-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-complete">确 认</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
export default {
  name: "AreaPatrolDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      loadText: '加载中',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      patrolItemList: [
        {
            itemName: '老人是否都在',
            isChecked: '1'
        },
        {
            itemName: '设施是否安全可用',
            isChecked: '1'
        },
        {
            itemName: '药品是否都有',
            isChecked: '2'
        }
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/workOrderDetails')
  },

  activated () {
    // 控制设备物理返回按键
    this.deviceReturn('/workOrderDetails')
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/workOrderDetails') {
        //此页面进入时重新请求数据
        console.log('重新请求数据');
      }
	  });
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","enterProblemRecordMessage"]),
  },

  methods: {
    ...mapMutations(["changeEnterProblemRecordMessage"]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/workOrderDetails'})
    },

    // 通过事件
    passEvent (event,item,index) {
      console.log(event,item,index)
    },

    // 不通过事件
    noPassEvent (event,item,index) {
      console.log(event,item,index);
      let temporaryInfo = this.enterProblemRecordMessage;
      temporaryInfo['isAllowOperation'] = true;
      temporaryInfo['enterProblemRecordPageSource'] = '/areaPatrolDetails';
      this.changeEnterProblemRecordMessage(temporaryInfo);
      this.$router.push({path: '/problemRecord'})
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
        .current-area {
            height: 54px;
            line-height: 54px;
            width: 94%;
            margin: 0 auto;
            font-size: 16px;
            color: #1684FC;
            /deep/ .van-icon {
                vertical-align: middle
            };
            >span {
                vertical-align: middle
            }
        };
        .patrol-item-box {
            flex: 1;
            width: 100%;
            overflow: auto;
            .patrol-item-list {
                padding: 16px 10px;
                box-sizing: border-box;
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .patrol-item-list-left {
                    font-size: 14px;
                    color: #101010;
                    padding-right: 6px;
                    flex: 1;
                    word-break: break-all;
                    box-sizing: border-box;
                    >span {
                        &:first-child {
                            color: #8E9397;
                            margin-right: 6px;
                        };
                        &:last-child {
                            color: #494D51
                        }
                    }
                };
                .patrol-item-list-right {
                    /deep/ .van-radio-group {
                        .van-radio {
                            .van-radio__icon {
                                height: auto !important
                            };
                            img {
                                width: 30px
                            }
                        };
                        >div {
                            margin-right: 20px;
                            &:last-child {
                                margin-right: 0
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
            width: 80%;
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