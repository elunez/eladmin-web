<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <el-dialog :visible.sync="dialog" :title="title" style="text-align: left" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
          <el-form-item label="key" prop="key">
            <el-input v-model="form.key" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="value" prop="value">
            <el-input v-model="form.value" style="width: 370px;" rows="6" type="textarea"/>
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
import { edit } from '@/api/redis'
export default {
  props: {
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
      loading: false, dialog: false, title: '编辑缓存',
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
    to() {
      this.form = { key: this.data.key, value: this.data.value }
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
      this.form = { key: '', value: '' }
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
