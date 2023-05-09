import request from '@/utils/request'
// 获取spu列表
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})
// 获取spu数据
export const reqSpuData = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
// 获取品牌数据
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })
// 获取spu图片
export const reqSpuImgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
// 获取销售属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })
// 修改spu或添加spu 区别在于修改spu会带参数id
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
  } else {
    request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
  }
}
// 删除spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取图片的数据
export const reqSpuImgListk = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
// 获取销售属性
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
// 获取平台属性数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加sku
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo })
// 获取sku列表
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
