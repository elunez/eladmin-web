<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route.path': {
      handler: function() {
        if (document.querySelector('.wwads-vertical')) {
          var ele = document.querySelector('.wwads-vertical').parentElement.parentElement
          ele.style.maxHeight = 'unset'
          ele.firstChild.hidden = true
        }
      }
    }
  }
}
</script>
