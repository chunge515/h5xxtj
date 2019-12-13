<template>
    <div class="Evaluation-details-page">
        <!-- 易教测评详情页 -->
        <div class="Evaluation-details-page-header">
            <div class="header-left">
                <img :src="list.coverImgUrl" alt="">
            </div>
            <div class="header-right">
							<p>{{list.name}}</p>
							<span><i style="font-size: .24rem; font-style: normal">￥</i>{{trues ? list.livePrice : list.price}}</span>
							<button @click="goT" v-if="!isV">获取提分行动</button>
            </div>
        </div>
				<div class="Evaluation-details-page-content">
						<div class="content-details content-box">
							<p class="content-title">商品详情:</p>
							<div>
								<ul>
									<li>{{gradeCode}}</li>
									<li>{{subjectCode}}</li>
									<li>{{list.bookTypeName}}</li>
								</ul>
							</div>
						</div>
						<div class="content-category content-box">
							<p class="content-title">服务类别:</p>
							<div>
								<label for=""><!--<span></span>-->测评</label>
								<label for="" ><span @click='selectBtn()' :style="style"></span>1V1报告解读服务</label>
							</div>
						</div>
						<div class="content-time" v-if="trues">
							<div class="content-top">
								<p class="content-title">选择时段:</p>
								<div @click="openPicker" class="date">{{date.real}}</div>
								<div class="desc">直播课只能选择最近7天内的时段</div>
							</div>
              <ul class="selection-time" v-if="times.length">
                <li v-for="(item,index) in times" :key="index"
                    :class="active == index ? 'active' : ''"
                    @click='TimeBtn(item,index)'>
                  {{item.courseTimeCodeStr.substring(0,5)}}
                </li>
              </ul>
              <div class="selection-time noData" v-else>
                暂无时间段！！！
              </div>
						</div>
						<div class="content-Discount-code content-box" v-if="!isV || trues">
							<p class="content-title">兑换码:</p>
							<input type="text" v-model="couponCode"/>
						</div>
				</div>
				 <div class="content-main" v-html="list.details">

				</div>
				<div class="footer-button">
          <span><i style="font-size: .24rem; font-style: normal">￥</i>{{trues ? list.livePrice : list.price}}</span>
					<button @click='buyBtn()'>立即兑换</button>
				</div>
      <!--选择日期-->
      <mt-datetime-picker
        v-model="date.value"
        ref="picker"
        type="date"
        :startDate="date.min"
        :endDate="date.max"
        @confirm="dateConfirm"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
      </mt-datetime-picker>

    </div>
</template>

<script>

  import moment from "moment";
  export default {
    data(){
      return {
					list:{},
					gradeCode:'',
					subjectCode:'',
					trues:false,
          times:[],//时间段
          date: {
            min: new Date(moment().add('days',1).format('YYYY/MM/DD')),
            max: new Date(moment().add('days',7).format('YYYY/MM/DD')),
            value: new Date(moment().add('days',1).format('YYYY/MM/DD')),
            real:moment(new Date(moment().add('days',1))).format('YYYY-MM-DD')   //真实值
          },
        time:null,
        active : null,
        item : null,
        couponCode:'',//兑换码
        coupinName:'',//立即兑换
        isV:false,
        isCoupon:false,//兑换码价格是否充足
        handler:function(e){e.preventDefault();}

      }
		},
		computed: {
			style(){
				if(this.trues){
					return {
						backgroundColor:'#67b6ee',
						border:'none'
					}
				} else {
					return {
						backgroundColor:'#fff'
					}
				}
			}
		},
    created() {
      //console.log(moment().add('days',7).format('YYYY/MM/DD'))
        this.ForMoreDetails();
        this.getList();
    },
    methods:{
      //购买提分行动的页面
      goT(){
        this.$router.push({path:'/vipCenter',query:{gradeCode:this.list.gradeCode,subjectCode:this.list.subjectCode}})
      },
      //查看是否購買提分行動
      isVip(id){
        let self = this;
        var obj={
          "gradeCode": this.list.gradeCode,
          "productType": 3,
          "subjectCode": this.list.subjectCode,
          "userId":id,
        }
        this.$axios.post(this.lantianUrl + 'member/isMember',obj).then(res =>{
          if(res.httpCode == "200"){
            self.isV = res.result || false;
          }
        })
      },
      /*解决iphone页面层级相互影响滑动的问题*/
      closeTouch:function(){
        document.getElementsByTagName("body")[0].addEventListener('touchmove',
          this.handler,{passive:false});//阻止默认事件
        console.log("closeTouch haved happened.");
      },
      openTouch:function(){
        document.getElementsByTagName("body")[0].removeEventListener('touchmove',
          this.handler,{passive:false});//打开默认事件
        console.log("openTouch haved happened.");
      },
      openPicker () {
        this.$refs.picker.open();
        this.closeTouch();//关闭默认事件

      },
      handleConfirm (data) {
        let date = moment(data).format('YYYY-MM-DD')
        this.birthday = date;
        this.openTouch();//打开默认事件
      },
      //确认选择日期
      dateConfirm(val) {
        console.l
        let date = moment(val).format('YYYY-MM-DD')
        this.date.real = date;
        this.openTouch();//打开默认事件
        this.getList();
       // this.date.real = this.date.value;
      },
			ForMoreDetails(){
				let self = this
				this.$axios.post(this.lantianUrl + 'agency/agencyAssessProduct/getAssessProductInfo',this.$route.query).then(res =>{
						if(res.httpCode == "200"){
								self.list = res.result ||{};
              let localData = this.localData.get('web') || {};
              if(localData.userId){this.isVip(localData.userId);}
							for(let i in self.GrandList){
									if(self.list.gradeCode == i){
											self.gradeCode = self.GrandList[i]
									}
							}
							for(let i in self.commonSubject){
									if(self.list.subjectCode == i){
											self.subjectCode = self.commonSubject[i]
									}
							}
						}
				})
			},
			selectBtn(){ //选中勾选框
				this.trues = !this.trues
			},
      //获取时间段
      getList(){
        this.active = null;
        this.item = null;

        this.$axios.post(this.lantianUrl +'agency/agencyAssessLiveTeacherTime/getHaveLiveTeacherTimeList',{
          subjectCode:this.list.subjectCode,
          gradeCode :this.list.gradeCode,
          date :this.date.real,
          isOccupy:0
        }).then(res =>{
          if(res.httpCode == '200'){
            this.times = res.result.teacherTimeList;
          }
        })
      },
      //立即购买
      buyBtn(){
        var that=this;
        let localData = this.localData.get('web') || {};
        if(!localData.userId){
          this.$router.push({path:'/login',query:{}});
          return
        }
        var isCoupon=false;
        if(this.trues){
          isCoupon=true;
          if(!this.item){
            this.Toast({message: '请选择要购买的时间段',type: 'warning'});
            return
          }
        }else{
          if(!this.isV){
            isCoupon=true;
          }else{
            that.saveOrder()
          }
          /*this.isVip(localData.userId);
          this.$nextTick(function () {

          })*/
        }
        this.$nextTick(function () {
          if(isCoupon){
            if(!this.couponCode){
              this.Toast({message: '请输入兑换码',type: 'warning'});
              return
            }else{
              var data={
                liveCourseCode :this.list.code,//商品code
                liveCourseType: this.trues ? 4 : 3,//3  测评  4  解读
                couponCode:this.couponCode//兑换码
              }
              this.$axios.post(this.lantianUrl + 'agency/checkCouponFaceValue',data).then(res =>{
                if(res.httpCode == "200"){
                  this.isCoupon = res.result || false;
                  if(!this.isCoupon){
                    this.Toast({message: '兑换码额度不足',type: 'warning'});
                  }else{
                    that.saveOrder()
                  }
                }
              })
          }}
        })
      },
      //提交订单
      saveOrder(){
        let localData = this.localData.get('web') || {};
        let params = {
          userCode:localData.userId || '',//buzhidao
          userName:localData.realname || '' ,//buzhidao
          productType:3, //固定值3
          liveCourseCode:this.list.code ,//课程code
          orderType:this.trues ? 3 : 5, //订单类型固定值3
          date:this.trues ?this.value : null,//时间年月日
          courseTimeCode:this.trues ?this.item.courseTimeCode : null,//时间code
          couponCode:this.couponCode, //优惠码选填   this.couponCode ?this.couponCode:null
          userMobile: localData.mobile//用户手机号
        }
        this.$axios.post(this.lantianUrl+'agency/saveOrder',params).then(res =>{
          if(res.httpCode == '300029'){
            let instance = this.Toast('您已购买该测评，请前往pc端体验！');
            setTimeout(() => {
              instance.close();
              this.$router.push({path:'/order'})
            }, 2000);
            return
          }
          if(res.httpCode == '300028'){
            this.Toast({message: '兑换码无效,请重新输入'});
            return
          }
          if(res.httpCode == '200'){
            if(res.result.vip == true){
              // let instance = this.Toast('您已购买提分行动，请前往pc端体验！');
            let instance = this.Toast('您已购买该测评，请前往pc端体验！');
              setTimeout(() => {
                instance.close();
                this.$router.push({path:'/order'})
              }, 2000);
            } else {
            }
          }
        })
      },
      //获取兑换码的额度
      TimeBtn(item,index){
        if(!this.dateConversionMinutes(item.courseTimeCodeStr.substring(0,5)) && this.currentTime() == item.date){
          return
        }
        this.item = item;
        console.log(item)
        this.active = index;
      },
			PaymentPageBtn(){
				this.$router.push({path:'/PaymentPage'})
			}
    },

//侦听属性
  watch: {
    //picker关闭没有回调函数，所以侦听该属性替代
    signReasonVisible:function(newvs,oldvs){//picker关闭没有回调函数，所以侦听该属性替代
      if(newvs){
        this.closeTouch();
      }else{
        this.openTouch();
      }
    },
    }
}
</script>
<style lang='scss'>
/* body.html{
	height: 100%;
} */
.Evaluation-details-page{
    .Evaluation-details-page-header{
        height: 2.13rem;
        padding: 0.31rem;
        background-color: #fff;
        display: flex;
        .header-left{
            width: 2.3rem;
						img{
							width: 2.3rem;
							height: 2rem;
						}
        }
        .header-right{
            flex: 1;
						position: relative;
						p{
							line-height: 0.38rem;
							font-size: 0.32rem;
							margin-left: 0.21rem;
							margin-top: 0.06rem;
							font-weight: bold;
							color: #5c5c5c;
						}
						span{
							position: absolute;
							left: 0.21rem;
							bottom: 0.17rem;
							font-size: 0.32rem;
							color: #d03131;
						}
						button{
							position: absolute;
							width: 2.01rem;
							height: 0.52rem;
              line-height: .52rem;
							background-color: #ff9b19;
							border: none;
							color: #fff;
							font-size: 0.21rem;
							border-radius:5px;
							bottom: 0.14rem;
							right: 0.1rem;
						}
        }
    }
		.Evaluation-details-page-content{
			background: #fff;
			overflow: auto;
			margin-top: 0.2rem;
			margin-bottom: 0.2rem;
			.content-box{
				height: 0.9rem;
				margin-left: 0.31rem;
				margin-right: 0.31rem;
				display: flex;
				align-items: center;
				border-bottom: 0.01rem solid #e5e5e5;
				.content-title{
					width: 1.49rem;
					font-size: 0.28rem;
					color: #959595;
				}
				div{
					flex: 1;
				}
			}
			.content-details{
				ul{
					li{
						float: left;
						padding: 0 0.14rem 0 0.14rem;
						color:#1a1a1a;
						font-size: 0.28rem;
					}
					li:nth-of-type(1){
						padding-left: 0;
						border-right: 0.01rem solid #e3e2ea;
					}
					li:nth-of-type(2){
						border-right: 0.01rem solid #e3e2ea;
					}
				}
			}
			.content-category{
				div label{
					float: left;
					font-size: 0.28rem;
					span{
						width: 0.32rem;
						height: 0.32rem;
						display: inline-block;
						background: url(../../../../static/img/correct-b.png) center no-repeat;
						background-size:80%;
						background-color:#cccccc;
						margin-right: 0.08rem;
						border-radius: 5px;
						float: left;
						box-sizing: border-box;
					}
				}
				div label:nth-of-type(2){
					margin-left: 0.4rem;
					span{
						background-color: #fff;
            vertical-align: middle;
						border: 0.01rem solid #ccc;
            margin-top:.04rem;
					}
				}
			}
			.content-Discount-code{
				border: none;
				height: 0.9rem;
				input{
					background: #f0f0f0;
					width: 2.41rem;
					height: 0.56rem;
					border: none;
          padding:0 .2rem;
					border-radius: 3px;
          font-size: 0.22rem;
				}
			}
			.content-time{
				border-bottom: 0.01rem solid #d9d9d9;
				margin-left: 0.32rem;
				margin-right: 0.32rem;
				.content-top{
					display: flex;
					align-items: center;
					height: 0.94rem;
					.content-title{
						width: 1.49rem;
						font-size: 0.28rem;
						color: #959595;
					}
          .date{
            height:.45rem;
            line-height: .45rem;
            background-color: #f0f0f0;
            border-radius: 3px;
            padding:0 .3rem;
            margin-right:1.2rem;
            color: #1a1a1a;
            font-size: .24rem;
          }
          .desc{
            width:2rem;
            color: #999;
            font-size: .2rem;
            align-self: center  ;
          }
				}
			}
      .selection-time{
        margin-left:1.49rem;
        height:auto;
        overflow: hidden;
        li{
          width:1.05rem;
          font-size: .24rem;
          height:.54rem;
          border:1px solid #ccc;
          border-radius: 5px; text-align: center;
          line-height: .54rem;
          margin:0 .36rem .2rem 0;
          float:left;
          &.active{
            background-color: #ffecec;
            color: #d03131;
            border:1px solid #ed7272;
          }
        }
      }
      .noData{
        font-size: .24rem;
        margin-bottom: .2rem;
        color: #1a1a1a;
      }
		}

}

.content-main{
  width:100%;
  padding:.3rem;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 0.89rem;
  img{
    max-width: 100%
  }
}

.footer-button{
		position: fixed;
		bottom: 0rem;
		left: 0rem;
		width: 100%;
		height: 0.89rem;
		border-top:0.01rem solid #d9d9d9;
		background-color: #fff;
		z-index: 2;
		button{
			width: 3.23rem;
			float: right;
			height: 100%;
			border: none;
			color: #fff;
			background: #d03131;
			font-size: 0.24rem;
		}
		span{
			padding-left: 0.32rem;
			line-height: 0.89rem;
			color: #d75b5b;
			font-size:0.32rem;
		}
	}
</style>
