// 平台属性管理模块请求文件
import request from '@/utils/request'
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
// 添加属性与属性值的接口
export const reqSaveAttrInfo = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data: data })
