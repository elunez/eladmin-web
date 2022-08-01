<template>
  <div
    v-show="show"
    class="wwads-cn wwads-vertical"
    data-id="148"
    style="z-index:10000;position:fixed;bottom:33px;right:5px;max-width:200px;padding:10px;border-radius:5px;"
  />
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  created() {
    const _this = this
    setTimeout(function() {
      _this.show = true
    }, 650)
  }
}
</script>

<style lang="scss" scoped>
  .wwads-vertical .wwads-poweredby {
    display: none !important;
  }
</style>
