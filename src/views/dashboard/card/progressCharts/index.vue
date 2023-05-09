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
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [{
        type: 'bar',
        data: [78],
        barWidth: 15,
        // color: 'yellowGreen',
        showBackground: true,
        // 设置背景颜色
        backgroundStyle: {
          color: '#eee'
        },
        // 文本标签
        label: {
          show: true,
          // 改变文本内容
          formatter: '|',
          // 文本标签的位置
          position: 'right'
        }
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
