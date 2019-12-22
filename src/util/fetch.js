import { message } from 'antd';
import * as LocalStorage from "./localstorage";

const request = (url, config) => {
  return fetch(url, config).then((res) => {
    if (!res.ok) {
      // 服务器异常返回
      throw Error('');
    }

    return res.json();
  }).then((resJson) => {
    console.log(resJson.code);
    if (resJson.code !== 200) {
      if(resJson.code === 401){
        window.location.href = '/login';
      }else if(resJson.code === 100){
        const newToken = resJson.token;
        LocalStorage.put('token', newToken);
        config.headers.token = newToken;
        return request(url, config);
      }
      // 项目内部认为的错误
      throw Error('');
    } else {
      return resJson;
    }
  }).catch(() => {
    // 公共错误处理
    message.error('内部错误，请重新登录');
  });
};
const header = () =>{
  let token = LocalStorage.get('token');
  let username = LocalStorage.get('username');
  return token ? {'username': username, 'token': token, 'content-type': 'application/x-www-form-urlencoded'} : {
    'content-type': 'application/x-www-form-urlencoded'
  }
}
const baseURL = '/studentmanage/'

// GET请求
export const get = (url) => {
  return request(baseURL + url, {method: 'GET', headers: header()});
};

// POST请求
export const post = (url, data) => {
  // return request(url, {
  //   body: JSON.stringify(data),
  //   headers: {
  //     'content-type': 'application/json'
  //   },
  //   method: 'POST'
  // });
  console.log(header);
  return request(baseURL + url, {
    body: data,
    headers: header(),
    method: 'POST'
  });
};
