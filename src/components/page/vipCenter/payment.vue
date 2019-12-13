<template>
    <div class="payment">
        <p class="pay-title">确认订单信息</p>
        <div class="pay-contain">
            <p con>
                <label>支付金额</label>
                <span>(优惠码已抵折扣)</span>
                <span>30</span>
            </p>
            <p>
                <label>支付方式</label>
                <span>微信</span>
            </p>
        </div>
        <div class="pay-button">
            <button @click="goNext">立即支付</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    methods: {
        goNext(){
            this.$router.push({path:'/paySuccess'})
        }
    }
}
</script>

<style lang="scss">
.payment{
    background-color: #fff;
    height: 100%;
    .pay-title{
        color:#333;
        font-size: .28rem;
        text-align: center;
        height: .9rem;
        line-height: .9rem;
        background-color: #f5f5f5;
        border-top: solid .01rem #d9d9d9;
        border-bottom: solid .01rem #d9d9d9;
    }
    .pay-contain{
        padding: 0 .34rem .3rem;
        p{
            height: .9rem;
            line-height: .9rem;
            font-size: .24rem;
            color: #666;
            border-bottom: solid .01rem #d9d9d9;
        }
       
    }
    .pay-button{
        margin-top: 5.3rem;
        text-align: center;
        button{
            width: 3.2rem;
            color: #fff;
            height: .8rem;
            font-size: .24rem;
            background-color: #d03131;
            border-radius: .08rem;
            border: 0;
        }
    }
}
</style>


