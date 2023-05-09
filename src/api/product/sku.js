import request from '@/utils/request'
// 获取sku的数据
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
//  sku上架
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
// 下架
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })
// sku详情
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
