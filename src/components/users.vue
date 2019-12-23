<template>
  <div class="usersdata">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="seachinput">
      <el-row :gutter="0">
        <el-col :span="5">
          <div class="grid-content bg-purple" >
           <el-input v-model="getuserdatas.query" placeholder="请输入内容" clearable></el-input>
          </div>
        </el-col>
        <el-col :span="2"><div class="grid-content bg-purple" id="sethi">
          <el-button icon="el-icon-search" style="float: left" @click="getusers" >搜索</el-button>
        </div></el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple"><el-button type="success" plain @click="dialogVisible = true">添加用户</el-button>
          </div></el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <div class="table" style="line-height:40px">
        <el-table
          :data="tableData"
          border>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="200">
          </el-table-column>
            <el-table-column
              prop="mobile"
              label="电话"
              width="180">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
            width="180">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeuesr(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div><el-button type="warning"  icon="el-icon-edit" plain @click="eiduserdata(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete"  plain @click="deleuse(scope.row.id)" ></el-button>
                <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable ="false">
                  <el-button type="primary" icon="el-icon-check"  plain @click="getroleslist(scope.row)"></el-button>
                </el-tooltip></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paegset">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getuserdatas.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="getuserdatas.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals">
        </el-pagination>
      </div>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      @close="closeadduser"
      width="50%">
     <div>
       <el-form label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelrefs">
         <el-form-item label="用户名" prop="username">
           <el-input v-model="formLabelAlign.username"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
           <el-input v-model="formLabelAlign.password"></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
           <el-input v-model="formLabelAlign.email"></el-input>
         </el-form-item>
         <el-form-item label="电话" prop="mobile">
           <el-input v-model="formLabelAlign.mobile"></el-input>
         </el-form-item>
       </el-form>
     </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addusername">确 定</el-button>
  </span>
    </el-dialog>
  <!--用户编辑对话框-->
    <el-dialog
      :visible.sync="eitVisible"
      title="编辑用户"
      width="50%">
      <div>
        <el-form label-width="80px" :model="eitLabelAlign" ref="eiduserdaref" :rules="eitrules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="eitLabelAlign.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"  prop="email">
            <el-input v-model="eitLabelAlign.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="eitLabelAlign.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eitVisible = false">取 消</el-button>
    <el-button type="primary" @click="eitdatauser">确 定</el-button>
  </span>
    </el-dialog>
<!--编辑用户对话框end-->
<!--    分类角色对话框-->
    <el-dialog
      @close="coleputdata"
      title="角色分类"
      :visible.sync="rolesVisible"
      width="50%">
      <div class="listdata">
        <p>当前用户: <b>{{roleslistdata.username}}</b></p>
        <p>当前角色: <b>{{roleslistdata.role_name}}</b></p>
        <p>修改角色:
          <el-select v-model="rolesdalist" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="putrolesdataid">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkemail = (rule, value, callback) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regemail.test(value)) {
        return callback()
      }
      callback(new Error('输入合法邮箱'))
    }
    var checkmobile = (rule, value, callback) => {
      const regemobeil = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      if (regemobeil.test(value)) {
        return callback()
      }
      callback(new Error('输入合法电话'))
    }
    return {
      crumb: '',
      seacinput: '',
      tableData: [],
      value1: true,
      value2: true,
      dialogVisible: false,
      rolesVisible: false,
      eitVisible: false,
      // 显示获得得权限列表名称
      options: [],
      // 获取 显示要被提交得用户姓名跟当前权限
      // 下拉被选中得
      rolesdalist: '',
      roleslistdata: {},
      totals: 0,
      formLabelAlign: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      eitLabelAlign: {},
      getuserdatas: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      eitrules: {
        email: [
          { required: true, validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkmobile, trigger: 'blur' }
        ]
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        email: [
          { required: true, validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkmobile, trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getusers()
  },
  methods: {
    async getusers() {
      const { data: userdata } = await this.$http.get('users', { params: this.getuserdatas })
      this.tableData = userdata.data.users
      this.totals = userdata.data.total
    },
    handleSizeChange(pagesiza) {
      this.getuserdatas.pagesize = pagesiza
      this.getusers()
    },
    handleCurrentChange(pagenull) {
      this.getuserdatas.pagenum = pagenull
      this.getusers()
    },
    // 修改用户状态
    async changeuesr(usersifo) {
      console.log(usersifo)
      const { data: res } = await this.$http.put(`users/${usersifo.id}/state/${usersifo.mg_state}`)
      if (res.meta.status !== 200) {
        usersifo.mg_state = !usersifo.mg_state
        this.$message.error('修改失败')
      } else {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      }
      console.log(res)
    },
    // 添加用户
    closeadduser() {
      this.$refs.formLabelrefs.resetFields() // 关闭重置表格
    },
    async addusername() {
      const { data: res } = await this.$http.post('users', this.formLabelAlign)
      console.log(res)
      if (res.meta.status !== 201) {
        this.$message.error(res.meta.msg)
      } else {
        this.getusers()
        this.dialogVisible = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      }
    },
    // 删除用户
    async deleuse(delinfoid) {
      const con = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      console.log(con)
      if (con === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      } else if (con === 'confirm') {
        const { data: deltuser } = await this.$http.delete(`users/${delinfoid}`)
        if (deltuser.meta.status === 200) {
          this.getusers()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        }
      }
    },
    // 获取要修改的用户信息
    async eiduserdata(userid) {
      this.eitVisible = true
      const { data: userdata } = await this.$http.get(`users/${userid}`)
      this.eitLabelAlign = userdata.data
      // console.log(this.eitLabelAlign)
    },
    // 修改用户信息
    eitdatauser() {
      this.$refs.eiduserdaref.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(`users/${this.eitLabelAlign.id}`, this.eitLabelAlign)
          if (res.meta.status !== 200) {
            this.$message.error('修改失败')
            this.eiduserdata()
          } else {
            this.getusers()
            this.eitVisible = false
            this.$message.success('修改成功')
          }
          console.log(res)
        } else {
          alert('submit!')
        }
      })
    },
    async getroleslist(scopedata) {
      this.roleslistdata = scopedata
      const { data: resdata } = await this.$http.get('roles')
      this.options = resdata.data
      // console.log(this.options)
      this.rolesVisible = true
    },
    async putrolesdataid() {
      if (!this.rolesdalist) {
        this.$message.error('请选择')
      }
      const { data: putdolesdata } = await this.$http.put(`users/${this.roleslistdata.id}/role`, { rid: this.rolesdalist })
      if (putdolesdata.meta.status !== 200) {
        this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
      this.rolesVisible = false
    },
    coleputdata() {
      this.rolesdalist = ''
      this.getusers()
    }
  }

}
</script>
<style lang="less" scoped>

.seachinput{
  margin-bottom: 5px;
}
.el-row{
  line-height: 0px;
}
  .listdata p{
   padding-top: 10px;
  }
</style>
