<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="1200px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px" :disabled="operate==='详情'">
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="行业" prop="custType">
            <el-select v-model="form.custType" filterable  placeholder="请选择" @change="custTypeAndAreaChange">
              <el-option
                v-for="item in dictCustType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地区" prop="area">
            <el-select v-model="form.area" filterable  placeholder="请选择" @change="custTypeAndAreaChange">
              <el-option
                v-for="item in dictArea"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="custName">
            <el-select
              v-model="form.custName"
              filterable
              remote
              reserve-keyword
              placeholder="输入客户名称(支持模糊查询)"
              :remote-method="custRemoteMethod"
              :loading="custLoading">
              <el-option
                v-for="item in custOption"
                :key="item.custName"
                :label="item.custName"
                :value="item.custName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="产品" prop="productId">
            <el-select v-model="form.productId" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictBisProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目类型" prop="projectType">
            <el-select v-model="form.projectType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictProjectType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目类别" prop="projectClass">
            <el-select v-model="form.projectClass" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictProjectClass"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="24">
          <el-form-item label="项目描述" prop="productDescription">
            <el-input v-model="form.productDescription" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="竞争对手" prop="competitor">
            <el-select v-model="form.competitor" filterable  multiple placeholder="请选择">
              <el-option
                v-for="item in dictCompetitor"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预计合同金额(万元)" prop="contractBalance">
            <el-input v-model="form.contractBalance" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成交金额(万元)" prop="confirmBalance">
            <el-input v-model="form.confirmBalance" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="成功率" prop="successRate">
            <el-select v-model="form.successRate" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictSuccessRate"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预计合同签订日期" prop="contractTime">
            <el-date-picker v-model="form.contractTime" type="month"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所处阶段" prop="stage">
            <el-select v-model="form.stage" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictStage"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="跟进人员" prop="followPerson">
            <el-select v-model="form.followPerson" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictFollowPerson"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新时间" prop="updateTime">
            <el-date-picker v-model="form.updateTime" type="date" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售" prop="salePerson">
            <el-input v-model="form.salePerson" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="签单时间" prop="estimatedTime">
            <el-date-picker v-model="form.estimatedTime" type="date" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同归档日期" prop="contractFillDate">
            <el-date-picker v-model="form.contractFillDate" type="date" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题反馈及备注" prop="memo">
            <el-input v-model="form.memo" style="width: 200px;" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/businessInfo'
import { initData } from  '@/api/data'
import { arrToString, deepClone, formatDate, yearMonthDate } from '@/utils/index'
export default {
  props: {
    operate: {
      type: String,
      required: true
    }
   ,dictCustType: {
     type: Array,
     required: true
    }
   ,dictArea: {
     type: Array,
     required: true
    }
   ,dictBisProductId: {
     type: Array,
     required: true
    }
   ,dictProjectType: {
     type: Array,
     required: true
    }
   ,dictProjectClass: {
     type: Array,
     required: true
    }
   ,dictCompetitor: {
     type: Array,
     required: true
    }
   ,dictSuccessRate: {
     type: Array,
     required: true
    }
   ,dictStage: {
     type: Array,
     required: true
    }
   ,dictFollowPerson: {
     type: Array,
     required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        custType: '',
        area: '',
        custName: '',
        productId: '',
        productDescription: '',
        projectType: '',
        projectClass: '',
        competitor: [],
        contractBalance: '',
        confirmBalance: '',
        successRate: '',
        contractTime: '',
        stage: '',
        followPerson: '',
        updateTime: '',
        salePerson: '',
        estimatedTime: '',
        contractFillDate: '',
        memo: ''
      },
      rules: {
        custType: [
          { required: true, message: '请选择行业', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        custName: [
          { required: true, message: '请选择客户名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'blur' }
        ],
        productDescription: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
        ],
        contractBalance: [
          { required: true, message: '请输入预计合同金额', trigger: 'blur' }
          //{ type: 'number', message: '预计合同金额必须为数字值'}
        ],
        confirmBalance: [
          //{ type: 'number', message: '预计成交金额必须为数字值'}
        ],
        stage: [
          { required: true, message: '请选择所处阶段', trigger: 'blur' }
        ],
        followPerson: [
          { required: true, message: '请选择跟进人员', trigger: 'blur' }
        ],
        salePerson: [
          { required: true, message: '请输入销售人员', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        memo: [
          { min: 1, max: 250, message: '长度在 1 到 250 个字符', trigger: 'blur' }
        ]
      },
      custLoading:false,
      custOption:[]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    dealForm(val){
      var contractTime = val.contractTime;
      if(contractTime){
        contractTime =yearMonthDate(new Date(val.contractTime));
      }
      var estimatedTime = val.estimatedTime? formatDate(val.estimatedTime,'yyyy-MM-dd'):val.estimatedTime;
      var contractFillDate = val.contractFillDate? formatDate(val.contractFillDate,'yyyy-MM-dd'):val.contractFillDate;
       this.form ={
         ...val,
         contractTime:contractTime,
         competitor:arrToString(val.competitor),
         contractBalance:Number(val.contractBalance),
         confirmBalance:Number(val.confirmBalance),
         updateTime:formatDate(val.updateTime,'yyyy-MM-dd'),
         estimatedTime:estimatedTime,
         contractFillDate:contractFillDate
       }
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild) {
            this.loading = true;
            this.dealForm(this.form);
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
      this.dialog = false;
      this.custOption = [];
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        custType: '',
        area: '',
        custName: '',
        productId: '',
        productDescription: '',
        projectType: '',
        projectClass: '',
        competitor: [],
        contractBalance: '',
        confirmBalance: '',
        successRate: '',
        contractTime: '',
        stage: '',
        followPerson: '',
        updateTime: '',
        salePerson: '',
        estimatedTime: '',
        contractFillDate: '',
        memo: ''
      }
    },
    queryCustName(custType,area,custName){
      var url = 'api/customer'
      const sort = 'id,desc'
      var params = { page: 0, size: 999999, sort: sort };
      if (custType !== ''){
        params["custType"] = custType
      }
      if (area !== ''){
        params["area"] = area;
      }
      if (custName !== ''){
        params["custName"] = custName;
      }
      initData(url,params).then( (res)=>{
          this.custOption = res.content;
          this.custLoading = false;
      }).catch((err)=>{
        this.custLoading = false;
        this.custOption =[];
        this.$message.error("查询客户名称选项出错!")
      })
    },
    custRemoteMethod(custName){
       if (!this.form.custType){
          this.$message.warning("请先选择行业!");
          this.custOption = [];
        }else  if (!this.form.area){
          this.$message.warning("请先选择地区!");
          this.custOption = [];
        } else if(this.form.custType !== '' && this.form.area !== ''){
         this.custLoading = true;
         this.queryCustName(this.form.custType,this.form.area,custName);
       }else {
         this.custOption = [];
       }
    },
    custTypeAndAreaChange(){
      if(this.form.custType !== '' && this.form.area !== ''){
        this.custLoading = true;
        this.form.custName = '';
        this.queryCustName(this.form.custType,this.form.area,this.form.custName);
      }
    }
  }
}
</script>

<style scoped>

</style>
