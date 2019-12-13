<template>
    <header class="CommponHeader">
        <span class="cancel"></span>
        <p class="CommponHeader-title">{{title}}</p>
    </header>
</template>

<script>
export default {
    props:{
        title:{           
            type : String, //类型
            default: ''    //标题
        }
    }
}
</script>

<style  scoped lang='scss'>
.CommponHeader{
    background: #fff;
    height: 0.84rem;
    border-bottom: 0.01rem solid #e0e0e0;
    display: flex;
    align-items: center;
    .cancel{
        display: block;
        width: 0.27rem;
        height: 0.27rem;
        background: url(../../../static/img/cha.png);
        background-size: 100%;
        margin: 0.32rem;
        cursor: pointer;
    }
    .CommponHeader-title{
        margin:auto;
        font-size: 0.29rem;
        color: #333333;
    }
}
</style>
