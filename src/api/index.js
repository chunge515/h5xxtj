import axios from 'axios';
import { Toast } from 'mint-ui';

// 超时时间
axios.defaults.timeout = 20000;
axios.defaults.params = {
  requestId: Math.random()
}
// http请求拦截器
axios.interceptors.request.use(config => {
  let user = localData.get('userInfo');
  if (user && user.token) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.token = user.token;
    config.headers.openId = user.openId;
  }
  return config
}, error => {
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(response => {
  // 响应成功
  switch (response.data.httpCode) {
    case '500':
      Toast({
        message: response.data.message
      })
      break
    case "20002":
      Toast({
        message: '用户或密码不正确'
      })
      break
    case "40001":
      Toast.error({
        message: '未知请求'
      })
      break
    case "40002":
      Toast({
        message: '参数丢失'
      })
      break
    case "40003":
      Toast({
        message: '参数类型错误'
      })
      break
    case "40004":
      Toast({
        message: '状态错误'
      })
      break
    case "40005":
      Toast({
        message: '资源不存在'
      })
      break
    case "40006":
      Toast({
        message: '资源被使用'
      })
      break
    case "40007":
      Toast({
        message: '资源重复'
      })
      break
    case "40008":
      Toast({
        message: '请求达到上限'
      })
      break
    case "40010":
      Toast({
        message: '该年级尚有班级没有相关学科的任课老师,请完善信息.'
      })
      break
    case "40301":
      // Toast({
      //   message: '认证失败'
      // })
      break
    case "40302":
      Toast({
        message: '无操作权限'
      })
      break
    case "40304":
      Toast({
        message: '签名错误'
      })
      break
    case "40305":
      Toast({
        message: '资源锁定'
      })
      break
    case "40101":
      Toast({
        message: '用户重复登录'
      })
      break
    case "600002":
      Toast({
        message: '账号异地登录,请重新登录'
      });
      window.location.href = 'index.html'
      break
    case "600003":
      Toast({
        message: 'token过期,请重新登录'
      });
      window.location.href = 'index.html'
      break
  }
  return response.data;
}, error => {
  if (!error.response) {
    Toast({
      message: error.message
    })
  }

  return Promise.reject(error) // 返回接口返回的错误信息
});

export var $regexp = ({
  isMobile: value => /^1[345678]\d{9}$/.test(value)
});

export var localData = {
  get(name) {
    if (!name) return null;
    return JSON.parse(localStorage.getItem(name));
  },
  set(name, obj) {
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(obj));
  },
  delete(name) {
    localStorage.removeItem(name);
  }
};
//解析试题结束
export let $$user = () => localData.get('userInfo') || {};
let teacherId = () => $$user().userId;
let filterSend = (send) => {
  return Object.assign(send, {
    userId: teacherId()
  })
}

//前后空格去除
let Trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//会话缓存
var sessionData = {
  get(name) {
    if (!name) return null;
    return JSON.parse(sessionStorage.getItem(name));
  },
  set(name, obj) {
    if (!name) return;
    sessionStorage.setItem(name, JSON.stringify(obj));
  },
  delete(name) {
    sessionStorage.removeItem(name);
  }
};

//当前时间
export var currentTime = () => {

  var d = new Date();
  var ye = d.getFullYear();
  var mo = (d.getMonth()+1).toString().padStart(2,'0');
  var da = d.getDate().toString().padStart(2,'0');
  return ye+'-'+mo+'-'+da;
}
//根据时间戳转换时间
export var  formatDate =(res) => {
  var now = new Date(Number(res))
  var year=now.getFullYear();
  var month=now.getMonth()+1;
  var date=now.getDate();
  return year+"-"+month+"-"+date;
}


export var  formatDates =(res) => {
  console.log(res)
  var now = new Date(Number(res))
  var year=now.getFullYear();
  var month=(now.getMonth()+1) ;
  var date=now.getDate();
  var time = now.getHours() > 10 ?  now.getHours() : '0' +  now.getHours();
  var minute = now.getMinutes() > 10 ? now.getMinutes() : '0' + now.getMinutes();
  var second = now.getSeconds() > 10 ? now.getSeconds() : '0' + now.getSeconds();
  return year+"-"+month+"-"+date + ' ' + time + ':' + minute + ':' + second;
}

/*图片*/
var strToUrl = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  //如果已经是html格式  直接返回
  if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)) return str;
  return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function (w) {
    if (/mp3$/i.test(w)) {
      return '<audio src=' + w + ' controls />'
    } else {
      return '<img style=max-width:100%;vertical-align:middle;  src=' + w + ' />'
    }
  }).replace(/\n/g, '<br />').replace(/\\n/g, '<br />')
};

export var GrandList = {
  '11': '一年级',
  '12': '二年级',
  '13': '三年级',
  '14': '四年级',
  '15': '五年级',
  '16': '六年级',
  '21': '七年级',
  '22': '八年级',
  '23': '九年级',
  '24': '中考',
  '31': '高一',
  '32': '高二',
  '33': '高考',

};


export var commonSubject = {
  '1': '语文',
  '2': '数学',
  '4': '物理',
  '3': '英语',
  '5': '化学',
  '6': '生物',
  '7': '历史',
  '8': '地理',
  '9': '政治',
  '10': '科学',
  '11': '信息技术',
  '12': '品德与生活',
  '13': '品德与社会',
  '14': '思想品德',
  '15': '心理学',
  '16': '习惯趣谈'
};
export var dateConversionMinutes = (str) =>{
  let time = str.substr(0,2),
    minute=str.substr(3,2),
    fen = time * 60 + Number(minute);
  let myDate = new Date();
  return (myDate.getHours() * 60 + myDate.getMinutes()) > fen ? false : true
}


let baseURL; //接口域名
let  agentUrl;
let lantianUrl; //蓝天域名
let apiURL = '';

let url = location.origin;
if (location.hostname == 'localhost' || location.protocol == "file:" || /^192\.168\.\d+\.\d+/.test(location.hostname)) { // 本地环境

  url = "http://statich5dev.xinguoren.cn";
}

baseURL = url + '/assessment';
lantianUrl = url + '/diagnosis/manager/';
agentUrl = url + '/webusiness/';
apiURL = url;

export {
  baseURL, agentUrl, lantianUrl, apiURL
}

axios.defaults.baseURL = baseURL;

export var $axios = axios;

