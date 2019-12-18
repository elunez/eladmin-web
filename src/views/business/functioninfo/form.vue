<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="800px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" :disabled="operate==='详情'">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="产品名称"  prop="productId">
            <el-select v-model="form.productId" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能名称"  prop="functionName">
            <el-input v-model="form.functionName"  style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="功能类型"  prop="functionType">
            <el-select v-model="form.functionType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictFunctionType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能模式"  prop="functionMode">
            <el-input v-model="form.functionMode"  style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-form-item label="备注"  prop="memo">
          <el-input v-model="form.memo"  type="textarea"/>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/functionInfo'
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
   ,dictFunctionType: {
     type: Array,
     required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        productId: '',
        functionName: '',
        functionType: '',
        functionMode: '',
        memo: ''
      },
      rules: {
        productId: [
          {required:true, message: '请选择产品名称',trigger: 'blur'}
        ],
        functionName: [
          { required: true, message: '请输入功能名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
          ],
        functionType: [
          {required:true, message: '请选择功能类型',trigger: 'blur'}
        ],
        functionMode: [
          {message: '请输入功能模式',trigger: 'blur'},
          { min: 1, max: 50, message: '长度在 1 到 20 个汉字', trigger: 'blur' }
        ],
        memo: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个汉字', trigger: 'blur' }
        ]
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
        productId: '',
        functionName: '',
        functionType: '',
        functionMode: '',
        memo: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
