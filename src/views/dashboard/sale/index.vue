<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visit" />
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          size="mini"
        />
      </div>

    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="16">
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="8" class="right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>8</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>9</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title
        },
        xAxis: {
          data: this.title === '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        series: [{
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.title === '销售额' ? this.listState.orderFullYear : this.listState.userFullYear
        }]
      })
    },
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          rigth: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWidthLabel: true
            }
          }

        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.listState.orderFullYear
        }
      })
    }

  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        rigth: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWidthLabel: true
          }
        }

      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: []
      }
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.box-card{
margin: 10px 0;
}
.clearfix{
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab{
  width:100%
}
.right{
  position: absolute;
  right: 0;
}
.date{
  width: 250px;
  margin: 0 20px;
}
.right span{
  margin: 0 10px;
}
.charts{
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width:100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 10px 0;
}
.rindex{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  background-color:black;
  color: white;
  float: left;
}
.rvalue{
  float: right;
}
</style>
