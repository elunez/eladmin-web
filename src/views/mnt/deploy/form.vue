<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="应用编号">
        <el-select v-model="form.appId" placeholder="请选择" style="width: 370px">
          <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="IP列表">
        <el-select v-model="form.selectIp" multiple placeholder="请选择" style="width: 370px">
          <el-option v-for="item in servers" :key="item.id" :label="item.id" :value="item.id" />
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
import { add, edit, getApps, getServers } from '@/api/deploy'
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
      apps: [],
      servers: [],
      form: {
        id: '',
        appId: '',
        ip: '',
        selectIp: []
      },
      rules: {}
    }
  },
  mounted() {
    this.initSelect()
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
    joinIp() {
      this.form.ip = ''
      this.form.selectIp.forEach(ip => {
        if (this.form.ip !== '') {
          this.form.ip += ','
        }
        this.form.ip += ip
      })
    },
    doAdd() {
      this.joinIp()
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
      this.joinIp()
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
        appId: '',
        ip: '',
        selectIp: []
      }
    },
    initSelect() {
      getApps().then(res => {
        this.apps = res.content
      })
      getServers().then(res => {
        this.servers = res.content
      })
    }
  }
}
</script>

<style scoped>
</style>
