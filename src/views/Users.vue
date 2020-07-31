<template>
  <div class="container-users" @keyup.enter="onClickEvent('search')">
    <div class="control">
      <div class="control-input">
        <el-input
          @input="onInput"
          class="control-input-style"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="pageKeyword"
        ></el-input>
        <el-button type="primary" @click="onClickEvent('search')">
          搜索
        </el-button>
      </div>
      <el-button type="primary" @click="onClickEvent('add')">
        新增用户
      </el-button>
    </div>

    <div class="table">
      <el-table :data="userList" style="width: 100%">
        <el-table-column label="姓名" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.role_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="onClickEvent('edit', scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-s-custom"
              @click="onClickEvent('role', scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="onClickEvent('del', scope.row)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paging">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotal"
        :page-size="pageSize"
        :current-page.sync="pageIndex"
        @current-change="onPageChange"
      ></el-pagination>
    </div>

    <div class="add-user-dialog">
      <el-dialog title="添加用户" :visible.sync="addUserDialog">
        <el-form :model="addUserForm" :rules="userFormRules" ref="addUserForm">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input
              type="text"
              v-model="addUserForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input
              type="password"
              v-model="addUserForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input
              type="text"
              v-model="addUserForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电话"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input
              type="text"
              v-model="addUserForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addUserForm')">重 置</el-button>
          <el-button @click="onDialog('addUserForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('addUserForm')">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div class="edit-user-dialog">
      <el-dialog
        title="编辑用户"
        :visible.sync="editUserDialog"
        ref="editUserForm"
      >
        <el-form
          :model="editUserForm"
          :rules="userFormRules"
          ref="editUserForm"
        >
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input
              type="text"
              v-model="editUserForm.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input
              type="text"
              v-model="editUserForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电话"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input
              type="text"
              v-model="editUserForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onDialog('editUserForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('editUserForm')">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div class="role-user-dialog">
      <el-dialog
        title="分配角色"
        :visible.sync="roleUserDialog"
        ref="roleUserForm"
      >
        <el-form
          :model="roleUserForm"
          :rules="userFormRules"
          ref="roleUserForm"
        >
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input
              type="text"
              v-model="roleUserForm.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-select v-model="roleUserForm.role_name" placeholder="请选择">
              <div v-for="item in roleList" :key="item.id">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.roleDesc"
                  placement="left"
                >
                  <el-option
                    :label="item.roleName"
                    :value="item.id"
                  ></el-option>
                </el-tooltip>
              </div>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onDialog('roleUserForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('roleUserForm')">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    let checkEmail = (rule, value, callback) => {
      let rules = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if (!rules.test(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    let checkMobile = (rule, value, callback) => {
      let rules = /^1[3456789]\d{9}$/;
      if (!rules.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      pageKeyword: "",
      pageIndex: 1,
      pageSize: 2,
      pageTotal: 0,
      userList: [],
      roleList: [],

      formLabelWidth: "80px",
      userFormRules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      },
      addUserDialog: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserDialog: false,
      editUserForm: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      roleUserDialog: false,
      roleUserForm: {
        id: "",
        username: "",
        role_name: "",
        roleID: ""
      }
    };
  },
  created() {
    let that = this;
    that.onClickEvent("search");
    that.getRoleList();
  },
  methods: {
    getRoleList() {
      let that = this;
      that.$_lc_api.getRoleList().then(res => {
        if (res && res.data && res.data.data && res.data.data.length) {
          that.roleList = res.data.data;
        }
      });
    },
    onInput(e) {
      if (!e) {
        this.onClickEvent("search");
      }
    },
    onPageChange() {
      this.onClickEvent("search");
    },
    onStateChange(e) {
      let that = this;
      let params = {
        id: e.id,
        state: e.mg_state
      };
      that.$_lc_api.changeState(params).then(res => {
        if (res && res.data && res.data.meta && res.data.meta.status === 200) {
          that.$message({
            message: "状态设置成功",
            type: "success"
          });
        } else {
          that.userList.forEach(item => {
            if (item.id === e.id) {
              item.mg_state = !e.mg_state;
            }
          });
          that.$message({
            message: "状态设置失败",
            type: "error"
          });
        }
      });
    },
    onDialog(formName) {
      switch (formName) {
        case "addUserForm":
          this.addUserDialog = !this.addUserDialog;
          break;
        case "editUserForm":
          this.editUserDialog = !this.editUserDialog;
          if (!this.editUserDialog) {
            this.resetForm("editUserForm");
          }
          break;
        case "roleUserForm":
          this.roleUserDialog = !this.roleUserDialog;
          if (!this.roleUserDialog) {
            this.resetForm("roleUserForm");
          }
          break;
      }
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (formName) {
            case "addUserForm":
              addUser(that.addUserForm);
              break;
            case "editUserForm":
              editUser(that.editUserForm);
              break;
            case "roleUserForm":
              roleUser(that.roleUserForm);
              break;
          }
        } else {
          return false;
        }
      });
      function addUser(params) {
        that.$_lc_api.addUser(params).then(res => {
          if (
            res &&
            res.data &&
            res.data.meta &&
            res.data.meta.status === 201
          ) {
            that.pageTotal += 1;
            that.pageIndex = Math.ceil(that.pageTotal / that.pageSize);
            that.resetForm(formName);
            that.onClickEvent("search");
            that.onDialog(formName);
            that.$message({
              message: "添加用户成功",
              type: "success"
            });
          } else {
            that.$message({
              message:
                res && res.data && res.data.meta
                  ? res.data.meta.msg || "添加用户失败"
                  : "添加用户失败",
              type: "error"
            });
          }
        });
      }
      function editUser(params) {
        that.$_lc_api
          .editUser({
            id: params.id,
            email: params.email,
            mobile: params.mobile
          })
          .then(res => {
            if (
              res &&
              res.data &&
              res.data.meta &&
              res.data.meta.status === 200
            ) {
              that.resetForm(formName);
              that.onClickEvent("search");
              that.onDialog(formName);
              that.$message({
                message: "编辑用户成功",
                type: "success"
              });
            } else {
              that.$message({
                message:
                  res && res.data && res.data.meta
                    ? res.data.meta.msg || "编辑用户失败"
                    : "编辑用户失败",
                type: "error"
              });
            }
          });
      }
      function roleUser(params) {
        that.$_lc_api.roleUser(params).then(res => {
          if (
            res &&
            res.data &&
            res.data.meta &&
            res.data.meta.status === 200
          ) {
            that.resetForm(formName);
            that.onDialog(formName);
            that.onClickEvent("search");
            that.$message({
              message: "分配角色成功",
              type: "success"
            });
          } else {
            that.$message({
              message:
                res && res.data && res.data.meta
                  ? res.data.meta.msg || "分配角色失败"
                  : "分配角色失败",
              type: "error"
            });
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onClickEvent(btnName, params) {
      let that = this;
      switch (btnName) {
        case "add":
          add();
          break;
        case "edit":
          edit(params);
          break;
        case "del":
          del(params);
          break;
        case "search":
          search();
          break;
        case "role":
          role(params);
          break;
      }
      function add() {
        that.onDialog("addUserForm");
      }
      function edit(params = {}) {
        for (let key in that.editUserForm) {
          that.editUserForm[key] = params[key];
        }
        that.onDialog("editUserForm");
      }
      function del(params = {}) {
        that
          .$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            that.$_lc_api.delUser(params.id).then(res => {
              if (
                res &&
                res.data &&
                res.data.meta &&
                res.data.meta.status === 200
              ) {
                that.pageIndex = 1;
                search();
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
          })
          .catch(() => {
            that.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
      function search() {
        that.$_lc_api
          .getUserList({
            query: that.pageKeyword,
            pagenum: that.pageIndex,
            pagesize: that.pageSize
          })
          .then(res => {
            if (
              res &&
              res.data &&
              res.data.data &&
              res.data.data.users &&
              res.data.data.users.length
            ) {
              that.userList = res.data.data.users || [];
              that.pageTotal = res.data.data.total || 0;
            } else {
              that.userList = [];
            }
          });
      }
      function role(params) {
        for (let key in that.roleUserForm) {
          that.roleUserForm[key] = params[key];
        }
        that.onDialog("roleUserForm");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container-users {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 500px;
  background-color: #fff;
}
.control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;

  .control-input {
    display: flex;
    align-items: center;
    width: 300px;
    /deep/ .el-input__inner {
      border-radius: 4px 0 0 4px;
    }

    .el-button {
      border-radius: 0 4px 4px 0;
    }
  }
}

.table {
  padding: 20px;
}

.paging {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.add-user-dialog,
.edit-user-dialog {
  /deep/ .el-dialog {
    width: 500px;
  }
}
</style>
