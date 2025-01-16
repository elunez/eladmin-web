<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" title="执行脚本" width="400px">
    <el-form ref="form" :rules="rules" size="small">
      <el-upload
        :action="databaseUploadApi"
        :data="databaseInfo"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        class="upload-demo"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">上传后，系统会自动执行SQL脚本</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  props: {
    databaseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      headers: {
        Authorization: getToken()
      },
      rules: {}
    }
  },
  computed: {
    ...mapGetters(['databaseUploadApi'])
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    handleSuccess(response, file, fileList) {
      if (response === 'success') {
        this.$notify({
          title: '执行成功',
          type: 'success',
          duration: 2500
        })
      } else {
        this.$notify({
          title: response,
          type: 'error',
          duration: 0
        })
      }
    },
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 0
      })
    }
  }
}
</script>

<style scoped>
</style>
