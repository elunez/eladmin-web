<template>
  <div>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="dialog = true">新增</el-button>
    <el-dialog :visible.sync="dialog" :title="title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="权限">
          <treeselect v-model="permissionIds" :multiple="true" :options="permissions" style="width: 370px;" placeholder="请选择权限" />
        </el-form-item>
        <el-form-item style="margin-top: -10px;" label="描述">
          <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
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
import { add } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    permissions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, title: '新增角色',
      form: { name: '', permissions: [], remark: '' }, permissionIds: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
          add(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            this.$parent.$parent.init()
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
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
