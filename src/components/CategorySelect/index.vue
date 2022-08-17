<template>
  <div>
    <!-- inline：行内表单模式，表示一行可以放置多个表单元素 -->
    <el-form :inline="true"
             class="demo-form-inline"
             v-model="cForm">
      <el-form-item label="一级分类">
        <!-- 当在编辑模式下，三个下来框都被禁用 -->
        <el-select placeholder="请选择"
                   v-model="cForm.category1Id"
                   @change="handler1()"
                   :disabled="show">
          <el-option :label="c1.name"
                     :value="c1.id"
                     v-for="c1 in list"
                     :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择"
                   v-model="cForm.category2Id"
                   @change="handler2"
                   :disabled="show">
          <el-option :label="c2.name"
                     :value="c2.id"
                     v-for="c2 in list2"
                     :key="c2.id"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择"
                   v-model="cForm.category3Id"
                   @change="handler3"
                   :disabled="show">
          <el-option :label="c3.name"
                     :value="c3.id"
                     v-for="c3 in list3"
                     :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data () {
    return {
      // 一级分类数据
      list: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],

      // 收集相应的一级二级三级分类id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      }
    }
  },
  // 组件挂载完毕，向服务器发送请求，获取对应一级分类的数据
  mounted () {
    // 调用获取一级分类数据的方法
    this.getCategoryList()
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategoryList () {
      // 获取一级分类的请求不需要携带参数
      let result = await this.$API.attr.reqCategoryList()
      if (result.code == 200) {
        this.list = result.data;
      } else {
        alert('获取一级列表失败')
      }
    },
    // 一级分类的select事件回调。(当一级分类的option发生变化的时候获取二级分类数据的方法)
    async handler1 () {
      // 清除数据，否则切换一级分类,之前的二三级分类还被保留
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';

      // 给父组件传递选中分类的id和分类的级别
      this.$emit('getCategoryId', { categoryId: this.cForm.category1Id, level: 1 })

      // 获取二级分类的树据
      let result = await this.$API.attr.reqCategory2List(this.cForm.category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      } else {
        alert('获取二级列表失败')
      }
    },
    // 二级分类的select事件回调。(当二级分类的option发生变化的时候获取三级分类数据的方法)
    async handler2 () {
      // 清除数据
      this.list3 = [];
      this.cForm.category3Id = '';

      // 给父组件传递选中分类的id和分类的级别
      this.$emit('getCategoryId', { categoryId: this.cForm.category2Id, level: 2 })

      // 获取三级分类的树据
      let result = await this.$API.attr.reqCategory3List(this.cForm.category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      } else {
        alert('获取三级列表失败')
      }
    },
    // 三级分类的select事件回调。(当三级分类的option发生变化的时候获取列表数据级分类数据的方法)
    handler3 () {
      // 给父组件传递选中分类的id和分类的级别
      this.$emit('getCategoryId', { categoryId: this.cForm.category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>