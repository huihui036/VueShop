<template>
  <div>
    <el-card>
      <el-row>
        <el-col style="margin-bottom: 5px">
          <el-button type="primary" class="el-icon-edit" @click="addcatebtn">添加分类</el-button>
        </el-col>
      </el-row>
      <el-row>
        <treetable border :expand-type="false" show-index :selection-type="false" index-text="#" :data="listadata" :columns="columns">
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" style="color: #00cc66"  v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
          <template slot="istex" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="danger" v-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
          <template  slot="setcate" slot-scope="scope">
            <el-button type="primary" size="mini" class="el-icon-edit" @click="showeitcateg(scope.row)" >编辑</el-button>
            <el-button type="danger"  size="mini" class="el-icon-delete-solid" @click="delectscope(scope.row)">删除</el-button>
          </template>
        </treetable>
      </el-row>
      <el-row>
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-size="5"
            :page-sizes="[5, 6, 10, 12]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-row>
    </el-card>
    <!--添加按钮对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addcateVisible"
      @close="closeaddcate"
      width="30%">
      <el-form label-width="80px" :rules="rules" ref="addcateformrefs" :model="addcateform" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addcateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <div class="block">
            <el-cascader
              v-model="addvule"
              :props="dicdatas"
              :options="options"
              @change="chanegcate"
              clearable
              :filterable="true"></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addcateVisible = false">取 消</el-button>
    <el-button type="primary" @click="endpotcattefrom" >确 定</el-button>
  </span>
    </el-dialog>
   <!-- 修改分类-->
    <el-dialog
      title="修改分类名称"
      :visible.sync="eitcatVisible"
      width="30%">
      <el-form label-width="80px" ref="postfroname" :rules="rules" :model="eitformLabel">
        <el-form-item label="名称" prop="cat_name">
          <el-input v-model="eitformLabel.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eitcatVisible = false">取 消</el-button>
    <el-button type="primary" @click="posteiedata">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>
<script>
export default {
  data() {
    return {
      getdic: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      eitcatVisible: false,
      eitformLabel: {},
      total: 0,
      // 隐藏添加按钮
      addcateVisible: false,
      addcateform: {},
      addvule: [],
      options: [],
      // 发送添加分类请求
      postcatedic: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      dicdatas: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      listadata: [],
      columns: [
        {
          label: 'name',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '层级',
          type: 'template',
          template: 'istex'
        },
        {
          label: '操作',
          type: 'template',
          template: 'setcate'
        }
      ]
    }
  },
  created() {
    this.getallcate()
  },
  methods: {
    async getallcate() {
      const { data: listadata } = await this.$http.get('categories', { params: this.getdic })
      this.listadata = listadata.data.result
      this.total = listadata.data.total
      console.log(listadata)
    },
    handleCurrentChange(pagenum) {
      this.getdic.pagenum = pagenum
      this.getallcate()
    },
    handleSizeChange(newpgasi) {
      this.getdic.pagesize = newpgasi
      this.getallcate()
    },
    async addcatebtn() {
      const { data: listdata } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(listdata)
      this.options = listdata.data
      this.addcateVisible = true
    },
    chanegcate(cahengs) {
      if (cahengs.length > 0) {
        this.postcatedic.cat_level = cahengs.length
        this.postcatedic.cat_pid = cahengs[cahengs.length - 1]
      } else {
        this.postcatedic.cat_level = 0
        this.postcatedic.cat_pid = 0
      }
      this.postcatedic.cat_name = this.addcateform.cat_name
      console.log(this.postcatedic.cat_level)
      console.log(this.postcatedic.cat_pid)
    },
    async endpotcattefrom() {
      this.postcatedic.cat_name = this.addcateform.cat_name
      if (!this.postcatedic.cat_name) {
        return this.$message.error('用户名，不能为空')
      } else {
        const { data: listdata } = await this.$http.post('categories', this.postcatedic)
        if (listdata.meta.status !== 201) {
          return this.$message.error('添加失败，请重新添加')
        }
        this.addcateVisible = false
        this.$message.success('添加成功')
        this.getallcate()
      }
      // const url = 'di' + this.postcatedic.cat_level + '' + this.postcatedic.cat_pid + '' + this.addcateform.cat_name
      // console.log(url)
    },
    // 关闭天添加分类的对话框
    closeaddcate() {
      this.$refs.addcateformrefs.resetFields()
    },
    async delectscope(sedeid) {
      const { data: delectla } = await this.$http.delete(`categories/${sedeid.cat_id}`)
      if (delectla.meta.status !== 200) {
        return this.$message.error('除失败，请重新操作')
      }
      this.getallcate()
      this.$message.success(delectla.meta.msg)
    },
    async showeitcateg(scopecat) {
      const { data: getname } = await this.$http.get(`categories/${scopecat.cat_id}`)
      if (getname.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.eitformLabel = getname.data
      this.eitcatVisible = true
    },
    async posteiedata() {
      this.$refs.postfroname.validate(async (valid) => {
        if (valid) {
          console.log(this.eitformLabel.cat_name)
          const { data: postlist } = await this.$http.put(`categories/${this.eitformLabel.cat_id}`, this.eitformLabel)
          if (postlist.meta.status !== 200) {
            return this.$message.error(postlist.meta.msg)
          }
          this.eitcatVisible = false
          this.getallcate()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
