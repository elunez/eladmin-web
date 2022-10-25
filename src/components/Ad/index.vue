<template>
  <div class="wwads-cn wwads-vertical wwads-sticky" data-id="148" style="max-width:180px" />
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
