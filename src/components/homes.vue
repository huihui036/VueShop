<template>
<div class="index">
    <el-container class="boxheight">
      <el-header>
        <el-col :span="8"><div class="grid-content bg-purple">1</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple-light">电商后台管理系统</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple inputrinfgt" @click="outlogin"><el-button type="warning">退出登入</el-button></div></el-col>
      </el-header>
      <el-container>
        <el-aside :width="IsCollapse ? '64px':'200px'">
            <div class="togelbuten" @click="tagebt">|||</div>
            <el-menu
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              unique-opened
              router
              :default-active="acriveciloe"
              :collapse="IsCollapse"
              active-text-color="#ffd04b">
              <el-submenu :index="item.id+ ''" v-for="item in menusdatalist" :key="item.id">
                <template slot="title">
                  <i :class="iconforme[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                  <el-menu-item :index=" '/' + subitme.path" v-for="subitme in item.children" :key="subitme.id" @click="activetogle('/' + subitme.path)">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{subitme.authName}}</span>
                  </template>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
      <!--    home页面占位符-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menusdatalist: [],
      iconforme: {
        '125': 'el-icon-warning',
        '103': 'el-icon-star-off',
        '101': 'el-icon-edit',
        '102': 'el-icon-goods',
        '145': 'el-icon-tickets'
      },
      IsCollapse: false,
      acriveciloe: ''
    }
  },
  created() {
    this.getmenus()
    this.acriveciloe = window.sessionStorage.getItem('active')
  },
  methods: {
    // 用户退出登入
    outlogin() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      // console.log('用户退出登入')
    },
    async getmenus() {
      const { data: menusdata } = await this.$http.get('menus')
      if (menusdata.meta.status !== 200) return this.$message.error(menusdata.meta.msg)
      this.menusdatalist = menusdata.data
      // console.log(this.menusdatalist)
      // console.log(menusdata)
    },
    tagebt() {
      this.IsCollapse = !this.IsCollapse
    },
    activetogle(acyivesave) {
      window.sessionStorage.setItem('active', acyivesave)
      this.acriveciloe = acyivesave
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style less="lang" scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu{
   border-right: null
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.boxheight,
.index {
  height: 100%;
}
.inputrinfgt {
  float: right;
}
.togelbuten{
  background-color: #0C0C0C;
  color: #ffffff;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  letter-spacing: .2em
;
}
</style>
