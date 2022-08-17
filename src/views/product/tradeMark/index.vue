<template>
  <div>
    <!-- 按钮组件：type颜色，size大小，icon图标 -->
    <el-button type="primary"
               icon="el-icon-plus"
               style="margin: 10px 0px"
               @click="showDialog">添加</el-button>
    <!--
			表格组件：table属性：
			border：给表格添加边框
			column属性：
		label：显示标题。  width：对应列的宽度。 algin：标题的对齐方式
			type: 如果需要显示索引可以在el-table-column，设置type属性为index即可显示从 1 开始的索引号。
			prop：对应列内容的字段名，也可以使用 property 属性
			注意：element-UI当中的table组件，展示的数据是一列一列进行展示数据
		-->
    <el-table style="width: 100%"
              border
              :data="list">
      <el-table-column type="index"
                       label="序号"
                       width="80px"
                       align="center" />
      <!-- 注意：el-table-column可以直接拿到el-table中data里面的数据，不需要data. -->
      <el-table-column prop="tmName"
                       label="品牌名称"
                       width="width" />
      <el-table-column prop="logoUrl"
                       label="品牌LOGO"
                       width="width">
        <!-- 作用域插槽，在element-ui底层写好了<slot></slot>,且回传了数据如row是一组数据，还有index这里就不写了 -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl"
               style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop"
                       label="操作"
                       width="width">
        <template slot-scope="{ row }">
          <el-button type="warning"
                     icon="el-icon-edit"
                     size="mini"
                     @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
			分页器：
			属性（前面加冒号只是为了数据将引号里的当作js表达式处理）：
			current-page：当前为第几页
			page-size：一页显示多少条数据
			total：一共有多少条数据
			pager-count：页码按钮的数量(除去上一页和下一页)，当总页数超过该值时会折叠
			page-sizes：控制每页显示数据条数的选项设置
			layout：组件布局(会按书写顺序排列)，子组件名用逗号分隔。 ->后面从页面的右边排列
			事件：
			@size-change：修改每页显示数据的条数，底层会将一页显示多少条数据传递过去
			@current-change：修改当前页码数,底层会将新的页码数传递给函数
		-->
    <el-pagination style="margin-top: 20px; textAlign: center"
                   :current-page="page"
                   :page-size="limit"
                   :total="total"
                   :pager-count="7"
                   :page-sizes="[3, 5, 7]"
                   layout=" prev, pager, next, jumper, -> ,sizes, total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" />
    <!--
			对话框：
			:visible.sync：控制对话框的显示与隐藏，true为显示，false为隐藏
		-->

    <el-dialog title="添加品牌"
               :visible.sync="dialogFormVisible">
      <!-- form表单
				v-model属性，这个属性的作用是把表单的数据收集到哪个对象的身上，将来表单验证也需要这个属性
				Form 组件提供了表单验证功能,只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
				注意需要验证的表单一定要有v-model
			-->
      <el-form style="width: 80%"
               :model="tmForm"
               :rules="rules"
               ref="rulesForm">
        <el-form-item :label="this.tmForm.id ? '修改品牌' : '添加品牌'"
                      label-width="100px"
                      prop="tmName">
          <el-input v-model="tmForm.tmName"
                    autocomplete="off" />
        </el-form-item>

        <!-- 图片上传框 -->
        <el-form-item label="品牌LOGO"
                      label-width="100px"
                      prop="logoUrl">
          <!--
						这里收集数据：不能使用v-model,因为不是表单元素，
						action：设置图片上传的地址,注意这里的地址需要加/dev-api，因为他没有使用我们自己封装的axios
						:on-success：当图片上传成功后触发
						:before-upload: 在图片上传前触发
					-->
          <el-upload class="avatar-uploader"
                     action="/dev-api/admin/product/fileUpload"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl"
                 :src="tmForm.logoUrl"
                 class="avatar" />
            <i v-else
               class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addOrUpdateTrademark()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 品牌管理
export default {
  name: 'TradeMark',
  data () {
    // 定义自定义校验规则 rule 校验规则  value 表单的文本   callback 放行
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度在 2 到 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      // 代表当前分页器第几页
      page: 5,
      // 页面展示数据条数
      limit: 3,
      // 一共多少条数据
      total: 0,
      // 页面渲染所需要的数据
      list: [],
      // 对话框显示与隐藏的控制属性
      dialogFormVisible: false,

      // 收集品牌信息，注意对象属性是固定的
      tmForm: {
        // 品牌名称
        tmName: '',
        // 品牌logo
        logoUrl: ''
      },
      rules: {
        /*
          required：表示当前表单是否一定需要内容
      message：提示信息
          trigger 决定什么时候表单验证，上传图片的不是表单所以用不上
         */
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 使用自定义验证规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌的logo验证规则
        logoUrl: [
          { required: true, message: '请选择品牌LOGO' }
        ],
      },
    }
  },
  // 组件挂载完毕发请求
  mounted () {
    // 获取列表数据的方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的数据,注意这里默认参数不能和this中解构的参数重名否者会报错,给一个默认参数，如果调用时没有传递页数默认跳到第四页
    async getPageList () {
      // 解构出参数
      const { page, limit } = this
      // 向服务器获取关于品牌管理的数据
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code == 200) {
        this.list = result.data.records
        this.total = result.data.total
        return 'ok'
      } else {
        return Promise.reject(new Error('faile'))
      }
    },

    // 当切换当前页码数时会触发
    handleCurrentChange (page) {
      // 整理参数
      this.page = page
      this.getPageList()
    },

    // 当分页器某一页需要展示数据条数发生变化时会触发
    handleSizeChange (limit) {
      this.limit = limit
      this.getPageList()
    },

    // 点击添加品牌按钮的回调
    showDialog () {
      // 点击添加按钮先清除tmForm，防止之前添加的商品logo和名称残留
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogFormVisible = true
    },

    // 修改品牌信息回调
    updateTradeMark (row) {
      // row当前用户选中品牌的信息,展示在页面上的都是从服务器获取的所以都含有id
      this.dialogFormVisible = true
      // 将已有品牌信息赋值给tmFrom进行展示
      // 需要将其解构，让其为浅拷贝，否者直接引用地址会影响原对象,而row就是我们list中的一部分所以会影响到页面数据
      this.tmForm = { ...row }
    },

    // 图片上传成功的函数
    handleAvatarSuccess (res, file) {
      // res和file 都是图片上传成功后服务器返回给前端的数据，但后者信息更全，包括了res，id，图片名等等
      this.tmForm.logoUrl = res.data
    },

    // 图片上传之前的函数
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 点击确定按钮，上传图片的回调
    addOrUpdateTrademark () {
      // 当全部验证字段通过，再去书写逻辑
      this.$refs.rulesForm.validate(async (valid) => {
        // 如果全部字段都符合条件
        if (valid) {
          this.dialogFormVisible = false
          // 发请求（添加|修改品牌）
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code == 200) {
            // 弹出添加成功信息，this,$message是element-ui里的一个API，可以在组件消息提示查看
            this.$message({
              // 消息提示是否可以关闭
              showClose: true,
              // 消息提示的内容
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
              // 消息提示的颜色
              type: 'success'
            })
            this.getPageList()
          } else {
            this.$message({
              showClose: false,
              message: this.tmForm.id ? '修改品牌失败' : '添加品牌失败',
              type: 'error'
            })
          }
        } else {
          return false
        }
      })

    },
    // 删除品牌信息
    deleteTradeMark (row) {
      // 弹框
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 确定按钮的回调，向服务器发请求
      })
        .then(async () => {
          // 向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          // 删除成功
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.list.length > 1 ? '' : this.page = this.page - 1
            this.getPageList()

          } else {
            this.$message.error('删除失败')
          }
          // 取消按钮的回调
        }).catch(() => {
          console.log('取消')
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>

