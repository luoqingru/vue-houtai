<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>

        <el-dropdown>
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart />
        </el-col>
        <el-col :span="12">
          <LineChart />
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" border="">
        <el-table-column
          label="排名"
          type="index"
          width="80"
        />
        <el-table-column
          label="搜索关键字"
          width="180"
        />
        <el-table-column
          sortable
          label="用户数"
        />
        <el-table-column
          sortable
          label="周涨幅"
        />
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        class="pagination"
      />
    </div>
  </el-card>
</template>

<script>
import LineChart from './lineChart/index.vue'
export default {
  components: {
    LineChart
  },
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>

<style scoped>
.search-header{
  display: flex;
  justify-content: space-between;
}
.header{
  border-bottom: 1px solid #eee;
  padding: 5px 0;
}
.pagination{
  float: right;;
}
</style>
