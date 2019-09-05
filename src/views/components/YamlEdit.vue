<template>
  <div class="app-container">
    <p class="warn-content">
      Yaml编辑器 基于
      <a href="https://github.com/codemirror/CodeMirror" target="_blank">CodeMirror</a>，
      主题预览地址
      <a href="https://codemirror.net/demo/theme.html#idea" target="_blank">Theme</a>
    </p>
    <Yaml :value="value" :height="height" />
  </div>
</template>

<script>
import Yaml from '@/components/YamlEdit/index'
export default {
  name: 'YamlEdit',
  components: { Yaml },
  data () {
    return {
      height: document.documentElement.clientHeight - 210 + 'px',
      value: ''
    }
  },
  mounted () {
    const that = this
    window.onresize = function temp () {
      that.height = document.documentElement.clientHeight - 210 + 'px'
    }
  }
}
</script>

<style scoped>
</style>
