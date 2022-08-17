<template>
  <div>
    <el-form ref="from"
             label-width="80px"
             v-model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"
                  v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"
                   v-model="spu.tmId">
          <!-- value是用来收集数据的 -->
          <el-option v-for="tm in tradeMarkList"
                     :key="tm.id"
                     :label="tm.tmName"
                     :value="tm.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea"
                  placeholder="描述"
                  rows='4'
                  v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- list-type 文件列表的类型(我们这个是照片墙类型，可以上传多个图片)  on-preview点击文件列表中已上传的文件(即图片预览)时的钩子
          file-list	上传的文件列表,用于展示图片的，规定图片对象中要有name和url属性，例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] 
        on-remove	文件列表移除文件时的钩子  on-success	文件上传成功时的钩子   -->
        <el-upload action="/dev-api/admin/product/fileUpload"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :on-success="uploadSucceed"
                   :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- el-dialog用于图片预览 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
                   v-model="attrIdAndAttrName">
          <el-option v-for="unselect in unSelectSaleAttr"
                     :key="unselect.id"
                     :label="unselect.name"
                     :value="`${unselect.id}:${unselect.name}`">
          </el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!attrIdAndAttrName"
                   @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table border
                  :data="spu.spuSaleAttrList">
          <el-table-column type="index"
                           label="序号"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName"
                           label="属性名"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值名称列表"
                           width="width">
            <template v-slot="{row}">
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag :key="tag.id"
                      v-for="(tag,index) in row.spuSaleAttrValueList"
                      closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template v-slot="{row,$index}">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="addOrUpdateSpu">保存</el-button>
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

      dialogImageUrl: '',
      dialogVisible: false,
      // spu用于储存spu信息，因为添加spu时不需要发请求获取数据(修改时需要)，所以我们在初始化spu时需要设置添加时需要的属性。
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性（销售属性）与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [],  // 储存品牌信息
      spuImageList: [], // 存储spu图片的数据
      saleAttrList: [], // 销售属性的数据
      attrIdAndAttrName: '', //收集未选择的销售属性id和销售属性名
    };
  },
  methods: {
    // 获取某个要修改的spu数据
    async initSpuData (id) {
      // 获取spu信息属性
      let spuResult = await this.$API.spu.reqSpu(id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌信息，就是下拉列表里的数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(id);
      //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
      //而我们服务器返回的数据中没有，所以需要把服务器返回的数据进行修改
      if (spuImageResult.code == 200) {
        let imgArr = spuImageResult.data;
        imgArr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        this.spuImageList = imgArr;
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 图片墙的回调
    // 文件列表移除文件时的回调
    handleRemove (file, fileList) {
      //file参数: 被删除的图片的信息
      //fileList:照片墙删除某一张图片以后，剩余的其他图片的信息
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    // 点击文件列表中已上传的文件时(即图片预览)的回调
    handlePictureCardPreview (file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    // 图片上传成功的回调
    uploadSucceed (response, file, fileList) {
      //收集照片墙图片的数据
      this.spuImageList = fileList;
    },
    // 销售属性属性值名称列表中添加按钮的回调
    addSaleAttrValue (row) {
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
      // 切换到input框时获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 销售属性属性值名称列表中input框的失去焦点的回调
    handleInputConfirm (row) {
      //解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复,这里也可以用some
      let flag = row.spuSaleAttrValueList.every(item =>
        item.saleAttrValueName != inputValue
      )
      if (!flag) {
        this.$message("属性值不能重复");
        return;
      }
      //新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      //修改inputVisible为false，不就显示button
      row.inputVisible = false;
    },
    // 添加销售属性的回调
    addSaleAttr () {
      // 将需要添加的销售属性信息收集起来
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象中spuSaleAttrList属性里面添加新的的销售属性
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 销售属性添加至没有时将attrIdAndAttrName置空，否则可以一直添加属性
      this.attrIdAndAttrName = '';
    },
    //保存的回调 
    async addOrUpdateSpu () {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          // 如果有item中有response属性就用response中的data作为imgUrl，没有的话就用url作为imgUrl
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code == 200) {
        //提示
        this.$message({ type: 'success', message: '保存成功' })
        //通知父组件回到场景0
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清除数据
      // Object.assign() 方法将所有可枚举和自有属性从一个或多个源对象(第一个以后的所有参数)复制到目标对象(第一个参数)，返回修改后的对象
      // $options 获取配置对象，this.$options获取当前组件的配置对象，this.$options.data()调用当前组件配置对象中的data方法，
      // 拿到的是data中返回的值，注意是配置时的值，而不是后面获取到数据的值
      // 下面的代码就是将data里的数据变为初始时的值，防止添加spu时页面中残留有上次取消的值，因为this._data是响应式的和data互相关联所以能起到效果
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加spu按钮的回调
    async addSpuData (category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌信息，就是下拉列表里的数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮的回调
    cancel () {
      // flag: '修改' 作用是让其回到之前点击添加时所处的页面
      this.$emit('changeScene', { scene: 0, flag: '修改' });
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr () {
      //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList

      // filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。
      return this.saleAttrList.filter(item => {
        // every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
    }
  }
}

</script>

<style>
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>