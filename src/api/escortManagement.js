import request from '@/utils/request'
// 获取所有任务列表
export function getAllTaskList(data) {
	return request({
	    url: 'nblink/patrol/checkTask/app/all',
	    method: 'get',
        params: data
	})
}

// 获取任务详情
export function getTaskDetails(taskId) {
	return request({
	    url: `nblink/patrol/checkTask/app/one/${taskId}`,
	    method: 'get'
	})
}

// 扫描科室二维码
export function departmentScanCode(data) {
	return request({
	    url: 'nblink/patrol/checkTask/app/scan',
	    method: 'put',
        data
	})
}

// 检查项通过
export function checkItemPass(data) {
	return request({
	    url: 'nblink/patrol/checkResult/check/OK',
	    method: 'put',
        data
	})
}

// 检查项通过
export function checkItemNoPass(data) {
	return request({
	    url: 'nblink/patrol/checkResult/check/NO',
	    method: 'put',
        data
	})
}

// 提交检查项
export function submitCheckItem(data) {
	return request({
	    url: 'nblink/patrol/checkResult/check/confirm',
	    method: 'put',
        data
	})
}

// 任务完成
export function taskComplete(data) {
	return request({
	    url: 'nblink/patrol/checkTask/app/confirm',
	    method: 'put',
        data
	})
}
