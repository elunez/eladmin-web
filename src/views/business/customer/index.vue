<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :operate="operate" :dictCustType="dict.cust_type" :dictArea="dict.area"/>
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <el-row :gutter="10">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>客户信息列表</span>
        </div>
        <!--工具栏-->
        <div class="head-container">
          <el-form ref="queryForm" :model="form"  size="small" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="客户类型" prop="custType">
                  <el-select v-model="form.custType" filterable  placeholder="请选择">
                    <el-option
                      v-for="item in dict.cust_type"
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
                      v-for="item in dict.area"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="客户名称" prop="custName">
                  <el-input v-model="form.custName"  maxlength="50" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 搜索 -->
                <el-button style="margin-left: 60px" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
          <!-- 客户信息新增 -->
          <el-button
            v-permission="['admin','customer:add']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="add">新增</el-button>
          <!-- 导出 -->
          <el-dropdown
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            style="margin-left: 20px"
            v-permission="['admin','customer:export']"
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
            v-permission="['admin','customer:import']"
            class="filter-item"
            type="primary"
            size="mini"
            style="margin-left: 20px"
            icon="el-icon-upload"
            @click="upload">导入EXECL
          </el-button>
        <!--表格渲染-->
        <el-table ref="Table" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="custType" label="客户类型">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="地区">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="custName" label="客户名称"/>
          <el-table-column prop="memo" label="备注"/>
          <el-table-column v-if="checkPermission(['admin','custUser:list','custProduct:list','customer:edit','customer:del'])" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['admin','custUser:list']" size="mini" type="primary" icon="el-icon-user" @click="viewCustUserAndProduct(scope.row)"/>
              <el-button v-permission="['admin','customer:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-popover
                v-permission="['admin','customer:del']"
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
      </el-card>
    </el-row>
    <el-dialog ref="dialog" :append-to-body="true" :close-on-click-modal="false" :before-close="handleViewCustUserClose" :visible.sync="dialog" title="客户其他信息列表" width="100%">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="客户信息" name="1">
          <el-card  class="box-card" shadow="false">
            <div slot="header" class="clearfix">
              <span>客户信息</span>
            </div>
            <el-form  :model="cust" size="mini" label-width="80px" :disabled="true">
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="客户类型"  prop="custType">
                    <el-select v-model="cust.custType" filterable  placeholder="请选择">
                      <el-option
                        v-for="item in dict.cust_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="地区" prop="area">
                    <el-select v-model="cust.area" filterable  placeholder="请选择">
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
                    <el-input v-model="cust.custName"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-form-item label="备注" prop="memo">
                  <el-input v-model="cust.memo"  type="textarea"/>
                </el-form-item>
              </el-row>
            </el-form>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="其他信息" name="2">
          <el-tabs tab-position="left">
            <el-tab-pane v-for="item in dict.product_id" :label="item.label" :key="item.value">
              <el-card class="box-card">
                <el-tabs type="border-card">
                  <el-tab-pane label="客户环境信息">
                    <el-table :data="envData">
                      <el-table-column prop="databaseVersion" label="数据库版本"></el-table-column>
                      <el-table-column prop="middlewareVersion" label="中间件版本"></el-table-column>
                      <el-table-column prop="sameService" label="应用与数据库是否同一服务器"></el-table-column>
                      <el-table-column prop="asServiceParam" label="应用服务器参数"></el-table-column>
                      <el-table-column prop="dbServiceParam" label="数据库服务器参数"></el-table-column>
                      <el-table-column prop="dbServiceParam" label="数据库服务器参数"></el-table-column>
                      <el-table-column prop="statRequestTime" label="统计申请日期"></el-table-column>
                      <el-table-column prop="statComfirmTime" label="统计确认日期"></el-table-column>
                      <el-table-column prop="statPerson" label="统计人员"></el-table-column>
                      <el-table-column prop="memo" label="备注"></el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="客户产品信息">
                    <el-table :data="envData">
                      <el-table-column prop="databaseVersion" label="存量账户数(万户)"></el-table-column>
                      <el-table-column prop="middlewareVersion" label="公募产品数量（或证券大集合等）"></el-table-column>
                      <el-table-column prop="sameService" label="专户产品数量（或证券小集合等）"></el-table-column>
                      <el-table-column prop="asServiceParam" label="产品类型统计（股票、货币、债券、lof、etf等）"></el-table-column>
                      <el-table-column prop="dbServiceParam" label="是否有余额理财"></el-table-column>
                      <el-table-column prop="statRequestTime" label="统计申请日期"></el-table-column>
                      <el-table-column prop="statComfirmTime" label="统计确认日期"></el-table-column>
                      <el-table-column prop="statPerson" label="统计人员"></el-table-column>
                      <el-table-column prop="memo" label="备注"></el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane v-if="liquidationTime.contains(item.label)" :label="item.label+'日常清算时间'">

                  </el-tab-pane>
                  <el-tab-pane label="客户已上线增值功能">
                    <el-table :data="envData">
                      <el-table-column prop="databaseVersion" label="功能模块"></el-table-column>
                      <el-table-column prop="middlewareVersion" label="上线日期"></el-table-column>
                      <el-table-column prop="sameService" label="使用情况"></el-table-column>
                      <el-table-column prop="statTime" label="统计日期"></el-table-column>
                      <el-table-column prop="statPerson" label="统计人员"></el-table-column>
                      <el-table-column prop="memo" label="备注"></el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="客户里程碑">

                  </el-tab-pane>
                </el-tabs>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadCustomer } from '@/api/customer'
import { downloadFile,deepClone, getDictCaption } from '@/utils/index'
import custUser from '../custuser/index'
import custProduct from '../custproduct/index'
import eForm from './form'
import rightMenu from '@/views/business/rightmenu/index'
import uploadForm from  '@/views/business/upload/form';
export default {
  name: 'Customer',
  components: { eForm, custUser, uploadForm, custProduct, rightMenu },
  mixins: [initData],
  dicts:['cust_type','area','product_id'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/customer',
      multipleSelection:[],
      dialog:false,
      cust:{},
      form : {
        id: '',
        custType: '',
        area: '',
        custName: '',
        memo: ''
      },
      liquidationTime:['TA4','ETF分TA','分TA'],
      envData:[

      ],
      activeNames: ['1','2']
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    getDictCaption,
    checkPermission,
    beforeInit() {
      this.url = 'api/customer'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort };
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
      this.operate = '新增'
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
        memo: data.memo
      }
      _this.dialog = true
    },
    handleSelectionChange(val){
       this.multipleSelection = val;
    },
    rowDoubleClick(row){
      const _this = this.$refs.form;
      _this.form = deepClone(row);
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
      this.openFullScreen('导出','客户列表');
      downloadCustomer(data).then(result => {
        downloadFile(result, '客户列表', 'xlsx')
        this.loadingInstance.close();
      }).catch(() => {
        this.loadingInstance.close();
      })
    },
    upload(){
      this.$refs.upform.dialog=true;
    },
    viewCustUserAndProduct(row){
       this.cust = row;
       this.dialog = true;
    },
    handleViewCustUserClose(){
       this.dialog = false;
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
       this.operate = '新增'
       _this.dialog = true
    }
  }
}
</script>

<style scoped>
</style>
