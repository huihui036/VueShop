<template>
    <div class="reports">
      <div class="tables">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>时间统计</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-card class="box-card"></el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    this.gettimedata()
  },
  methods: {
    async gettimedata() {
      const { data: timedatalist } = await this.$http.get('reports/type/1')
      console.log(timedatalist)
    }
  }
}
</script>

<style scoped>

</style>
