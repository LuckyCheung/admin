import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Notification } from "element-ui";
import url from "./base-url";

const http = axios.create({
  timeout: 5000
});

if (process.env.NODE_ENV == "development") {
  http.defaults.baseURL = url.development;
} else if (process.env.NODE_ENV == "production") {
  http.defaults.baseURL = url.production;
}
http.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

http.interceptors.request.use(
  config => {
    const token = store.getters["user/getToken"];
    token && (config.headers.Authorization = token);
    return config;
  },
  () => {
    handleErrorRequest(333, "req");
  }
);

http.interceptors.response.use(
  response => {
    if (response && response.status === 200) {
      if (
        response.data &&
        response.data.meta &&
        response.data.meta.status === 401
      ) {
        handleErrorRequest(response.data.meta.status, "res");
      } else {
        return response;
      }
    } else {
      handleErrorRequest(response.status, "res");
    }
  },
  () => {
    return handleErrorRequest(333, "res");
  }
);

function handleErrorRequest(errCode, errType) {
  console.log("error code:", errCode);
  console.log("error type:", errType);
  switch (errCode) {
    // 400: 参数错误
    case 400:
      console.log("error info:", "请求参数错误");
      break;
    // 401: 无效token
    case 401:
      Notification({
        title: "提示",
        message: "登录失效，请重新登录!"
      });
      console.log("error info:", "无效token");
      loginOut();
      break;
    // 403 token过期
    case 403:
      Notification({
        title: "提示",
        message: "登录过期，请重新登录!"
      });
      console.log("error info:", "token过期");
      loginOut();
      break;
    // 404请求不存在
    case 404:
      Notification({
        title: "提示",
        message: "网络请求不存在!"
      });
      break;
    case 333:
      Notification({
        title: "提示",
        message: "请求失败，请稍后再试!"
      });
      break;
    default:
      if (!window.navigator.onLine) {
        Notification({
          title: "提示",
          message: "网络不稳定，请稍后再试！"
        });
      }
  }
}

function loginOut() {
  store.commit("user/resetUserInfo");
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}

export default http;
