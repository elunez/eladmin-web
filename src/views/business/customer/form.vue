<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="60%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" :disabled="operate==='详情'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户类型" prop="custType">
            <el-select v-model="form.custType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictCustType"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地区" prop="area">
            <el-select v-model="form.area" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictArea"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="custName">
            <el-input v-model="form.custName" style="width: 200px;" maxlength="50" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户编号" prop="custNo">
            <el-input v-model="form.custNo" style="width: 200px;" maxlength="8" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="custProductType">
            <el-select v-model="form.custProductType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictCustProductType1"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上线产品" prop="custHaveProduct">
            <el-select v-model="form.custHaveProduct" multiple   placeholder="请选择">
              <el-option
                v-for="item in dictProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="form.memo" style="width: 600px;" type="textarea"  maxlength="250" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button  v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/customer'
export default {
  props: {
    operate: {
      type: String,
      required: true
    },
    dictProductId:{
      type:Array,
      required: true
    },
    dictCustType: {
      type: Array,
      required: true
    },
    dictArea: {
      type: Array,
      required: true
    },
    dictCustProductType1:{
      type: Array,
      required: true
    },
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        custType: '',
        area: '',
        custName: '',
        custNo: '',
        custProductType:'',
        custHaveProduct:[],
        memo: ''
      },
      rules: {
        custType: [
          { required: true, message: '请选择客户类型', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        custName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        custNo: [
          { required: true, message: '请输入客户编号', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
         if(vaild){
           this.loading = true
           this.dealData()
           if (this.operate ==='新增') {
             this.doAdd();
           } else if(this.operate ==='修改'){
             this.doEdit();
           }
         }
      });
    },
    dealData(){
      if(this.form.custHaveProduct.length){
        this.form = {
          ...this.form,
          custHaveProduct:this.form.custHaveProduct.join(',')
        }
      }
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
        custType: '',
        area: '',
        custName: '',
        custNo: '',
        custProductType:'',
        custHaveProduct:[],
        memo: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
