<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌" value="">
          <el-option v-for="item in tradeMarkList" :key="item.id" :label="item.tmName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" placeholder="请输入SPU描述" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action 图片上传的地址  on-preview图片预览时触发 on-remove图片删除时触发 file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndattrName" :placeholder="`还有${unSelectSaleAttr.length}项未选择`">
          <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndattrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table border style="width: 100%;margin: 20px 0;" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" align="center" width="80px" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <!-- @close="handleClose(tag)" 点击x删除属性值 -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>

          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        // 品牌的id
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      tradeMarkList: [],
      // 存储spu图片的数据
      imgList: [],
      // 销售属性列表
      saleAttrList: [],
      attrIdAndattrName: ''
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      const res = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item1.saleAttrName !== item.name
        })
      })
      return res
    }
  },
  methods: {
    // 照片墙删除照片的回调
    // file参数代表删除的那张图
    // fileList 是删除照片后剩下的照片
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.imgList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    async initSpuData(spu) {
      // console.log('发请求')
      const res = await this.$API.spu.reqSpuData(spu.id)
      console.log(res)
      if (res.code === 200) {
        this.spu = res.data
      }
      // 获取品牌的信息
      const trademarkres = await this.$API.spu.reqTradeMarkList()
      console.log(trademarkres)
      if (trademarkres.code === 200) {
        this.tradeMarkList = trademarkres.data
      }
      // 获取spu图片的数据
      const imgres = await this.$API.spu.reqSpuImgList(spu.id)
      console.log(imgres)
      if (imgres.code === 200) {
        const list = imgres.data
        // 由于照片墙的file-list需要name和url 而imgres.data里面没有这两个属性 而是imgName和imgUrl 所以需要增加两个属性
        list.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.imgList = list
      }
      const baseSaleAttrres = await this.$API.spu.reqBaseSaleAttrList()
      console.log(baseSaleAttrres)
      if (baseSaleAttrres.code === 200) {
        this.saleAttrList = baseSaleAttrres.data
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.imgList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndattrName.split(':')
      // 向spu的销售属性列表添加
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndattrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      console.log(row)
      // 通过响应式数据inputVisible控制input和button切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue收集input收集到的数据
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      // 往当前销售属性里向数组里面新增销售属性值
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 不能重复
      const res = row.spuSaleAttrValueList.some(item => {
        if (item !== row) {
          return item.saleAttrValueName === inputValue
        }
      })
      if (res) {
        this.$message('属性值重复！')
        return
      }
      const newSaleAttr = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttr)
      // 失去焦点变为
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数
      this.spu.spuImageList = this.imgList.map(item => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      console.log(res)
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮
    async addSpuData(category3Id) {
      // 添加spu时收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const trademarkres = await this.$API.spu.reqTradeMarkList()
      console.log(trademarkres)
      if (trademarkres.code === 200) {
        this.tradeMarkList = trademarkres.data
      }
      const baseSaleAttrres = await this.$API.spu.reqBaseSaleAttrList()
      console.log(baseSaleAttrres)
      if (baseSaleAttrres.code === 200) {
        this.saleAttrList = baseSaleAttrres.data
      }
    },
    // 取消按钮的回调
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // this._data 可以操作data中的响应式数据
      // this.$options.data() 可以获取配置对象 配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
