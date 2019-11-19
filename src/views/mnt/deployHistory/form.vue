<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="form.appName" style="width: 370px" />
      </el-form-item>
      <el-form-item label="部署IP" prop="ip">
        <el-input v-model="form.ip" style="width: 370px" />
      </el-form-item>
      <el-form-item label="部署时间" prop="deployDate">
        <el-input v-model="form.deployDate" style="width: 370px" />
      </el-form-item>
      <el-form-item label="部署人员" prop="deployUser">
        <el-input v-model="form.deployUser" style="width: 370px" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/deployHistory'
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
        appName: '',
        ip: '',
        deployDate: '',
        deployUser: ''
      },
      rules: {
        id: [{ required: true, message: '请输入编号', trigger: 'change' }],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'change' }
        ],
        ip: [{ required: true, message: '请输入部署IP', trigger: 'change' }],
        deployDate: [
          { required: true, message: '请输入部署时间', trigger: 'change' }
        ],
        deployUser: [
          { required: true, message: '请输入部署人员', trigger: 'change' }
        ]
      }
    }
  },
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
          } else {
            this.doEdit()
          }
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
        appName: '',
        ip: '',
        deployDate: '',
        deployUser: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
