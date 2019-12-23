<template>
  <div class="paeams">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 10px">
      <el-row>
       <el-col :span="24" style="margin-bottom: 30px">
         <el-alert
           title="警告提示的文案"
           type="warning"
           show-icon>
         </el-alert>
       </el-col>
        </el-row>
      <el-row>
        <el-col :span="8">
          <el-form  label-width="80px">
            <el-form-item label="活动名称:">
              <div class="block">
                <el-cascader
                  :props="listsdat"
                  expand-trigger="hover"
                  :options="optionslist"
                  v-model="selecteddata"
                  @change="handleChange">
                </el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-row>
          <el-col :span="5"><el-button type="primary" :disabled="isbtndisable" @click="addmayparams">添加按钮</el-button></el-col>
          <el-table
            border
            :data="listtableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag size="small" closable v-for='(ietm, key) in scope.row.attr_vals' :key="key" class="magelet" @close="delethistaga( key, scope.row)">{{ietm}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="商品参数"
              width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" plain  @click="xietparmas(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="deldetparmas(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-row>
          <el-col :span="5"><el-button type="primary" :disabled="isbtndisable" @click="addmayparams">添加分类</el-button></el-col>
          <el-table
            border
            :data="onlylistbleData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag size="small" closable v-for='(ietm, key) in scope.row.attr_vals' :key="key" class="magelet" @close="delethistaga( key, scope.row)">{{ietm}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="180">
            </el-table-column>
              <el-table-column
                prop="attr_vals"
                label="属性值"
                width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="xietparmas(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="deldetparmas(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--添加动态分类对话框-->
    <el-dialog
      title="添加动态"
      @close="closeaddmayn"
      :visible.sync="mayndialogVisible"
      width="50%">
      <el-form ref="manyadddform" :model="manyadddform" label-width="80px" :rules="maynsrules">
        <el-form-item label="商品参数" prop="attr_name">
          <el-input v-model="manyadddform.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="attr_vals">
          <el-input v-model="manyadddform.attr_vals" placeholder="英文逗号分隔"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="mayndialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="postmayndata" >确 定</el-button>
  </span>
    </el-dialog>
    <!--添加静态属性对话框-->
    <el-dialog
      title="添加静态属性"
      @close="closeaddmayn"
      :visible.sync="mayndialogVisible"
      width="50%">
      <el-form ref="manyadddform" :model="manyadddform" label-width="80px" :rules="maynsrules">
        <el-form-item label="商品参数" prop="attr_name">
          <el-input v-model="manyadddform.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals">
          <el-input v-model="manyadddform.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="mayndialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="postmayndata">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="修改属性"
      :visible.sync="eitdialogVisible"
      width="50%">
      <el-form ref="manyadddform" :model="eitadddform" label-width="80px" :rules="maynsrules">
        <el-form-item label="商品参数" prop="attr_name">
          <el-input v-model="eitadddform.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals">
          <el-input v-model="eitadddform.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eitdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="putparams" >确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'many',
      optionslist: [],
      // d静态表格参数
      listtableData: [],
      // 修改对话框
      eitdialogVisible: false,
      eitadddform: {},
      // 动态表格
      onlylistbleData: [],
      selecteddata: {},
      listsdat: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      mayndialogVisible: false,
      manyadddform: {},
      postpaedata: {},
      maynsrules: {
        attr_name: [
          { required: true, message: '请输入商品参数', trigger: 'blur' }
        ],
        attr_vals: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      },
      inputValue: '',
      tyepthreedata: {}
    }
  },
  created() {
    this.getcategories()
  },
  methods: {
    async getcategories() {
      const { data: listadata } = await this.$http.get('categories')
      this.optionslist = listadata.data
      console.log(listadata)
    },
    handleClick(tab) {
      console.log(tab.name)
      console.log(tab.disabled)
      this.getallparamsdata()
    },
    async getallparamsdata() {
      if (this.selecteddata.length !== 3) {
        this.$message.error('选择三级权限')
        this.listtableData = []
        this.onlylistbleData = []
        return
      }
      const { data: lsitda } = await this.$http.get(`categories/${this.setcalId}/attributes`, { params: { sel: this.activeName } })
      if (lsitda.meta.status !== 200) {
        this.$message.error(lsitda.meta.msg)
        return
      }
      lsitda.data.forEach(iemts => {
        iemts.attr_vals = iemts.attr_vals.split(',')
        iemts.inputVisible = false
        iemts.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.listtableData = lsitda.data
      } else {
        this.onlylistbleData = lsitda.data
      }
      console.log(lsitda)
    },
    handleChange() {
      this.getallparamsdata()
    },
    addmayparams() {
      this.mayndialogVisible = true
    },
    postmayndata() {
      this.$refs.manyadddform.validate(async (valid) => {
        if (valid) {
          this.postpaedata.attr_name = this.manyadddform.attr_name
          this.postpaedata.attr_vals = this.manyadddform.attr_vals
          this.postpaedata.attr_sel = this.activeName
          const { data: parmasdata } = await this.$http.post(`categories/${this.setcalId}/attributes`, this.postpaedata)
          if (parmasdata.meta.status !== 201) {
            return this.$message.error(parmasdata.meta.msg)
          }
          this.getallparamsdata()
          this.mayndialogVisible = false
        }
      })
    },
    closeaddmayn() {
      this.$refs.manyadddform.resetFields()
    },
    // 刪除属性
    async deldetparmas(scopeda) {
      const { data: deletapara } = await this.$http.delete(`categories/${scopeda.cat_id}/attributes/${scopeda.attr_id}`)
      if (deletapara.meta.status !== 200) {
        return this.$message.error(deletapara.meta.msg)
      }
      this.getallparamsdata()
    },

    // 获取修改前得数据
    async xietparmas(eitscope) {
      const { data: lisdata } = await this.$http.get(`categories/${eitscope.cat_id}/attributes/${eitscope.attr_id}`, { pragma: { attr_sel: this.activeName } })
      this.eitadddform = lisdata.data
      this.eitdialogVisible = true
      console.log(lisdata)
    },
    // 发送修改请求
    async putparams() {
      this.eitadddform.attr_sel = this.activeName
      const { data: listadad } = await this.$http.put(`categories/${this.eitadddform.cat_id}/attributes/${this.eitadddform.attr_id}`, this.eitadddform)
      if (listadad.meta.status !== 200) {
        return this.$message.error(listadad.meta.msg)
      }
      this.eitdialogVisible = false
      this.getallparamsdata()
    },
    showInput(roes) {
      roes.inputVisible = true
      // 获取input 输入状态
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(roes) {
      if (this.inputValue.trim().length === 0) {
        roes.inputVisible = false
        return
      }
      roes.attr_vals.push(this.inputValue)
      roes.inputVisible = false
      this.saveattrname(roes)
      this.inputValue = ''
    },
    async saveattrname(roes) {
      this.tyepthreedata.attr_vals = roes.attr_vals.join(',')
      this.tyepthreedata.attr_name = roes.attr_name
      this.tyepthreedata.attr_sel = roes.attr_sel
      const { data: listadad } = await this.$http.put(`categories/${roes.cat_id}/attributes/${roes.attr_id}`, this.tyepthreedata)
      if (listadad.meta.status !== 200) {
        this.$message.error(this.meta.msg)
      }
    },
    delethistaga(i, scopede) {
      scopede.attr_vals.splice(i, 1)
      this.saveattrname(scopede)
    }
  },
  // 计算属性判断是否为三级分类 并且放回
  computed: {
    isbtndisable() {
      if (this.selecteddata.length !== 3) {
        return true
      }
      return null
    },
    setcalId() {
      if (this.selecteddata.length === 3) {
        return this.selecteddata[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
  .magelet{
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
