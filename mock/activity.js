import Mock from 'mockjs'

const data = Mock.mock({
  'items|300': [{
    id: '@id',
    title: '@sentence(6, 3)',
    'status|1': ['已开启', '已关闭', '已下线'],
    name: '新用户活动@id',
    start_time: '@datetime',
		end_time: '@datetime'
  }]
})

export default [
  {
    url: '/admin/activity/get',
    type: 'post',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
