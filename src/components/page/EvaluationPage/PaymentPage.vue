<template>
<!-- 支付页 -->
    <div class="Payment-page">
        <div class="PaymentPage-header" v-if="PaymentStatus">
            确认订单消息
        </div>
        <div class="Successful-payment" v-else>

        </div>
        <div class="empty" v-if="!PaymentStatus"></div>
        <div class="payment-amount">
            <p>支付金额:</p>
            <p>(优惠码已抵扣5元)</p>
            <span>￥30</span>
        </div>
        <div class="payment-method">
            <p>支付方式</p>
            <span>微信支付</span>
        </div>
        <button class="paymentBtn" @click='paymentBtn()'>{{paymentBtns}}</button>
    </div>
</template>

<script>
export default {
    data(){
        return {
            paymentBtns:'立即支付',
            PaymentStatus:true
        }
    },
    methods:{
        paymentBtn(){
            
            if(!this.PaymentStatus){
                this.$router.push({path:'/EvaluationPage'})
            }
            this.PaymentStatus = false
            this.paymentBtns = '返回'
        }
    }
}
</script>

<style lang='scss' scoped>
.Payment-page{
    height: 100%;
    background: #fff;
}
.PaymentPage-header{
    height: 0.84rem;
    background-color: #f5f5f5;
    text-align: center;
    line-height: 0.84rem;
    font-size: 0.26rem;
    border-bottom: 0.01rem solid #d9d9d9;
    color: #333333;
}
.payment-amount{
    margin: 0 0.31rem;
    height: 0.78rem;
    border-bottom: 0.01rem solid #d9d9d9;
    line-height: 0.78rem;
    p:nth-of-type(1){
        font-size: 0.23rem;
        float: left;
        color: #666666;
    }
    p:nth-of-type(2){
        font-size: 0.23rem;
        float: left;
        margin-left: 2.85rem;
        color: #666666;
    }
    span{
        float: right;
        font-size: 0.24rem;
        color: #d03131;
        margin-left: 0.27rem;
    }
}
.payment-method{
    height: 0.8rem;
    margin: 0 0.31rem;
    line-height: 0.8rem;
    border-bottom: 0.01rem solid #d9d9d9;
    p{
        float: left;
        color: #666666;
        font-size: 0.23rem;
    }
    span{
        float: right;
        font-size: 0.23rem;
        color: #333333;
    }
}
.paymentBtn{
    position: absolute;
    bottom: 2.86rem;
    left: 50%;
    width: 3.28rem;
    height: 0.8rem;
    border: none;
    background: #d03131;
    color: #fff;
    border-radius: 0.15rem;
    font-size: 0.23rem;
    margin-left: -1.64rem;
}   
.Successful-payment{
    background: url(../../../../static/img/success.png) center no-repeat;
    background-size: 2.22rem;
    height: 3.04rem;
    background-color:#fff;
}
.empty{
    height: 0.2rem;
    background: #f5f5f5;
}
</style>
