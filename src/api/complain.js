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

// ==============================
// 投诉解决方案相关API
// 2020年4月5日 21:04:49
// =================================
export function getComplainPlan(query) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complainplans',
    method: 'get',
    params: query
  })
}
export function updateComplainPlan(id, data) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complainplans/' + id,
    method: 'put',
    data
  })
}

// =======================
// 方案跟踪信息相关API
// 2020年4月6日 21:18:43
// =======================
export function getComplainPlanTracking(query) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complainplantrackings',
    method: 'get',
    params: query
  })
}
