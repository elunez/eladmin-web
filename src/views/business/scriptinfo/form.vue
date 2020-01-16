<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="70%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px" :disabled="operate==='详情'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称"  prop="productId">
            <el-select v-model="form.productId" filterable  placeholder="请选择"   @change="productIdChange">
              <el-option
                v-for="item in  dictProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模块"  prop="moduleType">
            <el-select v-model="form.moduleType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictModuleType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="脚本类别"  prop="scriptClass">
            <el-select v-model="form.scriptClass" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictScriptClass"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="脚本名称"  prop="scriptName">
            <el-input v-model="form.scriptName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生效版本"  prop="effectVersion">
            <el-select
              v-model="form.effectVersion"
              filterable
              remote
              reserve-keyword
              placeholder="输入生效版本(支持模糊查询)"
              :remote-method="effectVersionRemoteMethod"
              :loading="effectVersionLoading">
              <el-option
                v-for="item in effectVersionOption"
                :key="item.versionNo"
                :label="item.versionNo+'('+item.productId+')'"
                :value="item.versionNo">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户手册名称"  prop="userManualName">
        <el-input v-model="form.userManualName" type="textarea" />
      </el-form-item>
      <el-form-item label="备注"  prop="memo">
        <el-input v-model="form.memo" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { add, edit } from '@/api/scriptInfo'
import  { queryVersionNo } from  '@/utils/business'
export default {
  props: {
    operate: {
      type: String,
      required: true
    }
    ,dictScriptClass: {
     type: Array,
     required: true
    },
    dictModuleType: {
    type: Array,
    required: true
    },
    dictProductId:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        productId:'',
        moduleType:'',
        scriptClass: '',
        scriptName: '',
        effectVersion: '',
        userManualName: '',
        memo: ''
      },
      rules: {
        productId: [
          {required:true, message: '请选择产品名称',trigger: 'blur'}
        ],
        moduleType: [
          {required:true, message: '请选择模块',trigger: 'blur'}
        ],
        scriptClass: [
          {required:true, message: '请选择脚本类别',trigger: 'blur'}
        ],
        scriptName: [
          {message: '请输入脚本名称',trigger: 'blur'},
          { min: 1, max: 100, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        userManualName: [
          { min: 1, max: 100, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        memo: [
          { min: 1, max: 200, message: '长度在 1 到 200 个汉字', trigger: 'blur' }
        ]
      },
      effectVersionLoading:false,
      effectVersionOption:[]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild) {
            this.loading = true;
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
        productId:'',
        moduleType:'',
        scriptClass: '',
        scriptName: '',
        effectVersion: '',
        userManualName: '',
        memo: ''
      }
    },
    effectVersionRemoteMethod(versionNo){
      queryVersionNo(this.form.productId,versionNo).then(res=>{
        this.effectVersionOption  = res.option;
        this.effectVersionLoading = res.loading;
      })
    },
    productIdChange(){
       if(!this.effectVersionLoading){
         this.effectVersionRemoteMethod(this.form.versionNo);
       }
    }
  }
}
</script>

<style scoped>

</style>
