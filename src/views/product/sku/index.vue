<template>
  <div>
    <el-table border style="width: 100%;" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button v-if="row.isSale===0" type="success" icon="el-icon-sort-down" size="mini" @click="sale(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit()" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
    <el-drawer :visible.sync="drawer" :direction="direction" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" type="success" style="margin-right: 10px;">{{ item.attrId }}-{{ item.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <!-- <h3 class="small">{{ item }}</h3> -->
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      // 存储sku列表的数据
      records: [],
      total: 0,
      skuInfo: [],
      drawer: false,
      direction: 'rtl'
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const res = await this.$API.sku.reqSkuList(page, limit)
      console.log(res)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const res = await this.$API.sku.reqSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async cancel(row) {
      const res = await this.$API.sku.reqCancelSale(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    async getSkuInfo(row) {
      const res = await this.$API.sku.reqSkuById(row.id)
      console.log(res)
      if (res.code === 200) {
        this.skuInfo = res.data
        this.drawer = true
      }
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-col{
  margin: 10px 10px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    border-radius: 50px;
  }
</style>
