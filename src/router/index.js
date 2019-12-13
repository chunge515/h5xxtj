import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

let router = new Router({
  routes: [{
    path: '/',
    redirect: '/evaluationPage',
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/paper/static',//做题页面
    component: resolve => require(['../components/page/paper/static.vue'], resolve)
  },
  {
    path: '/paperList',//试卷列表
    component: resolve => require(['../components/page/paper/paperList.vue'], resolve)
  },
  {
    path: '/report',//报告页面
    component: resolve => require(['../components/page/paper/report.vue'], resolve)
  },

  //我的页面
  {
    path: '/login',//登录
    component: resolve => require(['../components/page/mine/login.vue'], resolve),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/loginUp',//注册
    component: resolve => require(['../components/page/mine/loginUp.vue'], resolve),
    meta: {
      title: '注册',
      requireAuth: true,
    }
  },
  {
    path: '/forgetPwd',//注册
    component: resolve => require(['../components/page/mine/forgetPwd.vue'], resolve),
    meta: {
      title: '注册',
      requireAuth: true,
    }
  },
  {
    path: '/bindMobile',//绑定手机号
    component: resolve => require(['../components/page/mine/bindMobile.vue'], resolve),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/mine/detail',//基本信息详情
    component: resolve => require(['../components/page/mine/mine.vue'], resolve),
    meta: {
      title: '新国人书院家长问卷'
    }
  },
  {
    path: '/userInfo',//基本信息填写
    component: resolve => require(['../components/page/mine/userInfo.vue'], resolve),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/changeInfo',//修改信息填写
    component: resolve => require(['../components/page/mine/changeInfo.vue'], resolve),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/order',//订单列表
    component: resolve => require(['../components/page/myOrder/order.vue'], resolve),
    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/vipList',//会员列表
    component: resolve => require(['../components/page/vipCenter/vipList.vue'], resolve),
    meta: {
      title: '会员中心'
    }
  },
  {
    path: '/vipCenter',//会员中心
    component: resolve => require(['../components/page/vipCenter/vipCenter.vue'], resolve),
    meta: {
      title: '会员中心'
    }
  },
  {
    path: '/paySuccess',//支付
    component: resolve => require(['../components/page/vipCenter/paySuccess.vue'], resolve),
    meta: {
      title: '支付成功'
    }
  },
  {
    path: '/payment',//支付
    component: resolve => require(['../components/page/vipCenter/payment.vue'], resolve),
    meta: {
      title: '支付'
    }
  },
  {
    path: '/createInfo',//基本信息录入
    component: resolve => require(['../components/page/mine/createInfo.vue'], resolve),
    meta: {
      title: '新国人书院家长问卷'
    },
  },
  // 我的
  {
    path: "/mine",
    component: resolve => require(['../components/page/mine/index.vue'], resolve),
    meta: {
      title: "我的",
      requireAuth: true,
    }
  },
  // 报告列表
  {
    path: "/reports",
    component: resolve => require(['../components/page/mine/reports.vue'], resolve),
    meta: {
      title: "我的报告"
    }
  },
  {
    path: '/evaluationPage',
    component: resolve => require(['../components/page/EvaluationPage/EvaluationPage.vue'], resolve),
    meta: {
      title: '学习体检',
      requireAuth: true,
    }
  },
  {
    path: '/EvaluationDetailsPage',
    component: resolve => require(['../components/page/EvaluationPage/EvaluationDetailsPage.vue'], resolve),
    meta: {
      title: '详情',
    }
  },
  {
    path: '/PaymentPage',
    component: resolve => require(['../components/page/EvaluationPage/PaymentPage.vue'], resolve),
    meta: {
      title: '支付'
    }
  },
  {
    path: '/makeAppointment',
    component: resolve => require(['../components/page/makeAppointment/inedx.vue'], resolve),
    meta: {
      title: '预约',
    }
  },
  {
    path: '/bookinginquiries',//预约咨询
    component: resolve => require(['../components/page/makeAppointment/bookinginquiries.vue'], resolve),
    meta: {
      title: '预约咨询'
    }
  },
  {
    path: '/makeresults',//预约结果
    component: resolve => require(['../components/page/makeAppointment/makeresults.vue'], resolve),
    meta: {
      title: '预约结果'
    }
  },

  // 提分承保完善信息页面
  {
    path: '/publicityPage',
    component: resolve => require(['../components/page/publicityPage/index.vue'], resolve),
    meta: {
      title: '预约报名'
    }
  },


  // 提分承保宣传页
  {
    path: '/insured',
    component: resolve => require(['../components/page/insured/index.vue'], resolve),
    meta: {
      title: '预约报名'
    }
  },
  //  宣传页预约成功页面
  {
    path: '/signSuccess',
    component: resolve => require(['../components/page/insured/signSuccess.vue'], resolve),
    meta: {
      title: '报名成功'
    }
  },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {//如果设置标题，拦截后设置标题
    document.title = to.meta.title
  }
  const token = localStorage.getItem('web') ? JSON.parse(localStorage.getItem('web')).token : '';
  // debugger;
  if (!to.meta.requireAuth && !token && to.path != '/login' && to.path != '/insured' && to.path != '/signSuccess') {
    localStorage.setItem('path', to.path)
    localStorage.setItem('queryCode', to.query.code); // 没有登陆点击商品是，存储点击商品的code吗，登录时至今进入商品详情页
    next('/login');
  } else {
    next();
  }

})

export default router;
