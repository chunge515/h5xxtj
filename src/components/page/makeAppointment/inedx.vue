<template>
    <div class="makeAppointment" :style="{height: heightPage + 'px'}">
        <div class="makeAppointment_img_wrap">
            <mt-swipe :auto="0">
                <img class="makeAppointment_img_wrap-img" src="../../../assets/images/subscribe .png" alt="">
            </mt-swipe>
        </div>
        <!-- 选择学段 -->
        <!-- <div class="makeAppointment_info">
            <mt-cell title="学段" is-link @click.stop.native="infoHandler('10')">
                <span :class="orderInfo.stageCode && orderInfo.stageCode != '请选择学段'  ? 'colorBlack' : 'colorAsh'">{{orderInfo.stageCode ? orderInfo.stageCode : '请选择学段'}}</span>
            </mt-cell>
            <mt-cell title="学科" is-link @click.stop.native="infoHandler('20')">
                <span :class="orderInfo.subjectCode && orderInfo.subjectCode != '请选择学科' ? 'colorBlack' : 'colorAsh'">{{orderInfo.subjectCode ? orderInfo.subjectCode : '请选择学科'}}</span>
            </mt-cell>
            <mt-cell title="预约时间" is-link @click.stop.native="timeShow ? infoHandler('30') : null">
                <span :class="orderInfo.date && orderInfo.date != '请选择时间'  ? 'colorBlack' : 'colorAsh'">{{orderInfo.date ? orderInfo.date : timeShow ? '请选择时间' : '暂无预约时间'}}</span>
            </mt-cell>
            <mt-field label="工号" placeholder="请输入工号" v-model="orderInfoSub.workCode"></mt-field>
        </div> -->
        <div class="wrokbox">
            工号：<div class="work_wrap"><input  placeholder="请输入工号" v-model="workCode" class="workinput"></div>
        </div>
        <div class="makeAppointment_sub">
            <!-- <mt-button @click.native="handleClickSub">预 约</mt-button> -->
            <mt-button  @click="goBookinQinquiries">预 约</mt-button>
        </div>


        <!-- 操作表 -->
        <!-- <div class="makeAppointment_actionSheet_wrap" :class="!actionSheetHide ? 'actionSheethide' : 'actionSheetshow'"  :style="style" @click="infoHandler(orderIndex)">
            <div class="makeAppointment_actionSheet">
                <div class="makeAppointment_actionSheet_title">
                    <div class="title_btn" @click="cancelHandler">取消</div>
                    <div class="title_contemt">请选择</div>
                    <div class="title_btn" @click="defineHandler">确定</div>
                </div>
                <div class="makeAppointment_actionSheet_picker">
                    <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { period, subjectHigh, subjectJunior, subjectPrimary, time } from './codeTable'
import { Toast } from 'mint-ui';
import moment from 'moment'
export default {
    name: 'makeAppointment',
    data() {
        return {
            // sheetVisible: '',
            // actions: true,
            // style: '',
            // actionSheetHide: false, // 是否关闭，操作表，false=》操作表隐藏， true=>操作表展示
            // slots: [ ],// 操作表数据
            orderInfoSub: { // 预约信息提交时使用
                //stageCode: '', // 学段
                //subjectCode: '', // 学科
                //date: '', // 日期
                //dateTime: '', // 时间段
                //parentMobile: JSON.parse(localStorage.getItem('web')).mobile, // 手机号
                workCode: '', // 工号
                //userCode:  JSON.parse(localStorage.getItem('web')).userId, // 用户唯一码
            },
            // orderInfo: { // 预约信息，页面展示使用
            //     stageCode: '', // 学段
            //     subjectCode: '', // 学科
            //     date: '', // 日期
            //     parentMobile: '', // 手机号
            //     workCode: '', // 工号
            // },
            // periodOld: '', // 记录上次选择的学段
            // orderIndex: 10, // 当前选择的信息项
            // timeShow: true, // 时间段是否存在
            // heightPage: 0, // 页面高度
            // picker: null, // 操作表，当前选择的对象
            // timeDate: [], // 后端返回可选择时间
            // currentValue: '', // 当前打开的时间选择的日期
        }
    },
    // stageCode: '',
    // subjectCode: '',
    // date: '',

    // stageCodeSub: '',
    // subjectCodeSub: '',
    // dateSub: '',
    // dateTimeSub: '',

    // created() {
    //     this.slots = period
    // },
    mounted() {
        this.heightPage = document.documentElement.clientHeight;
    },
    methods: {
        goBookinQinquiries(){
            if(this.workCode){
                this.$router.push({path:"/bookinginquiries",query: { workCode: this.workCode}})
            }else{
                alert("工号不能为空")
                // console.log(this.workCode)
            }
        },
       
        // 解决ios页面被顶起的问题
        // getFocus() {
        //     // const input = document.querySelector('#input');
        //     window.scroll = 0;

        //     // $("#input").on("blur", function() { window.scroll(0, 0); });
        // },
        // 点击填写每项数据时触发
        // infoHandler(val) {
        //     // debugger; 
        //     this.orderIndex = val;
        //     if (val == 10) {
        //         this.slots = period;
        //         this.actionSheetHide = !this.actionSheetHide;
        //     } else if (val == 20) {
        //          this.actionSheetHide = !this.actionSheetHide;
        //         this.orderInfoSub.stageCode == 1 ? this.slots = subjectPrimary : this.orderInfoSub.stageCode == 2 ? this.slots = subjectJunior : this.slots = subjectHigh
                
        //     } else if (val == 30) {
        //         if (this.orderInfoSub.stageCode && this.orderInfoSub.subjectCode) {
        //             this.actionSheetHide = !this.actionSheetHide;
        //             this.slots = time
        //         } else {
        //             Toast({
        //                 message: '请先选择学段和学科',
        //                 duration: 1500
        //             });
        //         }
                
        //     }
        // },
        // 改变选择器中的值时触发
        // onValuesChange(picker, values) {
        //     // debugger;
        //     if (this.orderIndex == 10) {
        //         this.orderInfoSub.stageCode = period[0].values.indexOf(values[0])
        //         if (this.orderInfo.stageCode != values[0]) {
        //             this.orderInfo.subjectCode = ''
        //         }
        //         this.orderInfo.stageCode = values[0];
        //     } else if (this.orderIndex == 20) {
                
        //         this.orderInfoSub.subjectCode = this.slots[0].values.indexOf(values[0])
        //         this.orderInfo.subjectCode = values[0];
                
        //     } else {
        //         console.log(values);
        //         // this.orderInfoSub.dateTime = values[0];
        //         this.orderInfo.date = values[0] + '  ' + values[1];
        //          this.orderInfoSub.date = values[0];
        //          this.orderInfoSub.dateTime = values[1];

        //     }
        // },
        // 点击取消时触发
        // cancelHandler() {
        //     this.actionSheetHide = false;

        // },
        // 点击确认时触发
        // defineHandler() {
        //     this.actionSheetHide = false;
        //     if (this.orderInfoSub.stageCode && this.orderInfoSub.subjectCode && (this.orderIndex == 10 || this.orderIndex == 20)) {
        //         this.$axios.post(this.lantianUrl + '/agency/assessAuditionResource/getAppointmentTimes', {stageCode: this.orderInfoSub.stageCode, subjectCode: this.orderInfoSub.subjectCode})
        //         .then((res) => {
        //             if (res.httpCode == 200) {
        //                 // res.result.length ? this.timeShow = true :  this.timeShow = false;
        //                 // debugger;
        //                 if (res.result.length) {
        //                     this.timeShow = true;
        //                 } else {
        //                      this.timeShow = false;
        //                 }
        //                 res.result.forEach(item => {
        //                    item.date = moment(item.date).format('YYYY-MM-DD');
        //                     time[0].values = [];
        //                    time[0].values.push(item.date);
        //                    time[2].values = item.dateTimes
        //                 });
        //                 console.log(time);
        //             }
        //         })
        //     }
        // },
        // 提交时触发
        // handleClickSub() {
            
        //     const key = Object.keys(this.orderInfoSub)
        //     const keyInfo = Object.keys(this.orderInfo)

        //     this.orderInfoSub. parentMobile = JSON.parse(localStorage.getItem('web')).mobile; // 手机号
        //     this.orderInfoSub. userCode = JSON.parse(localStorage.getItem('web')).userId; // 手机号
        //     const _this = this;
        //     const complete = key.every((item) => {
        //     if (!_this.orderInfoSub[item]) {
        //         return false
        //     }
        //     return true;
        //     });
        //     if (complete) {
        //         this.$axios.post(this.lantianUrl + '/agency/assessMakeAppointment/saveAssessMakeAppointment', this.orderInfoSub)
        //         .then((res) => {
        //             // debugger;
        //             if(res.httpCode == 200) {
        //                 Toast({
        //                     message: '预约成功',
        //                     duration: 1500
        //                 });
        //                 key.forEach((item) => {
        //                     if (item != 'userCode' && item != 'parentMobile') {
        //                         _this.orderInfoSub[item] = '';
        //                     }
        //                 });
        //                 keyInfo.forEach((item) => {
        //                     _this.orderInfo[item] = '';
        //                 });
        //                 _this.stageCode = '';
        //                 _this.subjectCode = '';
        //                 _this.date = '';

        //                 _this.stageCodeSub = '';
        //                 _this.subjectCodeSub = '';
        //                 _this.dateSub = '';
        //                 _this.dateTimeSub = '';

        //             } else if (res.httpCode == 300044) {
                        
        //                 _this.dateSub = '';
        //                 _this.dateTimeSub = '';
        //                 _this.date = '';
        //                 _this.orderInfo.date = '';
        //                 _this.orderInfoSub.date = '';
        //                 _this.orderInfoSub.dateTime = '';
        //                 Toast({
        //                     message: res.message,
        //                     duration: 1500
        //                 });
        //                 this.getTime();
        //             }
        //         })

        //     } else {
        //         Toast({
        //             message: '请将信息填写完整',
        //             duration: 1500
        //         });
        //     }
        // },
        // 获取时间
        // getTime() {
        //     if (this.orderInfoSub.stageCode && this.orderInfoSub.subjectCode) {
        //         this.$axios.post(this.lantianUrl + '/agency/assessAuditionResource/getAppointmentTimes', {stageCode: this.orderInfoSub.stageCode, subjectCode: this.orderInfoSub.subjectCode})
        //         .then((res) => {
        //             if (res.httpCode == 200) {
        //                 if (res.result.length) {
        //                     this.timeShow = true;
        //                 } else {
        //                      this.timeShow = false;
        //                 }
        //                 time[0].values = [];
        //                 this.timeDate = res.result;
        //                 res.result.forEach(item => {
        //                    item.date = moment(item.date).format('YYYY-MM-DD');
        //                    time[0].values.push(item.date);
        //                 });
        //                 time[2].values = res.result[0].dateTimes
        //             }
        //         })
        //     }
        // }
    },
    // watch: {
    //     'orderInfo.stageCode': function(val) {
    //         if (this.orderInfo.date) {
    //             this.dateSub = '';
    //             this.dateTimeSub = '';
                
    //             this.orderInfo.date = '';
    //             this.orderInfoSub.date = '';
    //             this.orderInfoSub.dateTime = '';
    //         }
    //     },
    //     'orderInfo.subjectCode': function(val) {
    //         if (this.orderInfo.date) {
    //             this.dateSub = '';
    //             this.dateTimeSub = '';
                
    //             this.orderInfo.date = '';
    //             this.orderInfoSub.date = '';
    //             this.orderInfoSub.dateTime = '';
    //         }
    //     }
    // }
}
</script>

<style lang="scss">
    .makeAppointment {
        height: 100%;
        position: relative;
        background: white;
        .makeAppointment_info {
            margin-bottom: .8rem;
            margin-top: .4rem;    
            padding: 0 .4rem;
            .mint-field-core {
                text-align: right;
            }
            .colorBlack {
                 color:black;
            }
            .colorAsh {
                color: #c8c8cd;
            }
            .mint-field-core {
                color: black;
            }
            .mint-field-core::-webkit-input-placeholder {
                 /* WebKit browsers */
                color: #c8c8cd;
            }
           .mint-field-core:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #c8c8cd;
            }
            .mint-field-core::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #c8c8cd;
            }
            .mint-field-core::-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #c8c8cd;
            }
            .mint-cell:first-child {
                .mint-cell-wrapper {
                    background-size: 0 0;
                }
            }
            .mint-cell:last-child {
                background-position: .2rem bottom;
                .mint-cell-wrapper {
                        padding-right: .68rem;
                }
            }
        }
        .wrokbox{ width: 4.4rem; margin:1.5rem auto; line-height: 0.4rem; display: flex;}
        .work_wrap{ width: 3rem; padding-left: 0.2rem;border-bottom: 0.01rem solid #000;} 
        .workinput{ width:3rem; line-height: 0.4rem; border:none; }
        .makeAppointment_sub {
            text-align: center;
            position: absolute;
            left: 1.25rem;
            top: 7.5rem;
            .mint-button {
                background: #F89B00;
                color: white;
                width: 5rem;
                height: 1rem;
                border-radius: 1rem;
                font-size: .4rem;
            }
        }
        .makeAppointment_img_wrap {
            // height: 4.8rem;
            .makeAppointment_img_wrap-img {
                // height: 100%;
                width: 100%;
            }
        }
        .makeAppointment_actionSheet_wrap {
            position: fixed;
            height: 100%;
            top: 0%;
            left: 0;
            right: 0;
        }
        .makeAppointment_actionSheet {
            height: 4.5rem;
            width: 100%;
            position: absolute;
            bottom: 90px;
            .makeAppointment_actionSheet_title {
                width: 100%;
                height: 0.8rem;
                background: #ffeed2;;
                display: flex;
                .title_contemt {
                    flex: 1;
                    line-height: .8rem;
                    text-align: center;
                }
                .title_btn {
                    width: 2rem;
                    text-align: center;
                    line-height: .8rem;
                }
            }
            .makeAppointment_actionSheet_picker {
                background: white;
                .slot2 {
                    width: .5rem;
                    display: flex;
                    justify-content: center;
                }
            }
        }
        .actionSheetshow {
            display: block;
            // animation: actionSheetUp 0.2 forwards;
            // -webkit-animation: actionSheetUp 0.2 forwards;
        }
        .actionSheethide {
            display: none;
            // animation: actionSheetDown 0.2 forwards;
            // -webkit-animation: actionSheetDown 0.2 forwards;
        }
        /* Standard syntax */
        @keyframes actionSheetDown {
            from {
                top: 100%;
            }
            to {
                top: 0%;
            }
        }
        /* Standard syntax */
        @-webkit-keyframes actionSheetDown {
            from {
                top: 100%;
            }
            to {
                top: 0%;
            }
        }

        /* Standard syntax */
        @keyframes actionSheetUp {
            from {
                top: 0%;
            }
            to {
                top: 100%;
            }
        }
        /* Chrome, Safari, Opera */
        @-webkit-keyframes actionSheetUp {
            from {
                top: 0%;
            }
            to {
                top: 100%;
            }
        }
    }
</style>


