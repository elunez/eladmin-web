<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
       <el-collapse>
         <el-collapse-item title="搜索查询" name="1">
             <el-form ref="queryForm" :model="form"  size="small" label-width="60px">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="行业" prop="custType" >
                    <el-select v-model="form.custType" filterable  placeholder="请选择"  style="width: 100px;">
                      <el-option
                        v-for="item in dict.cust_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="地区" prop="area">
                    <el-select v-model="form.area" filterable  placeholder="请选择"  style="width: 100px;">
                      <el-option
                        v-for="item in dict.area"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="客户名称" prop="custName">
                    <el-input v-model="form.custName" style="width: 100px;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="产品" prop="productId">
                    <el-select v-model="form.productId" filterable  placeholder="请选择"  style="width: 100px;">
                      <el-option
                        v-for="item in dict.bis_product_id"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="项目类型" prop="projectType">
                    <el-select v-model="form.projectType" filterable  placeholder="请选择"  style="width: 100px;">
                      <el-option
                        v-for="item in dict.project_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="项目类别" prop="projectClass">
                    <el-select v-model="form.projectClass" filterable  placeholder="请选择"  style="width: 100px;">
                      <el-option
                        v-for="item in dict.project_class"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                 <el-col :span="4">
                   <el-form-item label="竞争对手" prop="competitor">
                     <el-select v-model="form.competitor" filterable  placeholder="请选择"  style="width: 100px;">
                       <el-option
                         v-for="item in dict.competitor"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" ></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="4">
                   <el-form-item label="成功率" prop="successRate">
                     <el-select v-model="form.successRate" filterable  placeholder="请选择"  style="width: 100px;">
                       <el-option
                         v-for="item in dict.success_rate"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" ></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="4">
                   <el-form-item label="所处阶段" prop="stage">
                     <el-select v-model="form.stage" filterable  placeholder="请选择"  style="width: 100px;">
                       <el-option
                         v-for="item in dict.stage"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" ></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="4">
                   <el-form-item label="跟进人员" prop="followPerson">
                     <el-select v-model="form.followPerson" filterable  placeholder="请选择"  style="width: 100px;">
                       <el-option
                         v-for="item in dict.follow_person"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" ></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="4">
                   <el-form-item label="销售" prop="salePerson">
                     <el-input v-model="form.salePerson" style="width: 100px;"/>
                   </el-form-item>
                 </el-col>
                 <el-col :span="4">
                     <el-button  size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                     <el-button  size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                 </el-col>
              </el-row>
               <el-row>
                 <el-col :span="4">
                   <el-form-item label="归档日期" prop="contractFillDate">
                     <el-date-picker v-model="form.contractFillDate" type="year" style="width: 100px;"/>
                   </el-form-item>
                 </el-col>
               </el-row>
            </el-form>
         </el-collapse-item>
         <el-collapse-item  v-if="checkPermission(['admin','businessInfo:add','businessInfo:edit','businessInfo:del','businessInfo:export','businessInfo:import'])" title="商机信息操作" name="2">
           <div>
             <!-- 新增 -->
             <el-button
               v-permission="['admin','businessInfo:add']"
               class="filter-item"
               type="primary"
               size="mini"
               icon="el-icon-plus"
               style="margin-left: 20px;margin-bottom: 4px"
               @click="add">新增</el-button>
             <el-button
               v-if="multipleSelection.length === 1"
               v-permission="['admin','businessInfo:edit']"
               class="filter-item"
               type="primary"
               size="mini"
               icon="el-icon-edit"
               style="margin-left: 20px;margin-bottom: 4px"
               @click="edit(multipleSelection[0],'修改')">修改</el-button>
             <el-popover
               v-if="multipleSelection.length !== 1"
               v-permission="['admin','businessInfo:edit']"
               :ref="multipleSelection"
               placement="top"
               width="180">
               <p v-if="multipleSelection.length <1">请选择一条数据!</p>
               <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
               <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
             </el-popover>
             <el-popover
               v-permission="['admin','businessInfo:del']"
               ref="delpopver"
               placement="top"
               width="200">
               <p v-if="multipleSelection.length > 0">确定删除{{this.multipleSelection.length}}条数据吗？</p>
               <div style="text-align: right; margin: 0" v-if="multipleSelection.length > 0">
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
               v-permission="['admin','businessInfo:export']"
               @command="download">
               <el-button type="primary" size="mini">
                 导出EXECL<i class="el-icon-arrow-down el-icon--right"></i>
               </el-button>
               <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="导出查询">导出查询</el-dropdown-item>
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
               style="margin-left: 20px;margin-bottom: 4px"
               icon="el-icon-upload"
               @click="upload">导入EXECL
             </el-button>
           </div>
         </el-collapse-item>
       </el-collapse>
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictCustType="dict.cust_type"   :dictArea="dict.area"   :dictBisProductId="dict.bis_product_id"   :dictProjectType="dict.project_type"   :dictProjectClass="dict.project_class"   :dictCompetitor="dict.competitor"   :dictSuccessRate="dict.success_rate"   :dictStage="dict.stage"   :dictFollowPerson="dict.follow_person"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--导出表单-->
    <downloadForm ref="downform" :uploadApi="uploadApi" />
    <!--表格渲染-->
    <el-table id="table" v-loading="loading"
                :data="data"
                size="small"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDoubleClick"
                :max-height="clientHeight"
                @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','businessInfo:add']))"
                @row-contextmenu="rowContextMenu">
        <el-table-column
          type="selection"
          class-name=""
          width="25"/>
        <el-table-column prop="updateTime" label="" width="30px">
          <template slot-scope="scope">
             <div>
               <img  :src="getImageSrc(scope.row)"  style="width: 20px;height: 20px"/>
             </div>
          </template>
        </el-table-column>
        <el-table-column prop="custType" label="行业" :show-overflow-tooltip="true" width="50px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="地区" :show-overflow-tooltip="true" width="50px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="custName" label="客户名称"  :show-overflow-tooltip="true" width="85px"/>
        <el-table-column prop="productId" label="产品"  :show-overflow-tooltip="true" width="65px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.productId,dict.bis_product_id)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="productDescription" label="项目描述" :show-overflow-tooltip="true" width="150px"/>
        <el-table-column prop="projectType" label="项目类型" :show-overflow-tooltip="true" width="80px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.projectType,dict.project_type)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="projectClass" label="项目类别" :show-overflow-tooltip="true" width="70px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.projectClass,dict.project_class)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="competitor" label="竞争对手" :show-overflow-tooltip="true" width="70px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.competitor,dict.competitor)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contractBalance" label="预计金额" :show-overflow-tooltip="true" width="70px"/>
        <el-table-column prop="confirmBalance" label="成交金额" :show-overflow-tooltip="true" width="70px"/>
        <el-table-column prop="successRate" label="成功率" :show-overflow-tooltip="true" width="60px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.successRate,dict.success_rate)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contractTime" label="预签日期" :show-overflow-tooltip="true" width="70px"/>
        <el-table-column prop="stage" label="所处阶段" :show-overflow-tooltip="true" width="70px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.stage,dict.stage)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="followPerson" label="跟进人员" :show-overflow-tooltip="true" width="70px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.followPerson,dict.follow_person)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"  width="85px">
          <template slot-scope="scope">
            <span>{{ parseTimeYMD(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="salePerson" label="销售" :show-overflow-tooltip="true" width="70px"/>
        <el-table-column prop="estimatedTime" label="签单时间"  width="85px">
          <template slot-scope="scope">
            <span>{{ parseTimeYMD(scope.row.estimatedTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractFillDate" label="归档日期"   width="85px">
          <template slot-scope="scope">
            <span>{{ parseTimeYMD(scope.row.contractFillDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="问题反馈" :show-overflow-tooltip="true" width="70px"/>
      </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <right-menu ref="rightMenu" :menu="menu"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadBusinessInfo } from '@/api/businessInfo'
import uploadForm from  '@/views/business/upload/form'
import downloadForm from  '@/views/business/download/form'
import { parseTime, downloadFile, deepClone, parseTimeYMD, getDictCaption } from '@/utils/index'
import rightMenu from '../rightmenu/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm,downloadForm, rightMenu },
  mixins: [initData],
  dicts:['cust_type','area','bis_product_id','project_type','project_class','competitor','success_rate','stage','follow_person'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/businessInfo',
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
        contractFillDate: this.getFirstDayOfYear(new Date())
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        }
      ],
      todayTime:''
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight -200;
    this.todayTime = this.timeFormat(new Date());
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted(){
  },
  methods: {
    parseTime,
    checkPermission,
    parseTimeYMD,
    getDictCaption,
    getImageSrc(row){
      var updateTime = new Date(row.updateTime);
      var todayTime = new Date(this.todayTime);
      if(updateTime>=todayTime){
        return require('../../../assets/image/xin.png');
      }else {
        return require('../../../assets/image/old.png');
      }
    },
    beforeInit() {
      this.url = 'api/businessInfo'
      const sort = 'updateTime,desc';
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    timeFormat(date) {
      if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日

      return y + "-" + m + "-" + d;
    },
    getFirstDayOfYear (date) {
      date.setDate(1);
      date.setMonth(0);
      return this.timeFormat(date);
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
        console.log(err.response.data.message)
      })
    },
    add() {
      this.operate = '新增';
      const  _this = this.$refs.form;
      _this.dialog = true
      _this.form.updateTime = this.todayTime;
    },
    edit(data,type) {
      this.operate = type
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
        competitor: data.competitor.split(',').filter(item=>item!=''),
        contractBalance: data.contractBalance,
        confirmBalance: data.confirmBalance,
        successRate: data.successRate,
        contractTime: data.contractTime,
        stage: data.stage,
        followPerson: data.followPerson,
        updateTime: this.timeFormat(new Date()),
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
       this.edit(row,'详情')
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
      var params =  {};
      params['data'] = data;
      params['criteria'] = {};
      if(command === '导出查询'){
        params['criteria'] = this.form;
      }
      this.openFullScreen('导出','TA商机信息列表');
      downloadBusinessInfo(params).then(result => {
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
      _this.form.updateTime = this.todayTime;
      _this.form.competitor = this.rightClickRow.competitor.split(',').filter(item=>item!='');
      this.operate = '新增';
      _this.dialog = true
    },
  }
}
</script>

<style>
</style>
