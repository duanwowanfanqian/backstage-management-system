<template>
  <div>
    <el-form ref="form"
             label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称"
                  v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元素)"
                  v-model="skuInfo.price"
                  type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"
                  v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea"
                  rows="4"
                  v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form"
                 label-width="80px"
                 :inline="true">
          <el-form-item :label="attrInfo.attrName"
                        v-for="attrInfo in attrInfoList"
                        :key="attrInfo.id">
            <el-select v-model="attrInfo.attrIdAndValueId"
                       placeholder="请选择">
              <el-option :label="attrValue.valueName"
                         :value="`${attrInfo.id}:${attrValue.id}`"
                         v-for="attrValue in attrInfo.attrValueList"
                         :key="attrValue.id">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>

      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form"
                 label-width="80px"
                 :inline="true">
          <el-form-item :label="saleAttr.saleAttrName"
                        v-for="saleAttr in spuSaleAttrList"
                        :key="saleAttr.id">
            <el-select v-model="saleAttr.attrIdAndValueId"
                       placeholder="请选择">
              <el-option :label="saleAttrValue.saleAttrValueName"
                         :value="`${saleAttr.id}:${saleAttrValue.id}`"
                         v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                         :key="saleAttrValue.id">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>

      </el-form-item>
      <el-form-item label="图片列表">
        <!-- selection-change 当选择项(多选框)发生变化时会触发该事件 -->
        <el-table style="width:100%"
                  border
                  :data="spuImageList"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="prop"
                           label="图片"
                           width="width">
            <template v-slot="{row}">
              <img :src="row.imgUrl"
                   style="width:100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName"
                           label="名称"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template v-slot="{row}">
              <el-button v-if="row.isDefault==0"
                         type="primary"
                         @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性的信息
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0, // 品牌id
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: '',
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 存储选中图片的信息
      imageList: []
    }
  },
  methods: {
    // 获取sku数据的回调
    async getData (category1Id, category2Id, spu) {
      //收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片数据
      let result = await this.$API.spu.reqSpuImageLIst(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list
      }
      //获取销售属性数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      //获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.id);
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    // 修改默认图片的回调
    changeDefault (row) {
      // 排他操作，先将其他图片设为菲默认图片
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      })
      //点击的那个图片的数据变为1
      row.isDefault = 1
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 多选框选中的回调
    handleSelectionChange (val) {
      // 获取到用户选中图片的信息数据
      // 注意：val是默认参数它携带来了被选中图片的所有信息，是一个数组
      this.imageList = val
    },
    // 取消按钮的回调
    cancel () {
      //自定义事件，让父组件切换场景0
      this.$emit('changeScenes', 0);
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
    async save () {
      // 整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 整理平台属性数据，整理数据方法一
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          let [attrId, valueId] = item.attrIdAndValueId.split(':');
          skuInfo.skuAttrValueList.push({ attrId, valueId });
        }
      })
      // 整理销售属性数据，整理数据方法二,方法一和二都能实现同样的效果，方法一更好理解
      // reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，
      // 最后将其结果汇总为单个返回值。prev初始值是我们设置的空数组，之后是上一次reducer函数的返回值，curr就是spuSaleAttrList中每一个元素()
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          let [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      // 整理图片列表数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '添加SKU成功' })
        this.$emit('changeScenes', 0)
      }
    }
  },
}
</script>

<style>
</style>