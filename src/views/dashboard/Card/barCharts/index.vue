<template>
  <div class="charts"
       ref="charts"></div>
</template>

<script>
// 5版本的echarts引入方式
import * as echarts from 'echarts';


export default {
  name: 'barCharts',
  mounted () {
    let lineCharts = echarts.init(this.$refs.charts);

    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        // 均分
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          type: "bar",
          data: [24, 52, 33, 16, 48, 19, 29, 43, 26, 31],
          color: 'aqua'
        }],

      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      // 提示
      tooltip: {
        show: true
      }

    });

  },
}
</script>

<style scoped>
.charts {
	width: 100%;
	height: 100%;
}
</style>