<!-- 报告列表页 -->
<template>
  <div class="reports">
    <div class="top-type">
      <mt-button size="large" class="report-type" @click="selectAction()">{{actions[actionI].name}} <span
        class="open">﹀</span></mt-button>
    </div>
    <ul class="page-infinite-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
      <li v-for="item in lists" class="report" :class="{'blue':item.type==1}">
        <i class="tip">{{testType(item.type)}}</i>
        <div class="name">{{myName(item)}}（{{item.appointDateTime? "已":"未"}}预约）</div>
        <div class="feet">
          <span class="time">{{item.createDate | timefilter(1)}}</span>
          <mt-button class="detail" size="small" v-show="parseInt(item.type) >0 && parseInt(item.type) < 3"
                     @click="gotoReport(item)">查看报告
          </mt-button>
        </div>
      </li>
    </ul>
    <p class="page-infinite-loading" v-show="pageNum < totalPage || totalPage < 0 ">
      <span>
        <div class="mint-spinner-fading-circle circle-color-24" style="width: 28px; height: 28px;">
          <div class="mint-spinner-fading-circle-circle is-circle2"></div>
          <div class="mint-spinner-fading-circle-circle is-circle3"></div>
          <div class="mint-spinner-fading-circle-circle is-circle4"></div>
          <div class="mint-spinner-fading-circle-circle is-circle5"></div>
          <div class="mint-spinner-fading-circle-circle is-circle6"></div>
          <div class="mint-spinner-fading-circle-circle is-circle7"></div>
          <div class="mint-spinner-fading-circle-circle is-circle8"></div>
          <div class="mint-spinner-fading-circle-circle is-circle9"></div>
          <div class="mint-spinner-fading-circle-circle is-circle10"></div>
          <div class="mint-spinner-fading-circle-circle is-circle11"></div>
          <div class="mint-spinner-fading-circle-circle is-circle12"></div>
          <div class="mint-spinner-fading-circle-circle is-circle13"></div>
        </div>
      </span>
      加载中...
    </p>
    <mt-actionsheet
      :actions="actions"
      v-model="showReportsChange">
    </mt-actionsheet>
  </div>
</template>

<script>

  export default {
    name: "reports",
    data() {
      return {
        userInfo:this.localData.get("userInfo")||{},
        showReportsChange: false,  //是否显示加载更多
        //报告类型
        actions: [
          {
            name: "学生测评",
            value: 1,
            method: this.check.bind(0)
          }, {
            name: "家长测评",
            value: 2,
            method: this.check.bind(1)
          }, {
            name: "全部报告",
            value: 0,
            method: this.check.bind(2)
          }
        ],
        parentTypes: ['', {parentType: 1, name: "家庭教养方式", code: 3,value:"upbringingResult"}, {parentType: 2, name: "亲子关系", code: 4,value:"parenthoodResult"}],
        actionI: 2,  //被选中的报告类型下标
        lists: [],
        pageNum: 0,
        pageSize: 10,
        totalPage: -1,
        loading: false,  //加载更多

      }
    },
    mounted() {
    },
    methods: {
      //选择报告类型
      check(v, i) {
        console.log("c", v, i);
        this.lists = [];  //清空
        this.actionI = i;
        this.pageNum = 1;
        this.totalPage = -1;
        this.getLists(1);
      },
      //加载下一页
      loadMore() {
        if (this.loading || (this.pageNum >= this.totalPage && this.totalPage >= 0)) return;
        this.loading = true;
      //  console.log("load more");
        this.getLists(this.pageNum + 1);
      },
      //选择报告类型
      selectAction() {
        this.showReportsChange = true;
      },
      //获取报告列表
      getLists(pageNum) {
        var _this = this;
        this.$axios({
          url: "/parentTest/getParentTests",
          method: "post",
          data: {
            pageNum: pageNum,
            pageSize: _this.pageSize,
            tel:_this.userInfo.mobile,
            childRealName:_this.userInfo.student&&_this.userInfo.student.childRealName||null, //有就传没有拉倒
            userId:_this.userInfo.userId,
            type: _this.actions[_this.actionI].value || null, //全部类型传null
            appKey: "app"
          }
        }).then(function (res) {
          if (res.code == "000000") {
            _this.lists = _this.lists.concat(res.result);
            _this.pageNum = res.pageNum;
            _this.totalPage = res.totalPage;

          } else {
            console.warn(res);
            _this.Toast({
              message: '获取数据失败',
              position: 'bottom',
              duration: 5000
            })
          }
          _this.loading = false
        }).catch(function (e) {
          console.error(e);
          _this.Toast({
            message: '获取数据失败',
            position: 'bottom',
            duration: 5000
          })
          _this.loading = false
        })
      },
      //查看报告
      gotoReport(v) {
        console.log(v)
        if (v.type == 1) {
          this.$router.push({
            path: "/report", query: {
              reportCode: v.evaluationRecordId,  //看详情
              reportId:v.id  //提交预约
            }
          })
        } else if (v.type == 2) {
          v.reportId = v.id;
          this.localData.set("datalist", v);
          this.$router.push({path: "/parent/text/report",
            query: {code:this.parentTypes[v.parentType].code,isParent:true}})
        }

      },
      testType: function (v) {
        for (var i = 0; i < this.actions.length; i++) {
          if (this.actions[i].value == v) {
            return this.actions[i].name;
          }
        }
        return "未知"
      },
      //获取当前名称
      myName(item) {
        if (item.type == 2) {
          var o = this.parentTypes[item.parentType];
          return o && o.name || " ";
        } else {
          return item.paperName || " ";
        }
      }
    },
    filters: {
      timefilter(v, t) {
        var time = new Date(v);
        if (!v || !time || !time.getFullYear()) return "  ";
        var s = time.getFullYear() + ".";
        s += (time.getMonth() > 8 ? (1 + time.getMonth()) : ("0" + (1 + time.getMonth()))) + ".";
        s += (time.getDate() > 9 ? time.getDate() : ("0" + time.getDate())) + " ";
        s += (time.getHours() > 9 ? time.getHours() : ("0" + time.getHours())) + ":";
        s += time.getMinutes() > 9 ? time.getMinutes() : ("0" + time.getMinutes());
        return s;
      }
    }
  }
</script>

<style scoped lang="scss">
  .open {
    display: inline-block;
    vertical-align: middle;
  }

  .reports {
    box-sizing: border-box;
    padding: 20px .9rem 0;
    position: relative;
    height: 100%;
    background-color: #fff;
    overflow: scroll;
    ul {
      margin-top: 2.2rem;
      box-sizing: border-box;
      display: block;
      padding-bottom: .5rem;
    }
    .top-type {
      background-color: #fff;
      font-size: .7rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      text-align: center;
      border-radius: 6px;
      height: 2rem;
      line-height: 2rem;
      padding: .32rem .9rem 0;
      button {
        background-color: #a91515;
        color: #fff;
      }
    }
    /* 家长测评 */
    .report {
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);
      margin-top: .8rem;
      position: relative;
      display: block;
      z-index: 1;
      border-radius: 6px;
      clear: both;
      box-sizing: border-box;
      padding: 2rem .4rem .4rem;
      .name {
        font-weight: bold;
        font-size: .9rem;
        color: #333333;
        padding-top: .4rem;
      }
      .feet {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: .1rem;
        .time {
          color: #999999;
          font-size: .7rem;
          vertical-align: bottom;
        }
      }
      .detail {
        background-color: #ffa400;
        color: #fff;
      }
      .tip {
        top: .5rem;
        left: -.1rem;
        position: absolute;
        z-index: 10;
        font-style: normal;
        background-color: #ffa400;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: .6rem;
        display: inline-block;
        padding: 0 5px 0 8px;
        color: #fff;
        &:after {
          position: absolute;
          left: 100%;
          top: 0;
          border-top: .55rem solid #ffa400;
          border-left: .2rem solid #ffa400;
          border-bottom: .55rem solid transparent;
          border-right: .2rem solid transparent;
          z-index: 11;
          content: " ";
          font-size: 0;
        }

      }
      /* 学生测评 */
      &.blue {
        .detail {
          background-color: #00a8b5;
        }
        .tip {
          background-color: #00a8b5;
          &:after {
            position: absolute;
            left: 100%;
            top: 0;
            border-top: .55rem solid #00a8b5;
            border-left: .2rem solid #00a8b5;
            border-bottom: .55rem solid transparent;
            border-right: .2rem solid transparent;
            z-index: 11;
            content: " ";
            font-size: 0;
          }
        }
      }
    }

    .page-infinite-loading {
      text-align: center;
      height: 50px;
      line-height: 50px;
      span {
        vertical-align: middle;
        display: inline-block;
      }
    }
    .circle-color-24 > div::before {
      background-color: #ccc;
    }

  }

</style>
