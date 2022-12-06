<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">退出中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <NavBar path="/workOrderDetails" title="问题列表页" />
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <van-tabs v-model="activeName" color="#1684FC" title-inactive-color="#BEC7D1" title-active-color="#1684FC" @change="vanTabsChangeEvent">
                <van-tab title="本次任务" name="currentTask">
                    <div class="backlog-task-list" v-for="(item,index) in taskList" :key="index">
                        <div class="backlog-task-top">
                            <div class="backlog-task-top-left">
                                <span>任务编号</span>
                                <span>{{ item.taskNumber }}</span>
                            </div>
                            <div class="backlog-task-top-right">
                                <span :class="{'spanNoStartStyle': item.status == 1,'spanCompletedStyle': item.status == 3}">{{ taskStatusTransition(item.status) }}</span>
                            </div>
                        </div>
                        <div class="backlog-task-content">
                            <div class="inspect-item">
                                <span>巡查项:</span>
                                <span>{{ item.tasksetName }}</span>
                            </div>
                            <div class="taskset-name">
                                <span>任务集名称:</span>
                                <span>{{ item.tasksetName }}</span>
                            </div>
                            <div class="task-create-time">
                                <span>任务生成时间:</span>
                                <span>{{ item.taskCreateTime }}</span>
                            </div>
                            <div class="complete-patrol-area">
                                <span>区域:</span>
                                <span>{{ item.patrolArea }}</span>
                            </div>
                            <div class="unfinished-patrol-area">
                                <span>检查时间:</span>
                                <span>{{ item.checkTime }}</span>
                            </div>
                            <div class="taskset-number">
                                <span>任务集编号:</span>
                                <span>{{ item.tasksetNumber }}</span>
                            </div>
                            <div class="right-arrow-box" @click="problemRecordEvent">
                                <van-icon name="arrow" color="#1684FC" size="24" />
                            </div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="全部任务" name="allTask">
                    <div class="backlog-task-list" v-for="(item,index) in taskList" :key="index">
                        <div class="backlog-task-top">
                            <div class="backlog-task-top-left">
                                <span>任务编号</span>
                                <span>{{ item.taskNumber }}</span>
                            </div>
                            <div class="backlog-task-top-right">
                                <span :class="{'spanNoStartStyle': item.status == 1,'spanCompletedStyle': item.status == 3}">{{ taskStatusTransition(item.status) }}</span>
                            </div>
                        </div>
                        <div class="backlog-task-content">
                            <div class="inspect-item">
                                <span>巡查项:</span>
                                <span>{{ item.tasksetName }}</span>
                            </div>
                            <div class="taskset-name">
                                <span>任务集名称:</span>
                                <span>{{ item.tasksetName }}</span>
                            </div>
                            <div class="task-create-time">
                                <span>任务生成时间:</span>
                                <span>{{ item.taskCreateTime }}</span>
                            </div>
                            <div class="complete-patrol-area">
                                <span>区域:</span>
                                <span>{{ item.patrolArea }}</span>
                            </div>
                            <div class="unfinished-patrol-area">
                                <span>检查时间:</span>
                                <span>{{ item.checkTime }}</span>
                            </div>
                            <div class="taskset-number">
                                <span>任务集编号:</span>
                                <span>{{ item.tasksetNumber }}</span>
                            </div>
                            <div class="right-arrow-box" @click="problemRecordEvent">
                                <van-icon name="arrow" color="#1684FC" size="24" />
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
export default {
  name: "QuestionList",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      activeName: 'currentTask',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      taskList: [
        {
            taskNumber: 'kx239230237829032780327',
            tasksetName: '日常巡查',
            taskCreateTime: '2022-10-14 00:00',
            patrolArea: '体检科',
            checkTime: '2022-10-14 00:00',
            tasksetNumber: 'kx2392302',
            status: 1

        },
        {
            taskNumber: 'kx239230237829032780327',
            tasksetName: '巡查1',
            taskCreateTime: '2022-10-14 00:00',
            patrolArea: '体检科',
            checkTime: '2022-10-14 00:00',
            tasksetNumber: 'kx2392302',
            status: 3
        },
        {
            taskNumber: 'kx239230237829032780327',
            tasksetName: '日常巡查',
            taskCreateTime: '2022-10-14 00:00',
            patrolArea: '体检科',
            checkTime: '2022-10-14 00:00',
            tasksetNumber: 'kx2392302',
            status: 2

        },
        {
            taskNumber: 'kx239230237829032780327',
            tasksetName: '巡查1',
            taskCreateTime: '2022-10-14 00:00',
            patrolArea: '体检科',
            checkTime: '2022-10-14 00:00',
            tasksetNumber: 'kx2392302',
            status: 3
        }
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/workOrderDetails")
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","enterProblemRecordMessage"])
  },

  methods: {
    ...mapMutations(["changeEnterProblemRecordMessage"]),

    // 任务状态转换
    taskStatusTransition (num) {
        switch(num) {
             case 1 :
                return '未开始'
                break;
            case 2 :
                return '进行中'
                break;
            case 3 :
                return '待签字'
                break;
            case 4 :
                return '已完成'
                break;
        }
    },

    // tab切换值变化事件
    vanTabsChangeEvent (value) {
        console.log(value)
    },


    // 点击进入问题记录页
    problemRecordEvent () {
        let temporaryInfo = this.enterProblemRecordMessage;
        temporaryInfo['isAllowOperation'] = false;
        temporaryInfo['enterProblemRecordPageSource'] = '/questionList';
        this.changeEnterProblemRecordMessage(temporaryInfo);
        this.$router.push('/problemRecord')
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: #fff !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
        color: #fff !important;
        font-size: 22px !important;
        }
        .van-nav-bar__title {
        color: #fff !important;
        font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
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
        /deep/ .van-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 0;
            .van-tabs__wrap {
                .bottom-border-1px(#BEC7D1)
            };
            .van-tabs__content {
                flex: 1;
                padding: 8px 4px 0px 4px;
                box-sizing: border-box;
                background: #f7f7f7;
                overflow: auto;
                .backlog-task-list {
                    padding: 0 8px 4px 8px;
                    box-sizing: border-box;
                    border-radius: 6px;
                    background: #fff;
                    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                    margin-bottom: 10px;
                    .backlog-task-top {
                        height: 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        color: #1684FC;
                        .bottom-border-1px(#BEC7D1);
                        .backlog-task-top-left {
                            flex: 1;
                            .no-wrap()
                        };
                        .backlog-task-top-right {
                            width: 70px;
                            text-align: center;
                            span {
                                display: inline-block;
                                width: 62px;
                                height: 22px;
                                text-align: center;
                                line-height: 22px;
                                background: #289E8E;
                                color: #fff;
                                border-radius: 6px;
                            };
                            .spanNoStartStyle {
                                background: #174E97;
                            };
                            .spanCompletedStyle {
                                background: #101010;
                            }
                        }
                    };
                    .backlog-task-content {
                        position: relative;
                        .right-arrow-box {
                            position: absolute;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            right: 8px;
                            top: 50%;
                            transform: translateY(-50%)
                        };
                        >div {
                          line-height: 28px;
                          word-break: break-all;
                          font-size: 14px;
                          color: #101010  
                        };
                        .inspect-item {
                            color: #1684FC
                        };
                        .complete-patrol-area {
                            >span {
                            }
                        };
                        .unfinished-patrol-area {
                             >span {
                            }
                        }
                    }
                }
            }
        }
    }
  }
}
</style>