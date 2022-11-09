// 登录信息store的初始值
export function getDefaultLoginState() {
    return {
        userInfo: null, //用户信息
        permissionInfo: [], //权限列表
        roleNameList: [], //角色列表
        isLogin: false, //是否登录
        token: null, //请求token
        overDueWay: false, // 过期方式
        timeMessage: {}, //阿里云签名过期时间信息
        ossMessage: {}, //阿里云签名信息
        chooseProject: [] //选择的医院 
    }
};
// 陪护管理信息store的初始值
export function getDefaultEscortManagementState() {
    return {
        enterProblemRecordMessage: {}, //进入问题记录页时携带的相关信息
        patrolTaskListMessage: {}, //巡查任务列表信息
    }
};