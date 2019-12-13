<template>
  <!--用户基本信息-->
  <section class="publicityPage">
    <div class="loading-wrap" v-if="isLoading">
      <svg
        class="icon loading_rotate"
        style="width: 2em; height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="805"
      >
        <path
          d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
          fill="#262626"
          p-id="806"
        />
      </svg>
      <div class="loading_wrap_text">加载中...</div>
    </div>
    <div v-else-if="isTrue">
      <div class="page_banner">
        <img src="../../../assets/images/insured/banner1.png" alt />
      </div>
      <insured @isGoFather="goToStatic"></insured>
    </div>
    <!-- 错误页 -->
    <div v-else>
      <error-page @refreshFa="isSignUp"></error-page>
    </div>
  </section>
</template>
<script>
import insured from "../../../components/common/insuredH5.vue";
import errorPage from "../../../components/common/errorPage.vue";
export default {
  components: {
    insured,
    errorPage
  },
  props: {},
  created() {
    this.isSignUp();
  },
  data() {
    return {
      isInfo: JSON.parse(localStorage.getItem("web")), //是否完善过信息
      isTrue: true, //是否可以预约报名号
      isLoading: true //是否需要加载
    };
  },
  methods: {
    // 判断是否报名
    isSignUp() {
      this.$axios
        .post("/userSubjectInsuranceRecord/getSubjectInsuranceRecord", {
          gradeCode: 33,
          userId: localStorage.getItem("token")
        })
        .then(res => {
          if (res.code == "000000") {
            this.isTrue = true;
            if (res.result && res.result.subjectCodes) {
              this.goToStatic();
            } else {
              this.isLoading = false;
            }
          } else {
            this.isTrue = false;
            this.isLoading = false;
          }
        });
    },
    // 跳到测评项目
    goToStatic(data) {
      let url;
      if (location.host == "testingh5dev.e-eduspace.com") {
        url = "http://statich5dev.xinguoren.cn";
      } else if (location.host == "testingh5test.e-eduspace.com") {
        url = "http://statich5test.xinguoren.cn";
      } else if (location.host == "testingh5.e-eduspace.com") {
        url = "http://statich5.xinguoren.cn";
      } else {
        url = "http://localhost:8084";
      }
      let isInfo = this.isInfo;
      // localStorage.clear();
      let query = `mobile=${data ? data.parentMobile : isInfo.mobile}&userId=${
        isInfo.userId
      }`;
      window.location.href = url + "/#/evaluationList?" + query;
    }
  },
  computed: {},
  filters: {}
};
</script>
<style lang="scss">
.publicityPage {
  height: 100%;
  .page_banner {
    background-color: #17abb8;
    img {
      width: 100%;
    }
  }
  .loading-wrap {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    .loading_wrap_text {
      margin-top: 0.2rem;
    }
    .loading_rotate {
      animation: loadingRotate 2s linear infinite;
    }
  }
  @keyframes loadingRotate {
    0% {
      transform: rotateZ(0deg);
    }
    10% {
      transform: rotateZ(36deg);
    }
    20% {
      transform: rotateZ(72deg);
    }
    30% {
      transform: rotateZ(108deg);
    }
    40% {
      transform: rotateZ(144deg);
    }
    50% {
      transform: rotateZ(180deg);
    }
    60% {
      transform: rotateZ(216deg);
    }
    70% {
      transform: rotateZ(252deg);
    }
    80% {
      transform: rotateZ(288deg);
    }
    90% {
      transform: rotateZ(324deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
</style>
