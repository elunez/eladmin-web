<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="80%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px" :disabled="operate==='详情'" >
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户类型"  prop="custType">
            <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 200px;" @change="custTypeAndAreaChange">
              <el-option
                v-for="item in dictCustType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地区"  prop="area">
            <el-select v-model="form.area" filterable  placeholder="请选择" style="width: 200px;" @change="custTypeAndAreaChange">
              <el-option
                v-for="item in dictArea"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称"  prop="custName">
             <el-select
              v-model="form.custName"
              filterable
              remote
              reserve-keyword
              placeholder="输入客户名称(支持模糊查询)"
              style="width: 200px;"
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称"  prop="productId">
            <el-select v-model="form.productId" filterable  placeholder="请选择"   @change="productIdChange" style="width: 200px;">
              <el-option
                v-for="item in  dictProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发放日期"  prop="issueDate">
            <el-date-picker
              v-model="form.issueDate"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发放人"  prop="issuePerson">
            <el-select
              v-model="form.issuePerson"
              filterable
              remote
              reserve-keyword
              placeholder="输入发放人(支持模糊查询)"
              style="width: 200px;"
              :remote-method="userRemoteMethod"
              :loading="userLoading">
              <el-option
                v-for="item in userOption"
                :key="item.id"
                :label="item.username"
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="operate==='新增'">
        <el-dropdown @command="addDeliveryDetail">
          <el-button type="primary">
            新增交付物<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in dictDeliverType" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-tabs v-model="form.acitveName"  type="card" editable :closable="operate==='新增'" @tab-remove="removeTab">
        <el-tab-pane
          :key="index"
          v-for="(item, index) in form.deliveryDetails"
          :label="'第'+String(index+1)+'交付物('+getDictCaption(item.deliverType,dictDeliverType)+')'"
          :name="String(index)">
          <el-form v-if="item.deliverType==0" :ref="'detail'+index" :model="item" :rules="rules" size="small" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="非主干版本"  prop="noTrunkVersion">
                  <el-select
                    v-model="item.noTrunkVersion"
                    filterable
                    remote
                    reserve-keyword
                    allow-create
                    default-first-option
                    style="width: 200px;"
                    placeholder="输入非主干版本(支持模糊查询)"
                    :remote-method="(versionNo)=>{noTrunkVersionRemoteMethod(versionNo,index)}"
                    :loading="deliverOption[index].noTrunkVersionLoading">
                    <el-option
                      v-for="item in deliverOption[index].noTrunkVersionOption"
                      :key="item.versionNo"
                      :label="item.versionNo+'('+item.productId+')'"
                      :value="item.versionNo">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="对应主干版本"  prop="trunkVersion">
                  <el-select
                    v-model="item.trunkVersion"
                    filterable
                    remote
                    reserve-keyword
                    allow-create
                    default-first-option
                    style="width: 200px;"
                    placeholder="输入对应主干版本(支持模糊查询)"
                    :remote-method="(versionNo)=>{trunkVersionRemoteMethod(versionNo,index)}"
                    :loading="deliverOption[index].trunkVersionLoading">
                    <el-option
                      v-for="item in deliverOption[index].trunkVersionOption"
                      :key="item.versionNo"
                      :label="item.versionNo+'('+item.productId+')'"
                      :value="item.versionNo">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发放来源"  prop="issueSource">
                  <el-select v-model="item.issueSource" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictIssueSource"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="任务号/修改单号"  prop="taskNo">
                  <el-input v-model="item.taskNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SVN日志号"  prop="svnNo">
                  <el-input v-model="item.svnNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="需求编号"  prop="requireNo">
                  <el-input v-model="item.requireNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="需求类型"  prop="requireType">
                  <el-select v-model="item.requireType" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictRequireType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注"  prop="memo">
                  <el-input v-model="item.memo"  type="textarea" style="width: 550px;"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-if="item.deliverType==1" :ref="'detail'+index" :model="item" :rules="rules" size="small" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="功能模块"  prop="functionModule">
                  <el-select
                    v-model="item.functionModule"
                    filterable
                    remote
                    reserve-keyword
                    style="width: 200px;"
                    placeholder="输入对应功能模块(支持模糊查询)"
                    @change="(functionName)=>{fMconfigRemoteMethod(functionName,index)}"
                    :remote-method="(functionName)=>{functionRemoteMethod(functionName,index)}"
                    :loading="deliverOption[index].functionLoading">
                    <el-option
                      v-for="item in deliverOption[index].functionOption"
                      :key="item.id"
                      :label="item.functionName"
                      :value="item.functionName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目编号"  prop="projectNo" :rules="[{ required: getDictCaption(item.issueGist,dictIssueGistAccretion)==='任务书', message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                  <el-input v-model="item.projectNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictIssueGistAccretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="配置项名称"  prop="configName">
                <el-select
                  v-model="item.configName"
                  filterable
                  multiple
                  allow-create
                  default-first-option
                  style="width: 900px;"
                  placeholder="选择配置项(支持模糊查询)"
                  :loading="deliverOption[index].functionLoading">
                  <el-option
                    v-for="item in deliverOption[index].fmconfigOption"
                    :key="item.id"
                    :label="item.scriptName"
                    :value="item.scriptName">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注"  prop="memo">
              <el-input v-model="item.memo"  type="textarea" style="width: 900px;"/>
            </el-form-item>
          </el-form>
          <el-form v-if="item.deliverType==2 || item.deliverType==3" :ref="'detail'+index" :model="item" :rules="rules" size="small" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="模块"  prop="moduleType">
                  <el-select v-model="item.moduleType" filterable  placeholder="请选择"  style="width: 300px;" @change="(moduleType)=>{moduleTypeChange(moduleType,index)}">
                    <el-option
                      v-for="item in  dictModuleType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 300px;">
                    <el-option
                      v-for="item in  dictIssueGistNoAccretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="配置项名称"  prop="configName">
              <el-select
                v-model="item.configName"
                filterable
                multiple
                allow-create
                default-first-option
                style="width: 830px;"
                placeholder="选择配置项(支持模糊查询)"
                :remote-method="(configName)=>{configNameRemoteMethod(configName,index)}"
                :loading="deliverOption[index].configLoading">
                <el-option
                  v-for="item in deliverOption[index].configOption"
                  :key="item.id"
                  :label="item.scriptName"
                  :value="item.scriptName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form v-if="item.deliverType==4" :ref="'detail'+index" :model="item" :rules="rules" size="small" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="TA代码"  prop="taCode">
                  <el-input v-model="item.taCode" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="模块"  prop="module">
                  <el-select v-model="item.module" filterable  placeholder="请选择"  style="width: 200px;"  @change="(module)=>{moduleChange(module,index)}">
                    <el-option
                      v-for="item in  dictModule"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="功能编号"  prop="functionNo" :rules="[{ required: getDictCaption(item.module,dictModule)==='功能', message: '请输入功能编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                  <el-input v-model="item.functionNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="配置项名称"  prop="configName" :rules="[]">
              <el-select
                v-model="item.configName"
                filterable
                multiple
                allow-create
                default-first-option
                style="width: 900px;"
                placeholder="选择配置项(支持模糊查询)"
                :remote-method="(configName)=>{sqConfigNameRemoteMethod(configName,index)}"
                :loading="deliverOption[index].configLoading">
                <el-option
                  v-for="item in deliverOption[index].configOption"
                  :key="item.id"
                  :label="item.scriptName"
                  :value="item.scriptName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="授权期"  prop="authorDateType">
                  <el-select v-model="item.authorDateType" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictAuthorDateType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictIssueGistAuthor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目编号"  prop="projectNo">
                  <el-input v-model="item.projectNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/delivery'
import { parseTimeymd, deepClone, getDictCaption, findArrayAttr } from '@/utils/index'
import  { queryVersionNo, queryCustName, queryUser, queryFunction, queryScriptNoFunc } from  '@/utils/business'
export default {
  props: {
    operate: {
      type: String,
      required: true
    }
   ,dictDeliverType: {
     type: Array,
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
   ,dictIssueSource: {
     type: Array,
     required: true
    }
   ,dictRequireType: {
     type: Array,
     required: true
    }
   ,dictIssueGistAccretion: {
     type: Array,
     required: true
    }
   ,dictIssueGistNoAccretion: {
      type: Array,
      required: true
    },
    dictIssueGistAuthor:{
      type: Array,
      required: true
    },
    dictAuthorDateType:{
      type: Array,
      required: true
    }
   ,dictModuleType: {
     type: Array,
     required: true
    }
   ,dictModule: {
     type: Array,
     required: true
    },
    dictProductId: {
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
        deliverId: '',
        productId:'',
        deliverType: '',
        custType: '',
        area: '',
        custName: '',
        noTrunkVersion: '',
        trunkVersion: '',
        issueSource: '',
        taskNo: '',
        svnNo: '',
        requireNo: '',
        requireType: '',
        memo: '',
        functionModule: '',
        configName: [],
        projectNo: '',
        issueGist: '',
        moduleType: '',
        taCode: '',
        module: '',
        functionNo:'',
        authorDateType:'',
        acitveName:'0',
        deliveryDetails:[]
      },
      formModel: {
        id: '',
        deliverId: '',
        productId:'',
        deliverType: '',
        custType: '',
        area: '',
        custName: '',
        noTrunkVersion: '',
        trunkVersion: '',
        issueSource: '',
        taskNo: '',
        svnNo: '',
        requireNo: '',
        requireType: '',
        memo: '',
        functionModule: '',
        configName: [],
        projectNo: '',
        issueGist: '',
        moduleType: '',
        taCode: '',
        module: '',
        functionNo:'',
        authorDateType:''
      },
      rules: {
        custType: [
          { required: true, message: '请选择客户类型', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品名称', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        custName: [
          { required: true, message: '请选择客户名称', trigger: 'blur' }
        ],
        issueDate: [
          { required: true, message: '请选择发放日期', trigger: 'blur' }
        ],
        issuePerson: [
          { required: true, message: '请选择发放人', trigger: 'blur' }
        ],
        noTrunkVersion: [
          { required: true, message: '请选择非主干版本', trigger: 'blur' }
        ],
        trunkVersion: [
          { required: true, message: '请选择对应主干版本', trigger: 'blur' }
        ],
        issueSource: [
          { required: true, message: '请选择发放来源', trigger: 'blur' }
        ],
        taskNo: [
          { required: true, message: '请输入任务单号', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        requireNo: [
          { required: true, message: '请输入需求编号', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        requireType: [
          { required: true, message: '请选择需求类型', trigger: 'blur' }
        ],
        functionModule: [
          { required: true, message: '请选择功能模块', trigger: 'blur' }
        ],
        configName: [
          { required: true, message: '请选择配置项名称', trigger: 'blur' }
        ],
        issueGist: [
          { required: true, message: '请选择发放依据', trigger: 'blur' }
        ],
        moduleType: [
          { required: true, message: '请选择模块', trigger: 'blur' }
        ],
        taCode: [
          { required: true, message: '请输入TA代码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请选择模块', trigger: 'blur' }
        ],
        authorDateType: [
          { required: true, message: '请选择授权期', trigger: 'blur' }
        ],
      },
      custLoading:false,
      custOption:[],
      userLoading:false,
      userOption:[],
      deliverOption:{},
      versionLoading:false,
      versionOption:[],
      functionLoading:false,
      functionOption:[],
      fmconfigOption:[],
    }
  },
  methods: {
    getDictCaption,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if(this.operate ==='新增'){
        this.$refs.form.validate((vaild)=>{
            if(vaild){
              this.form.deliveryDetails.forEach((item,index)=>{
                  var detailVaild = true;
                  this.$refs['detail'+index][0].validate((vaild)=>{ detailVaild = detailVaild&&vaild});
                  if(detailVaild){
                     this.doAdd();
                  }
              })

            }
        })
      }

    },
    addDataDeal(){
       this.form.deliveryDetails.forEach((item)=>{
          item.productId = this.form.productId;
          item.custType = this.form.custType;
          item.area = this.form.area;
          item.custName = this.form.custName;
          item.issueDate =parseTimeymd(this.form.issueDate);
          item.issuePerson = this.form.issuePerson;
          item.configName  = item.configName.join(",");
       })
    },
    doAdd() {
      this.addDataDeal();
      add(this.form.deliveryDetails).then(res => {
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
      this.$refs['form'].resetFields();
      this.form = {
        id: '',
        productId:'',
        deliverType: '',
        custType: '',
        area: '',
        custName: '',
        noTrunkVersion: '',
        trunkVersion: '',
        issueSource: '',
        taskNo: '',
        svnNo: '',
        requireNo: '',
        requireType: '',
        memo: '',
        functionModule: '',
        configName: [],
        projectNo: '',
        issueGist: '',
        moduleType: '',
        taCode: '',
        module: '',
        functionNo:'',
        authorDateType:'',
        acitveName:'0',
        deliveryDetails:[]
      }
    },
    addDeliverOption(index,flag){
      this.$set(this.deliverOption,index,{
        noTrunkVersionLoading: false,
        noTrunkVersionOption: [],
        trunkVersionLoading: false,
        trunkVersionOption: [],
        functionLoading: false,
        functionOption: [],
        fmconfigOption: [],
        configLoading: false,
        configOption: []
      });
      //如果flag为true则选项查询
      if(flag){
         var detail = this.form.deliveryDetails[index];
         if(this.form.deliveryDetails[index].deliverType == '0'){
           this.noTrunkVersionRemoteMethod(this.form.productId,index);
           this.trunkVersionRemoteMethod(this.form.productId,index);
         }else if(this.form.deliveryDetails[index].deliverType == '1'){
           console.log(this.form.deliveryDetails)
           this.functionRemoteMethod(detail.functionModule,index);
           this.fMconfigRemoteMethod(detail.functionModule,index);
         }
      }
    },
    batchAddDeliverOption(size){
       if(size){
          for(var i = 0;i< size;i++){
             this.addDeliverOption(i,true);
          }
       }
    },
    addDeliveryDetail(value){
       var detail = deepClone(this.formModel);
       detail.deliverType = value;
       this.addDeliverOption(this.form.deliveryDetails.length,false);
       this.form.deliveryDetails.push(detail);
       this.form.acitveName = String(this.form.deliveryDetails.length-1);
    },
    removeTab(targetName){
       this.form.deliveryDetails.splice(Number(targetName),1);
       this.deliverOption.splice(Number(targetName),1);
       if(Number(targetName) === this.form.deliveryDetails.length){
         this.form.acitveName = String(Number(targetName)-1);
       }else {
         this.form.acitveName = targetName;
       }
    },
    noTrunkVersionRemoteMethod(versionNo,index){
      queryVersionNo(this.form.productId,versionNo).then(res=>{
        this.$set(this.deliverOption[index],'noTrunkVersionLoading',res.loading);
        this.$set(this.deliverOption[index],'noTrunkVersionOption',res.option)
      })
    },
    trunkVersionRemoteMethod(versionNo,index){
      queryVersionNo(this.form.productId,versionNo).then(res=>{
        this.$set(this.deliverOption[index],'trunkVersionLoading',res.loading)
        this.$set(this.deliverOption[index],'trunkVersionOption',res.option)
      })
    },
    productIdChange(){
      //清空所有跟产品有关字段
      //重置版本选项
      this.form.deliveryDetails.forEach((item,index)=>{
         item.noTrunkVersion = '';
         item.trunkVersion = '';
         item.functionMode = '';
         item.configName = [];
         item.module = '';
         item.moduleType = '';
         this.$set(this.deliverOption[index],'noTrunkVersionOption',[]);
         this.$set(this.deliverOption[index],'trunkVersionOption',[]);
         this.$set(this.deliverOption[index],'functionOption',[]);
         this.$set(this.deliverOption[index],'fmconfigOption',[]);
         this.$set(this.deliverOption[index],'configOption',[]);
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
        queryCustName(this.form.custType,this.form.area,custName).then(res=>{
          this.custOption  = res.option;
          this.custLoading = res.loading;
        });

      }else {
        this.custOption = [];
      }
    },
    custTypeAndAreaChange(){
      if(this.form.custType !== '' && this.form.area !== ''){
        this.custLoading = true;
        this.form.custName = '';
        queryCustName(this.form.custType,this.form.area,this.form.custName).then(res=>{
          this.custOption  = res.option;
          this.custLoading = res.loading;
        })

      }
    },
    userRemoteMethod(username){
      this.userLoading = true;
      queryUser(username).then(res=>{
        this.userOption  = res.option;
        this.userLoading = res.loading;
      })
    },
    functionRemoteMethod(functionName,index){
     if(this.form.productId){
       this.$set(this.deliverOption[index],'functionLoading',true);
       queryFunction(this.form.productId,functionName).then(res=>{
         this.$set(this.deliverOption[index],'functionLoading',res.loading)
         this.$set(this.deliverOption[index],'functionOption',res.option)
       })
       if(this.operate ==='修改'){
          if(findArrayAttr(this.deliverOption[index].functionOption,'functionName',this.form.deliveryDetails[index].functionModule)===-1){
            this.$set(this.deliverOption[index].functionOption,this.deliverOption[index].functionOption.length,
              {
                'id':this.form.deliveryDetails[index].functionModule,
                'functionName':this.form.deliveryDetails[index].functionModule
              })
          }
       }
       console.log(this.deliverOption[index].functionOption);
     }else {
       this.$message.warning("请先选择产品名称!");
     }
    },
    fMconfigRemoteMethod(functionName,index){
      if(functionName){
        this.deliverOption[index].functionOption.forEach((item)=>{
            if(item.functionName === functionName){
             this.$set( this.deliverOption[index],'fmconfigOption',item.scripts);
              if(this.operate ==='修改'){
                if(!this.deliverOption[index].fmconfigOption){
                  this.$set( this.deliverOption[index],'fmconfigOption',[]);
                }
                var fmconfigOption =this.deliverOption[index].fmconfigOption;
                this.form.deliveryDetails[index].configName.forEach((item)=>{
                  if(findArrayAttr(fmconfigOption,'scriptName',item)===-1){
                    this.$set(fmconfigOption,fmconfigOption.length,
                      {
                        'id':item,
                        'scriptName':item
                      })
                  }
                })
                console.log(fmconfigOption);
              }
            }
         })
      }
    },
    configNameRemoteMethod(configName,index){
      if(!this.form.deliveryDetails[index].moduleType || this.form.deliveryDetails[index].moduleType == ''){
        this.$message.warning("请先选择模块!")
      }
      if(!this.form.productId || this.form.productId == '' ){
        this.$message.warning("请先选择产品!")
      }
      if(this.form.productId&&this.form.deliveryDetails[index].moduleType){
        this.$set(this.deliverOption[index],'configLoading',true);
        queryScriptNoFunc(this.form.productId,this.form.deliveryDetails[index].moduleType,'').then(res=>{
          this.$set(this.deliverOption[index],'configLoading',res.loading)
          this.$set(this.deliverOption[index],'configOption',res.option)
        });
      }
    },
    sqConfigNameRemoteMethod(configName,index){
      if(!this.form.deliveryDetails[index].module || this.form.deliveryDetails[index].module == ''){
        this.$message.warning("请先选择模块!")
      }
      if(!this.form.productId || this.form.productId == '' ){
        this.$message.warning("请先选择产品!")
      }
      if(this.form.productId&&this.form.deliveryDetails[index].module){
        this.$set(this.deliverOption[index],'configLoading',true);
        queryScriptNoFunc(this.form.productId,'0','').then(res=>{
          this.$set(this.deliverOption[index],'configLoading',res.loading)
          this.$set(this.deliverOption[index],'configOption',res.option)
        });
      }
    },
    moduleTypeChange(moduleType,index){
        this.$set(this.deliverOption[index],'configName','');
        this.configNameRemoteMethod('',index);
    },
    moduleChange(module,index){
      this.$set(this.deliverOption[index],'configName','');
      this.sqConfigNameRemoteMethod('',index);
    }
  }
}
</script>

<style scoped>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
