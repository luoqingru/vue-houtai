<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        // 横轴均分
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [{
        type: 'bar',
        data: [10, 7, 33, 12, 88, 9, 22, 56, 12, 23, 34, 77]
      }],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
