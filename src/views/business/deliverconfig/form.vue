<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" :disabled="operate==='详情'">
      <el-form-item label="产品名称"  prop="productId">
        <el-select v-model="form.productId" filterable  placeholder="请选择">
          <el-option
                  v-for="item in dictProductId"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址"  prop="address">
        <el-input v-model="form.address" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/deliverConfig'
import store from '@/store'
export default {
  props: {
    operate: {
      type: String,
      required: true
    }
   ,dictProductId: {
     type: Array,
     required: true
    }
  },
  data() {
    const validAddress = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入地址'))
      } else if (!this.isvalidAddress(value)) {
        callback(new Error('请输入正确地址必须到文件名且只支持.xlsx或者.xls文件'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        productId: '',
        address: '',
        username:store.getters.user.username
      },
      rules: {
        address: [
          { required: true, trigger: 'blur', validator: validAddress },
          { min: 2, max: 20, message: '长度在 1 到 500 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    isvalidAddress(str) {
      const reg = /(\.xls|\.xlsx)$/
      return reg.test(str)
    },
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
        productId: '',
        address: '',
        username:store.getters.user.username
      }
    }
  }
}
</script>

<style scoped>

</style>
