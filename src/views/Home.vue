<template>
  <div class="container-home">
    <el-container style="height: 100%">
      <el-aside style="width: 200px;">
        <div class="brand">
          LOGO
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :background-color="regularColor"
          text-color="#fff"
          :active-text-color="activeColor"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu
            v-for="menu1 in menu"
            :key="menu1.id"
            :index="'/' + menu1.path"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ menu1.authName }}</span>
            </template>
            <el-menu-item
              v-for="menu2 in menu1.children"
              :key="menu2.id"
              :index="'/' + menu2.path"
            >
              <i class="el-icon-location"></i>
              <span>{{ menu2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div>后台管理系统</div>
          <el-button plain @click="logout" class="logout-btn">退出</el-button>
        </el-header>
        <el-main>
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="(item, index) in pageList"
                :key="item.name"
              >
                <a :href="item.path" v-if="index < pageList.length - 1">
                  {{ item.name }}
                </a>
                <a v-else>{{ item.name }}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      regularColor: "#545C64",
      activeColor: "#409EFF",
      menu: [],
      pageList: []
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.pageList = route.matched.map(item => {
          return {
            path: item.path || "",
            name: item.name || ""
          };
        });
      },
      immediate: true
    }
  },
  created() {
    let that = this;
    that.showMenus();
  },
  methods: {
    async showMenus() {
      let res = await this.$_lc_api.getMenu();
      this.menu = (res && res.data && res.data.data) || [];
    },
    logout() {
      let that = this;
      that
        .$confirm("此操作将立即退出, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.$store.commit("user/resetUserInfo");
          that.$router.replace({ path: "/login" });
        });
    }
  }
};
</script>

<style lang="less" scoped>
@baseColor: #31cad6;
@RegularColor: #545c64;
.container-home {
  width: 100%;
  height: 100%;
}

.el-aside {
  background-color: @RegularColor;
  color: #333;
  text-align: center;
  line-height: 200px;

  .brand {
    width: 100%;
    height: 80px;
    line-height: 80px;
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    background-color: @RegularColor;
    border-bottom: 1px solid #ccc;
  }

  /deep/ .el-submenu__title {
    padding: 0 20px 0 30px !important;
    text-align: left;
  }
}

.el-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px !important;
  background-color: #fff;
  color: #000;

  div {
    font-size: 30px;
    font-weight: 700;
  }

  .logout-btn {
    position: absolute;
    right: 20px;
  }
}

.el-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e9eef3;
  color: #333;

  .breadcrumb {
    margin-bottom: 20px;
    padding: 14px;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
  }
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
