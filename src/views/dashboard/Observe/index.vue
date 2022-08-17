<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <Search></Search>
      </div>
    </el-col>
    <Category></Category>
    <el-col :span="12">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
  </el-row>

</template>

<script>
import Search from './Search'
import Category from './Category'

export default {
  name: 'Observe',
  components: {
    Search,
    Category
  }
}
</script>

<style>
</style>