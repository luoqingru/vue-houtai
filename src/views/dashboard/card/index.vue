<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67%<svg t="1682904263247" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5962" width="16" height="16"><path d="M512.146286 454.753524l-266.849524 266.727619L193.584762 669.744762l318.585905-318.415238 318.268952 318.415238-51.736381 51.687619z" p-id="5963" fill="#1296db" /></svg></span>
              <span>日同比&nbsp;&nbsp;19.96%<svg t="1682904563244" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7039" width="16" height="16"><path d="M830.24 340.688l11.328 11.312a16 16 0 0 1 0 22.624L530.448 685.76a16 16 0 0 1-22.64 0L196.688 374.624a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l288.496 288.496 288.512-288.496a16 16 0 0 1 22.624 0z" fill="#1296db" p-id="7040" /></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineCharts />
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barCharts />
            </template>
            <template slot="footer">
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressCharts />
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.67%<svg t="1682904263247" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5962" width="16" height="16"><path d="M512.146286 454.753524l-266.849524 266.727619L193.584762 669.744762l318.585905-318.415238 318.268952 318.415238-51.736381 51.687619z" p-id="5963" fill="#1296db" /></svg></span>
              <span>日同比&nbsp;&nbsp;19.96%<svg t="1682904563244" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7039" width="16" height="16"><path d="M830.24 340.688l11.328 11.312a16 16 0 0 1 0 22.624L530.448 685.76a16 16 0 0 1-22.64 0L196.688 374.624a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l288.496 288.496 288.512-288.496a16 16 0 0 1 22.624 0z" fill="#1296db" p-id="7040" /></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './detail/index.vue'
import lineCharts from './lineChart/index.vue'
import barCharts from './barCharts/index.vue'
import progressCharts from './progressCharts/index.vue'
export default {
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts
  }
}
</script>

<style>

</style>
