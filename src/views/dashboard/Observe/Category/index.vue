<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span class="analogySale">销售额类别占比</span>

      <el-radio-group style="float: right; padding: 3px 0; "
                      v-model="value">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>

    </div>
    <div>
      <div class="charts"
           ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Category',
  data () {
    return {
      value: '全部渠道'
    }
  },
  mounted () {
    let myChart = echarts.init(this.$refs.charts)
    myChart.setOption({
      title: {
        text: '千反田',
        subtext: "800",
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          // 每块饼的间距
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: 800, name: '千反田' },
            { value: 735, name: '雷姆' },
            { value: 640, name: '小鸟游六花' },
            { value: 713, name: '式守美' },
            { value: 685, name: '02' }
          ]
        }
      ]
    })
    //绑定事件
    myChart.on('mouseover', function (params) {
      myChart.setOption({
        //重新设置标题
        title: {
          text: params.name,
          subtext: params.value
        }
      })
    });
  },
}
</script>

<style scoped>
.analogySale {
	line-height: 46px;
}
.charts {
	width: 100%;
	height: 300px;
}
</style>