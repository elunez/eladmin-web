<template>
  <el-dialog :visible.sync="dialog" width="600px" @close="doSubmit">
    <el-upload
      :on-preview="handlePictureCardPreview"
      :before-remove="handleBeforeRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :headers="headers"
      :file-list="fileList"
      :action="imagesUploadApi"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { del } from '@/api/picture'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      dialog: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      pictures: []
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  methods: {
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          del(this.pictures[i].id).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.$parent.$parent.init()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }
}
</script>

<style scoped>

</style>
