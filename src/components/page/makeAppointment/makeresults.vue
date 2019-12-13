<template>
    <div class="makeresults_wrap">
        <mt-swipe :auto="0">
            <img class="img_wrap-img" src="../../../assets/images/cg.png" alt="">
        </mt-swipe>
        <div class="succeedtext">恭喜您已成功预约1对1专家咨询服务</div>
        <div class="contentlistone">
            <ul class="reservationlistone" v-for="(item,index) in orderInfo" :key="index">
                <li class="subjectone">{{item.stageName}}</li>
                <li class="marginleftone"><span class="fontcoler"> 预约时间：</span>{{item.date}}</li>
                <li class="marginleftone"><span class="fontcoler"> 咨询位置：</span>{{item.seatCode}}</li>
                <li class="marginleftone"><span class="fontcoler"> 试听位置：</span>{{item.auditionSeatCode}}</li>
                <li class="marginleftone" style="display:flex;"><span class="site fontcoler">试听位置：</span><span class="specific_address">北京市西城区燕莎盛世大厦8层（大中电器东边50米）</span></li>
            </ul>
        </div>
        <div class="questions_phone">如有疑问请电话咨询：<span class="fontbottom">010-82279600</span>。我们非常期待您的到来。</div>
    </div>
</template>
<script>
import { Radio } from 'mint-ui';
import moment from 'moment'
export default {
    name:"makeresults",
    data() {
        return {
          orderInfo:[]  
        }
    },
    created() {
      this.handleClickSub() 
    },
    methods: {
        // 获取预约列表
        handleClickSub() {
            const orderInfoSub = { 
               userCode:JSON.parse(localStorage.getItem("web")).userId,
            };
            this.$axios.post(this.lantianUrl + '/agency/assessMakeAppointment/getAssessMakeAppointmentPageList',orderInfoSub)
            .then((res)=>{
                if (res.httpCode == 200) {
                    console.log(orderInfoSub);
                    res.result.list.forEach(element => {
                       element.date  = moment(element.date).format('YYYY-MM-DD') + '  ' + element.dateTime;
                   });
                   this.orderInfo=res.result.list
                   //console.log(this.orderInfo)
                }
            });
        }, 
    },
}
</script>

<style>
    .makeresults_wrap{
       width: 100%;
       height: auto;
       position: relative;
       background:#F4F2F3;
    }
    .img_wrap-img{
        width:0.74rem;
        margin-top:0.4rem;
        margin-left: 3.38rem;
    }
    .succeedtext{ 
        margin-top: 0.3rem; 
        text-align:center;
        font-size: 0.34rem;
        color: #F89B00;
    }
    .contentlistone{
      width:100%;
      height: 10rem; 
      overflow: hidden;
      overflow-y:scroll; 
    }
    .reservationlistone{
        width:6.6rem;
        padding-left: 0.1rem;
        padding-right: 0.2rem;
        padding-top: 0.3rem;
        padding-bottom: 1rem;
        background: #fff;
        border-radius: 0.1rem;
        margin:0.4rem auto 0;
    }
    .subjectone{ 
        display:inline-block;
        margin-left: 0.4rem;
        color: #333;
        font-weight: 600;
    }
    .marginleftone{
        margin-left: 0.4rem;
        margin-top: 0.1rem;
        color: #151515;
    }
    .site{
        display: inline-block; 
    }
    .specific_address{
        display: inline-block; 
        width: 4.6rem; 
        flex: 1;
    }
    .fontcoler{
        color: #999;
    }
    .questions_phone{
       width: 6.8rem;
       margin: auto;
       text-align:left;
       position: absolute;
       left:0.35rem; 
       /* top: 12.2rem;   */
       top: 11.2rem;
    }
    .fontbottom{
        color:rgb(38, 0, 255);
    }
</style>
