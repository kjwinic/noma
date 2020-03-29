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
export function updateComplain(id,data) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains/'+id,
    method: 'put',
    data
  })
}

