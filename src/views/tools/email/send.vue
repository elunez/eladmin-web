<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" style="width: 646px" placeholder="请输入邮件标题，标题不能为空" />
      </el-form-item>
      <el-form-item label="收件地址" prop="tos">
        <el-input v-model="form.tos" style="width: 646px" placeholder="请输入收件地址，多个地址英文逗号,隔开" />
      </el-form-item>
      <div ref="editor" class="editor" />
      <el-button :loading="loading" style="margin-left:1.6%;margin-bottom: 30px" size="medium" type="primary" @click="doSubmit">发送邮件</el-button>
    </el-form>
  </div>
</template>

<script>
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { mapGetters } from 'vuex'
import E from 'wangeditor'
export default {
  name: 'Index',
  data() {
    return {
      loading: false, form: { subject: '', tos: '', content: '' },
      rules: {
        subject: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        tos: [
          { required: true, message: '收件人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {
    const _this = this
    var editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.config.zIndex = 10
    // 文件上传
    editor.config.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        upload(_this.imagesUploadApi, image).then(res => {
          const data = res.data
          const url = _this.baseApi + '/file/' + data.type + '/' + data.realName
          insert(url)
        })
      })
    }
    editor.config.onchange = (html) => {
      this.form.content = html
    }
    editor.create()
  },
  methods: {
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          send(this.form).then(res => {
            this.$notify({
              title: '发送成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .editor{
    text-align:left;
    margin: 20px;
    width: 730px;
  }
 ::v-deep .w-e-text-container {
    height: 360px !important;
  }
</style>
