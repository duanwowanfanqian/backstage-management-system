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
        min: 0,
        max: 100
      },
      yAxis: {
        //隐藏y轴
        show: false,
        // 均分
        type: "category",

      },
      //系列
      series: [
        {
          type: "bar",
          data: [85],
          color: '#bf0',
          // 柱条宽度
          barWidth: 10,
          // 是否显示背景色
          showBackground: true,
          // 背景色配置
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          //文本标签
          label: {
            show: true,
            //改变文本内容
            formatter: '|',
            // 对文字进行偏移
            offset: [114, 0]

          }
        }],

      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },

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