import { Provide } from '@midwayjs/decorator';
import axios from 'axios';
const queryString = require('query-string');
const request = require('request');
const axios_instance = axios.create({
  baseURL: '',
  timeout: 120000,
});

axios_instance.interceptors.response.use(
  result => {
    const { data } = result;
    return data;
  },
  error => {
    console.error('加载失败');
    return Promise.reject(error);
  }
);

@Provide()
export class HttpService {
  async get(url: string, params: any) {
    const params_str = queryString.stringify(params);
    let fullUrl = url;
    if (params_str) {
      if (url.indexOf('?') > -1) {
        fullUrl += '&' + params_str;
      } else {
        fullUrl += '?' + params_str;
      }
    }
    return axios_instance.get(fullUrl);
  }

  async del(url: string, params: any) {
    return axios_instance.delete(url, {
      data: params,
    });
  }

  async post(url: string, params: any) {
    return axios_instance.post(url, params);
  }

  async request(options) {
    return new Promise(function (resolve, reject) {
      request(options, (err, res, body) => {
        if (res.statusCode == 200) {
          resolve(body);
        } else {
          console.log(res.statusCode);
        }
      });
    });
  }
}
