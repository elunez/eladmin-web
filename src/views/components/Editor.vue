<template>
  <div class="app-container">
    <p class="warn-content">
      富文本基于
      <el-link type="primary" href="https://www.wangeditor.com/v5/getting-started.html" target="_blank">wangEditor</el-link>
    </p>
    <el-row :gutter="10">
      <wang-editor v-model="editorContent" :editor-height="200" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WangEditor from '@/components/WangEditor/index'

export default {
  name: 'Editor',
  components: { WangEditor },
  data() {
    return {
      editorContent:
        `
        <ul>
          <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.wangeditor.com/v5/getting-started.html">wangEditor</a></li>
        </ul>
        `
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {

  }
}
</script>

<style scoped>
.text {
  text-align:left;
}
::v-deep .w-e-text-container {
  height: 420px !important;
}
</style>
