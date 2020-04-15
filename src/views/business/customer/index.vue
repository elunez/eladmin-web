<template>
  <div class="app-container">
    <div  v-if="!dialog">
      <!--表单组件-->
      <eForm ref="form" :operate="operate" :dictCustType="dict.cust_type"
             :dictArea="dict.area"
             :dictCustProductType1="dict.cust_product_type1"
             :dictProductId="dict.product_id"/>
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
          <el-button
            v-permission="['admin','userPermission:add']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-s-tools"
            @click="userPermissionAdd">用户数据权限设置</el-button>
          <el-button
            v-permission="['admin','customer:edit']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-link"
            @click="linkCustomer">关联主客户</el-button>
          <!--表格渲染-->
          <div>
            <div>
              <el-table ref="Table" v-loading="loading" :data="data"
                        size="small"
                        border
                        row-key="id"
                        default-expand-all
                        style="width: 100%;margin-top: 10px"
                        :tree-props="{children: 'childrens', hasChildren: 'hasChildren'}"
                        @selection-change="handleSelectionChange"
                        @row-dblclick="rowDoubleClick">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <af-table-column prop="custName" label="客户名称"/>
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
                <el-table-column prop="custNo" label="客户编号"/>
                <el-table-column prop="custProductType" label="类型">
                  <template slot-scope="scope">
                    <div>{{getDictCaption(scope.row.custProductType,dict.cust_product_type1)}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="custHaveProduct" label="上线产品">
                  <template slot-scope="scope">
                    <div>{{getDictCaption(scope.row.custHaveProduct,dict.product_id)}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注"/>
                <el-table-column v-if="checkPermission(['admin','custEnv:list','custHaveValueAdded:list','custMilestone:list','custProduct:list','custProductLiqTime:list','customer:edit','customer:del'])" label="操作" align="center" width="200px">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.parentId !=='*'"
                      v-permission="['admin','custEnv:list','custHaveValueAdded:list','custMilestone:list','custProduct:list','custProductLiqTime:list']"
                      size="mini"
                      type="primary"
                      icon="el-icon-more"
                      @click="viewCustUserAndProduct(scope.row,scope.$index)"/>
                    <el-button v-permission="['admin','customer:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                    <el-popover
                      v-permission="['admin','customer:del']"
                      :ref="scope.row.id"
                      placement="top"
                      width="180">
                      <p>确定删除本条数据吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                        <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id,scope.row)">确定</el-button>
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
            </div>
          </div>
        </el-card>
        <el-dialog :append-to-body="true" :close-on-click-modal="false"
                   :before-close="()=>{userPermissionAddFlag = false}"
                   :visible.sync="userPermissionAddFlag"
                   title="用户数据权限设置" width="60%">
           <user-permission :dataId="multipleSelection" menuId="customer" :columns="userPermissionColumns"></user-permission>
           <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="()=>{userPermissionAddFlag = false}">关闭设置页面</el-button>
           </div>
        </el-dialog>
      </el-row>
    </div>
    <other-info  v-if="dialog" ref="otherinfo" :cust="cust"
                 :dict-product-id="dict.product_id"
                 :dict-area="dict.area"
                 :dict-os-version="dict.os_version"
                 :dict-mid-version="dict.mid_version"
                 :dict-yes-no="dict.yes_no"
                 :dict-db-version="dict.db_version"
                 :dict-cust-product-type="dict.cust_product_type"
                 :dict-cust-product-type1="dict.cust_product_type1"
                 :dict-cust-type="dict.cust_type"/>
    <link-form ref="linkform" :linkCust="multipleSelection"></link-form>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getData } from '@/api/data'
import { del, downloadCustomer } from '@/api/customer'
import { downloadFile,deepClone, getDictCaption } from '@/utils/index'
import eForm from './form'
import linkForm from './linkform'
import otherInfo from './otherinfo'
import rightMenu from '@/views/business/rightmenu/index'
import uploadForm from  '@/views/business/upload/form';
import userPermission from  '@/views/system/datapermission/userpermission/index';
export default {
  name: 'Customer',
  components: { eForm, otherInfo,userPermission, uploadForm, rightMenu, linkForm },
  mixins: [initData],
  dicts:['cust_type','area','product_id','os_version','db_version','yes_no','mid_version','cust_product_type','cust_product_type1'],
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
        parentId: '',
        memo: ''
      },
      userPermissionAddFlag:false,
      userPermissionColumns:[],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch:{
  },
  methods: {
    getDictCaption,
    checkPermission,
    beforeInit() {
      this.url = 'api/customer'
      const sort = 'id,desc';
      this.form.parentId = '*';
      this.params = { page: this.page, size: this.size, sort: sort };
      Object.assign(this.params,this.form);
      return true
    },
    subDelete(id,row) {
      if(row.childrens.length){
        this.$message.warning("请先删除子客户!")
        return;
      }
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
      _this.form =  deepClone(data);
      if(data.custHaveProduct && data.custHaveProduct.length){
        _this.form.custHaveProduct = data.custHaveProduct.split(',')
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
    },
    viewCustUserAndProduct(row,index){
      if(!row.custHaveProduct || !row.custHaveProduct.length){
         this.$message.warning("还未设置上线产品");
         return;
      }
      this.cust = row;
      this.dialog = true;
    },
    userPermissionAdd(){
      // if(!this.multipleSelection || !this.multipleSelection.length){
      //   this.$message.warning("请先选择需要需要限制的客户信息!")
      //   return;
      // }
      this.userPermissionAddFlag = !this.userPermissionAddFlag;
      if(this.userPermissionAddFlag){
        this.userPermissionColumns =[
          {
            prop:'custType',
            label:'客户类型',
            dictName:this.dict.cust_type,
          },
          {
            prop:'area',
            label:'地区',
            dictName:this.dict.area,
          },
          {
            prop:'custName',
            label:'客户名称',
            dictName:'',
          },
        ]
      }
    },
    linkCustomer(){
      if(!this.multipleSelection || !this.multipleSelection.length){
         this.$message.warning("请先选择需要关联的子客户!")
         return;
      }
      var haveChild = this.multipleSelection.filter(item=>item.hasOwnProperty('hasChildren') && item.hasChildren).length > 0;
      if(haveChild){
        this.$message.warning("请不要选择主客户!");
        return;
      }
      const _this = this.$refs.linkform;
      _this.dialog = true;
    }

  }
}
</script>

<style scoped>
.el-card__body {
  padding: 0px;
}
</style>
