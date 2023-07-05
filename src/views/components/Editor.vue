<template>
  <div class="app-container">
    <p class="warn-content">
      富文本基于
      <el-link type="primary" href="https://www.wangeditor.com/v5/getting-started.html" target="_blank">wangEditor</el-link>
    </p>
    <el-row :gutter="10">
      <wang-editor v-model="editorContent" style="height: 500px; overflow-y: hidden;" />
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
        `更多帮助请查看官方文档`
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
