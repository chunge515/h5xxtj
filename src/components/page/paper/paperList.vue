<template>
  <!--试题列表-->
  <div>
    <!--头部-->
    <header class="pagerList-head">
      <div></div>
      <div @click="chooseSubject">
        <span>{{gradeSub || '全部'}}</span>
        <i v-show="!popupVisible" class="fa fa-angle-down"></i>
        <i v-show="popupVisible" class="fa fa-angle-up"></i>
      </div>
      <div></div>
    </header>

    <!--试题列表-->
    <article class="test-list">
      <section class="test-list-wrap">
        <mt-loadmore :bottom-method="loadBottom"
                     @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded"
                     :auto-fill="false" ref="loadmore">
          <ul>
            <li v-for="(item,index) in paperList" :key="index">
              <!--测评卷-->
              <div class="test" v-if="item.evaluationRecordCode == null">
                <div class="title">{{item.paperName}}</div>
                <div class="test-bottom-wrap">
                  <div class="test-bottom-icon">
                    <span><i class="fa fa-bar-chart colorBlue"></i>{{item.totalScore}}分</span>
                    <span><i class="fa fa-flash colorOrange"></i>{{item.standardTime}}分钟</span>
                  </div>
                  <div>
                    <!--<router-link :to="{path:'/paper/static',query:{paperid: item.paperId,gradecode: grade.code,inviteCode:inviteCode}}">-->
                      <mt-button size="small" type="primary" class="beginbtn" @click="goTest(item.paperId)">开始测评</mt-button>
                    <!--</router-link>-->
                  </div>
                </div>
              </div>
              <!--报告-->
              <div class="test-finish" v-if="item.evaluationRecordCode != null">
                <div class="title">
                  <p>{{item.paperName}}</p>
                  <div><span>{{item.evaluationRecordScore || 0}}分</span></div>
                </div>
                <div class="test-finish-bottom-wrap">
                  <div class="test-finish-bottom-icon">
                    <span><i class="fa fa-bar-chart colorBlue"></i>{{item.evaluationRecordScore || 0}}分/{{item.totalScore}}分</span>
                    <span><i class="fa fa-calendar colorGreen"></i>{{item.evaluationRecordTime.substr(0,10)}}</span>
                  </div>
                  <div>
                    <router-link :to="{path:'/report',query:{reportCode: item.evaluationRecordCode,gradecode: grade.code,}}">
                      <mt-button size="small" type="primary" class="seereport" @click="viewReport(item)">查看报告</mt-button>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="allLoaded" class="loadfinish">没有更多数据了</div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="triple-bounce" color="#3ebce5"  v-show="bottomStatus == 'loading'"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </section>
    </article>

    <!--筛选年级学科-->
    <mt-popup
      v-model="popupVisible"
      position="top"
      :modal="false"
      popup-transition="popup-fade"
      :closeOnClickModal="false"
    >
      <header class="pagerList-head">
        <div></div>
        <div @click="chooseSubject">
          <span>{{gradeSub || '全部'}}</span>
          <i v-show="!popupVisible" class="fa fa-angle-down"></i>
          <i v-show="popupVisible" class="fa fa-angle-up"></i>
        </div>
        <div></div>
      </header>
      <!--年级学科-->
      <div class="screen">
      </div>
      <div class="screen-wrap">
        <div class="grade-wrap">
          <p><span></span>年级</p>
          <ul>
            <li v-for="item in grades" @click="chooseGradeItem(item)" :class="[item.gradeCode==grade.code?'active':'']">{{item.gradeName}}</li>
          </ul>
        </div>
        <div class="subject-wrap">
          <p><span></span>学科</p>
          <ul>
            <li v-for="item in subjects" @click="chooseSubjectItem(item)" :class="[item.subjectCode==subject.code?'active':'']">{{item.subjectName}}</li>
          </ul>
        </div>
        <div class="screen-btn-wrap">
          <button class="screen-btn" @click="chooseSubject">确定</button>
        </div>
      </div>

    </mt-popup>

  </div>
</template>

<script>
    export default {
      name: "paperList",
      data() {
          return {
            headName: "开始作答组件头部标题",//头部内容
            popupVisible: false,//年级学科弹出框是否显示
            grades: [],//年级列表
            grade: {
              code: null,
              name: '',
            },//年级信息
            subjects: [],//学科列表
            subject: {
              code: null,
              name: '',
            },//学科信息
            paperList: [],//试卷列表
            pageSize: 10,//试卷每页显示条数
            pageNum: 1,//试卷页码
            totalPage : 0,//数据总页码
            allLoaded: false,//数据是否加载完毕
            bottomStatus: '',//底部上拉加载状态
            userId: '',
          }
      },
      mounted() {
        var userid = window.localStorage.getItem("userid");

        if(userid == null) {
          this.userId = '';
        }else {
          this.userId = userid;
        }
        this.popupVisible = !this.popupVisible;
        var url = this.$route.query;
        var obj = {
          code:url.code,
          inviteCode:url.inviteCode
        }
      //  console.log(obj)
        window.localStorage.setItem("urlQuery",JSON.stringify(obj));
        // var gradeSubject = window.localStorage.getItem("gradeSubject");

        // if(gradeSubject!=null) {
        //   this.grade.code = JSON.parse(gradeSubject).grade.code;
        //   this.grade.name = JSON.parse(gradeSubject).grade.name;
        //
        //   this.subject.code = JSON.parse(gradeSubject).subject.code;
        //   this.subject.name = JSON.parse(gradeSubject).subject.name;
        // }

        //获取年级列表
        this.getSubjectList();
      },
      methods: {
        goTest:function(id){
          var $this = this;
          var url = this.$route.query;
          $this.$router.push({
            path: '/paper/static',
            query:{
              paperid: id,
              gradecode: $this.grade.code,
              inviteCode:url.inviteCode
            }
          })
        },
        //查看报告
        viewReport(item) {
          // console.log("查看报告");
          // console.log(item);
        },
        //获取年级列表
        getSubjectList() {
          var codeItem = this.$route.query;
          this.$axios({
            method: "post",
            url:  this.apiURL + "/jeecg/rest/support/grade/getGrades",
            data: {
              appKey: "string",
              token: "string",
              stageCode:codeItem.code
            }
          }).then((res) => {
            this.grades = res.result;
            this.grade.code = res.result[0].gradeCode;
            this.grade.name = res.result[0].gradeName;
            this.inviteCode = this.$route.inviteCode;
            // console.log("学年列表");
            // console.log(this.grades);

            if(this.grade.code == null) {
              this.grade.code = this.grades[0].gradeCode;
            }
            if(this.grade.name == '') {
              this.grade.name = this.grades[0].gradeName;
            }

            //获取学科列表
            this.getGradeList();
          }).catch(err => {
            // console.log(err);
            this.Toast('获取学年出现错误');
          })
        },
        //获取学科列表
        getGradeList() {
          this.$axios({
            method: "post",
            url:  this.apiURL + "/jeecg/rest/support/course/getSubjects",
            data: {
              appKey: "string",
              gradeCodes: [
                this.grade.code
              ],
              token: "string"
            }
          }).then((res) => {
            /*只要数学和英语*/
            var arr = [];
            for(var i = 0;i<res.result.length;i++){
              if(res.result[i].subjectCode==2||res.result[i].subjectCode==3){
                arr.push(res.result[i])
              }
            }

            this.subjects = arr//res.result;
          //  console.log(this.subjects)
            this.subject.code = arr[0].subjectCode//res.result[0].subjectCode;
            this.subject.name = arr[0].subjectName//res.result[0].subjectName;
            // this.subjects.unshift({
            //   "subjectCode": null,
            //   "subjectName": "全部",
            // })

            if(this.subject.code == null) {
              this.subject.code = this.subjects[0].subjectCode;
            }
            if(this.subject.name == '') {
              this.subject.name = this.subjects[0].subjectName;
            }
            this.paperList = [];

            this.getTestList();
          }).catch(err => {
            // console.log(err);
            this.Toast('获取学科出现错误');
          })
        },
        //获取试卷列表
        getTestList() {
          this.$axios({
            method: "post",
            url: "/paper/getPaperList",
            data: {
              appKey: null,
              difficultyCode: null,
              gradeCode: this.grade.code,//年级code
              pageNum: this.pageNum,//试卷页码
              pageSize: this.pageSize,//试卷每页显示条数
              paperId: null,
              paperName: null,
              productId: "3b881f4878694e8b81a0399db794cf5e",
              releaseStatus: 1,
              subjectCode: this.subject.code,//学科code
              token: null,
              userId: this.userId,
              // 5c3e38587d064cac9c93f9409fadee97
              // 61e980e33dca4669bc9e7d66ec0ce35d
            }
          }).then((res) => {
            if(res.code == '000000') {
              this.paperList = this.paperList.concat(res.pages);
              this.totalPage  = res.totalPage ;//数据总页码

              // console.log('试卷列表');
              // console.log(res.pages)
              //返回的数据总条数小于每页显示条数
              if(res.pages.length < this.pageSize) {
                this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
              }
              this.handleBottomChange("loadingEnd");//数据加载完毕 修改状态码
            }else {
              this.Toast('获取试卷出现错误');
            }
          }).catch(err => {
            // console.log(err);
            this.Toast('获取试卷出现错误');
          })
        },

        //修改状态码方法
        handleBottomChange(status) {
          this.bottomStatus = status;
        },
        //下拉方法
        loadBottom() {
          var _this = this;
          _this.handleBottomChange("loading");//上拉时 改变状态码
          //页码增加
          _this.pageNum += 1;
          setTimeout(() => {
            if(_this.pageNum  <= _this.totalPage ){//页码小于总页数
              //获取试卷列表
              _this.getTestList()
            }else{
              _this.allLoaded = true;//模拟数据加载完毕 禁用上拉加载
            }
            // 下拉结束，改变状态码
            _this.handleBottomChange("loadingEnd");
            _this.$refs.loadmore.onBottomLoaded();
          }, 1000);
        },
        //选择学科年级弹框
        chooseSubject() {
          var _this = this;
          //清空试卷列表
          this.paperList = [];
          //隐藏时
          if(this.popupVisible == true) {
            //试卷页码数
            this.pageNum = 1;
            // 数据是否加载完毕变回false
            this.allLoaded = false;
            //获取试卷列表
            this.getTestList();

            var gradeDetail = {
              grade: {
                code: _this.grade.code,
                name: _this.grade.name
              },
              subject: {
                code: _this.subject.code,
                name: _this.subject.name
              }
            }
            window.localStorage.setItem('gradeSubject',JSON.stringify(gradeDetail))

          }
          this.popupVisible = !this.popupVisible;
        },
        //选择年级
        chooseGradeItem(item) {
          this.grade.code = item.gradeCode;
          this.grade.name = item.gradeName;
          if(this.grade.code == null) {
            //获取全部学科列表
            this.getAllGradeList();
          }else {
            //获取学科列表
            this.getGradeList();
          }
        },
        //选择学科
        chooseSubjectItem(item) {
          this.subject.code = item.subjectCode;
          this.subject.name = item.subjectName;
        },

        //获取全部学科列表
        getAllGradeList() {
          this.$axios({
            method: "post",
            url:  this.apiURL + "/jeecg/rest/support/subject/getSubjects",
            data: {
              "appKey": "string",
              "gradeCodes": [
                this.grade.code
              ],
              "token": "string"
            }
          }).then((res) => {
            this.subjects = res.result;
            // this.subjects.unshift({
            //   "subjectCode": null,
            //   "subjectName": "全部",
            // })
          }).catch(err => {
            // console.log(err);
            this.Toast('获取学科出现错误');
          })
        },
      },
      computed: {
        //头部显示的标题
        gradeSub: function() {
          if(this.grade.name == "全部" && this.subject.name == "全部"){
            return '全部';
          }else if(this.grade.name == "全部" || this.subject.name == "全部") {
            if(this.grade.name == "全部") {
              this.grade.name = '';
            }
            if(this.subject.name == "全部") {
              this.subject.name = '';
            }
            return this.grade.name + this.subject.name;
          }else {
            return this.grade.name + this.subject.name;
          }
        }
      }
    }
</script>

<style scoped>
  /*头部*/
  .pagerList-head {
    height: 2.1rem;
    line-height: 2.1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    background: #3ebce5;
    padding: 0 0.8rem;
  }
  .pagerList-head span {
    font-size: 0.8rem;
  }
  .pagerList-head i {
    display: inline-block;
    font-size: 1rem;
    position: relative;
    top: 0.05rem;
  }
  .rightIcon {
    position: relative;
    z-index: 99;
  }

  /*筛选年级学科*/
  .screen {
    width: 100%;
    height:calc(100vh - 2.1rem);
    background: rgb(0,0,0);
    opacity: 0.5;
    position: absolute;
    top: 2.1rem;
    left: 0;
  }
  .screen-wrap {
    width: 100%;
    max-height: calc(100vh - 2.1rem);
    overflow: auto;
    background: white;
    padding-top: 1rem;
    /*box-shadow: 0px 2px 0px 0px #e0e0e0;*/
    position: relative;
  }
  .subject-wrap {
    border-top: 1px solid #d9d9d9;
  }
  .grade-wrap,.subject-wrap {
    padding: 1rem 0.65rem 0;
  }
  .grade-wrap p,.subject-wrap p {
    font-size: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
    display: flex;
    align-items: center;
  }
  .grade-wrap p span,.subject-wrap p span {
    width: 0.3rem;
    height: 0.3rem;
    display: inline-block;
    background-color: #3ebce5;
    border-radius: 50%;
    margin-right: 0.45rem;
  }
  .grade-wrap ul,.subject-wrap ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.9rem;
  }
  .grade-wrap ul li,.subject-wrap ul li {
    width: 3.85rem;
    /*background: #3ebce5;*/
    text-align: center;
    height: 1.4rem;
    line-height: 1.4rem;
    margin: 0 0.15rem 1.3rem;
    font-size: 0.7rem;
    border-radius: 0.7rem;
  }
  .active {
    background: #3ebce5;
    color: white;
  }
  .screen-btn-wrap {
    width: 100%;
    text-align: center;
    height: 2.4rem;
  }
  .screen-btn {
    width: 4.5rem;
    height: 1.8rem;
    background: #3ebce5;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.8rem;
  }


  /*试题列表*/
  .test-list {
    width: 100%;
    touch-action: none !important;
  }
  .test-list-wrap {
    width: 100%;
    height: calc(100vh - 2.1rem);
    overflow: auto;
  }
  .test-list-wrap ul {
    padding: 1.2rem 0.8rem 0;
  }
  .test-list-wrap ul li {
    height: 4.05rem;
    margin-bottom: 0.8rem;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0px 2px 0px 0px #e0e0e0;
  }

  /*开始测评*/
  .test-list-wrap ul li .test {
    height: 3.65rem;
    padding: 0.2rem 0.55rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-left: 0.1rem solid #ff9234;
    border-radius: 0.2rem;
  }
  .test-list-wrap ul li .test .title {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .test-list-wrap ul li .test .test-bottom-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .test-list-wrap ul li .test .test-bottom-wrap .test-bottom-icon span {
    margin-right: 0.6rem;
    color: #858585;
    font-size: 0.6rem;
  }
  .test-list-wrap ul li .test .test-bottom-wrap .test-bottom-icon span i {
    margin-right: 0.3rem;
  }
  .beginbtn {
    width: 3.45rem;
    height: 1.15rem;
    font-size: 0.6rem;
    white-space: nowrap;
    background-color: #ff9234;
    text-align: center;
    line-height: 1rem;
    padding: 0;
  }

  /*查看报告*/
  .test-list-wrap ul li .test-finish {
    height: 3.65rem;
    padding: 0.2rem 0.55rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-left: 0.1rem solid #3ebce5;
    border-radius: 0.2rem;
  }
  .test-list-wrap ul li .test-finish .title {
    font-size: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .test-list-wrap ul li .test-finish .title p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .test-list-wrap ul li .test-finish .title div {
    width: 2.1rem;
    height: 2.1rem;
    background: url('../../../../static/img/branch_bg.png') no-repeat;
    background-size: 100% 100%;
  }
  .test-list-wrap ul li .test-finish .title div span {
    display: inline-block;
    width: 2.1rem;
    height: 2.1rem;
    line-height: 1.3rem;
    text-align: center;
    transform: rotate(45deg);
    font-size: 0.6rem;
    color: white;
  }
  .test-list-wrap ul li .test-finish .test-finish-bottom-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .test-list-wrap ul li .test-finish .test-finish-bottom-wrap .test-finish-bottom-icon span {
    margin-right: 0.6rem;
    color: #858585;
    font-size: 0.6rem;
  }
  .test-list-wrap ul li .test-finish .test-finish-bottom-wrap .test-finish-bottom-icon span i {
    margin-right: 0.3rem;
  }
  .seereport {
    width: 3.45rem;
    height: 1.15rem;
    font-size: 0.6rem;
    white-space: nowrap;
    background-color: #3ebce5;
    text-align: center;
    line-height: 1rem;
    padding: 0;
  }


  .loadfinish {
    text-align: center;
    font-size: 0.6rem;
    color: #666;
    line-height: 1.5rem;
  }
  .colorBlue {
    color: #45b7b7;
  }
  .colorOrange {
    color: #ff9234;
  }
  .colorGreen {
    color: #7ac858;
  }
</style>
