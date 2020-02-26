<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" :disabled="operate==='详情'">
      <el-form-item label="文件名"  prop="fileName">
        <el-input v-model="form.fileName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否目录"  prop="isDir">
        <el-select v-model="form.isDir" filterable  placeholder="请选择">
          <el-option
                  v-for="item in dictIsDir"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件大小"  prop="fileSize">
        <el-input v-model="form.fileSize" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最近访问时间"  prop="fileAtime">
        <el-input v-model="form.fileAtime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最近修改时间"  prop="fileMtime">
        <el-input v-model="form.fileMtime" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/ftpFile'
export default {
  props: {
    operate: {
      type: String,
      required: true
    }
   ,dictIsDir: {
     type: Array,
     required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        fileName: '',
        isDir: '',
        fileSize: '',
        fileAtime: '',
        fileMtime: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild) {
            this.loading = true
            if (this.operate ==='新增') {
              this.doAdd();
            } else if(this.operate ==='修改'){
              this.doEdit();
            }
          }
        })

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
        fileName: '',
        isDir: '',
        fileSize: '',
        fileAtime: '',
        fileMtime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
