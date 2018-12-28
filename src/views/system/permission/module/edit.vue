<template>
  <div>
    <el-button :disabled="data.id === 1" size="mini" type="success" @click="to">编辑</el-button>
    <el-dialog :visible.sync="dialog" :title="title" style="text-align: left" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 360px;"/>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias" style="width: 360px;"/>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px;" label="上级类目">
          <treeselect v-model="form.pid" :options="permissions" style="width: 360px;" placeholder="选择上级类目" />
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
import { edit } from '@/api/permission'
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
      loading: false, dialog: false, title: '编辑权限',
      form: { id: '', name: '', alias: '', pid: 0 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    to() {
      this.form = { id: this.data.id, name: this.data.name, alias: this.data.alias, pid: this.data.pid }
      this.dialog = true
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const _this = this
          edit(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            setTimeout(() => {
              _this.sup_this.init()
              _this.sup_this.getPermissions()
            }, 200)
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
      this.form = { id: '', name: '', alias: '', pid: 0 }
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
