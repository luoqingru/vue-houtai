<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect :show="!isShow" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 底部有三部分切换 -->
      <div v-show="scene===0">
        <el-button icon="el-icon-plus" type="primary" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border style="width: 100%" :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column label="Spu名称" width="150" prop="spuName" />
          <el-table-column label="Spu描述" width="width" prop="description" />
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <hint-button type="success" size="mini" icon="el-icon-plus" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" size="mini" icon="el-icon-edit" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" size="mini" icon="el-icon-info" title="查看当前spu全部的sku列表" @click="handler(row)" />
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除spu" />
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!--
          -->
        <el-pagination
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          layout="prev, pager, next,jumper,->,sizes,total"
          style="text-align: center; margin-top: 20px;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm v-show="scene===1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene===2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" border style="width: 100%;">
        <el-table-column property="skuName" label="名称" width="150" />
        <el-table-column property="price" label="价格" width="150" />
        <el-table-column property="weight" label="重量" width="150" />
        <el-table-column property="date" label="默认图片" width="150">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm/index.vue'
import SkuForm from './SkuForm/index.vue'
export default {
  name: 'Spu',
  components: {
    SpuForm, SkuForm
  },
  data() {
    return {
      isShow: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      spuList: [],
      total: 0,
      scene: 0, // 0表示展示SPU列表  1表示添加SPU/修改SPU  2表示添加SKU
      dialogTableVisible: false, // 控制对话框的显示与隐藏
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      // console.log(id)
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取商品
        this.getSpuList()
      }
    },
    async getSpuList() {
      const res = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
      // console.log(res)
      if (res.code === 200) {
        this.total = res.data.total
        this.spuList = res.data.records
      }
    },
    // 点击分页器第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // 点击
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加SPU按钮的回调
    addSpu() {
      this.scene = 1
      //
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改SPU按钮的回调
    updateSpu(row) {
      this.scene = 1
      // 获取子组件SpuForm的方法
      console.log(this.$refs.spu.initSpuData(row))
    },

    changeScene({ scene, flag }) {
      // flag区分保存按钮是修改还是添加
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      console.log(res)
      if (res.code === 200) {
        this.$message({
          type: 'success', message: '删除成功'
        })
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
      }
    },
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku列表的回调
    async handler(row) {
      this.dialogTableVisible = true
      this.spu = row
      // 获取sku列表
      const res = await this.$API.spu.reqSkuList(row.id)
      console.log(res)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      // 清除sku列表的数据
      this.skuList = []
      // done用于关闭对话框
      done()
    }
  }
}
</script>

<style>

</style>
