<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>线上热门搜索</span>

      <el-dropdown style="float: right; padding: 3px 0">
        <span>
          <i class="el-icon-more"></i>
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
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
      </el-row>

      <el-table style="width: 100%"
                border
                :data="topSearch">
        <el-table-column type="index"
                         label="排名"
                         width="80">
        </el-table-column>
        <el-table-column prop="keyword"
                         label="搜索关键字"
                         width="width">
        </el-table-column>
        <el-table-column prop="users"
                         label="用户数"
                         sortable
                         width="width">
        </el-table-column>
        <el-table-column prop="advance"
                         label="周涨数"
                         sortable
                         width="width">
        </el-table-column>
      </el-table>

      <el-pagination layout="prev, pager, next"
                     :total="1000"
                     style="text-align:right; margin: 0px 0 -20px 0;">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './lineCharts'

export default {
  name: 'Search',
  data () {
    return {
      topSearch: [
        { keyword: 'JK制服', users: 13260, advance: '20%' },
        { keyword: '衬衫', users: 10210, advance: '15%' },
        { keyword: '运动鞋', users: 8260, advance: '13%' },
      ]
    }

  },
  components: {
    LineCharts
  }
}
</script>

<style scoped>
</style>