import http from "./http";
function GET(url, params) {
  return new Promise((resolve, reject) => {
    http
      .get(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log("get err", err);
        reject(err);
      });
  });
}

function POST(url, params) {
  return new Promise((resolve, reject) => {
    http
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log("post err", err);
        reject(err);
      });
  });
}

function PUT(url, params) {
  return new Promise((resolve, reject) => {
    http
      .put(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log("put err", err);
        reject(err);
      });
  });
}

function DEL(url, params) {
  return new Promise((resolve, reject) => {
    http
      .delete(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log("del err", err);
        reject(err);
      });
  });
}

export default {
  login: p => POST("login", p),
  getMenu: () => GET("/menus"),
  getUserList: p => GET("/users", { params: p }),
  changeState: p => PUT(`/users/${p.id}/state/${p.state}`),
  addUser: p => POST("/users", p),
  editUser: p =>
    PUT(`/users/${p.id}`, {
      email: p.email,
      mobile: p.mobile
    }),
  delUser: p => DEL(`/users/${p}`),
  getRoleList: () => GET("/roles"),
  roleUser: p =>
    PUT(`users/${p.id}/role`, {
      rid: p.role_name
    })
};
