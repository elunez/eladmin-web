<template>
  <div>
    <div id="codefund"/>
    <div ref="codefund"/>
  </div>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    key(newVal, oldVal) {
      const script = document.createElement('script')
      script.setAttribute(
        'src',
        'https://codefund.app/properties/287/funder.js'
      )
      this.$refs.codefund.appendChild(script)
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.setAttribute(
      'src',
      'https://codefund.app/properties/287/funder.js'
    )
    this.$refs.codefund.appendChild(script)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ #cf{
    max-width: 100% !important;
  }
  /deep/ #codefund img{
    display: none;
  }
  /deep/ #cf a:nth-child(3){
    float: right;
  }
  /deep/ #cf span span:nth-child(1){
    font-size: 13px !important;
    width: 100% !important;
    line-height: 1.5 !important;
    display: block !important;
    background-color: #f8f8f8 !important;
    text-align: left !important;
    padding: 8px 11px !important;
  }

  /deep/ #cf .cf-wrapper .cf-text:before {
    margin-right: 4px;
    padding: 2px 6px;
    border-radius: 3px;
    background-color: #4caf50;
    color: #fff;
    content: "Supporter";
  }
</style>
