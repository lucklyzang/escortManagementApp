<template>
  <div class="page-box" ref="wrapper">
    <div class="content">
        <div class="subproject">
            <h2>保洁管理</h2>
            <div class="subproject-list-box">
                <div class="subproject-list" v-for="(item,index) in cleaningManagementList" 
                    :key="index"
                    @click="cleanManagementEvent(item,index)"
                >
                    <img :src="item.imgUrl" alt="">
                    <span>{{ item.name }}</span>
                </div> 
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    import {
    } from '@/api/escortManagement.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
        IsPC,
        removeExceptLoginMessageLocalStorage
    } from '@/common/js/utils'
    export default {
        name: 'Home',
        components: {
        },
        data() {
            return {
                activeObjectName: 'environmentalManagement',
                cleaningManagementList: [
                    {
                        name: '任务列表',
                        imgUrl: require("@/common/images/home/task-list.png")
                    },
                    {
                        name: '考勤管理',
                        imgUrl: require("@/common/images/home/attendance-management.png")
                    },
                    {
                        name: '考勤统计',
                        imgUrl: require("@/common/images/home/attendance-statistics.png")
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
						path: '/home'
					})
                })
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin'
            ])
        },

        methods: {
            ...mapMutations([
                "changeChooseProject"
            ]),

            // 保洁管理子项点击事件
            cleanManagementEvent (item, index) {
            }
        }
    }
</script>
<style lang='less' scoped>
    @import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
    .page-box {
        background: #F8F8F8;
        .content-wrapper();
        .content {
           .subproject {
                width: 100%;
                height: 160px;
                background: #fff;
                border-radius: 8px;
                margin-top: 10px;
                padding: 10px 12px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                h2 {
                    width: 100%;
                    height: 24px;
                    font-size: 16px;
                    color: #242424;
                    font-weight: bold;
                };
                .subproject-list-box {
                    width: 100%;
                    display: flex;
                    height: 100px;
                    .subproject-list {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        >img {
                            width: 50px;
                            height: 50px;
                            margin-left: 6px;
                        };
                        >span {
                            margin-top: 10px;
                            font-size: 16px;
                            color: #101010
                        }
                    }
                }
            }
        }
    }
</style>