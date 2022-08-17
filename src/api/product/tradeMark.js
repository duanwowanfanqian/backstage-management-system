// 这个模块主要获取的是品牌管理的数据的模块

import request from '@/utils/request'

// 获取管理用户分页列表  GET  admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) =>
	request({
		url: `admin/product/baseTrademark/${page}/${limit}`,
		method: 'GET'
	})

// 新增品牌：/admin/product/baseTrademark/save  post  携带两个参数：品牌名称，品牌logo
// 注意：对于新增的品牌，给服务器传递的数据，不需要传递ID，ID是由服务武器生成的

// 修改品牌：/admin/product/baseTrademark/update  put 携带三个参数：id，品牌名称，品牌logo
// 注意：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪个品牌

export const reqAddOrUpdateTradeMark = trademark => {
	// 带给服务器的参数含有id----修改
	if (trademark.id) {
		return request({
			url: '/admin/product/baseTrademark/update',
			data: trademark,
			method: 'PUT'
		})
	} else {
		return request({
			url: '/admin/product/baseTrademark/save',
			data: trademark,
			method: 'POST'
		})
	}
}

// 删除品牌
//  /admin/product/baseTrademark/remove/{id}   delete
export const reqDeleteTradeMark = id => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE' })
