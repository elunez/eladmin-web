<template>
  <div>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="dialog = true">新增</el-button>
    <el-dialog :visible.sync="dialog" :title="title" width="500px">
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
import { add } from '@/api/permission'
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
      loading: false, dialog: false, title: '新增权限',
      form: { name: '', alias: '', pid: 0 },
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
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          add(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            setTimeout(() => {
              this.$parent.$parent.init()
              this.$parent.$parent.getPermissions()
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
      this.form = { name: '', alias: '', pid: 0 }
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
