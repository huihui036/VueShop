<template>
  <div class="addgoods">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-alert
        title="添加商品"
        type="info"
        :closable="false"
        show-icon
        style="text-align: center"
      >
      </el-alert>
      <div style="margin-top: 10px">
        <el-steps
          :space="200"
          :active="activeTabName - 0"
          finish-status="success"
          align-center
        >
          <el-step title="商品信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品信息"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
        </el-steps>
      </div>
      <div style="margin-top: 10px; margin-bottom: 20px">
        <el-form
          ref="goosdform"
          :label-position="labelPosition"
          :rules="addgoodsrules"
          :model="addgoodsform"
          label-width="80px"
        >
          <el-tabs
            :tab-position="tabPosition"
            :before-leave="befolevtab"
            v-model="activeTabName"
            style="width: 80%"
            @tab-click="tabclick"
          >
            <el-tab-pane name="0" label="基本信息">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addgoodsform.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addgoodsform.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model.number="addgoodsform.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model.number="addgoodsform.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addgoodsform.goods_cat"
                  :options="catoptions"
                  :props="catdatapro"
                  clearable
                  @change="chagecat"
                >
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="1" label="商品参数">
              <el-form-item
                v-for="(itme, key) in manyattr_name"
                :key="key"
                :label="itme.attr_name"
              >
                <el-checkbox-group v-model="itme.attr_vals">
                  <el-checkbox
                    v-for="(itmes, index) in itme.attr_vals"
                    :key="index"
                    :label="itmes"
                    border
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="2" label="商品信息">
              <el-form-item
                v-for="(itmeonly, key) in olnyattr_name"
                :key="key"
                :label="itmeonly.attr_name"
              >
                <el-input v-model="itmeonly.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品图片">
              <el-upload
                class="upload-demo"
                action="http://localhost:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="successfile"
                list-type="picture"
                :headers="headersobj"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品内容">
              <quill-editor
                v-model="addgoodsform.goods_introduce"
              ></quill-editor>
              <el-button type="primary" @click="addpostdat">主要按钮</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="imgsfile" style=" width:100%" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var catgoodnume = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        }
        callback()
      })
    }
    return {
      activeTabName: '0',
      tabPosition: 'left',
      labelPosition: 'top',
      sel: '',
      // 上传图片请求头
      headersobj: {
        Authorization: window.sessionStorage.getItem('Authorization')
      },
      csedata: {},
      // 图片预览
      imgsfile: '',
      dialogVisible: false,
      // 添加商
      addgoodsform: {
        goods_name: '0',
        goods_price: 1,
        goods_number: 1,
        goods_weight: 1,
        goods_introduce: '',
        goods_cat: [],
        pics: [],
        attrs: []
      },
      // 商品分类
      catdatapro: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      olnyattr_name: [],
      manyattr_name: [],
      catoptions: [],
      addgoodsrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, validator: catgoodnume, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, validator: catgoodnume, trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择活商品分类', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    console.log(this.activeTabName)
    this.getcategories()
  },
  methods: {
    async getcategories() {
      const { data: listadata } = await this.$http.get('categories')
      this.catoptions = listadata.data
      console.log(listadata)
    },
    chagecat() {
      let len = this.addgoodsform.goods_cat.length
      this.addgoodsform.catid = this.addgoodsform.goods_cat[len - 1]
      console.log(this.addgoodsform.goods_cat[len - 1])
    },
    befolevtab(activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.addgoodsform.goods_cat.length < 1) {
          this.$notify.error({
            title: '错误',
            message: '您的商品信息未填写完整，请填写完整商品信息'
          })
          return false
        }
      }
      // return false
    },
    async tabclick() {
      if (this.activeTabName !== '0') {
        this.$refs.goosdform.validate(async valid => {
          if (!valid) {
            this.activeTabName = '0'
            this.$notify.error({
              title: '错误',
              message: '您的商品信息未填写完整，请填写完整商品信息'
            })
          }
          if (this.activeTabName === '1') {
            this.sel = 'many'
            const { data: getcatna } = await this.$http.get(
              `categories/${this.cat_ID}/attributes`,
              {
                params: { sel: this.sel }
              }
            )
            if (!getcatna.data) {
              console.log('123')
            } else {
              getcatna.data.forEach(item => {
                item.attr_vals = item.attr_vals.split(',')
              })
            }
            console.log(getcatna.data)
            this.manyattr_name = getcatna.data
          } else if (this.activeTabName === '2') {
            this.sel = 'only'
            const { data: getcatna } = await this.$http.get(
              `categories/${this.cat_ID}/attributes`,
              {
                params: { sel: this.sel }
              }
            )
            this.olnyattr_name = getcatna.data
          }
        })
      }
    },
    // 上传图片 --图片预览
    handlePreview(files) {
      this.imgsfile = files.response.data.url
      this.dialogVisible = true
    },
    // 上传图片 --删除
    handleRemove(removefile) {
      console.log(removefile)
      let removepat = removefile.response.data.tmp_path
      let i = this.addgoodsform.pics.findIndex(x => x.pic === removepat)
      console.log(i)
      this.addgoodsform.pics.splice(i, 1)
    },
    // 上传成功
    successfile(response) {
      let imgpic = { pic: response.data.tmp_path }
      this.addgoodsform.pics.push(imgpic)
      console.log(this.addgoodsform)
      console.log(response)
    },
    addpostdat() {
      this.$refs.goosdform.validate(async valid => {
        if (valid) {
          console.log(this.addgoodsform)
          this.csedata = this.addgoodsform
          if (this.csedata.goods_cat instanceof Array) {
            this.csedata.goods_cat = this.csedata.goods_cat.join(',')
          }
          console.log(this.olnyattr_name)
          this.olnyattr_name.forEach(itmes => {
            const newfor = {
              attr_id: itmes.cat_id,
              attr_value: itmes.attr_vals
            }
            this.csedata.attrs.push(newfor)
          })
          this.manyattr_name.forEach(itmes => {
            const newfor = {
              attr_id: itmes.cat_id,
              attr_value: itmes.attr_vals
            }
            this.csedata.attrs.push(newfor)
          })

          const { data: res } = await this.$http.post('goods', this.csedata)
          console.log(res)
        }
      })
    }
  },
  computed: {
    cat_ID() {
      if (this.activeTabName === '1' || this.activeTabName === '2') {
        return this.addgoodsform.catid
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped></style>
