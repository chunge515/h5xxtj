<template>
    <div class="user-header">
        <header>
            <!-- <i class="fa fa-times" aria-hidden="true"></i> -->
            <span>X</span>
             <span>我的</span>
        </header>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>


<style lang="scss">
.user-header{
    color: #333;
    font-size: .32rem;
    height: .8rem;
    line-height: .8rem;
    padding:0 .38rem;
    text-align: center;
    background-color: #fff;
    position: relative;
    border-bottom:solid .01rem #e1e1e1;
    span:nth-child(1){
        position: absolute;
        color: #6a6a6a;
       left: .35rem;
    }
}
</style>



