<template>
  <div>
    <el-button :disabled="data.id === 1" size="mini" type="success" @click="to">编辑</el-button>
    <el-dialog :visible.sync="dialog" :title="title" style="text-align: left" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="权限">
            <treeselect v-model="permissionIds" :multiple="true" :options="permissions" style="width: 370px;" placeholder="请选择权限" />
          </el-form-item>
          <el-form-item style="margin-top: -10px;" label="描述">
            <el-input v-model="form.remark" rows="5" style="width: 370px;" type="textarea"/>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { edit } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, title: '编辑角色',
      form: { id: '', name: '', permissions: [], remark: '' }, permissionIds: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    to() {
      const _this = this
      this.form = { id: this.data.id, name: this.data.name, remark: this.data.remark, permissions: [] }
      this.data.permissions.forEach(function(data, index) {
        _this.permissionIds.push(data.id)
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
          this.form.permissions = []
          const _this = this
          this.permissionIds.forEach(function(data, index) {
            const permission = { id: data }
            _this.form.permissions.push(permission)
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
      this.permissionIds = []
      this.form = { name: '', permissions: [], remark: '' }
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
