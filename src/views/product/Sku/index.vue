<template>
  <div>
    <!-- 展示数据的表格 -->
    <el-table style="width:100%"
              border
              :data="records">
      <el-table-column type="index"
                       label="序号"
                       width="80"
                       align="center">
      </el-table-column>
      <el-table-column prop="skuName"
                       label="名称"
                       width="width">
      </el-table-column>
      <el-table-column prop="skuDesc"
                       label="描述"
                       width="width">
      </el-table-column>
      <el-table-column label="默认图片"
                       width="110">
        <template v-slot="{row}">
          <img :src="row.skuDefaultImg"
               alt=""
               style="width:80px; height:80px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight"
                       label="重量"
                       width="80">
      </el-table-column>
      <el-table-column prop="price"
                       label="价格"
                       width="80">
      </el-table-column>
      <el-table-column label="操作"
                       width="width">
        <template v-slot="{row}">
          <!-- icon图标表示的是sku当前状态，而不是用来表示操作 -->
          <el-button type="success"
                     size="mini"
                     icon="el-icon-bottom"
                     v-if="row.isSale==0"
                     @click="sale(row)"></el-button>
          <el-button v-else
                     type="success"
                     size="mini"
                     icon="el-icon-top"
                     @click="cancel(row)"></el-button>
          <el-button type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     @click="edit"></el-button>
          <el-button type="info"
                     size="mini"
                     icon="el-icon-info"
                     @click="getSkuInfo(row)"></el-button>
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="deleteSkuInfo"></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination :current-page="page"
                   :page-sizes="[3, 5, 7]"
                   :page-size="limit"
                   layout=" prev, pager, next, jumper,->,total, sizes"
                   :total="total"
                   style="text-align:center"
                   @size-change="handleSizeChange"
                   @current-change="getSkuList">
    </el-pagination>

    <!-- 抽屉 -->
    <!-- :before-close="handleClose" -->
    <el-drawer :title="`上架时间：${skuInfo.createTime}`"
               :visible.sync="drawer"
               size='50%'>
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success"
                    v-for="attr in skuInfo.skuAttrValueList"
                    :key="attr.id"
                    style="margin-right:10px;">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <template>
            <!-- 走马灯，也叫轮播图 -->
            <el-carousel height="400px"
                         trigger="click">
              <el-carousel-item v-for="skuImage in skuInfo.skuImageList"
                                :key="skuImage.id">
                <img :src="skuImage.imgUrl"
                     alt=""
                     style="width:512px;">
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
// sku管理
export default {
  name: 'Sku',
  data () {
    return {
      page: 1, // 分页器的当前页数
      limit: 5, // 每页展示多少条数据
      records: [], // 存储SKU列表的数据
      total: 0, // 储存分页器一共多少页
      skuInfo: {}, // 储存sku信息
      drawer: false,  // 控制抽屉显示隐藏
    }
  },
  methods: {
    // 获取sku列表的数据的回调
    async getSkuList (pager = 1) {
      this.page = pager;
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // pageSize（即limit） 改变时会触发
    handleSizeChange (val) {
      //修改参数
      this.limit = val
      this.getSkuList()
    },
    // 上架回调
    async sale (row) {
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: 'success',
          message: '上架成功'
        })
      }
    },
    // 下架回调
    async cancel (row) {
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({
          type: 'success',
          message: '下架成功'
        })
      }
    },
    // 编辑sku
    edit () {
      this.$message({
        type: 'info',
        message: '该功能正在开发中'
      })
    },
    // 查看sku详细信息的回调
    async getSkuInfo (row) {
      let result = await this.$API.sku.reqSkuById(row.id)
      if (result.code == 200) {
        this.skuInfo = result.data;
        this.drawer = true;
      }
    },
    // 删除sku列表的回调
    deleteSkuInfo () {
      this.$message({
        type: 'error',
        message: '您没有此操作权限'
      })
    }

  },
  mounted () {
    //获取sku列表的方法
    this.getSkuList();
  },
}
</script>


<style >
.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
#el-drawer__title {
	color: black;
}
</style>

<style scoped>
/* 通过浏览器检查底层查看的类名 */
.el-row .el-col-5 {
	font-size: 18px;
	text-align: right;
}
.el-col {
	margin: 10px 10px;
}
>>> .el-carousel__button {
	width: 10px;
	height: 10px;
	background: red;
	border-radius: 50%;
}
</style>
