import request from '@/utils/request'
// 获取所有任务列表
export function getAllTaskList(data) {
	return request({
	    url: 'nblink/patrol/checkTask/app/all',
	    method: 'get',
        params: data
	})
}