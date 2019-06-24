import request from '@/utils/request'

// 活动管理相关 -api

//获取活动列表数据
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
