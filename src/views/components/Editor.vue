<template>
  <div class="app-container">
    <p class="warn-content">
      富文本基于
      <el-link type="primary" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599" target="_blank">wangEditor</el-link>
      ，图片上传使用 <el-link type="primary" href="https://sm.ms/" target="_blank">SM.MS</el-link>
    </p>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
        <div ref="editor" class="text" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
        <div v-html="editorContent" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import E from 'wangeditor'
export default {
  name: 'Editor',
  data() {
    return {
      editorContent:
        `
        <ul>
          <li>富文本中图片上传使用的是 SM.MS 图床：<a style="color: #42b983" target="_blank" href="https://sm.ms/">sm.ms</a></li>
          <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
        </ul>`
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    const _this = this
    var editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.customConfig.zIndex = 10
    // 文件上传
    editor.customConfig.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        upload(_this.imagesUploadApi, image).then(data => {
          insert(data.data.url)
        })
      })
    }
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.create()
    // 初始化数据
    editor.txt.html(this.editorContent)
  }
}
</script>

<style scoped>
  .text {
    text-align:left;
  }
  /deep/ .w-e-text-container {
    height: 420px !important;
  }
</style>
