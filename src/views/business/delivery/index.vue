<template>
  <div class="app-container">
    <!--工具栏-->
    <el-collapse>
      <el-collapse-item v-if="dict.deliver_type" :title="getDictCaption(activeName,dict.deliver_type)+'搜索查询'" name="1">
        <div class="head-container" v-if="activeName==0">
          <!-- TA4非主干版本搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="交付任务号"  prop="deliverId">
                  <el-input v-model="form.deliverId" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.product_id"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户类型"  prop="custType">
                  <el-select v-model="form.custType" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.cust_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地区"  prop="area">
                  <el-select v-model="form.area" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.area"
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
                  <el-input v-model="form.custName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="非主干版本"  prop="noTrunkVersion">
                  <el-input v-model="form.noTrunkVersion" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="对应主干版本"  prop="trunkVersion">
                  <el-input v-model="form.trunkVersion" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.issue_gist_no_accretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="任务号/修改单号"  prop="taskNo">
                  <el-input v-model="form.taskNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="SVN日志号"  prop="svnNo">
                  <el-input v-model="form.svnNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求编号"  prop="requireNo">
                  <el-input v-model="form.requireNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求类型"  prop="requireType">
                  <el-select v-model="form.requireType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.require_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发放日期"  prop="issueDate">
                  <el-input v-model="form.issueDate" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放人"  prop="issuePerson">
                  <el-input v-model="form.issuePerson" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否生效"  prop="used">
                  <el-select v-model="form.used" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.yes_no"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                  <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="head-container" v-if="activeName==1">
          <!-- TA4增值搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="交付任务号"  prop="deliverId">
                  <el-input v-model="form.deliverId" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.product_id"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户类型"  prop="custType">
                  <el-select v-model="form.custType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.cust_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地区"  prop="area">
                  <el-select v-model="form.area" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.area"
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
                  <el-input v-model="form.custName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="功能模块"  prop="functionModule">
                  <el-input v-model="form.functionModule" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="配置项名称"  prop="configName">
                  <el-input v-model="form.configName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目编号"  prop="projectNo">
                  <el-input v-model="form.projectNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.issue_gist_accretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放日期"  prop="issueDate">
                  <el-input v-model="form.issueDate" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放人"  prop="issuePerson">
                  <el-input v-model="form.issuePerson" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                  <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="是否生效"  prop="used">
                  <el-select v-model="form.used" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.yes_no"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="head-container" v-if="activeName==2 || activeName==3">
          <!--  TA4非增值搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="交付任务号"  prop="deliverId">
                  <el-input v-model="form.deliverId" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.product_id"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户类型"  prop="custType">
                  <el-select v-model="form.custType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.cust_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地区"  prop="area">
                  <el-select v-model="form.area" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.area"
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
                  <el-input v-model="form.custName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模块"  prop="moduleType">
                  <el-select v-model="form.moduleType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.module_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="配置项名称"  prop="configName">
                  <el-input v-model="form.configName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.issue_gist_no_accretion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发放日期"  prop="issueDate">
                  <el-input v-model="form.issueDate" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放人"  prop="issuePerson">
                  <el-input v-model="form.issuePerson" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否生效"  prop="used">
                  <el-select v-model="form.used" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.yes_no"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
               <el-form-item>
                 <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                 <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
               </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="head-container" v-if="activeName==4">
          <!-- 搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="交付任务号"  prop="deliverId">
                  <el-input v-model="form.deliverId" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.product_id"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户类型"  prop="custType">
                  <el-select v-model="form.custType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.cust_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地区"  prop="area">
                  <el-select v-model="form.area" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.area"
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
                  <el-input v-model="form.custName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="TA代码"  prop="taCode">
                  <el-input v-model="form.taCode" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模块"  prop="module">
                  <el-select v-model="form.module" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.module"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="功能编号"  prop="functionNo">
                  <el-input v-model="form.functionNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="配置项名称"  prop="configName">
                  <el-input v-model="form.configName" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权期限"  prop="authorDateType">
                  <el-select v-model="form.authorDateType" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.author_date_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放依据"  prop="issueGist">
                  <el-select v-model="form.issueGist" filterable  placeholder="请选择"  style="width: 150px;">
                    <el-option
                      v-for="item in  dict.issue_gist_author"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目编号"  prop="projectNo">
                  <el-input v-model="form.projectNo" style="width: 150px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发放日期"  prop="issueDate">
                  <el-input v-model="form.issueDate" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放人"  prop="issuePerson">
                  <el-input v-model="form.issuePerson" style="width: 150px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否生效"  prop="used">
                  <el-select v-model="form.used" filterable  placeholder="请选择" style="width: 150px;">
                    <el-option
                      v-for="item in  dict.yes_no"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                  <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item v-if="checkPermission(['admin', 'delivery:add','delivery:edit','delivery:del','delivery:export','delivery:import'])" title="交付操作" name="2">
        <div class="head-container">
          <!-- 新增 -->
          <el-button
            v-permission="['admin','delivery:add']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="batchAdd">批量复制交付</el-button>
          <el-button
            v-if="multipleSelection.length === 1"
            v-permission="['admin','delivery:edit']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="edit(multipleSelection[0])">修改</el-button>
          <el-popover
            v-if="multipleSelection.length !== 1"
            v-permission="['admin','delivery:edit']"
            :ref="multipleSelection"
            placement="top"
            width="180">
            <p v-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
          </el-popover>
          <el-popover
            v-permission="['admin','delivery:del']"
            ref="delpopver"
            placement="top"
            width="200">
            <p v-if="multipleSelection.length > 0">确定删除{{multipleSelection.length}}条数据吗？</p>
            <div style="text-align: right; margin: 0" v-if="multipleSelection.length >0">
              <el-button size="mini" type="text" @click="$refs['delpopver'].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(multipleSelection)">确定</el-button>
            </div>
            <el-button slot="reference"  style="margin-left: 20px" size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
          </el-popover>
          <!-- 导出 -->
          <el-dropdown
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            style="margin-left: 20px;margin-bottom: 4px"
            v-permission="['admin','delivery:export']"
            @command="download">
            <el-button type="primary" size="mini">
              导出EXECL<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="导出全部">导出全部</el-dropdown-item>
              <el-dropdown-item command="导出选择">导出选择</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--导入-->
          <el-button
            v-permission="['admin','delivery:import']"
            class="filter-item"
            type="primary"
            size="mini"
            style="margin-left: 20px;margin-bottom: 4px"
            icon="el-icon-upload"
            @click="upload">导入EXECL
          </el-button>
          <el-dropdown
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            style="margin-left: 20px;margin-bottom: 4px"
            v-permission="['admin','delivery:add']"
            @command="banOrUseDelivery">
            <el-button type="primary" size="mini">
              废弃启用<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="废弃">废弃</el-dropdown-item>
              <el-dropdown-item command="启用">启用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-setting"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="()=>{configDialog = true}"
          >功能编号清单</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--表单组件-->
    <addForm ref="addForm"
              :dictDeliverType="dict.deliver_type"
              :dictCustType="dict.cust_type"
              :dictArea="dict.area"
              :dictIssueSource="dict.issue_source"
              :dictRequireType="dict.require_type"
              :dictIssueGistAccretion="dict.issue_gist_accretion"
              :dictIssueGistNoAccretion="dict.issue_gist_no_accretion"
              :dictIssueGistAuthor="dict.issue_gist_author"
              :dictAuthorDateType="dict.author_date_type"
              :dictModuleType="dict.module_type"
              :dict-product-id="dict.product_id"
              :dict-delivery-approver="dict.delivery_approver"
              :dictModule="dict.module"  />
    <editForm ref="editForm" :operate="operate"
           :dictDeliverType="dict.deliver_type"
           :dictCustType="dict.cust_type"
           :dictArea="dict.area"
           :dictIssueSource="dict.issue_source"
           :dictRequireType="dict.require_type"
           :dictIssueGistAccretion="dict.issue_gist_accretion"
           :dictIssueGistNoAccretion="dict.issue_gist_no_accretion"
           :dictIssueGistAuthor="dict.issue_gist_author"
           :dictAuthorDateType="dict.author_date_type"
           :dictModuleType="dict.module_type"
           :dict-product-id="dict.product_id"
           :dict-delivery-approver="dict.delivery_approver"
           :dictModule="dict.module"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <el-tabs type="border-card" v-model="activeName"  @tab-click="tabHandleClick">
      <el-tab-pane v-if="dict.deliver_type"  v-for="item in dict.deliver_type" :key="item.value">
        <span slot="label"><i>{{item.label}}</i></span>
        <!--表格渲染-->
        <el-table v-if="activeName ==0" v-loading="loading" :data="data" size="small" border style="width: 100%"
                  @selection-change="handleSelectionChange"
                  :max-height="clientHeight"
                  @row-dblclick="rowDoubleClick">
          <af-table-column
            type="selection"
            width="35">
          </af-table-column>
          <af-table-column prop="deliverId" label="交付ID">
            <template slot-scope="scope">
              <div>{{replaceFrontNZero(scope.row.deliverId)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="productId"  label="产品名称">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custType" label="客户类型">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="area" label="地区" >
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
            </template>
          </af-table-column>
          <el-table-column prop="custName" label="客户名称" :show-overflow-tooltip="true" width="100px"/>
          <af-table-column prop="noTrunkVersion" label="非主干版本":show-overflow-tooltip="true" width="200px"/>
          <af-table-column prop="trunkVersion" label="对应主干版本":show-overflow-tooltip="true" width="200px"/>
          <af-table-column prop="packageDetails" label="程序包明细"/>
          <af-table-column prop="taskNo" label="任务号/修改单号"/>
          <af-table-column prop="svnNo" label="SVN日志号"/>
          <af-table-column prop="requireNo" label="需求编号"/>
          <af-table-column prop="issueGist" label="发放依据">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_no_accretion)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="issueDate" label="发放日期"/>
          <af-table-column prop="issuePerson" label="发放人"/>
          <af-table-column prop="approver" label="审批人">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="memo" label="备注"/>
        </el-table>
        <el-table v-if="activeName ==1" v-loading="loading" :data="data" size="small" border style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="rowDoubleClick"
                  :max-height="clientHeight">
          <af-table-column
            type="selection"
            width="35">
          </af-table-column>
          <af-table-column prop="deliverId" label="交付ID">
            <template slot-scope="scope">
              <div>{{replaceFrontNZero(scope.row.deliverId)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="productId"  label="产品名称">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custType" label="客户类型">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="area" label="地区" :show-overflow-tooltip="true" width="45px">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custName" label="客户名称"/>
          <af-table-column prop="functionModule" label="功能模块"/>
          <af-table-column prop="configName" label="配置项名称">
          </af-table-column>
          <af-table-column prop="functionMode" label="功能模式"/>
          <af-table-column prop="projectNo" label="项目编号"/>
          <af-table-column prop="issueGist" label="发放依据">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_accretion)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="issueDate" label="发放日期"/>
          <af-table-column prop="issuePerson" label="发放人"/>
          <af-table-column prop="approver" label="审批人">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="memo" label="备注"/>
        </el-table>
        <el-table v-if="activeName ==2 || activeName==3" v-loading="loading" :data="data" border size="small" style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="rowDoubleClick"
                  :max-height="clientHeight">
          <af-table-column
            type="selection"
            width="35">
          </af-table-column>
          <af-table-column prop="deliverId" label="交付ID">
            <template slot-scope="scope">
              <div>{{replaceFrontNZero(scope.row.deliverId)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="productId"  label="产品名称">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custType" label="客户类型">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="area" label="地区">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custName" label="客户名称"/>
          <af-table-column prop="moduleType" label="模块">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.moduleType,dict.module_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="configName" label="配置项名称">
          </af-table-column>
          <af-table-column prop="issueGist" label="发放依据">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_no_accretion)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="issueDate" label="发放日期"/>
          <af-table-column prop="issuePerson" label="发放人"/>
          <af-table-column prop="approver" label="审批人">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="memo" label="备注"/>
        </el-table>
        <el-table v-if="activeName ==4" v-loading="loading" :data="data" size="small" border style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="rowDoubleClick"
                  :max-height="clientHeight">
          <af-table-column
            type="selection"
            width="35">
          </af-table-column>
          <af-table-column prop="deliverId" label="交付ID">
            <template slot-scope="scope">
              <div>{{replaceFrontNZero(scope.row.deliverId)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="productId"  label="产品名称">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custType" label="客户类型">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="area" label="地区">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="custName" label="客户名称"/>
          <af-table-column prop="taCode" label="TA代码"/>
          <af-table-column prop="module" label="模块">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.module,dict.module)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="functionNo" label="功能编号"/>
          <af-table-column prop="configName" label="配置项名称"/>
          <af-table-column prop="authorDateType" label="授权期限">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.authorDateType,dict.author_date_type)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="issueGist" label="发放依据">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_author)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="projectNo" label="项目编号"/>
          <af-table-column prop="issueDate" label="发放日期"/>
          <af-table-column prop="issuePerson" label="发放人"/>
          <af-table-column prop="approver" label="审批人">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
            </template>
          </af-table-column>
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
      </el-tab-pane>
    </el-tabs>
    <right-menu ref="rightMenu" :menu="menu"/>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="()=>{configDialog = false}" :visible.sync="configDialog"  title="功能编号清单" width="80%">
      <fun-id-list></fun-id-list>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del ,downloadDelivery, batchUpdate} from '@/api/delivery'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption, strDate, replaceFrontNZero } from '@/utils/index'
import rightMenu from '@/views/business/rightmenu/index'
import eForm from './form'
import addForm from './addform'
import editForm from './editform'
import funIdList from '../funidlist/index'
import store from '@/store'
export default {
  components: { eForm, editForm, addForm,  uploadForm, rightMenu, funIdList },
  mixins: [initData],
  dicts:['deliver_type','cust_type','area','issue_source','require_type','issue_gist_accretion','issue_gist_no_accretion','module_type','module','author_date_type','issue_gist_author','product_id','delivery_approver','yes_no'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/delivery',
      form: {
        id: '',
        deliverId:'',
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
        issueDate: '',
        issuePerson: '',
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
        used:'1'
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        },
      ],
      tabDatas:{},
      activeName:0,
      multipleSelection:[],
      operate:'',
      configDialog:false
    }
  },
  watch:{
    activeName(activeName){
      this.$nextTick(()=>{
        //修改查询条件,只获取配置字段其余清空
        var tempForm = deepClone(this.form);
        this.clearForm();
        this.form.deliverType = String(activeName);
        if(this.$refs['queryForm'].fields){
          this.$refs['queryForm'].fields.forEach((item,index)=>{
            this.form[item.prop] = tempForm[item.prop];
          })
        }
        this.toQuery();
      })
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight -200;
    this.$nextTick(() => {
      this.form.deliverType = String(this.activeName);
      this.init();
    })
  },
  methods: {
    replaceFrontNZero,
    checkPermission,
    getDictCaption,
    beforeInit() {
      this.url = 'api/delivery'
      const sort = 'deliverId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(this.multipleSelection.map(item=>{return item.id})).then(res => {
        this.delLoading = false
        this.$refs['delpopver'].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs['delpopver'].doClose()
      })
    },
    batchAdd() {
      const  _this = this.$refs.addForm;
      _this.dialog = true;

    },
    cloneDelivery(data){
      const _this = this.$refs.form
      _this.form =deepClone(data);
      _this.form.deliveryDetails =[];
      _this.form.deliveryDetails.push({
        ...data,
        configName:data.configName.split(',')
      });
      _this.batchAddDeliverOption(_this.form.deliveryDetails.length);
      _this.form.acitveName='0'
    },
    edit(data) {
      this.operate = '修改'
      const _this = this.$refs.editForm
      _this.form = deepClone(data);
      _this.form = {
         ..._this.form,
        issueDate:strDate(data.issueDate)
      };
      _this.dialog = true
    },
    rowDoubleClick(row){
      const _this = this.$refs.editForm
      _this.form = deepClone(row);
      _this.form = {
        ..._this.form,
        issueDate:strDate(row.issueDate)
      };
      this.operate = '详情';
      _this.dialog = true
    },
    // 导出
    download(command) {
      var data = [];
      if(command ==='导出选择'){
        if(!this.multipleSelection.length){
          this.$message({
            message: '请选择要导出的数据',
            type: 'warning'
          });
          return;
        }
        data = this.multipleSelection ;
      }
      this.openFullScreen('导出','交付信息列表');
      downloadDelivery(data).then(result => {
        downloadFile(result, '交付信息列表', 'xlsx')
        this.loadingInstance.close();
      }).catch(() => {
          this.loadingInstance.close();
        })
    },
    upload(){
      this.$refs.upform.dialog=true;
    },
    clearForm(){
      this.form = {
        id: '',
        deliverId:'',
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
        issueDate: '',
        issuePerson: '',
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
        used:'1'
      };
    },
    resetQuery(){
      this.$refs['queryForm'].resetFields();
      this.clearForm();
    },
    rowContextMenu(row){
      this.rightClickRow = row;
    },
    copyClick(){
      const  _this = this.$refs.form;
      _this.form = deepClone(this.rightClickRow);
      this.operate = '新增'
      _this.dialog = true
    },
    tabHandleClick(tab,event){

    },
    replaceDouChar(config){
      var  arr = config;
      // if(arr&&arr.length){
      //      arr = config.replace(/$/g,'\n');
      // }
      return arr;
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    banOrUseDelivery(command){
      if(this.multipleSelection && this.multipleSelection.length){
        var used = '1';
        if(command == '废弃'){
          used = '0';
        }
        var arr = this.multipleSelection.filter(item=>item.used == used);
        if(arr && arr.length){
           this.$message.warning("不能重复"+command);
           return
        }
        this.$confirm('此操作将'+command+'这些交付物, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = deepClone(this.multipleSelection);
          data.forEach((item)=>{
            item.used = used;
          })
          batchUpdate(data).then((res)=>{
            this.$notify({
              title: command+'成功',
              type: 'success',
              duration: 2500
            })
            this.init()
          }).catch((e)=>{
            this.$notify({
              title: command+'失败',
              type: 'error',
              duration: 2500
            })
          })
        })
      }else {
        this.$message.warning("请至少选择一条数据")
      }
    }
  }
}
const  SPLIT_CHAR = "$";
</script>

<style>
  .el-table .cell {
    white-space: pre-line;
  }
</style>
