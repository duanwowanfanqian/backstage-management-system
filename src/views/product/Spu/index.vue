<template>
  <div>
    <el-card class="box-card"
             style="width:100%; ">
      <CategorySelect @getCategoryId="getCategoryId"
                      :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card class="box-card"
             style="width:100%; margin:20px 0;">
      <!-- 底部这里将来有三部分进行切换 -->
      <div v-show="scene==0">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!category3Id"
                   @click="addSpu">添加SPU</el-button>
        <el-table border
                  :data="records">
          <el-table-column type="index"
                           label="序号"
                           align="center"
                           :width="80">
          </el-table-column>
          <el-table-column prop="spuName"
                           label="SPU名称"
                           width="width">
          </el-table-column>
          <el-table-column prop="description"
                           label="SPU描述"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template v-slot="{row,$index}">
              <HintButton type="success"
                         size="mini"
                         icon="el-icon-plus"
                         title="添加sku"
                         @click="addSku(row)"></HintButton>
              <HintButton type="warning"
                         size="mini"
                         icon="el-icon-edit"
                         title="修改spu"
                         @click="updateSpu(row)"></HintButton>
              <HintButton type="info"
                         size="mini"
                         icon="el-icon-info"
                         title="查看当前spu全部sku列表"
                         @click="handler(row)"></HintButton>
              <el-popconfirm title="确定删除这一段内容吗？"
                             @onConfirm="deleteSpu(row)">
                <HintButton type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           title="删除spu"
                           slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <SkuForm v-show="scene==2"
               @changeScenes="changeScenes"
               ref="sku" />
      <SpuForm v-show="scene==1"
               @changeScene="changeScene"
               ref="spu" />
      <el-pagination style="margin-top: 20px; textAlign: center"
                     :current-page="page"
                     :page-size="limit"
                     :total="total"
                     :pager-count="7"
                     :page-sizes="[3, 5, 7]"
                     @size-change="handleSizeChange"
                     @current-change="getSpuList"
                     layout=" prev, pager, next, jumper, -> ,sizes, total" />
    </el-card>

    <el-dialog :title="`${spu.spuName}的sku列表`"
               :visible.sync="dialogVisible"
               :before-close="close">
      <el-table :data="skuList"
                style="width: 100%"
                border
                v-loading="loading">
        <el-table-column prop="skuName"
                         label="名称"
                         width="width">
        </el-table-column>
        <el-table-column prop="price"
                         label="价格"
                         width="width">
        </el-table-column>
        <el-table-column prop="weight"
                         label="重量"
                         width="width">
        </el-table-column>
        <el-table-column label="默认图片"
                         width="width">
          <template v-slot="{row}">
            <img :src="row.skuDefaultImg"
                 style="width:100px; height:100px;">
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

// spu管理
export default {
  name: 'Spu',
  data () {
    return {
      // 三级分类的分类id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的功能是否可用
      show: true,
      page: 1,  // 分页器当前页数
      limit: 3,  // 每一页需要展示几条数据
      records: [],  // spu列表的数据
      total: 0,  // 分页器一共要展示多少条数据
      scene: 0, // 0 代表展示spu列表数据  1 添加spu|修改spu   2 添加sku
      dialogVisible: false,  // 控制sku列表显示与隐藏
      spu: {},
      skuList: [],  // 储存sku列表信息
      loading: true,   // 控制sku列表懒加载
    }
  },
  methods: {
    // 自定义事件的回调，用户获取
    getCategoryId ({ categoryId, level }) {
      if (level == 1) {
        this.category2Id = '';
        this.category3Id = '';
        this.category1Id = categoryId;
      } else if (level == 2) {
        this.category3Id = '';
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu列表数据的回调
    async getSpuList (pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      // 携带三个参数：page 第几页，limit 一页展示多少条数据，category3Id 三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 修改展示页面数据条数的回调
    handleSizeChange (limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu的回调
    addSpu () {
      this.scene = 1;
      // 通知子组件发请求获取品牌和销售属性
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个spu的回调
    updateSpu (row) {
      this.scene = 1;
      // 调用子组件中的initSpuData中的方法
      this.$refs.spu.initSpuData(row.id);
    },
    // 自定义事件的回调，是用户修改spu时点击取消按钮的回调
    changeScene ({ scene, flag }) {
      //flag这个形参为了区分保存按钮是添加还是修改
      //切换结构（场景）
      this.scene = scene;
      //子组件通知父组件切换场景，需要再次获取SPU列表的数据进行展示
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }

    },
    // 删除spu的回调
    async deleteSpu (row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku的回调
    addSku (row) {
      // 切换到场景2
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求---三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 自定义事件的回调，是用户添加sku时点击取消按钮的回调
    changeScenes (scene) {
      this.scene = scene
      this.getSpuList(this.page)
    },
    // 查看sku列表的回调
    async handler (row) {
      //点击这个按钮的时候，对话框可见的
      this.dialogVisible = true
      //保存spu信息
      this.spu = row
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭sku列表的回调
    close (done) {
      //loading属性再次变为真
      this.loading = true
      //清除sku列表的数据
      this.skuList = []
      //关闭对话框(也就是关闭sku列表的回调)
      done()
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
}
</script>

<style>
</style>