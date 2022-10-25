<template>
  <div
    v-if="show"
    id="ww-container"
    class="wwads-cn wwads-vertical"
    data-id="148"
    style="z-index:10000;position:fixed;bottom:0;right:1px;max-width:200px;border-radius:5px;"
  />
</template>

<script>
export default {
  data() {
    return {
      show: true
    }
  },
  created() {
    if (window._AdBlockInit === undefined) {
      this.show = false
    }
  }
}
</script>
