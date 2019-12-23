<template>
  <div class="rigtsbox">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-table
        :data="rightsdatas"
        border
        style="width: 80% ; line-height: 40px">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="180">
        </el-table-column>
        <el-table-column label="层级" width="180" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'" >二级</el-tag>
            <el-tag type="danger" v-if="scope.row.level === '2'">三级</el-tag>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsdatas: []
    }
  },
  created() {
    this.getrightsdatas()
  },
  methods: {
    async getrightsdatas() {
      const { data: res } = await this.$http.get('rights/list')
      this.rightsdatas = res.data
    }
  }
}
</script>
<style lang="less" scoped>

</style>
