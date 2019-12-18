<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="1000px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px"  :disabled="operate==='详情'">
      <el-row :gutter="8">
         <el-col :span="8">
           <el-form-item label="产品名称" prop="productId">
             <el-select v-model="form.productId" filterable placeholder="请选择" @change="productIdChange">
               <el-option
                 v-for="item in dictProductId"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" ></el-option>
             </el-select>
           </el-form-item>
         </el-col>
        <el-col :span="8">
          <el-form-item label="版本号" prop="versionNo">
            <el-input v-model="form.versionNo"  maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="版本类型" prop="versionType">
            <el-select v-model="form.versionType" filterable placeholder="请选择">
              <el-option
                v-for="item in dictVersionType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="基础版本号" prop="baseVersionNo">
            <el-select
              v-model="form.baseVersionNo"
              filterable
              remote
              reserve-keyword
              placeholder="输入版本名称(支持模糊查询)"
              :remote-method="baseVersionRemoteMethod"
              :loading="baseVersionLoading">
              <el-option
                v-for="(item,index) in baseVersion"
                :key="index"
                :label="item.versionNo"
                :value="item.versionNo">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布状态" prop="releaseStatus">
            <el-select v-model="form.releaseStatus" filterable  placeholder="请选择" @change="rsSelectChange">
              <el-option
                v-for="item in dictReleaseStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布时间" prop="releaseTime">
            <el-date-picker v-model="form.releaseTime" type="datetime" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
          <el-form-item label="备注" prop="memo">
            <el-input v-model="form.memo"  type="textarea" maxlength="250" placeholder="请输入内容"/>
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
import { add, edit } from '@/api/product'
import { initData } from  '@/api/data'
import { parseTime } from '@/utils/index'
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
   ,dictVersionType: {
     type: Array,
     required: true
    }
   ,dictReleaseStatus: {
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
        versionNo: '',
        versionType: '',
        baseVersionNo: '',
        releaseStatus: '',
        releaseTime: '',
        memo: ''
      },
      rules: {
        productId: [
          { required: true, message: '请选择产品名称', trigger: 'blur' }
        ],
        versionNo: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        versionType: [
          { required: true, message: '请选择版本类型', trigger: 'blur' }
        ]
      },
      baseVersionLoading:false,
      baseVersion:[]
    }
  },
  methods: {
    parseTime,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
        if(vaild){
          this.loading = true
          if (this.operate ==='新增') {
            this.doAdd();
          } else if(this.operate ==='修改'){
            this.doEdit();
          }
        }
      });
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
        versionNo: '',
        versionType: '',
        baseVersionNo: '',
        releaseStatus: '',
        releaseTime: '',
        memo: ''
      }
    },
    rsSelectChange(val){
       //如果发布则修改发布时间为当前时间否则清空发布时间
       if(val==='1'){
         this.form.releaseTime = parseTime(new Date());
       }else if (val ==='0' || !val) {
         this.form.releaseTime = null;
       }
    },
    queryBaseVersion(productId,baseVersionNo){
      var url = 'api/product'
      const sort = 'id,desc'
      var params = { page: 0, size: 999999, sort: sort };
      if (productId !== ''){
        params["productId"] = productId
      }
      if (baseVersionNo !== ''){
        params["baseVersionNo"] = baseVersionNo;
      }
      initData(url,params).then( (res)=>{
        this.baseVersion = res.content;
        this.baseVersionLoading = false;
      }).catch((err)=>{
        this.baseVersionLoading = false;
        this.baseVersion =[];
        this.$message.error("查询版本号选项出错!")
      })
    },
    baseVersionRemoteMethod(baseVersionNo){
      if (!this.form.productId){
        this.$message.warning("请先选择产品名称!");
        this.baseVersion = [];
      } else if(this.form.productId !== ''){
        this.baseVersionLoading = true;
        this.queryBaseVersion(this.form.productId,baseVersionNo);
      }else {
        this.baseVersion = [];
      }
    },
    productIdChange(){
      if(this.form.productId !== ''){
        this.baseVersionLoading = true;
        this.form.baseVersionNo = '';
        this.queryBaseVersion(this.form.productId,this.form.baseVersionNo);
      }
    }
  }
}
</script>

<style scoped>

</style>
