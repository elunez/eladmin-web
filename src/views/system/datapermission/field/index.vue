<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
              <el-form-item label="数据权限标识符"  prop="permissionId">
                  <el-input v-model="form.permissionId" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="字段代码"  prop="fieldCode">
                  <el-input v-model="form.fieldCode" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="字段名称"  prop="fieldName">
                  <el-input v-model="form.fieldName" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="字典代码"  prop="dictName">
                  <el-input v-model="form.dictName" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="操作类型"  prop="operateType">
                  <el-select v-model="form.operateType" filterable  placeholder="请选择">
                    <el-option
                            v-for="item in  dict.operate_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="操作值"  prop="operateValue">
                  <el-input v-model="form.operateValue" style="width: 200px;"/>
              </el-form-item>
      </el-form>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
     </div>
     <div class="head-container">
        <!-- 新增 -->
         <el-button
                v-permission="['admin','dataPermissionField:add']"
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
                 v-permission="['admin','dataPermissionField:export']"
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
                  v-permission="['admin','dataPermissionField:import']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  icon="el-icon-upload"
                  @click="upload">导入EXECL
          </el-button>
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictOperateType="dict.operate_type"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="fieldCode" label="字段代码"/>
      <el-table-column prop="fieldName" label="字段名称"/>
      <el-table-column prop="dictName" label="字典代码"/>
      <el-table-column prop="operateType" label="操作类型">
        <template slot-scope="scope">
          <div v-if=" scope.row.operateType in dict.operate_type">{{dict.operate_type[scope.row.operateType].label}}</div>
          <div v-else-if=" !scope.row.operateType in dict.operate_type">{{scope.row.operateType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="operateValue" label="操作值"/>
      <el-table-column v-if="checkPermission(['admin','dataPermissionField:edit','dataPermissionField:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','dataPermissionField:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','dataPermissionField:del']"
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
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadDataPermissionField } from '@/api/dataPermissionField'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm },
  mixins: [initData],
  dicts:['operate_type'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/dataPermissionField/upload',
      multipleSelection:[],
      form: {
        id: '',
        permissionId: '',
        fieldCode: '',
        fieldName: '',
        dictName: '',
        operateType: '',
        operateValue: ''
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
      this.url = 'api/dataPermissionField'
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
        permissionId: data.permissionId,
        fieldCode: data.fieldCode,
        fieldName: data.fieldName,
        dictName: data.dictName,
        operateType: data.operateType,
        operateValue: data.operateValue
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
      downloadDataPermissionField(data).then(result => {
        downloadFile(result, 'DataPermissionField列表', 'xlsx')
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
    }
  }
}
</script>

<style scoped>

</style>
