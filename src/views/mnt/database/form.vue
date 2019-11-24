<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="数据库名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="jdbcUrl" prop="jdbcUrl">
        <el-input v-model="form.jdbcUrl" style="width: 370px" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" style="width: 370px" />
      </el-form-item>
      <el-form-item label="数据库密码" prop="pwd">
        <el-input v-model="form.pwd" type="password" style="width: 370px" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/database'
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
        jdbcUrl: '',
        userName: '',
        pwd: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入数据库名称', trigger: 'change' }
        ],
        jdbcUrl: [
          { required: true, message: '请输入数据库连接地址', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        pwd: [
          { required: true, message: '请输入数据库密码', trigger: 'change' }
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
        name: '',
        jdbcUrl: '',
        userName: '',
        pwd: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
