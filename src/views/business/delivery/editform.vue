<template>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="80%">
      <el-form ref="form" v-if="form.deliverType==0" :model="form" :rules="rules" size="small" label-width="120px" :disabled="operate==='详情'" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户类型"  prop="custType">
              <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-select v-model="form.area" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-input v-model="form.custName" style="width: 200px;"/>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="非主干版本"  prop="noTrunkVersion">
             <el-input v-model="form.noTrunkVersion" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对应主干版本"  prop="trunkVersion">
              <el-input v-model="form.trunkVersion" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发放依据"  prop="issueGist">
              <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictIssueGistNoAccretion"
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
              <el-input v-model="form.taskNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SVN日志号"  prop="svnNo">
              <el-input v-model="form.svnNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求编号"  prop="requireNo">
              <el-input v-model="form.requireNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item  v-if="getDictCaption(form.issueGist,dictIssueGistNoAccretion)==='领导审批'" label="审批人"   prop="approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
              <el-select v-model="form.approver" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictDeliveryApprover"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="程序包明细"  prop="packageDetails" :rules="[{ min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }]">
            <el-input v-model="form.packageDetails" type="textarea"  style="width: 870px;"  show-word-limit/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注"  prop="memo">
              <el-input v-model="form.memo"  type="textarea" style="width: 870px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="form" v-if="form.deliverType==1" :model="form" :rules="rules" size="small" label-width="120px" :disabled="operate==='详情'" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户类型"  prop="custType">
              <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-select v-model="form.area" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-input v-model="form.custName" style="width: 200px;"/>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="功能模块"  prop="functionModule">
              <el-input v-model="form.functionModule" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编号"  prop="projectNo" :rules="
            [{ required: projectNoNeed(form.issueGist,dictIssueGistAccretion), message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
              <el-input v-model="form.projectNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发放依据"  prop="issueGist">
              <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictIssueGistAccretion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="配置项名称"  prop="configName">
            <el-input v-model="form.configName" type="textarea" style="width: 900px;"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item  v-if="getDictCaption(form.issueGist,dictIssueGistAccretion)==='领导审批'" label="审批人"   prop="approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
              <el-select v-model="form.approver" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictDeliveryApprover"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="功能模式"  prop="functionMode" :rules="{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }" >
              <el-input v-model="form.functionMode"   style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注"  prop="memo">
            <el-input v-model="form.memo"  type="textarea" style="width: 900px;"/>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form ref="form" v-if="form.deliverType==2 || form.deliverType==3" :model="form" :rules="rules" size="small" label-width="120px" :disabled="operate==='详情'" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户类型"  prop="custType">
              <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 200px;" >
                <el-option
                  v-for="item in dictCustType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区"  prop="area" :rules="[{ required: form.custType!==getDictValue('财富云',dictCustType) , message: '请选择地区', trigger: 'blur' }]">
              <el-select v-model="form.area" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-input v-model="form.custName" style="width: 200px;"/>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="模块"  prop="moduleType">
              <el-select v-model="form.moduleType" filterable  placeholder="请选择"  style="width: 200px;" >
                <el-option
                  v-for="item in  dictModuleType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发放依据"  prop="issueGist">
              <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictIssueGistNoAccretion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  v-if="getDictCaption(form.issueGist,dictIssueGistNoAccretion)==='领导审批'" label="审批人"   prop="approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
              <el-select v-model="form.approver" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictDeliveryApprover"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置项名称"  prop="configName">
          <el-input v-model="form.configName" style="width: 900px;"/>
        </el-form-item>
        <el-row>
          <el-form-item label="备注"  prop="memo">
            <el-input v-model="form.memo"  type="textarea" style="width: 900px;"/>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form ref="form" v-if="form.deliverType==4" :model="form" :rules="rules" size="small" label-width="120px" :disabled="operate==='详情'" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户类型"  prop="custType">
              <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 200px;" >
                <el-option
                  v-for="item in dictCustType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区"  prop="area" :rules="[{ required: form.custType!==getDictValue('财富云',dictCustType) , message: '请选择地区', trigger: 'blur' }]">
              <el-select v-model="form.area" filterable  placeholder="请选择" style="width: 200px;" >
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
              <el-input v-model="form.custName" style="width: 200px;"/>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="TA代码"  prop="taCode">
              <el-input v-model="form.taCode" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块"  prop="module">
              <el-select v-model="form.module" filterable  placeholder="请选择"  style="width: 200px;"   >
                <el-option
                  v-for="item in  dictModule"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="功能编号"  prop="functionNo" :rules="[{ required: getDictCaption(form.module,dictModule)==='功能', message: '请输入功能编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
              <el-input v-model="form.functionNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置项名称"  prop="configName" :rules="[]">
          <el-input v-model="form.configName" style="width: 900px;"/>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="授权期限"  prop="authorDateType">
              <el-select v-model="form.authorDateType" filterable  placeholder="请选择"  style="width: 200px;">
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
              <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictIssueGistAuthor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编号"  prop="projectNo" :rules="
            [{ required: projectNoNeed(form.issueGist,dictIssueGistAuthor), message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]" >
              <el-input v-model="form.projectNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item  v-if="getDictCaption(form.issueGist,dictIssueGistAuthor)==='领导审批'" label="审批人"   prop="approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
              <el-select v-model="form.approver" filterable  placeholder="请选择"  style="width: 200px;">
                <el-option
                  v-for="item in  dictDeliveryApprover"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注"  prop="memo">
            <el-input v-model="form.memo"  type="textarea" style="width: 900px;"/>
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
import { edit } from '@/api/delivery'
import  {  queryUser } from  '@/utils/business'
import { parseTimeymd, deepClone, getDictCaption, getDictValue  } from '@/utils/index'
export default {
    name: "editform",
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
    },
    dictDeliveryApprover:{
      type: Array,
      required: true
    }
  },
    data(){
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
          issueDate:'',
          issuePerson:'',
          noTrunkVersion: '',
          trunkVersion: '',
          issueSource: '',
          taskNo: '',
          svnNo: '',
          requireNo: '',
          requireType: '',
          memo: '',
          functionModule: '',
          configName: '',
          projectNo: '',
          issueGist: '',
          moduleType: '',
          taCode: '',
          module: '',
          functionNo:'',
          authorDateType:'',
          approver:'',
          functionMode:'',
          packageDetails:'',
          used:''
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
            { required: true, message: '请输入客户名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          issueDate: [
            { required: true, message: '请选择发放日期', trigger: 'blur' }
          ],
          issuePerson: [
            { required: true, message: '请选择发放人', trigger: 'blur' }
          ],
          noTrunkVersion: [
            { required: true, message: '输入非主干版本', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          trunkVersion: [
            { required: true, message: '输入对应主干版本', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          issueSource: [
            { required: true, message: '请选择发放依据', trigger: 'blur' }
          ],
          taskNo: [
            { required: true, message: '请输入任务单号', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          requireNo: [
            { required: true, message: '请输入需求编号', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          requireType: [
            { required: true, message: '请选择需求类型', trigger: 'blur' }
          ],
          functionModule: [
            { required: true, message: '请输入功能模块', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          configName: [
            { required: true, message: '请输入配置项名称', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
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
        userLoading:false,
        userOption:[],
      }
    },
    methods:{
      getDictCaption,
      getDictValue,
      projectNoNeed(issueGist,dict){
        return getDictCaption(issueGist,dict).indexOf('TS')===-1&&
          getDictCaption(issueGist,dict)!=='领导审批' &&
          getDictCaption(issueGist,dict)!=='首次授权' &&
          getDictCaption(issueGist,dict)!=='云英' &&
          getDictCaption(issueGist,dict)!=='授权延期' &&
          getDictCaption(issueGist,dict)!=='脚本更新';
      },
      cancel() {
        this.resetForm()
      },
      dealFormData(){
        this.form = {
          ...this.form,
          issueDate : parseTimeymd(this.form.issueDate)
        }
      },
      doSubmit(){
        this.$refs.form.validate((vaild)=> {
          if (vaild) {
            this.dealFormData();
            if(this.operate === '修改'){
              this.doEdit();
            }
          }
        });
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
          issueDate:'',
          issuePerson:'',
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
          configName: '',
          projectNo: '',
          issueGist: '',
          moduleType: '',
          taCode: '',
          module: '',
          functionNo:'',
          authorDateType:'',
          approver:'',
          used:''
        }
      },
      productIdChange(){
        this.form.noTrunkVersion = '';
        this.form.trunkVersion = '';
        this.form.functionMode = '';
        this.form.configName = '';
        this.form.module = '';
        this.form.moduleType = '';
      },
      userRemoteMethod(username){
        this.userLoading = true;
        queryUser(username).then(res=>{
          this.userOption  = res.option;
          this.userLoading = res.loading;
        })
      },
    }
}
</script>

<style scoped>

</style>
