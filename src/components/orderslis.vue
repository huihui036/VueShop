<template>
  <div class="listordes">
    <div class="tables">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="list">
      <el-card class="box-card">
        <el-table
          :data="ordertableData"
          border
          style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="order_number"
            label="订单号"
            width="210">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="价格"
            width="180">
          </el-table-column>
          <el-table-column label="是否付款" width="180">
            <template slot-scope="scope">
              <el-tag type="danger" v-if='scope.row.order_pay === "0" '>未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="下单时间"
            width="180">
          </el-table-column>
            <el-table-column
              prop="is_send"
              label="是否发货"
              width="180">
          </el-table-column>
          <el-table-column label="支付方式" prop="order_pay" width="180">
            <template  slot-scope="scope">
              <el-tag type="danger" v-if='scope.row.order_pay === "0" '>未付款</el-tag>
              <el-tag type="danger" v-if='scope.row.order_pay === "1" '>微信</el-tag>
              <el-tag type="danger" v-if='scope.row.order_pay === "2" '>支付宝</el-tag>
              <el-tag type="danger" v-if='scope.row.order_pay === "3" '>银行</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" class="el-icon-edit" @click="eitorderdata(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 12]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
   <!-- 修改订单对话框-->
    <el-dialog
      title="修改订单"
      :visible.sync="eitordeVisible"
      width="50%">
      <el-form ref="form" :model="eitdataform" label-width="80px">
        <el-form-item label="是否发货">
          <el-select v-model="eitdataform.is_send" placeholder="请选择">
            <el-option label="已发货" value="1"></el-option>
            <el-option label="未发货" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="eitdataform.order_pay" placeholder="请选择">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="微信" value="1"></el-option>
            <el-option label="银行卡" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="eitdataform.order_price"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="eitdataform.order_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eitordeVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeorder">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ordertableData: [],
      getorderdata: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      eitordeVisible: false,
      eitdataform: {}
    }
  },
  created() {
    this.getorderlaist()
  },
  methods: {
    async getorderlaist() {
      const { data: res } = await this.$http.get('orders', { params: this.getorderdata })
      console.log(res)
      this.total = res.data.total
      this.ordertableData = res.data.goods
    },
    handleSizeChange(pagezsize) {
      console.log(pagezsize)
      this.getorderdata.pagesize = pagezsize
      this.getorderlaist()
    },
    handleCurrentChange(pagenum) {
      this.getorderdata.pagenum = pagenum
      this.getorderlaist()
    },
    async eitorderdata(scopedata) {
      console.log(scopedata.order_id)
      this.eitdataform.order_id = scopedata.order_id
      const { data: tabledata } = await this.$http.get(`orders/${scopedata.order_id}`)
      console.log(tabledata)
      this.eitdataform = tabledata.data
      this.eitordeVisible = true
    },
    async changeorder() {
      console.log(this.eitdataform)
      const { data: postadata } = await this.$http.put(`orders/${this.eitdataform.order_id}`, this.eitdataform)
      console.log(postadata)
      this.getorderlaist()
    }
  }
}
</script>
<style lang="less" scoped></style>
