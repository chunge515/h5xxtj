<template>
    <div class="wrapbook">
        <div class="contentlist" v-if="orderInfo.length">
            <div class="am-form-group" v-for="(item,index) in orderInfo" :key="index" @click="selectHandler(item)">
                <label class="am-radio">
                    <ul class="reservationlist">
                        <li><input type="radio" name="radio10" value="male" data-am-ucheck required  class="radio_btn"><span class="subject">{{item.stageName}}</span></li>
                        <li class="marginleft"><span class="fontcoler">预约时间：</span> {{item.date}}</li>
                        <li class="marginleft"><span class="fontcoler">咨询位置：</span>{{item.seatCode}}</li>
                        <li class="marginleft"><span class="fontcoler">试听位置：</span>{{item.auditionSeatCode}}</li>
                    </ul>
                </label>
            </div>
        </div>
        <div class="nulllength" v-else>暂无课程可以预约</div>
        <mt-button v-if="orderInfo.length" class="reservationbtn" @click="handleClickmake">提 交 预 约</mt-button>       
    </div>
</template>
<script>
import { Radio } from 'mint-ui';
import moment from 'moment'
export default {
    name:"bookinginquiries",
    data() {
        return {
            orderInfo: [],
            code: '',
        }
    },
    mounted() {
        
    },
    created(){
        this.handleClickSub()
    },
    methods: {
        goBookinQinquiries(){
            this.$router.replace({path:"/makeresults"}); 
        },
        
        // 获取预约列表
        handleClickSub() {
            const orderInfoSub = { 
               isUsed: 0,
               pageNum: 1,
               pageSize: 10000,
               workCode: this.$route.query.workCode,
            };
            this.$axios.post(this.lantianUrl + '/agency/assessMakeAppointment/getSaleMakeAppointmentFreeList',orderInfoSub)
            .then((res)=>{
                if (res.httpCode == 200) {
                    res.result.list.forEach(element => {
                       element.date  = moment(element.date).format('YYYY-MM-DD') + '  ' + element.dateTime;
                   });
                   this.orderInfo=res.result.list
                   console.log(this.orderInfo.length)
                }
            });
        },
       
        // 提交预约
        handleClickmake(){
            // debugger;
            const orderInfomake = { 
                code: this.code,
                parentMobile:JSON.parse(localStorage.getItem("web")).mobile,
                userCode:JSON.parse(localStorage.getItem("web")).userId,
            };
            this.$axios.post(this.lantianUrl + '/agency/assessMakeAppointment/updateAssessMakeAppointmentUserByCode',orderInfomake) 
            .then((res) =>{
                if(res.httpCode == 200){
                    this.goBookinQinquiries()   
                }
            });  
        },
         // 选择预约
        selectHandler(item) {
            this.code = item.code;
        },

    },
}
</script>
<style>
    .wrapbook{
        width: 100%;
        position: relative;
        background:#F4F2F3;
    }
    .contentlist{
      width:100%;
      height: 10rem; 
      overflow: hidden;
      overflow-y:scroll;    
    }
    .reservationlist{
        width:6.6rem;
        padding-left: 0.2rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        background: #fff;
        border-radius: 0.1rem;
        margin:0.3rem auto 0;
    }
    .am-form-group{
      width: 100%;
        
    }
    .am-radio{
       position: relative;   
    }
    .radio_btn{
        border: 1px solid #000;
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 100%;
        margin-bottom: 0.3rem;  
    }
    .radio_btn:checked + label{
        border: 1px solid #000;
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 100%;
        margin-bottom: 0.3rem;
        background: red;  
    }
    .marginleft{
        margin-left: 0.4rem;
        margin-top: 0.1rem;
        color: #151515;
    }
    .subject{ 
        display:inline-block;
        margin-left: 0.2rem;
        color: #333;
        font-weight: 600;
    }
   
    .fontcoler{
        color: #999;
    }
    .reservationbtn {
        background: #F89B00;
        color: white;
        width: 5rem;
        height: 1rem;
        border-radius: 1rem;
        font-size: .4rem;
        position: absolute;
        left: 1.25rem;
        top: 10.2rem;
    }
    .nulllength{margin-top:2rem; text-align: center;}
</style>
