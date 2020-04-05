import request from '@/utils/request'

// 获取投诉详情
export function getComplain(query) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains',
    method: 'get',
    params: query
  })
}
// 编辑投诉详单
export function updateComplain(id, data) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains/' + id,
    method: 'put',
    data
  })
}
// 上传excel
export function uploadComplain(data) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains',
    method: 'post',
    data
  })
}

// 获取无线用户投诉解决方案
// 2020年4月5日 21:04:49
export function getComplainPlan(query) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complainplans',
    method: 'get',
    params: query
  })
}
