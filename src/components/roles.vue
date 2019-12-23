<template>
  <div class="roles">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="rightstab">
      <el-card class="box-card">
        <el-row>
          <el-col :span="6"><el-button type="primary" style="float: left" @click="addrolesbtn">添加角色</el-button></el-col>
        </el-row>
        <el-table
          :data="soletableData"
          stripe
          border
        style="line-height: 40px">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(items, key) in scope.row.children" :class="[activeClass, key === 0 ? 'bdtop':'' ]" :key="items.id">
                <el-col :span="5">
                  <el-tag closable @close="deletetga(scope.row,items.id)">{{items.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                  </el-col>
              <!--  渲染二级三级-->
                <el-col :span="19">
                  <el-row  v-for="items2 in items.children " :key="items2.id">
                   <!-- 渲染二级-->
                    <el-col :span="8">
                      <el-tag type="success" closable @close="deletetga(scope.row,items2.id)" >{{items2.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                   <!-- 渲染三级-->
                    <el-col :span="16">
                      <el-tag class="magestag" v-for="items3 in items2.children " :key="items3.id"  type="warning" closable @close="deletetga(scope.row,items3.id)">{{items3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div><el-button type="warning"  icon="el-icon-edit" plain @click="changeroles(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete"  plain @click="delterolesdata(scope.row)"></el-button>
                <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable ="false">
                  <el-button type="primary" icon="el-icon-check"  plain @click="setroles(scope.row)"></el-button>
                </el-tooltip></div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!--分配权限-->
    <el-dialog :visible.sync="rolerihts" width="50%">
        <el-tree :data="datas" accordion :props="defaultProps" node-key="id"
                 show-checkbox :default-checked-keys="rightskey" ref="potrolesid">
        </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rolerihts = false">取 消</el-button>
    <el-button type="primary" @click="postdatroles">确 定</el-button>
  </span>
    </el-dialog>
    <!--添加角色-->
    <el-dialog
      @close ="closexiedable"
      title="添加角色"
      :visible.sync="addroles"
      width="50%">
      <el-form ref="addrolesform" :model="addrolesform"  :rules="addrolesrules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addrolesform.roleName"></el-input>
      </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc" >
          <el-input v-model="addrolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addroles = false">取 消</el-button>
    <el-button type="primary" @click="postdataroles">确 定</el-button>
  </span>
    </el-dialog>
   <!-- 修改角色弹框-->
    <el-dialog
      title="修改角色"
      :visible.sync="eitroles"
      width="50%">
    <el-form :model="eitrolesform" :rules="addrolesrules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="eitrolesform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色说明"  >
          <el-input v-model="eitrolesform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eitroles = false">取 消</el-button>
    <el-button type="primary" @click="putrolesdata">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolerihts: false,
      activeClass: 'active',
      soletableData: [],
      datas: [],
      // 请求分配权限用户id
      postrelsid: '',
      // 获取默认勾选的id
      rightskey: [],
      // 添加角色
      addrolesform: {},
      addroles: false,
      // 修改角色
      eitroles: false,
      eitrolesform: {},
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      addrolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色说明', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getrghts()
  },
  methods: {
    async getrghts() {
      const { data: res } = await this.$http.get('roles')
      this.soletableData = res.data
    },
    glyabes(youstatus) {
      if (youstatus !== 201) {
        this.$message.error('失败了')
      } else {
        this.$message.success('成功了')
      }
    },
    // 删除权限 标签
    async deletetga(role, rightsid) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      console.log(res)
      if (res === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      } else if (res === 'confirm') {
        const { data: deletag } = await this.$http.delete(`roles/${role.id}/rights/${rightsid}`)
        console.log(deletag)
        if (deletag.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('成功删除标签')
        }
        role.children = deletag.data
      }
    },
    // 获取树形标签数据
    async setroles(roles) {
      // 用于提交post请求地址
      this.postrelsid = roles.id
      const { data: condeda } = await this.$http.get('rights/tree')
      this.datas = condeda.data
      this.rightskey = []
      this.getrolesid(roles, this.rightskey)
      console.log(this.rightskey)
      this.rolerihts = true
    },
    getrolesid(node, arrs) {
      if (!node.children) {
        return arrs.push(node.id)
      }
      node.children.forEach(ietms => {
        this.getrolesid(ietms, arrs)
      })
    },
    // 分配权限
    async postdatroles() {
      var keyid = [
        ...this.$refs.potrolesid.getCheckedKeys(),
        ...this.$refs.potrolesid.getHalfCheckedKeys()
      ]
      const listid = keyid.join(',')
      console.log(listid)
      console.log(keyid)
      const urlid = this.postrelsid
      const { data: res } = await this.$http.post(`roles/${urlid}/rights`, { rids: listid })
      if (res.meta.status !== 200) {
        this.$message.error('添加失败')
      }
      this.rolerihts = false
      this.getrghts()
    },
    // 添加角色按钮显示框
    addrolesbtn() {
      this.addroles = true
    },
    // 发送 添加角色请求
    async postdataroles() {
      const { data: resdata } = await this.$http.post('roles', this.addrolesform)
      console.log(resdata.meta.status)
      this.glyabes(resdata.meta.status)
      this.getrghts()
    },
    closexiedable() {
      this.$refs.addrolesform.resetFields()
    },
    // 删除列表的角色
    async delterolesdata(scopeid) {
      const delrole = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      if (delrole === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      } else if (delrole === 'confirm') {
        const { data: deletrole } = await this.$http.delete(`roles/${scopeid.id}`)
        if (deletrole.meta.status !== 200) {
          this.$message.error('失败了')
        } else {
          this.$message.success('成功')
        }
      }
      this.getrghts()
    },
    // 修改角色弹框
    async changeroles(scopedata) {
      const { id: scopedataid } = scopedata
      const { data: resdata } = await this.$http.get(`roles/${scopedataid}`)
      if (resdata.meta.status !== 200) {
        return this.$message.error('失败了')
      } else {
        this.eitrolesform = resdata.data
        this.eitrolesform.id = scopedataid
        this.eitroles = true
      }
    },
    async putrolesdata() {
      const { data: res } = await this.$http.put(`roles/${this.eitrolesform.id}`, { roleName: this.eitrolesform.roleName, roleDesc: this.eitrolesform.roleDesc })
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户失败')
      }
      this.$message.success('修改用户成功')
      this.eitroles = false
      this.getrghts()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-tag{
    margin-top: 10px;
  }
  .active{
    border-bottom: 1px solid #EBEEF5;
  }
  .bdtop{
    border-top: 1px solid #EBEEF5;
    margin-top: -15px;
  }
  .magestag{
    margin-left: 5px;
  }
</style>
