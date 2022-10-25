<template>
  <div
    v-if="show"
    id="ww-container"
    class="wwads-cn wwads-vertical"
    data-id="148"
    style="z-index:10000;padding: 12px 10px;"
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
