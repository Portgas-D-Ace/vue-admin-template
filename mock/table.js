import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(5, 2)',
    'status|1': ['已开启', '已关闭', '已下线'],
    name: '新用户活动@id',
    start_time: '@datetime',
		end_time: '@datetime'
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
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
