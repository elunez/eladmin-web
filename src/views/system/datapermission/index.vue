<template>
  <div class="app-container">
    <!--工具栏-->
<!--     <div class="head-container">-->
<!--      &lt;!&ndash; 搜索 &ndash;&gt;-->
<!--      <el-form ref="queryForm" :model="form"  size="small" label-width="100px">-->
<!--              <el-form-item label="角色"  prop="roleId">-->
<!--                  <el-input v-model="form.roleId" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="表代码"  prop="tableCode">-->
<!--                  <el-input v-model="form.tableCode" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="表名称"  prop="tableName">-->
<!--                  <el-input v-model="form.tableName" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--      </el-form>-->
<!--      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>-->
<!--      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>-->
<!--     </div>-->
     <div class="head-container">
        <!-- 新增 -->
         <el-button
                v-permission="['admin','dataPermission:add']"
                class="filter-item"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                style="margin-left: 20px"
                @click="add">新增</el-button>
        <!-- 导出 -->
<!--         <el-dropdown-->
<!--                 class="filter-item"-->
<!--                 type="primary"-->
<!--                 icon="el-icon-download"-->
<!--                 style="margin-left: 20px"-->
<!--                 v-permission="['admin','dataPermission:export']"-->
<!--                 @command="download">-->
<!--           <el-button type="primary" size="mini">-->
<!--             导出EXECL<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--           </el-button>-->
<!--           <el-dropdown-menu slot="dropdown">-->
<!--             <el-dropdown-item command="导出全部">导出全部</el-dropdown-item>-->
<!--             <el-dropdown-item command="导出选择">导出选择</el-dropdown-item>-->
<!--           </el-dropdown-menu>-->
<!--         </el-dropdown>-->
        <!--导入-->
<!--          <el-button-->
<!--                  v-permission="['admin','dataPermission:import']"-->
<!--                  class="filter-item"-->
<!--                  type="primary"-->
<!--                  size="mini"-->
<!--                  style="margin-left: 20px"-->
<!--                  icon="el-icon-upload"-->
<!--                  @click="upload">导入EXECL-->
<!--          </el-button>-->
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate" :dict="dict" />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="name" label="方案名称"/>
      <el-table-column prop="roleId" label="角色名称">
        <template slot-scope="scope">
           <div>{{getRoleName(scope.row.roleId)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="tableCode" label="表代码"/>
      <el-table-column prop="tableName" label="表名称"/>
      <el-table-column v-if="checkPermission(['admin','dataPermission:edit','dataPermission:del'])" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','dataPermission:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','dataPermission:del']"
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
import { del, downloadDataPermission } from '@/api/dataPermission'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone } from '@/utils/index'
import { getAll } from '@/api/role'
import eForm from './form'
export default {
  components: { eForm, uploadForm },
  mixins: [initData],
  dicts:['ALL'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/dataPermission/upload',
      multipleSelection:[],
      form: {
        id: '',
        roleId: '',
        tableCode: '',
        tableName: ''
      },
      roles:[]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
      //初始化配置
      this.$refs.form.getSet();
      this.getRoles();
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/dataPermission'
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
      const _this = this.$refs.form;
      _this.form = {
        id: data.id,
        className:'',
        name:data.name,
        roleId: data.roleId,
        tableCode: data.tableCode,
        tableName: data.tableName,
        tableIndex:null,
        fields:deepClone(data.fields)
      };
     _this.getTableIndex();
     _this.dialog = true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    rowDoubleClick(row){
      const _this = this.$refs.form;
      _this.form = deepClone(row);
      _this.getTableIndex();
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
      downloadDataPermission(data).then(result => {
        downloadFile(result, 'DataPermission列表', 'xlsx')
      this.downloadLoading = false
    }).catch(() => {
        this.downloadLoading = false
      })
    },
    upload(){
      this.$refs.upform.dialog=true;
    },
    getRoles() {
      getAll().then(res => {
        this.roles = res
        this.$refs.form.roles =res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getRoleName(roleId){
       var name = "未找到对应角色名";
       for (var i = 0;i<this.roles.length;i++){
         if(roleId===this.roles[i].id){
           name =this.roles[i].name;
           break;
         }
       }
      return  name;
    },
    resetQuery(){
      this.$refs['queryForm'].resetFields();
    }
  },
  watch:{
     roles(){
        if(!this.roles.length){
          this.getRoles();
        }
     }
  }
}
</script>

<style scoped>

</style>
