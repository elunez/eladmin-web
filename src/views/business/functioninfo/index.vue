<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
              <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择">
                    <el-option
                            v-for="item in  dict.product_id"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="功能名称"  prop="functionName">
                  <el-input v-model="form.functionName" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="功能类型"  prop="functionType">
                  <el-select v-model="form.functionType" filterable  placeholder="请选择">
                    <el-option
                            v-for="item in  dict.function_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="功能模式"  prop="functionMode">
                  <el-select v-model="form.functionMode" filterable  placeholder="请选择">
                    <el-option
                            v-for="item in  dict.function_mode"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="备注"  prop="memo">
                  <el-input v-model="form.memo" style="width: 200px;"/>
              </el-form-item>
      </el-form>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
     </div>
     <div class="head-container">
        <!-- 新增 -->
         <el-button
                v-permission="['admin','functionInfo:add']"
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
                 v-permission="['admin','functionInfo:export']"
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
                  v-permission="['admin','functionInfo:import']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  icon="el-icon-upload"
                  @click="upload">导入EXECL
          </el-button>
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictProductId="dict.product_id"   :dictFunctionType="dict.function_type"    />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick"
              @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','functionInfo:add']))" @row-contextmenu="rowContextMenu">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="productId" label="产品名称">
        <template slot-scope="scope">
          <div v-if=" scope.row.productId in dict.product_id">{{dict.product_id[scope.row.productId].label}}</div>
          <div v-else-if=" !scope.row.productId in dict.product_id">{{scope.row.productId}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="functionName" label="功能名称"/>
      <el-table-column prop="functionType" label="功能类型">
        <template slot-scope="scope">
          <div v-if=" scope.row.functionType in dict.function_type">{{dict.function_type[scope.row.functionType].label}}</div>
          <div v-else-if=" !scope.row.functionType in dict.function_type">{{scope.row.functionType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="functionMode" label="功能模式"/>
      <el-table-column prop="memo" label="备注"/>
      <el-table-column v-if="checkPermission(['admin','functionInfo:edit','functionInfo:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','functionInfo:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','functionInfo:del']"
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
import { del, downloadFunctionInfo } from '@/api/functionInfo'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone } from '@/utils/index'
import eForm from './form'
import rightMenu from '@/views/business/rightmenu/index'

export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['product_id','function_type'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/functionInfo/upload',
      multipleSelection:[],
      form: {
        id: '',
        productId: '',
        functionName: '',
        functionType: '',
        functionMode: '',
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
    checkPermission,
    beforeInit() {
      this.url = 'api/functionInfo'
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
        productId: data.productId,
        functionName: data.functionName,
        functionType: data.functionType,
        functionMode: data.functionMode,
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
      this.downloadLoading = true
      downloadFunctionInfo(data).then(result => {
        downloadFile(result, '功能信息列表', 'xlsx')
      this.downloadLoading = false
    }).catch(() => {
        this.downloadLoading = false
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
    }
  }
}
</script>

<style scoped>

</style>
