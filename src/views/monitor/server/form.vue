<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="form.ip" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="访问端口">
        <el-input-number v-model="form.port" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/monitor/server'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        name: '',
        ip: '',
        port: '8777',
        state: '',
        cpuRate: '',
        cpuCore: '',
        memTotal: '',
        memUsed: '',
        diskTotal: '',
        diskUsed: '',
        swapTotal: '',
        swapUsed: '',
        sort: '999'
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入访问端口', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
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
        ip: '',
        port: '',
        state: '',
        cpuRate: '',
        cpuCore: '',
        memTotal: '',
        memUsed: '',
        diskTotal: '',
        diskUsed: '',
        swapTotal: '',
        swapUsed: '',
        sort: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
