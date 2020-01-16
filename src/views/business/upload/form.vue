<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog"  width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <!--   上传文件   -->
      <el-form-item  label="上传">
        <el-upload
          ref="upload"
          :limit="1"
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :action="baseURL+uploadApi+'/upload'">
          <div class="eladmin-upload"><i class="el-icon-upload"/> 添加文件</div>
          <div slot="tip" class="el-upload__tip">只可上传EXECL文件,且文件行数不超过2000行</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button  type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import Config from '@/config'
import initData from '@/mixins/initData'
export default {
  props: {
    uploadApi: {
      type: String,
      required: true
    }
  },
  mixins: [initData],
  data() {
    return {
      fileName: '', dialog: false,
      headers: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        id: '',
        name: ''
      },
      baseURL: process.env.NODE_ENV === 'production' ? process.env.BASE_API+'/' : '/',
      rules: {
      }
    }
  },
  computed: {
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.openFullScreen('导入',this.fileName);
      this.$refs.upload.submit()
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: ''
      }
    },
    beforeUpload(file) {
      let isLt2M = true;
      isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!');
      }
      isLt2M = /\.xlsx?$/.test(file.name);
      if (!isLt2M) {
        this.$message.error('文件格式不正确(.xls或.xlsx)');
      }
      this.fileName = file.name;
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.dialog = false;
      this.resetForm();
      this.$refs.upload.clearFiles();
      this.$parent.init();
      this.loadingInstance.close();
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message);
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      });
      this.fileName = ''
      this.loadingInstance.close();
    }
  }
}
</script>

<style scoped>

</style>
