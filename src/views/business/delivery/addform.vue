<template>
  <div>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="新增交付明细" width="80%">
      <el-form  ref="form"
                :model="form"
                :rules="rules"
                size="small"
                v-loading="genDeliverFlag"
                element-loading-text="拼命在生成明细..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                label-width="120px"   >
        <el-form-item label="粘贴交付语句"><el-input v-model="form.text" type="textarea"  :rows="4" /></el-form-item>
        <el-form-item>
          <el-button  style="margin-left: 20px" type="primary" @click="dealDeliveryText" :disabled="genDeliverFlag">生成交付明细</el-button>
          <el-button  style="margin-left: 20px" type="info" @click="clearDeliveryItem">清空交付语句</el-button>
          <el-button style="margin-left: 20px" type="success" @click="addDeliverCard(0)">新增交付明细</el-button>
          <el-tooltip placement="top">
            <div slot="content">
              交付复制格式如下:
              <br/>1.一次交付只能交付一个客户但是可以交付不同类型。
              <br/>2.多个不同类型交付以数字加中文顿号为开头如“1、xxxx”。
              <br/>3.程序发放格式:/客户类型/地区/客户名称/产品名称/非主干版本-客户编号(交付日期_SVN编号_老版本编号(选填)_主干版本_需求编号(多个以"&"分割))。
              <br/>4.功能发放格式:
              <br/>        (1)/客户类型/地区/客户名称/产品名称/功能模块名称/模块_交付日期_脚本名称；
              <br/>        (2)/客户类型/地区/客户名称/产品名称/模块_交付日期_脚本名称；
              <br/>        (3)/客户类型/地区/客户名称/产品名称/售前测试/功能模块名称/模块_交付日期_脚本名称；
            </div>
            <el-button    icon="el-icon-info" circle/>
          </el-tooltip>
        </el-form-item>
        <el-card class="box-card" v-if="form.details && form.details.length">
          <div slot="header" class="clearfix">
            <span>交付客户信息</span>
          </div>
          <div>
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
                <el-form-item label="地区"  prop="area" :rules="{ required: form.custType!==getDictValue('财富云',dictCustType) , message: '请选择地区', trigger: 'blur' }">
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
                  <el-select
                    v-model="form.custName"
                    filterable
                    remote
                    reserve-keyword
                    allow-create
                    default-first-option
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
                  <el-select v-model="form.productId" filterable  placeholder="请选择"     style="width: 200px;">
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
          </div>
        </el-card>
        <el-card class="box-card" v-if="
      form.details &&
      form.details.length &&
      form.details.filter((item,index)=>{return item.deliverType==1&&!alloption[index].addValueFlag}).length">
          <div slot="header" class="clearfix">
            <span>增值公共信息</span>
          </div>
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目编号"   prop="publicItem.deliverType1.projectNo" :rules="
                   [{ required: projectNoNeed(form.publicItem.deliverType1.issueGist,dictIssueGistAccretion), message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                  <el-input v-model="form.publicItem.deliverType1.projectNo"  @input="projectNoPublicChange" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发放依据"  prop="publicItem.deliverType1.issueGist" :rules="[
                        { required: true, message: '请选择发放依据', trigger: 'blur' }
                      ]">
                  <el-select v-model="form.publicItem.deliverType1.issueGist" filterable @change="issueGistPublicChange" placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictIssueGistAccretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item  v-if="getDictCaption(form.publicItem.deliverType1.issueGist,dictIssueGistAccretion)==='领导审批'" label="审批人"   prop="publicItem.deliverType1.approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                  <el-select v-model="form.publicItem.deliverType1.approver" filterable @change="approverChange" placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictDeliveryApprover"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" v-if="
      form.details &&
      form.details.length &&
      form.details.filter((item,index)=>{return item.deliverType==4&&!alloption[index].addValueFlag}).length">
          <div slot="header" class="clearfix">
            <span>授权公共信息</span>
          </div>
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="TA代码"  prop="publicItem.deliverType4.taCode" :rules="[
                      { required: true, message: '请输入TA代码', trigger: 'blur' },
                      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ]">
                  <el-input v-model="form.publicItem.deliverType4.taCode" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="授权期限"  prop="publicItem.deliverType4.authorDateType" :rules="{ required: true, message: '请选择授权期', trigger: 'blur' }">
                  <el-select v-model="form.publicItem.deliverType4.authorDateType" filterable  placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictAuthorDateType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目编号"  prop="publicItem.deliverType4.projectNo" :rules="
                   [{ required: projectNoNeed(form.publicItem.deliverType4.issueGist,dictIssueGistAuthor), message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                  <el-input v-model="form.publicItem.deliverType4.projectNo" style="width: 200px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发放依据" prop="publicItem.deliverType4.issueGist"  :rules="[
                        { required: true, message: '请选择发放依据', trigger: 'blur' }
                      ]">
                  <el-select v-model="form.publicItem.deliverType4.issueGist" filterable   placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictIssueGistAuthor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item  v-if="getDictCaption(form.publicItem.deliverType4.issueGist,dictIssueGistAuthor)==='领导审批'" label="审批人"   prop="publicItem.deliverType4.approver" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                  <el-select v-model="form.publicItem.deliverType4.approver" filterable   placeholder="请选择"  style="width: 200px;">
                    <el-option
                      v-for="item in  dictDeliveryApprover"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" v-for="(item,index) in form.details" :key="index">
          <div slot="header" class="clearfix">
            <span>第{{index+1}}个交付物({{getDictCaption(item.deliverType,dictDeliverType)}})</span>
            <el-button style="float: right;" type="text" @click="delDeliverCard(index)">删除交付明细</el-button>
            <el-button style="float: right; margin-right: 20px" type="text" @click="addDeliverCard(index,item,alloption[index])">复制交付明细</el-button>
            <el-button v-if="item.deliverType ==1 || item.deliverType ==4 " style="float: right; margin-right: 20px" type="text" @click="()=>{alloption[index].addValueFlag = !alloption[index].addValueFlag}">{{alloption[index].addValueFlag?'关闭':'开启'}}个性化{{getDictCaption(item.deliverType,dictDeliverType)}}公共信息</el-button>
            <el-button v-if="item.deliverType ==4" style="float: right; margin-right: 20px" type="text" @click="copyOldAuthor(index)">复制往期授权</el-button>
            <el-select  v-model="item.deliverType" size="mini"  filterable  placeholder="请选择"
                        @change="()=>{changeDeliverType(index)}"
                        style="margin-right: 20px;width: 150px">
              <el-option
                v-for="item in  dictDeliverType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </div>
          <div>
            <div v-if="item.deliverType ==0" >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="非主干版本" :prop="`details.${index}.noTrunkVersion`"   :rules="[
                        { required: true, message: '输入非主干版本', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                      ]">
                    <el-input v-model="item.noTrunkVersion" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="对应主干版本"  :prop="`details.${index}.trunkVersion`"  :rules="[
                        { required: true, message: '输入对应主干版本', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                      ]">
                    <el-input v-model="item.trunkVersion" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发放依据"   :prop="`details.${index}.issueGist`" :rules="[
                        { required: true, message: '请选择发放依据', trigger: 'blur' }
                      ]">
                    <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
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
                  <el-form-item label="任务号/修改单号"   :prop="`details.${index}.taskNo`"  :rules="[
                      { required: true, message: '请输入任务单号', trigger: 'blur' },
                      { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ]">
                    <el-input v-model="item.taskNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="SVN日志号"  :prop="`details.${index}.svnNo`" :rules="{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }">
                    <el-input v-model="item.svnNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="需求编号"  :prop="`details.${index}.requireNo`"  :rules="[
                      { required: true, message: '请输入需求编号', trigger: 'blur' },
                      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ]">
                    <el-input v-model="item.requireNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item  v-if="getDictCaption(item.issueGist,dictIssueGistNoAccretion)==='领导审批'" label="审批人"   :prop="`details.${index}.approver`" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                    <el-select v-model="item.approver" filterable  placeholder="请选择"  style="width: 200px;">
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
                <el-form-item label="程序包明细"  :prop="`details.${index}.packageDetails`" :rules="[{ min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }]">
                  <el-input v-model="item.packageDetails" type="textarea"  style="width: 900px;"  show-word-limit/>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注"  prop="memo" :prop="`details.${index}.memo`" :rules="{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }" >
                    <el-input v-model="item.memo"  type="textarea" style="width: 870px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="item.deliverType ==1">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="功能模块"  :prop="`details.${index}.functionModule`" :rules="[
                      { required: true, message: '请输入功能模块', trigger: 'blur' },
                      { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ]" >
                    <el-input  v-if="alloption[index].functionModule.length ===0" v-model="item.functionModule" style="width: 300px;"/>
                    <el-select v-else v-model="item.functionModule" filterable  placeholder="请选择"  style="width:300px;">
                      <el-option
                        v-for="item in  alloption[index].functionModule"
                        :key="item.id"
                        :label="item.functionName"
                        :value="item.functionName" ></el-option>
                    </el-select>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="()=>{refreshClick(index)}"></el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="功能模式"  :prop="`details.${index}.functionMode`" :rules="{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }" >
                    <el-input v-model="item.functionMode"   style="width: 300px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="配置项名称"  :prop="`details.${index}.configName`" :rules="[
                  { required: true, message: '请输入配置项名称', trigger: 'blur' },
                  { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ]">
                <el-input v-model="item.configName" type="textarea" style="width: 900px;"/>
              </el-form-item>
              <el-row>
                <el-col :span="8">
                  <el-form-item v-if="alloption[index].addValueFlag"  label="项目编号"   :prop="`details.${index}.projectNo`" :rules="
                   [{ required:projectNoNeed(item.issueGist,dictIssueGistAccretion), message: '请输入项目编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                    <el-input v-model="item.projectNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="alloption[index].addValueFlag" label="发放依据"  :prop="`details.${index}.issueGist`" :rules="[
                        { required: true, message: '请选择发放依据', trigger: 'blur' }
                      ]">
                    <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictIssueGistAccretion"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item  v-if="getDictCaption(item.issueGist,dictIssueGistAccretion)==='领导审批'&&alloption[index].addValueFlag" label="审批人"   :prop="`details.${index}.approver`" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                    <el-select v-model="item.approver" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictDeliveryApprover"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备注"  :prop="`details.${index}.memo`" :rules="{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }" >
                <el-input v-model="item.memo"  type="textarea" style="width: 900px;"/>
              </el-form-item>
            </div>
            <div v-if="item.deliverType ==2 || item.deliverType ==3">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="模块"  :prop="`details.${index}.moduleType`" :rules="{ required: true, message: '请选择模块', trigger: 'blur' }">
                    <el-select v-model="item.moduleType" filterable  placeholder="请选择"  style="width: 200px;" >
                      <el-option
                        v-for="item in  dictModuleType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发放依据"  :prop="`details.${index}.issueGist`" :rules="{ required: true, message: '请选择发放依据', trigger: 'blur' }">
                    <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictIssueGistNoAccretion"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item  v-if="getDictCaption(item.issueGist,dictIssueGistNoAccretion)==='领导审批'" label="审批人"   :prop="`details.${index}.approver`" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                    <el-select v-model="item.approver" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictDeliveryApprover"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="配置项名称"  :prop="`details.${index}.configName`" :rules="[
                  { required: true, message: '请输入配置项名称', trigger: 'blur' },
                  { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ]">
                <el-input v-model="item.configName" type="textarea" style="width: 830px;"/>
              </el-form-item>
              <el-form-item label="备注"  :prop="`details.${index}.memo`" :rules="{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }" >
                <el-input v-model="item.memo"  type="textarea" style="width: 830px;"/>
              </el-form-item>
            </div>
            <div v-if="item.deliverType ==4">
              <el-row>
                <el-col :span="8" v-if="alloption[index].addValueFlag">
                  <el-form-item label="TA代码"  :prop="`details.${index}.taCode`" :rules="[
                      { required: true, message: '请输入TA代码', trigger: 'blur' },
                      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ]">
                    <el-input v-model="item.taCode" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="模块" :prop="`details.${index}.module`" :rules="[
                      { required: true, message: '请选择模块', trigger: 'blur' }
                    ]">
                    <el-select v-model="item.module" filterable  placeholder="请选择"  style="width: 200px;"   >
                      <el-option
                        v-for="item in  dictModule"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="功能编号"  :prop="`details.${index}.functionNo`" :rules="[{ required: getDictCaption(item.module,dictModule)==='功能', message: '请输入功能编号', trigger: 'blur' },
                   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                    <el-input v-model="item.functionNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="配置项名称"  :prop="`details.${index}.configName`" :rules="[{ min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }]">
                <el-input v-model="item.configName" type="textarea" style="width: 900px;"/>
              </el-form-item>
              <el-row>
                <el-col :span="8" v-if="alloption[index].addValueFlag" >
                  <el-form-item   label="授权期限"  :prop="`details.${index}.authorDateType`" :rules="{ required: true, message: '请选择授权期', trigger: 'blur' }">
                    <el-select v-model="item.authorDateType" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictAuthorDateType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="alloption[index].addValueFlag" >
                  <el-form-item label="发放依据"  :prop="`details.${index}.issueGist`" :rules="{ required: true, message: '请选择发放来源', trigger: 'blur' }">
                    <el-select v-model="item.issueGist" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictIssueGistAuthor"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="alloption[index].addValueFlag" >
                  <el-form-item label="项目编号"  prop="projectNo" :rules="[{required:projectNoNeed(item.issueGist,dictIssueGistAuthor)}, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }]">
                    <el-input v-model="item.projectNo" style="width: 200px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8"  v-if="alloption[index].addValueFlag">
                  <el-form-item  v-if="getDictCaption(item.issueGist,dictIssueGistAuthor)==='领导审批'" label="审批人"   :prop="`details.${index}.approver`" :rules="[{ required: true, message: '请选择审批人', trigger: 'blur' }
                   ]">
                    <el-select v-model="item.approver" filterable  placeholder="请选择"  style="width: 200px;">
                      <el-option
                        v-for="item in  dictDeliveryApprover"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备注"  :prop="`details.${index}.memo`" :rules="{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }" >
                <el-input v-model="item.memo"  type="textarea" style="width: 900px;"/>
              </el-form-item>
            </div>
          </div>
        </el-card>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="authorCancel" :visible.sync="authordialog" title="延期授权选择" width="80%">
      <!-- 搜索 -->
      <el-form ref="queryForm" :model="queryform"  size="small" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="交付任务号"  prop="deliverId">
              <el-input v-model="queryform.deliverId" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称"  prop="productId">
              <el-select v-model="queryform.productId" filterable  placeholder="请选择" style="width: 150px;">
                <el-option
                  v-for="item in  dictProductId"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户类型"  prop="custType">
              <el-select v-model="queryform.custType" filterable  placeholder="请选择"  style="width: 150px;">
                <el-option
                  v-for="item in  dictCustType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区"  prop="area">
              <el-select v-model="queryform.area" filterable  placeholder="请选择"  style="width: 150px;">
                <el-option
                  v-for="item in  dictArea"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户名称"  prop="custName">
              <el-input v-model="queryform.custName" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="TA代码"  prop="taCode">
              <el-input v-model="queryform.taCode" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模块"  prop="module">
              <el-select v-model="queryform.module" filterable  placeholder="请选择"  style="width: 150px;">
                <el-option
                  v-for="item in  dictModule"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="功能编号"  prop="functionNo">
              <el-input v-model="queryform.functionNo" style="width: 150px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="配置项名称"  prop="configName">
              <el-input v-model="queryform.configName" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="授权期限"  prop="authorDateType">
              <el-select v-model="queryform.authorDateType" filterable  placeholder="请选择"  style="width: 150px;">
                <el-option
                  v-for="item in  dictAuthorDateType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发放依据"  prop="issueGist">
              <el-select v-model="queryform.issueGist" filterable  placeholder="请选择"  style="width: 150px;">
                <el-option
                  v-for="item in  dictIssueGistAuthor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目编号"  prop="projectNo">
              <el-input v-model="queryform.projectNo" style="width: 150px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="发放日期"  prop="issueDate">
              <el-input v-model="queryform.issueDate" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发放人"  prop="issuePerson">
              <el-input v-model="queryform.issuePerson" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button  size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
              <el-button  size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table   v-loading="loading" :data="data" size="small" border style="width: 100%;"
                @selection-change="handleSelectionChange">
        <af-table-column
          type="selection"
          width="35">
        </af-table-column>
        <af-table-column prop="deliverId" label="交付ID"/>
        <af-table-column prop="productId"  label="产品名称"/>
        <af-table-column prop="custType" label="客户类型">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dictCustType)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="area" label="地区">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dictArea)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="custName" label="客户名称"/>
        <af-table-column prop="taCode" label="TA代码"/>
        <af-table-column prop="module" label="模块">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.module,dictModule)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="functionNo" label="功能编号"/>
        <af-table-column prop="configName" label="配置项名称"/>
        <af-table-column prop="authorDateType" label="授权期限">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.authorDateType,dictAuthorDateType)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="issueGist" label="发放依据">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.issueGist,dictIssueGistAuthor)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="projectNo" label="项目编号"/>
        <af-table-column prop="issueDate" label="发放日期"/>
        <af-table-column prop="issuePerson" label="发放人"/>
        <af-table-column prop="memo" label="备注"/>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="authorCancel">取消</el-button>
        <el-button type="primary" @click="authorSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add } from '@/api/delivery'
import initData from '@/mixins/initData'
import { quryScriptHaveFunc } from '@/api/scriptInfo'
import { getFunctionNo } from '@/api/funIdAccount'
import  {  queryUser,queryCustName, queryFunction } from  '@/utils/business'
import { scriptName, queryFunctList } from '@/api/functionInfo'
import { validDictSelect } from '@/views/validator/business'
import { parseTimeymd, deepClone, getDictCaption, trim, getDictValue, strDate, find ,coutChar } from '@/utils/index'
import store from '@/store'
  const  SPLIT_CHAR = "\n";
  const  DELIVER_FC = "财富云";//财富云
  const  DELIVER_NFC = "非财富云";//非财富云
  const  DELIVER_SOFTWARE = "程序";//程序
  const  DELIVER_FUNCTION = "功能";//功能
  const  DELIVER_REPROT = "报表";//报表
  const  DELIVER_QUERY = "查询";//查询
  const  DELIVER_BOOK = "文档";//用户手册/文档
  const  DELIVER_INTERFACE = "接口";//接口
  const  DELIVER_AUTHOR = "授权";//授权
  const  DELIVER_PROCESS = "流程";//授权
  const  DELIVER_DICT = "数据字典";//数据字典
  const  formModel = {
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
    used:'1'
}
  export default {
    name: "addform",
    mixins: [initData],
    props: {
      dictDeliverType: {
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
    data() {
      return {
        loading: false,
        dialog: false,
        authordialog:false,
        form: {
          id: '',
          text:'',
          radio:'0',
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
          used:'1',
          details:[],
          publicItem:{
            deliverType1:deepClone(formModel),
            deliverType4:deepClone(formModel),
          }
        },
        queryform:{
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
          used:'1'
        },
        rules: {
          custType: [
            { required: true, trigger: 'blur', validator:(rule,value,callback)=>(validDictSelect(rule,value,callback,this.dictCustType)) }
          ],
          productId: [
            { required: true,trigger: 'blur', validator:(rule,value,callback)=>(validDictSelect(rule,value,callback,this.dictProductId)) }
          ],
          area: [
            { required: true,  trigger: 'blur', validator:(rule,value,callback)=>(validDictSelect(rule,value,callback,this.dictArea)) }
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
        custLoading:false,
        custOption:[],
        genDeliverFlag:false,
        alloption:[],
        optionModule:{
          addValueFlag:false,
          functionModule:[]
        },
        multipleSelection:[],
        copyAuthorIndex:0,
        loadingInstance:null,
        dealCount:0,
        dirFunctionArr:[]
      }
    },
    watch:{
      dealCount(){
        if(this.dealCount > 0){
           this.genDeliverFlag = true
        }else {
          this.genDeliverFlag = false
        }
      }
    },
    methods:{
      getDictCaption,
      getDictValue,
      projectNoNeed(issueGist,dict){
        return getDictCaption(issueGist,dict).indexOf('TS')===-1&&
        getDictCaption(issueGist,dict)!=='领导审批' &&
        getDictCaption(issueGist,dict)!=='首次授权' &&
        getDictCaption(issueGist,dict)!=='授权延期' &&
        getDictCaption(issueGist,dict)!=='云英' &&
        getDictCaption(issueGist,dict)!=='脚本更新';
      },
      dealCust(detail){
        if(detail){
           if(!this.form.custName){
             this.form.custName = detail.custName;
           }
           if(!this.form.custType){
             this.form.custType = detail.custType;
           }
          if(!this.form.area){
            this.form.area = detail.area;
          }
          if(!this.form.productId){
            this.form.productId = detail.productId;
          }
          if(!this.form.issueDate){
            if(detail.issueDate){
              this.form.issueDate =  strDate(detail.issueDate);
            }else {
              this.form.issueDate =  strDate(new Date());
            }
          }
          if(!this.form.issuePerson){
            this.form.issuePerson = store.getters.user.username;
          }
        }
      },
      clearDeliveryItem(){
        this.form.text = '';
      },
      addOption(index){
         this.alloption.push(deepClone(this.optionModule))
      },
      batchAddOption(size){
        if(size){
          for(var i = 0;i< size;i++){
            this.addOption(i);
          }
        }
      },
      cancel() {
        this.resetForm()
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields();
        this.form= {
            id: '',
            text:'',
            radio:'0',
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
            details:[],
            publicItem:{
              deliverType1:deepClone(formModel),
              deliverType4:deepClone(formModel),
            }
        };
      },
      addDataDeal(){
        this.form.details.forEach((item,index)=>{
          item.productId = this.form.productId;
          item.custType = this.form.custType;
          item.area = this.form.area;
          item.custName = this.form.custName;
          item.issueDate =parseTimeymd(this.form.issueDate);
          item.issuePerson = this.form.issuePerson;
          if(!this.alloption[index].addValueFlag&&item.deliverType==1){
            var deliverType1 =  this.form.publicItem.deliverType1;
            item.projectNo = deliverType1.projectNo;
            item.issueGist = deliverType1.issueGist;
            item.approver  = deliverType1.approver;
          }else if(!this.alloption[index].addValueFlag&&item.deliverType==4){
            var deliverType4 =  this.form.publicItem.deliverType4;
            item.authorDateType = deliverType4.authorDateType;
            item.projectNo = deliverType4.projectNo;
            item.issueGist = deliverType4.issueGist;
            item.taCode = deliverType4.taCode;
            item.approver = deliverType4.approver;
          }
        })
      },
      doSubmit(){
        if(!this.form.details.length){
          this.$message.warning("请先增加交付物明细!")
          return
        }
        this.$refs.form.validate((vaild, object)=> {
          if (vaild) {
              this.doAdd();
          }else {
            setTimeout(()=>{
              //定位到检验错误第一个位置
              var isError= document.getElementsByClassName("is-error");
              isError[0].querySelector('input').focus();
            },100);
            return false;
          }
        })
      },
      doAdd() {
        this.addDataDeal();
        add(this.form.details).then(res => {
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
        })
      },
      userRemoteMethod(username){
        this.userLoading = true;
        queryUser(username).then(res=>{
          this.userOption  = res.option;
          this.userLoading = res.loading;
        })
      },
      delDeliverCard(index){
        this.form.details.splice(index,1);
        this.alloption.splice(index,1);
      },
      addDeliverCard(index,data,option){
        if(!data){
          data = deepClone(formModel);
          data.deliverType = getDictValue('增值',this.dictDeliverType);
        }else {
          data = deepClone (data);
        }
        if(!option){
           option = deepClone(this.optionModule);
        }else {
          option = deepClone(option);
        }
        this.form.details.splice(index,0,data);
        this.alloption.splice(index,0,option);
        this.dealCust(data);
      },
      refreshClick(index){
         var data = []
         if(this.form.details[index].configName){
           data = this.form.details[index].configName.split(SPLIT_CHAR);
         }
         scriptName(data).then(res=>{
           this.alloption[index].functionModule = res;
         })

      },
      dealDirFunc(){
        var configName = {}
        return new Promise(resolve => {
          if(this.dirFunctionArr.length){
            var data = {productId:this.form.productId,functionNames:this.dirFunctionArr};
            this.dealCount++
            queryFunctList(data).then(res=>{
              var funcData = res;
              if(funcData && funcData.length){
                funcData.forEach((item,index)=>{
                   if(item.scripts.length){
                     var scrpitNames =  item.scripts.map((scriptItem)=>{
                       return scriptItem.scriptName;
                     }).join(SPLIT_CHAR);
                     configName[item.functionName] = scrpitNames;
                   }else {
                     configName[item.functionName] =  ''
                   }
                })
              }
              resolve(configName);
              this.dealCount--;
            })
          }
        });
      },
      dealDeliveryText(){
        this.dealCount++;
        var stratLength = this.form.details.length;
        var text = this.form.text;
        //去掉语句中的空格
        text = text.replace(/\ +/g, "");
        //去掉数字顿号
        text = text.replace(/[0-9]、/g,'');
        //换行分割
        var textArr = text.split('\n').filter(item=>item!='');
        textArr.forEach((item,index)=>{
            this.dealSentence(item,index)
        })
        var endLength = this.form.details.length;
        this.batchAddOption(endLength-stratLength);
        this.dealDirFunc().then(res=>{
           if(this.dirFunctionArr.length){
             console.log(JSON.stringify(res));
             this.form.details.forEach((item,index)=>{
                if(item.deliverType == 1 && res.hasOwnProperty(item.functionModule)){
                  item.configName = res[item.functionModule];
                }
             })
           }
          //对于增值非增值和授权同时存在进行复制授权补填配置项信息
          this.dealCount++
          this.checkOutDeliveryType(this.form.details.filter(item=>item.deliverType===getDictValue('非增值',this.dictDeliverType)&&item.configName)).then(res=>{
            this.dealNoAddValueScipts(res.arr,res.res);
            this.fillFunctionNo().then(res=>{
              this.accretionAddAuthor(res,this.form.details.filter(item=>item.deliverType == 4),this.form.details.filter(item=>item.deliverType != 0 && item.deliverType != 4))
              this.dealCount--;
            }).catch(e=>{
              this.dealCount--;
            })

          }).catch(e=>{
            this.dealCount--;
          });
        })

        this.dealCount--;
      },
      dealSentence(text,index){
        if(text){
          var  type = this.judgeDeliveryTextType(text);
          var module = this.judgeModuleType(text);
          if(type === DELIVER_NFC){
           this.dealDeliveryNFC(text,module)
          }else if(type === DELIVER_FC){
            this.dealDeliveryFC(text,module)
          }
        }
      },
      judgeDeliveryTextType(str){
        var type = DELIVER_NFC;
        if(str.indexOf('财富云')!==-1){
          type = DELIVER_FC;
        }
        return type;
      },
      judgeModuleType(str){
         var type = DELIVER_SOFTWARE;
         if(str.match(/授权/g)!==null){
           type =  DELIVER_AUTHOR;
           return  type
         }else  if (str.match(/数据字典[_|\/]/g)!==null){
           type =   DELIVER_DICT;
         }else  if (str.match(/接口[_|\/]/g)!==null){
           type =   DELIVER_INTERFACE;
         }else  if(str.match(/(手册|文档)[.|_|\/]/g)!==null){
           type =   DELIVER_BOOK;
         }else if(str.match(/报表[_|\/]/g)!==null){
           type = DELIVER_REPROT;
         }else if(str.match(/查询[_|\/]/g)!==null){
           type = DELIVER_QUERY;
         }else if(str.match(/流程[_|\/]/g)!==null){
           type = DELIVER_PROCESS;
         }else if(str.match(/功能[_|\/]/g)!==null || str.match(/脚本[_|\/]?/g)!==null){
           type =  DELIVER_FUNCTION;
         }
         //最后判断如果字符只有数字字母.-_()和等
        var st = str.split('/').filter(item=>item!='');
        if(st && st.length > 4 && st[4].match(/[^0-9a-zA-Z\.\-\_\&\(\)等]/)== null){
          type = DELIVER_SOFTWARE;
        }
         return  type;
      },
      dealDeliveryNFC(text,module){
        var textArr = text.split('/').filter(item=>item!='');
        //前四个为/客户类型/地区/客户名称/产品
        var detail =  deepClone(formModel);
        if(textArr.length > 4){
          var index = 4;
          detail.custType = getDictValue(textArr[0],this.dictCustType);
          detail.area = getDictValue(textArr[1],this.dictArea);
          detail.custName = textArr[2];
          this.dealProductId(detail,textArr[3]);
          if(module === DELIVER_AUTHOR){
            this.dealAuthoration(detail)
          }else if(module === DELIVER_SOFTWARE){
            this.dealSoftWare(detail,textArr.slice(index,textArr.length));
          }else {
            if(textArr[index].indexOf('售前测试')!==-1){
              //detail.issueGist = getDictValue('任务书授权测试',this.dictIssueGistAccretion);
              detail.deliverType = getDictValue('增值',this.dictDeliverType);
            }
            if(!textArr[index] || textArr[index].match(/^00/)){
               index++;
            }
            this.dealFunction(detail,module,textArr.slice(index,textArr.length),textArr[index]);
          }
          this.dealCust(detail);
        }
      },
      dealDeliveryFC(text,module){
        var textArr = text.split('/').filter(item=>item!='');
        var detail =  deepClone(formModel);
        detail.deliverType = getDictValue('财富云',this.dictDeliverType);
        detail.custType = getDictValue(textArr[0],this.dictCustType);
        var index = 0;
        this.dealProductId(detail,textArr[2]);
        var scriptFlag = textArr[1].match(/脚本/g)!==null;
        if(scriptFlag || module !== DELIVER_SOFTWARE){
          //普通脚本
          if(module === DELIVER_AUTHOR){
            //授权
            detail.custName = textArr[4];
            this.dealAuthoration(detail)
          }else {
            detail.issueGist = getDictValue('TS需求',this.dictIssueGistNoAccretion);
            if(!scriptFlag){
              //个性化脚本
              detail.custName = textArr[1];
              index = 3;
            }else {
              index = 4;
            }
            this.dealFunction(detail,module,textArr.slice(index,textArr.length),textArr[index]);
          }
        }else {
          //程序
          detail.custName = textArr[1];
          index = 3;
          this.dealSoftWare(detail,textArr.slice(index,textArr.length));
        }
        this.dealCust(detail);
      },
      dealProductId(detail,str){
        var reg_prodctId = /[(|（]售前测试[)|）]/g;
        if(str.match(reg_prodctId)!==null){
          detail.productId = getDictValue(str.replace(reg_prodctId,''),this.dictProductId);
          detail.issueGist = getDictValue('TS售前测试需求',this.dictIssueGistAccretion);
          detail.deliverType = '1'//增值
        }else {
          detail.productId = getDictValue(str,this.dictProductId);
        }
      },
      dealAuthoration(detail){
        detail.deliverType =  getDictValue('授权',this.dictDeliverType);
        detail.module =  getDictValue('功能',this.dictModule);
        detail.authorDateType =  getDictValue('三个月',this.dictAuthorDateType);
        detail.issueGist =  getDictValue('无合同项目执行特批',this.dictIssueGistAuthor);
        detail.issueDate =  parseTimeymd(new Date());
        this.form.details.splice(0,0,detail);
      },
      dealSoftWare(detail,arr){
         detail.deliverType = getDictValue('非主干版本',this.dictDeliverType);
         detail.issueGist = getDictValue('TS需求',this.dictIssueGistNoAccretion);
         arr.forEach((item,index)=>{
            if(index === 0){
              var start = item.indexOf('(') === -1?item.indexOf('（'):item.indexOf('(');
              var end =  item.indexOf(')') === -1?item.indexOf('）'):item.indexOf(')');
              var allStr = item.substring(start+1,end).split('_');
              var noTrunkVersion =  item.substring(0,start);
              //去掉客户编号
              detail.noTrunkVersion = noTrunkVersion.substring(0,find(noTrunkVersion,'-',3)).replace(/-/g,'.');
              var falg = false;
              allStr.forEach((item1,index1)=>{
                if(index1 ===0){
                  detail.issueDate = strDate(item1);
                }else if(index1 ===1){

                  if(item1.length>10 && item1.indexOf('&') === -1){
                    falg =true;
                    detail.noTrunkVersion += '('+item1+")";
                  }else {
                    detail.svnNo= item1;
                  }
                }else if(index1 ===2){
                  if(falg){
                    detail.svnNo= item1;
                  }else {
                    detail.trunkVersion = item1;
                  }
                }else if(index1 ===3){
                  if(falg){
                    detail.trunkVersion = item1;
                  }else {
                    detail.requireNo = item1
                  }
                }else if(index1 ===4 && falg){
                  detail.requireNo = item1
                }
              })
            }
            if(index === 1){
               if(item.indexOf('.')===-1){
                 item += '/'
               }
               detail.packageDetails = item;
            }
         })
        var exist = false;
        this.form.details.forEach((item,index)=>{
          if(item.deliverType === detail.deliverType
            && item.noTrunkVersion === detail.noTrunkVersion && item.trunkVersion=== detail.trunkVersion ){
            exist = true;
            item.packageDetails +=SPLIT_CHAR+detail.packageDetails;
          }
        })
        if(!exist){
          if(detail.requireNo.indexOf('&')!==-1){
            var reqNoArr = detail.requireNo.split('&');
            reqNoArr.forEach((item)=>{
              var mutilNo = deepClone(detail);
              mutilNo.requireNo = item.replace(/等/g,'');
              this.form.details.push(mutilNo);
            })
          }else {
            this.form.details.push(detail);
          }
        }

      },
      dealFunction(detail,moduleType,arr,tStr){
        if(detail.deliverType ===''){
          var specialCharCount = coutChar(tStr,'_')+coutChar(tStr,'-');
          if(specialCharCount >= 3 && coutChar(tStr,'.sql') ===0&&tStr.match(/^功能_/)!==null){
            detail.deliverType = getDictValue('增值',this.dictDeliverType);
            //detail.issueGist = getDictValue('任务书',this.dictIssueGistAccretion);
            detail.issueGist = '';
          }else {
            detail.deliverType =getDictValue('非增值',this.dictDeliverType);
            detail.issueGist = getDictValue('TS需求',this.dictIssueGistNoAccretion);
          }
         }
        var isDir = false; //是否是目录
         var productIdName = getDictCaption(detail.productId,this.dictProductId);
         for(var i = 0;i < arr.length;i++) {
           var str = trim(arr[i]);
           if (i === 0) {
             detail.moduleType = getDictValue(moduleType, this.dictModuleType)
             if (str.indexOf('手册') !== -1 && arr.length < 6) {
               detail.issueDate = str.substring(0, find(str, '_', 1));
               detail.configName = str.substring(find(str, '_', 1) + 1, str.length);
             } else {
               //第一个_为截止的字符串
               var subindex = 1;
               var issueDate =str.substring(0, find(str, '_', 1));
               var count = coutChar(str,'_');
               while (true){
                 if(!issueDate || issueDate.length === 8 || subindex>count){
                   break;
                 }
                 subindex++;
                 issueDate = str.substring(find(str, '_', subindex-1)+1, find(str, '_', subindex));
               }
               detail.issueDate = issueDate;
               var SqlName = str.substring(find(str, '_', subindex) + 1, str.length);
               if (SqlName.indexOf(".sql") === -1 && SqlName.indexOf(".pdf") === -1 && SqlName.indexOf(".xlsx") === -1 && SqlName.indexOf(".execl") === -1
                && SqlName.indexOf(".xls") === -1) {
                 if(moduleType!==DELIVER_REPROT && productIdName !== 'AOP'){
                   SqlName += ".sql";
                   if(arr.length  === 1){
                     isDir = true;
                   }
                 }else {
                   SqlName += '/'
                 }
               }
               if (detail.deliverType === '1') {
                 //全局去掉mysql oracle_和.sql
                 var funcName = SqlName.replace(new RegExp("_mysql|_oracle|.sql|","g"), '');
                 //去掉第一个开通
                 funcName = funcName.replace(/开通/, '');
                 //获取符合条件的最长最字符串
                 var matchs = funcName.match(new RegExp(productIdName+"(\\.[0-9])?[-_]?"));
                 //只取最大的字符串
                 if(matchs && matchs.length){
                   matchs.sort((a,b)=>{
                     var orderA = 0;
                     if(a){
                       orderA = a.length;
                     }
                     var orderB = 0;
                     if(b){
                       orderB = b.length;
                     }
                     return orderB-orderA;
                   });
                   //最大字符串的前面都舍弃
                   funcName = funcName.substring(funcName.indexOf(matchs[0])+matchs[0].length,funcName.length);
                 }
                 detail.functionModule = funcName
                 detail.configName += SqlName
               } else {
                 detail.configName += SqlName;
               }
             }
           }
           if(i === 1){
              detail.configName = str;
           }
         }
        //循环查找是否有这个功能
        var flag = false;
        this.form.details.forEach((item,index)=>{
          if((item.deliverType === detail.deliverType)&&(item.issueGist === detail.issueGist)&&
            (((item.deliverType==='1') && (item.functionModule === detail.functionModule))||
              ((item.deliverType==='2'|| item.deliverType === '3') && (item.moduleType ===detail.moduleType) ))){
            if(!isDir){
              item.configName +=SPLIT_CHAR+detail.configName;
            }
            flag = true;
          }
        })
        if(!flag){
          this.form.details.push(detail);
          if(isDir){
            this.dirFunctionArr.push(detail.functionModule)
          }
        }
      },
      custRemoteMethod(custName){
        if (!this.form.custType){
          this.$message.warning("请先选择行业!");
          this.custOption = [];
        }else  if (this.form.custType!==getDictValue('财富云',this.dictCustType)&&!this.form.area){
          this.$message.warning("请先选择地区!");
          this.custOption = [];
        } else{
          this.custLoading = true;
          queryCustName(this.form.custType,this.form.area,custName).then(res=>{
            this.custOption  = res.option;
            this.custLoading = res.loading;
          });

        }
      },
      checkOutDeliveryType(arr){
        var result = {arr:arr,res:[]}
        return new Promise((resolve,reject)=>{
          if(!arr || !arr.length ){
            resolve(result);
          }
          //校验当中如果维护的脚本的是否都是非增值 如果不是则需要改成增值
          //如果改变类型的时候如果是增值改成非增值增加提示
          //提取出脚本信息
          var scripts = []
          arr.forEach((item,index)=>{
            if(item.configName){
              scripts =  scripts.concat(item.configName.split(SPLIT_CHAR));
            }
          })
          quryScriptHaveFunc(scripts).then((res)=>{
              result.res = res;
              resolve(result);
          }).catch(e=>{
              reject(result);
          })
        })
      },
      dealNoAddValueScipts(nArr,arr){
        if(arr && arr.length){
          //处理数据
          var scriptsFunc = {}
          arr.forEach((item,index)=>{
            if(item.functions && item.functions.length){
              scriptsFunc[item.scriptName] = item.functions;
            }

          })
          nArr.forEach((item,index)=>{
            var itemArr = item.configName.split(SPLIT_CHAR);
            var func = [];
            var nofunc = [];
            itemArr.forEach((item1)=>{
              //检测是否有功能脚本 有则判断为增值  没有则判断为非增值
              if(scriptsFunc.hasOwnProperty(item1)){
                func.push(item1);
              }else {
                nofunc.push(item1);
              }
            })
            //判断是否有 没有功能的脚本则保留为非增值
            if(nofunc.length){
              //1.修改原配置项为当前非增值
              item.configName = nofunc.join(SPLIT_CHAR);
            }else {
              item.configName = '';
            }
            //剩下的进行新增
            if(func.length){
              //对增值分组
              var deliverFunc = {};
              func.forEach((item1)=>{
                //脚本第一个功能
                var functionName = scriptsFunc[item1][0].functionName;
                if(!deliverFunc.hasOwnProperty(functionName)){
                  deliverFunc[functionName]  = []
                }
                deliverFunc[functionName].push(item1);
              })
              //根据功能新增交付物明细
              for(var key in deliverFunc){
                var detail = deepClone(formModel);
                detail.functionModule = key ;
                detail.deliverType = getDictValue('增值',this.dictDeliverType);
                detail.configName  = deliverFunc[key].join(SPLIT_CHAR)
                this.form.details.push(detail);
                this.addOption(1);
              }
            }
          })
          //最后删除configname 为空的交付明细
          this.form.details.forEach((item,index)=>{
            if((item.deliverType == 2 || item.deliverType == 3) && (!item.configName || !item.configName.length)){
              this.delDeliverCard(index);
            }
          })
        }
      },
      changeDeliverType(index){
         //清空发放依据
         this.alloption[index].addValueFlag = false;
         var deliverType =  this.form.details[index].deliverType
         var item = this.form.details[index];
         if(deliverType == 0 || deliverType == 2 || deliverType== 3){//版本非增值财富云
           var addValueIssueGistLabel = getDictCaption(this.form.issueGist,this.dictIssueGistAccretion);
           var noAddValueIssueGistValue = getDictValue(addValueIssueGistLabel,this.dictIssueGistNoAccretion);
           if(noAddValueIssueGistValue!==addValueIssueGistLabel) {
             item.issueGist = noAddValueIssueGistValue;
           }else {
             item.issueGist = getDictValue('任务书',this.dictIssueGistNoAccretion);
           }
           item.approver = this.form.approver;
         }else if (deliverType == 1){//增值
           this.form.details[index].issueGist = '';
         }
      },
      issueGistPublicChange(){
         var addValueIssueGistLabel = getDictCaption(this.form.publicItem.deliverType1.issueGist,this.dictIssueGistAccretion);
         var noAddValueIssueGistValue = getDictValue(addValueIssueGistLabel,this.dictIssueGistNoAccretion);
         this.form.details.forEach((item)=>{
           if (item.deliverType == 0 || item.deliverType == 2 || item.deliverType == 3) {
              if(noAddValueIssueGistValue!==addValueIssueGistLabel) {
                item.issueGist = noAddValueIssueGistValue;
              }else {
                item.issueGist = getDictValue('任务书',this.dictIssueGistNoAccretion);
              }
           }
         })
         noAddValueIssueGistValue = getDictValue(addValueIssueGistLabel,this.dictIssueGistAuthor);
         if(noAddValueIssueGistValue!==addValueIssueGistLabel){
           this.form.publicItem.deliverType4.issueGist = noAddValueIssueGistValue
         }else {
           this.form.publicItem.deliverType4.issueGist = getDictValue('无合同项目执行特批',this.dictIssueGistAuthor);
         }
      },
      projectNoPublicChange(projectNo){
         this.form.publicItem.deliverType4.projectNo = projectNo
      },
      approverChange(){
        this.form.details.forEach((item)=>{
          if (item.deliverType == 0 || item.deliverType == 2 || item.deliverType == 3) {
             item.approver = this.form.publicItem.deliverType1.approver;
          }
        });
        this.form.publicItem.deliverType4.approver = this.form.publicItem.deliverType1.approver;
      },
      resetQuery(){
        this.$refs['queryForm'].resetFields();
      },
      beforeInit() {
        this.url = 'api/delivery'
        const sort = 'deliverId,desc'
        this.params = { page: this.page, size: this.size, sort: sort }
        Object.assign(this.params,this.queryform);
        return true
      },
      authorCancel(){
        this.resetQuery();
        this.authordialog = false;
      },
      copyOldAuthor(index){
         this.queryform.deliverType = getDictValue('授权',this.dictDeliverType);
         this.queryform.custType = this.form.custType;
         this.queryform.area = this.form.area;
         this.queryform.productId = this.form.productId;
         this.queryform.custName = this.form.custName;
         this.queryform.taCode   = this.form.publicItem.deliverType4.taCode;
         this.init();
         this.copyAuthorIndex = index
         this.authordialog = true;
      },
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      authorSubmit(){
        if(this.multipleSelection && this.multipleSelection.length){
          this.multipleSelection.forEach((item)=>{
            var taCode  = this.form.publicItem.deliverType4.taCode;
            if(!taCode  || taCode.length){
              this.form.publicItem.deliverType4.taCode = item.taCode;
            }
            this.addDeliverCard(this.copyAuthorIndex,item);
          })
          this.delDeliverCard(this.copyAuthorIndex+this.multipleSelection.length);
          this.authorCancel();
        }else {
          this.$message.error("请选择至少一条授权信息!")
        }
      },
      accretionAddAuthor(functionNoList,authorArr,accretionArr){
        //找出所有增值未在授权中的脚本
        var accretionScript = [];
        if( accretionArr && accretionArr.length){
          var addflag = false;
          accretionArr.forEach((item,index)=>{
            if(item.configName && item.configName.length){
              var scripts = item.configName.split(SPLIT_CHAR).filter(
                item1=>item1!='' &&
                  item1.indexOf('.sql')!=-1 &&(
                    authorArr && authorArr.length &&
                    authorArr.filter(item2=>item2.configName == item1 ).length == 0 ));//如果已经在授权脚本信息汇总的排除
              if(scripts && scripts.length){
                scripts.forEach((item3)=>{
                  if(functionNoList[item3]){
                    addflag = true;
                    var detail    =   deepClone(formModel);
                    detail.configName = item3;
                    detail.functionNo = functionNoList[item3].functionNo
                    this.dealAuthoration(detail);
                    this.addOption(1)
                  }
                })
              }
            }
          })
          if(addflag){
            //排除所有配置项为空的授权
            this.form.details.forEach((item,index)=>{
              if( item.deliverType == 4 && ( !item.configName ||  !item.configName.length )){
                this.delDeliverCard(index)
              }
            })
          }
        }
      },
      fillFunctionNo(authorArr,accretionArr){
        var result = []
        return new Promise((resolve,reject)=>{
          getFunctionNo({productId: this.form.productId,controled:'1'}).then(data=>{
            result = data
            resolve(result)
          }).catch(e=>{
            console.log(e);
            reject(result)
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>
