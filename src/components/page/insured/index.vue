<template>
  <!--用户基本信息-->
  <section class="insured">
      
      <div class="page_banner">
          <img src="../../../assets/images/insured/newbanner.png" alt="">
      </div>
      <insured :type=1></insured>
  </section>
</template>
<script>
import insured from '../../../components/common/insuredH5.vue'
export default {
  components: {
      insured
  },
  props: {},
  created() {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  filters: {}
};
</script>
<style lang="scss">
.insured{
.page_banner{
        background-color: #17ABB8;
        img{
        width: 100%;
        }
    }
}
</style>
