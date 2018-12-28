<template>
  <div>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="dialog = true">新增</el-button>
    <el-dialog :visible.sync="dialog" :title="title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="key" prop="key">
          <el-input v-model="form.key" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input v-model="form.value" style="width: 370px;" rows="6" type="textarea"/>
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
import { add } from '@/api/redis'
export default {
  data() {
    return {
      loading: false, dialog: false, title: '新增缓存',
      form: { key: '', value: '' },
      rules: {
        key: [
          { required: true, message: '请输入Key', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入Value', trigger: 'blur' }
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
      this.form = { key: '', value: '' }
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
