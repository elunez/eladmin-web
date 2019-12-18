<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="行业" prop="custType" >
              <el-select v-model="form.custType" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.cust_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区" prop="area">
              <el-select v-model="form.area" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.area"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="custName">
              <el-input v-model="form.custName" style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="产品" prop="productId">
              <el-select v-model="form.productId" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.bis_product_id"
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
                  v-for="item in dict.project_type"
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
                  v-for="item in dict.project_class"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="竞争对手" prop="competitor">
              <el-select v-model="form.competitor" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.competitor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成功率" prop="successRate">
              <el-select v-model="form.successRate" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.success_rate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所处阶段" prop="stage">
              <el-select v-model="form.stage" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.stage"
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
                  v-for="item in dict.follow_person"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售" prop="salePerson">
              <el-input v-model="form.salePerson" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item >
              <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
              <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
     </div>
     <div class="head-container">
        <!-- 新增 -->
         <el-button
                v-permission="['admin','businessInfo:add']"
                class="filter-item"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                style="margin-left: 20px"
                @click="add">新增</el-button>
        <!-- 导出 -->
         <el-dropdown
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 style="margin-left: 20px"
                 v-permission="['admin','businessInfo:export']"
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
                  v-permission="['admin','businessInfo:import']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  icon="el-icon-upload"
                  @click="upload">导入EXECL
          </el-button>
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictCustType="dict.cust_type"   :dictArea="dict.area"   :dictBisProductId="dict.bis_product_id"   :dictProjectType="dict.project_type"   :dictProjectClass="dict.project_class"   :dictCompetitor="dict.competitor"   :dictSuccessRate="dict.success_rate"   :dictStage="dict.stage"   :dictFollowPerson="dict.follow_person"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick"
              @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','businessInfo:add']))" @row-contextmenu="rowContextMenu">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="custType" label="行业">
        <template slot-scope="scope">
          <div v-if=" scope.row.custType in dict.cust_type">{{dict.cust_type[scope.row.custType].label}}</div>
          <div v-else-if=" !scope.row.custType in dict.cust_type">{{scope.row.custType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="地区">
        <template slot-scope="scope">
          <div v-if=" scope.row.area in dict.area">{{dict.area[scope.row.area].label}}</div>
          <div v-else-if=" !scope.row.area in dict.area">{{scope.row.area}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="custName" label="客户名称"/>
      <el-table-column prop="productId" label="产品">
        <template slot-scope="scope">
          <div v-if=" scope.row.productId in dict.bis_product_id">{{dict.bis_product_id[scope.row.productId].label}}</div>
          <div v-else-if=" !scope.row.productId in dict.bis_product_id">{{scope.row.productId}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="productDescription" label="项目描述"/>
      <el-table-column prop="projectType" label="项目类型">
        <template slot-scope="scope">
          <div v-if=" scope.row.projectType in dict.project_type">{{dict.project_type[scope.row.projectType].label}}</div>
          <div v-else-if=" !scope.row.projectType in dict.project_type">{{scope.row.projectType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="projectClass" label="项目类别">
        <template slot-scope="scope">
          <div v-if=" scope.row.projectClass in dict.project_class">{{dict.project_class[scope.row.projectClass].label}}</div>
          <div v-else-if=" !scope.row.projectClass in dict.project_class">{{scope.row.projectClass}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="competitor" label="竞争对手">
        <template slot-scope="scope">
          <div>{{stringSplitHaveDict(scope.row.competitor,dict.competitor)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="contractBalance" label="预计合同金额(万元)"/>
      <el-table-column prop="confirmBalance" label="成交金额(万元)"/>
      <el-table-column prop="successRate" label="成功率">
        <template slot-scope="scope">
          <div v-if=" scope.row.successRate in dict.success_rate">{{dict.success_rate[scope.row.successRate].label}}</div>
          <div v-else-if=" !scope.row.successRate in dict.success_rate">{{scope.row.successRate}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="contractTime" label="预计合同签订日期"/>
      <el-table-column prop="stage" label="所处阶段">
        <template slot-scope="scope">
          <div v-if=" scope.row.stage in dict.stage">{{dict.stage[scope.row.stage].label}}</div>
          <div v-else-if=" !scope.row.stage in dict.stage">{{scope.row.stage}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="followPerson" label="跟进人员">
        <template slot-scope="scope">
          <div v-if=" scope.row.followPerson in dict.follow_person">{{dict.follow_person[scope.row.followPerson].label}}</div>
          <div v-else-if=" !scope.row.followPerson in dict.follow_person">{{scope.row.followPerson}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTimeYMD(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salePerson" label="销售"/>
      <el-table-column prop="estimatedTime" label="签单时间" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTimeYMD(scope.row.estimatedTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractFillDate" label="合同归档日期" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTimeYMD(scope.row.contractFillDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="问题反馈及备注"/>
      <el-table-column v-if="checkPermission(['admin','businessInfo:edit','businessInfo:del'])" label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','businessInfo:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','businessInfo:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <right-menu ref="rightMenu" @copyClick="copyClick"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadBusinessInfo } from '@/api/businessInfo'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, parseTimeYMD, stringSplitHaveDict } from '@/utils/index'
import rightMenu from '../rightmenu/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['cust_type','area','bis_product_id','project_type','project_class','competitor','success_rate','stage','follow_person'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/businessInfo/upload',
      multipleSelection:[],
      form: {
        id: '',
        custType: '',
        area: '',
        custName: '',
        productId: '',
        productDescription: '',
        projectType: '',
        projectClass: '',
        competitor: '',
        contractBalance: '',
        confirmBalance: '',
        successRate: '',
        stage: '',
        followPerson: '',
        salePerson: '',
        memo: ''
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    stringSplitHaveDict,
    parseTimeYMD,
    beforeInit() {
      this.url = 'api/businessInfo'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.operate = '新增';
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.operate = '修改'
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        custType: data.custType,
        area: data.area,
        custName: data.custName,
        productId: data.productId,
        productDescription: data.productDescription,
        projectType: data.projectType,
        projectClass: data.projectClass,
        competitor: data.competitor,
        contractBalance: data.contractBalance,
        confirmBalance: data.confirmBalance,
        successRate: data.successRate,
        contractTime: data.contractTime,
        stage: data.stage,
        followPerson: data.followPerson,
        updateTime: data.updateTime,
        salePerson: data.salePerson,
        estimatedTime: data.estimatedTime,
        contractFillDate: data.contractFillDate,
        memo: data.memo
      }
      _this.dialog = true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    rowDoubleClick(row){
      const _this = this.$refs.form;
      _this.dealForm(row);
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
      this.openFullScreen('TA商机信息列表');
      downloadBusinessInfo(data).then(result => {
        downloadFile(result, 'TA商机信息列表', 'xlsx')
        this.loadingInstance.close();
    }).catch(() => {
        this.loadingInstance.close();
      })
    },
    upload(){
      this.$refs.upform.dialog=true;
    },
    resetQuery(){
      this.$refs['queryForm'].resetFields();
    },
    rowContextMenu(row){
      this.rightClickRow = row;
    },
    copyClick(){
      const  _this = this.$refs.form;
      _this.form = deepClone(this.rightClickRow);
      this.operate = '新增';
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
