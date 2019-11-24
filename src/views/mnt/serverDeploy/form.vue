<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="服务器IP" prop="id">
        <el-input v-model="form.id" :disabled="!isAdd" style="width: 370px" />
      </el-form-item>
      <el-form-item label="服务器账号" prop="accountId">
        <el-select
          v-model="form.accountId"
          clearable
          placeholder="选择对应账号"
          class="filter-item"
          style="width: 370px"
        >
          <el-option
            v-for="item in accountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/serverDeploy'
import { validateIP } from '@/utils/validate'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    accountList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        accountId: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入IP', trigger: 'change' },
          { validator: validateIP, trigger: 'change' }
        ],
        accountId: [
          { required: true, message: '请选择账号', trigger: 'change' }
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
        accountId: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
