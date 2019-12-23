<template>
 <div class="goodlis">
   <div class="tables">
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>商品列表</el-breadcrumb-item>
     </el-breadcrumb>
   </div>
   <div class="seachinput">
     <el-row :gutter="0">
       <el-col :span="5"><div class="grid-content bg-purple">
         <el-input placeholder="请输入内容" v-model="getgoodsdt.query" clearable @clear="getgoodslist">
           <el-button slot="append" icon="el-icon-search"  @click="getserachgoods"></el-button>
         </el-input>
       </div></el-col>
       <el-col :span="2">
         <div class="grid-content bg-purple"><el-button type="primary" plain @click="goaddgoods">添加商品</el-button>
         </div></el-col>
     </el-row>
   </div>
   <div class="googtabel">
     <el-table
       :data="goodslist"
       border
       style="width: 100%">
       <el-table-column type="index">
       </el-table-column>
       <el-table-column
         prop="goods_name"
         label="商品名称"
         width="480">
       </el-table-column>
       <el-table-column
         prop="goods_price"
         label="商品价格(RMB )"
         width="200">
       </el-table-column>
       <el-table-column
         prop="goods_weight"
         label="重量"
         width="160">
       </el-table-column>
       <el-table-column
         label="创建时间"
         width="220">
         <template slot-scope="scope">
           {{scope.row.upd_time|dataformat}}
         </template>
       </el-table-column>
       <el-table-column label="操作">
       </el-table-column>
     </el-table>
   </div>
   <div class="block">
     <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :page-sizes="[5, 10, 12, 20]"
       layout="total, sizes, prev, pager, next, jumper"
       :total="totals">
     </el-pagination>
   </div>
 </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取到的商品数据
      goodslist: [],
      // 请求参数
      getgoodsdt: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totals: 0
    }
  },
  created() {
    this.getgoodslist()
  },
  methods: {
    async getgoodslist() {
      const { data: res } = await this.$http.get('goods', { params: this.getgoodsdt })
      console.log(res)
      this.goodslist = res.data.goods
      this.totals = res.data.total
    },
    handleSizeChange(pagesiz) {
      this.getgoodsdt.pagesize = pagesiz
      this.getgoodslist()
    },
    handleCurrentChange(pagenume) {
      this.getgoodsdt.pagenum = pagenume
      this.getgoodslist(pagenume)
    },
    // 关键词搜索
    async getserachgoods() {
      const { data: res } = await this.$http.get('goods', { params: this.getgoodsdt })
      if (res.meta.status !== 200) {
        this.$message.error('搜索失败')
      } else if (res.data.goods.length === 0) {
        this.$message({
          message: '搜索不到你要的商品，请重新搜索',
          type: 'warning'
        })
      }
      this.getgoodslist()
    },
    goaddgoods() {
      this.$router.push('/goods/addgoods')
    }
  }
}
</script>
<style lang="less" scoped>
.seachinput{
  margin-bottom: 5px;
}
</style>
