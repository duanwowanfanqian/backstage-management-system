<!-- 封装el-button组件 -->
<template>
  <a :title="title"
     style="margin:10px;">
    <!-- $attrs是父组件给子组件传的属性，如果有属性被props接收，则在$attrs中不显示,$listeners获取父组件传过来的事件 -->
    <!-- v-bind可以将所有属性遍历出来，v-on可以将所有事件遍历出来，不能使用简写 -->
    <el-button v-bind="$attrs"
               v-on="$listeners"></el-button>

  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
}
</script>

<style>
</style>