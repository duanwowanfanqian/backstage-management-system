<template>
  <el-card class="box-card"
           style="margin:10px 0;">
    <div slot="header"
         class="clearfix"
         id="upten">
      <!--    @tab-click="handleClick" -->
      <el-tabs class="tab"
               v-model="activeName">
        <el-tab-pane label="销售额"
                     name="sale">
        </el-tab-pane>
        <el-tab-pane label="访问量"
                     name="visite">
        </el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--  -->
        <el-date-picker v-model="date"
                        class="date"
                        type="daterange"
                        range-separator="—"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="16">
          <div class="grid-content bg-purple"
               ref="charts">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
            <h3>线下连锁店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex reds">0</span>
                <span>沙县小吃</span>
                <span class="rvalue ">196328</span>
              </li>
              <li>
                <span class="rindex reds">1</span>
                <span>肯德基</span>
                <span class="rvalue">181341</span>
              </li>
              <li>
                <span class="rindex reds">3</span>
                <span>麦当劳</span>
                <span class="rvalue">172648</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>重庆小面</span>
                <span class="rvalue">143318</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>华莱士</span>
                <span class="rvalue">121345</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>汉堡王</span>
                <span class="rvalue">120388</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>真功夫</span>
                <span class="rvalue">110587</span>
              </li>

            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>

</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
// 该组件中被注释的代码都是使用了mock数据的代码，会和服务器冲突导致不能登录等等，所以不用，
// import { mapState } from 'vuex'

export default {
  name: 'Sale',
  data () {
    return {
      // v-model不仅有数据绑定的作用，还可以指定默认元素，如上面就指定销售额el-tab-pone为默认选中的
      activeName: 'sale',
      myCharts: null,
      //收集日历数据
      date: []
    }
  },
  mounted () {
    //初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: this.title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          max: 500
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
          color: 'orange',
        }
      ]
    })
  },
  computed: {
    //重新设置配置项
    title () {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    },
    // ...mapState({
    //   listState: state => state.home.list
    // })
  },
  watch: {
    //重新修改图标的配置数据
    //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
    title () {
      this.myCharts.setOption({
        title: {
          text: this.title,
        },
        // xAxis: {
        //   data: this.title == '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis,
        // },
        // series: {
        //   name: 'Direct',
        //   type: 'bar',
        //   barWidth: '60%',
        //   data: this.title == '销售额' ? this.listState.orderFullYear : this.listState.userFullYear,
        //   color: 'orange',
        // }

      })
    },
    // 在页面渲染时listState还没有拿到数据，此时页面中的柱形图为空，所以我们要监听listState,当其拿到数据就重新生成图表
    listState () {
      // this.myCharts.setOption({
      //   title: {
      //     text: this.title
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'shadow'
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: this.listState.orderFullYearAxis,
      //       axisTick: {
      //         alignWithLabel: true
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       max: 500
      //     }
      //   ],
      //   series: [
      //     {
      //       name: 'Direct',
      //       type: 'bar',
      //       barWidth: '60%',
      //       data: this.listState.orderFullYear,
      //       color: 'orange',
      //     }
      //   ]
      // })
    }
  },
  methods: {
    //本天
    setDay () {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //本周
    setWeek () {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth () {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear () {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },

  },
}
</script>

<style scoped>
.clearfix {
	position: relative;
	display: flex;
	justify-content: space-between;
}

.tab {
	width: 100%;
}

.right {
	position: absolute;
	right: 0;
}

.right span {
	margin: 0 10px;
}

.date {
	margin: -10px 20px 0 20px;
}

.bg-purple {
	width: 100%;
	height: 300px;
}

.bg-purple-light {
	padding-left: 100px;
}

ul {
	list-style: none;
	padding-left: 10px;
}

li {
	margin-bottom: 12px;
}

.rindex {
	display: inline-block;
	width: 20px;
	height: 20px;
	text-align: center;
	background-color: rgb(205, 200, 200);
	color: white;
	border-radius: 50%;
	margin-right: 20px;
}

.rvalue {
	float: right;
	margin-right: 10px;
}

.reds {
	background-color: rgb(0, 179, 255);
}
</style>