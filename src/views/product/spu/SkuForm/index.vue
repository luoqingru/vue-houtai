<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" placeholder="规格描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="item in spuAttrInfo" :key="item.id" :label="item.attrName">
            <el-select v-model="item.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="item1 in item.attrValueList" :key="item1.id" :label="item1.valueName" :value="`${item.id}:${item1.attrId}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="item in spuSaleAttrList" :key="item.id" :label="item.saleAttrName">
            <el-select v-model="item.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="item1 in item.spuSaleAttrValueList" :key="item1.id" :label="item1.saleAttrValueName" :value="`${item.id}:${item1.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImgList" @selection-change="handleSelectionChange">
          <el-table-column prop="date" label="日期" width="80" type="selection" />
          <el-table-column prop="date" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="date" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault===0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImgList: [],
      spuSaleAttrList: [],
      spuAttrInfo: [],
      skuInfo: {
        category3Id: '',
        tmId: 0,
        spuId: 0,
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 默认图片
        skuDefaultImg: '',
        skuImageList: [],
        // 平台属性
        skuAttrValueList: [],
        // 销售属性
        skuSaleAttrValueList: []

      },
      spu: {},
      imgList: []
    }
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片数据
      const res = await this.$API.spu.reqSpuImgListk(spu.id)
      console.log(res)
      if (res.code === 200) {
        const list = res.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImgList = list
      }
      // 获取销售属性数据
      const res1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      console.log(res1)
      if (res1.code === 200) {
        this.spuSaleAttrList = res1.data
      }
      // 获取平台属性的数据
      const res2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      console.log(res2)
      if (res2.code === 200) {
        this.spuAttrInfo = res2.data
      }
    },
    // table表格复选框的改变事件
    handleSelectionChange(select) {
      this.imgList = select
    },
    // 排他 点击当前按钮设为默认 其他的不是
    changeDefault(row) {
      this.spuImgList.forEach(item => item.isDefault === 0)
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {
      // 自定义事件 让父组件切换为场景0
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    async save() {
      // alert(111)
    // 整理参数
    // 整理平台属性
      const { spuAttrInfo, skuInfo, spuSaleAttrList, imgList } = this
      // spuAttrInfo.forEach(item=>{
      //   if(item.attrIdAndValueId){
      //     const [attrId,valueId]=item.attrIdAndValueId.split(':')
      //     let obj={attrId,valueId}
      //     this.skuAttrValueList.push(obj)

      //   }
      // })
      skuInfo.skuAttrValueList = spuAttrInfo.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 图片列表
      skuInfo.skuImageList = imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id

        }
      })
      // 发请求
      const res = await this.$API.spu.reqAddSku(skuInfo)
      console.log(res)
      if (res.code === 200) {
        this.$message({ type: 'succcess', message: '添加sku成功' })
        this.$emit('changeScenes', 0)
      }
    }
  }
}

</script>

<style>

</style>
