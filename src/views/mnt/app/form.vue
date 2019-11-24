<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="800px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" style="width: 670px" placeholder="部署后的文件或者目录名称，用于备份" />
      </el-form-item>
      <el-form-item label="应用端口" prop="port">
        <el-input-number v-model="form.port" placeholder="例如：8080" />
      </el-form-item>
      <el-form-item label="上传目录" prop="uploadPath">
        <el-input
          v-model="form.uploadPath"
          style="width: 670px"
          placeholder="例如: /opt/upload"
        />
      </el-form-item>
      <el-form-item label="部署目录" prop="deployPath">
        <el-input
          v-model="form.deployPath"
          style="width: 670px"
          placeholder="例如: /opt/app"
        />
      </el-form-item>
      <el-form-item label="备份目录" prop="backupPath">
        <el-input
          v-model="form.backupPath"
          style="width: 670px"
          placeholder="例如: /opt/backup"
        />
      </el-form-item>
      <el-form-item label="启动脚本" prop="startScript">
        <el-input
          v-model="form.startScript"
          :rows="2"
          type="textarea"
          autosize
          style="width: 670px"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="部署脚本" prop="deployScript">
        <el-input
          v-model="form.deployScript"
          :rows="2"
          type="textarea"
          autosize
          style="width: 670px"
          placeholder=""
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/app'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        name: '',
        port: 8080,
        uploadPath: '/opt/upload',
        deployPath: '/opt/app',
        backupPath: '/opt/backup',
        startScript: '',
        deployScript: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'change' }
        ],
        uploadPath: [
          { required: true, message: '请输入上传目录', trigger: 'change' }
        ],
        deployPath: [
          { required: true, message: '请输入部署目录', trigger: 'change' }
        ],
        backupPath: [
          { required: true, message: '请输入备份目录', trigger: 'change' }
        ],
        startScript: [
          { required: true, message: '请输入启动脚本', trigger: 'change' }
        ],
        deployScript: [
          { required: true, message: '请输入部署脚本', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          this.$message.error('请将表单中的信息补充完整！')
        }
      })
    },
    doAdd() {
      add(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    doEdit() {
      edit(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        port: 8080,
        uploadPath: '/opt/upload',
        deployPath: '/opt/app',
        backupPath: '/opt/backup',
        startScript: '',
        deployScript: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
