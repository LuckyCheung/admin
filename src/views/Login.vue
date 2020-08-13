<template>
  <div class="container-login" @keyup.enter="submitForm('ruleForm')">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          提交
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        password: "",
        username: ""
      },
      jump: "",
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.jump = (route.query && route.query.jump) || "";
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations("user", ["setUserInfo"]),
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.login({
            username: that.ruleForm.username,
            password: that.ruleForm.password
          });
        }
      });
    },
    resetForm(formName) {
      let that = this;
      that.$refs[formName].resetFields();
    },
    login({ username, password }) {
      let that = this;
      that.$_lc_api
        .login({
          username,
          password
        })
        .then(res => {
          if (
            res &&
            res.data &&
            res.data.meta &&
            res.data.meta.status === 200
          ) {
            that.setUserInfo({
              uInfo: res.data.data
            });
            that.$_lc_api.getMenu().then(res1 => {
              if (res1 && res1.data) {
                that.setUserInfo({
                  uRouter: res1.data.data
                });
                that.$router.replace({
                  path: that.jump || "/home"
                });
                that.$message({
                  type: "success",
                  message: "登录成功"
                });
              } else {
                that.$message({
                  type: "error",
                  message: "登录失败，请稍后再试！"
                });
              }
            });
          } else {
            that.$message({
              type: "error",
              message: res.data.meta.msg,
              duration: 2000
            });
          }
        })
        .catch(() => {
          that.$message({
            type: "error",
            message: "登录失败，请稍后再试！"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #2d3a4b;

  /deep/ .el-form-item__label {
    color: #fff;
  }
}
</style>
