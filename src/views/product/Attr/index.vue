<template>
  <div>
    <el-card class="box-card"
             style="width:100%; ">
      <categorySelect @getCategoryId="getCategoryId"
                      :show="!isShowTable"></categorySelect>
    </el-card>
    <el-card class="box-card"
             style="width:100%;  margin:20px 0;">
      <div v-show="isShowTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="addAttr"
                   :disabled="!category3Id">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList"
                  style="width: 100%; margin-top:20px;"
                  border>
          <el-table-column type="index"
                           label="序号"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="attrName"
                           label="属性名称"
                           width="150">
          </el-table-column>
          <el-table-column prop="attrValueList"
                           label="属性值列表">
            <template slot-scope="{row}">
              <!-- Tag标签，一个有背景色和边框的标签 -->
              <el-tag type="danger"
                      v-for="attr in row.attrValueList"
                      :key="attr.id"
                      style="margin:10px;">{{attr.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="150">
            <template scope="{row}">
              <el-button type="primary"
                         size="mini"
                         icon="el-icon-edit"
                         @click="updateAttr(row)"></el-button>
              <el-button type="danger"
                         size="mini"
                         icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true"
                 class="demo-form-inline"
                 ref="form"
                 v-model="attrInfo">
          <el-form-item label="属性名"
                        style="margin-left: 20px;">
            <el-input placeholder="请输入属性名"
                      v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 当我们没有输入属性名时就会将添加属性值的按钮给禁用 -->
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="addAttrValue"
                   :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width:100%; margin: 20px 0;"
                  border
                  :data="attrInfo.attrValueList">
          <el-table-column type="index"
                           label="序号"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值名称"
                           width="width">
            <template v-slot="{row,$index}">
              <!-- 这里结构需要用到span和input进行来回切换 -->
              <el-input v-model="row.valueName"
                        placeholder="请输入属性值名称"
                        size="mini"
                        v-if="row.flag"
                        @blur="toLook(row)"
                        @keyup.native.enter="toLook(row)"
                        :ref="$index"></el-input>
              <!-- 将其转为块级元素，这样它才能占满一个单元格，点击空白时也能切换 -->
              <span v-else
                    @click="toEdit(row,$index)"
                    style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row,$index}">
              <!-- el-popconfirm气泡确定框，用途删除点击按钮时弹出确定消息 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`"
                             @onConfirm="deleteAttrValue($index)">
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary"
                   @click="addOrUpdateAttr"
                   :disabled="attrInfo.attrValueList.length==0">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
// 按需导入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";

export default {
  name: 'Attr',
  data () {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 用于接收平台属性
      attrList: [],
      // 控制表格及添加按钮显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性的数据
      attrInfo: {
        attrName: '',   // 属性名
        attrValueList: [],  // 属性值，因为属性值可以是多个，因此需要的是数组
        categoryId: '',   // 这里的id为三级分类的id
        categoryLevel: 3,   // 这里的分类一定是3级分类，所以一定是3
      },
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId ({ categoryId, level }) {
      // 区分三级分类对应的id,并在父组件进行存储
      if (level == 1) {
        // 当一级分类切换时，将之前的二三级分类id清除
        this.category2Id = ''
        this.category3Id = ''
        this.category1Id = categoryId;
      } else if (level == 2) {
        // 当二级分类切换时，将之前的三级分类id清除
        this.category3Id = ''
        this.category2Id = categoryId
      } else {
        // 当三级分类的id都有了,就发送请求获取品牌属性
        this.category3Id = categoryId
        this.getAttrList();
      }
    },
    // 获取平台属性的回调
    async getAttrList () {
      let result = await this.$API.attr.reqAttrList(this.category1Id, this.category2Id, this.category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }

    },
    // 添加属性值回调
    addAttrValue () {
      // 向属性值数组里面添加元素，同时生成添加属性的表格列表
      this.attrInfo.attrValueList.push({
        // attrId 是我们输入|修改属性时自带 的属性名对应的id
        // valueName 相应的属性值名称
        // flag 控制收集属性值表格的模式（显示|编辑），即文本框和文本标签的显示与隐藏
        attrId: this.attrInfo.id,
        valueName: '',   // 属性值
        flag: true,
      }),
        this.$nextTick(() => {
          // 新添加的表单，索引就是attrInfo.attrValueList的长度减一
          this.$refs[this.attrInfo.attrValueList.length - 1].focus();
        })
    },
    // 添加属性回调
    addAttr () {
      // 将属性展示界面切换为添加|修改属性界面
      this.isShowTable = false,
        // 清除之前的添加|修改属性的数据，并收集3级分类的id
        this.attrInfo = {
          attrName: '',   // 属性名
          attrValueList: [],  // 属性值，因为属性值可以是多个，因此需要的是数组
          categoryId: this.category3Id,   // 三级分类的id
          categoryLevel: 3   // 这里的分类一定是3级分类，所以值一定是3
        }
    },
    // 修该属性回调
    updateAttr (row) {
      this.isShowTable = false;

      // 将选中的属性赋值给attrInfo,让修改时原来的属性值显示
      // 由于row的层级超过了1层，所以使用浅拷贝依然会影响到原数据，所以需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      // 在修改某一个属性时，需要将对应的全部属性值添加flag标记，这样才能切换展示或编辑模式

      this.attrInfo.attrValueList.forEach(item => {
        // 因为vue无法探测通过 obj.property=value 新增的 property(也就是属性)，也是说该属性不是响应式的，所以我们需要使用$set方法来添加
        this.$set(item, 'flag', false);
      })
    },
    // 收集属性值表格中的表单失去焦点回调,(即表单与span的切换)
    toLook (row) {
      // 如果用户输入的属性值名称为空则不能作为新的属性值，需要提示用户输入新的不为空的属性值
      if (row.valueName.trim() == '') {
        this.$message({
          message: '属性值名称不能为空',
          type: 'warning'
        });
        return
      }
      // some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。
      let tf = this.attrInfo.attrValueList.some(item => {
        // 判断的时候需要把收集新增属性值数组当中新增的属性值排除，否则一直都会有相同的
        if (row !== item) {
          return item.valueName == row.valueName
        }
      })
      // 判断新增属性值是否和原有的属性值|之前新增的属性相同，有就提示用户，没有就切换
      if (tf) {
        this.$message({
          message: '属性值名称重复',
          type: 'warning'
        });
        return
      }
      row.flag = false;
    },
    // 点击span的回调,变为编辑模式
    toEdit (row, index) {
      row.flag = true;
      // 获取input节点，自动聚焦
      // 因为点击span切换到编辑模式，重绘回流(回流一定会引起重绘)input需要时间，所以不是直接获取焦点，需要使用$nextTick
      // $nextTick,当节点渲染完毕，会被调用
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 气泡确定框确定按钮的回调
    // 注意：不同版本的element-ui他们的api都有一定变化，需要注意，就像这里气泡确定框的确定触发条件
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮回调
    async addOrUpdateAttr () {
      // 整理参数：首先需要排除valueName为空的数据，二是要将flag属性去除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName != '') {
          delete item.flag
          return true
        }
      })
      if (this.attrInfo.attrValueList.length != 0) {
        try {
          // 发送请求
          await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
          // 提示用户数据提交成功的消息
          this.$message({ message: '数据提交成功', type: 'success' })
          // 切换到展示模式
          this.isShowTable = true;
          // 重新获取新数据
          this.getAttrList();
        } catch (error) {

        }
      }

    }
  }
}
</script>
 
<style>
.box-card {
	width: 480px;
}
</style>
