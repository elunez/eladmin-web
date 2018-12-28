<template>
  <div>
    <el-button :disabled="data.id === 1" size="mini" type="success" @click="to">编辑</el-button>
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :title="title" style="text-align: left" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio v-model="form.enabled" label="true">激活</el-radio>
          <el-radio v-model="form.enabled" label="false" >锁定</el-radio>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;" label="角色">
          <treeselect v-model="roleIds" :multiple="true" :options="roles" style="width: 370px;" placeholder="请选择角色" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { edit } from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    roles: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, title: '编辑用户',
      form: { id: '', username: '', email: '', enabled: '', roles: [] }, roleIds: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    to() {
      const _this = this
      this.form = { id: this.data.id, username: this.data.username, email: this.data.email, enabled: this.data.enabled.toString(), roles: [] }
      this.data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      this.dialog = true
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.roles = []
          const _this = this
          this.roleIds.forEach(function(data, index) {
            const role = { id: data }
            _this.form.roles.push(role)
          })
          edit(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            _this.sup_this.init()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.roleIds = []
      this.form = { id: '', username: '', email: '', enabled: '', roles: [] }
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
