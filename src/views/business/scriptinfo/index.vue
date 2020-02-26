<template>
  <div class="app-container">
    <!--工具栏-->
    <el-collapse>
      <el-collapse-item   title="搜索查询" name="1">
        <div class="head-container">
          <!-- 搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品名称"  prop="productId">
                  <el-select v-model="form.productId" filterable  placeholder="请选择">
                    <el-option
                      v-for="item in  dict.product_id"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="脚本类别"  prop="scriptClass">
                  <el-select v-model="form.scriptClass" filterable  placeholder="请选择">
                    <el-option
                      v-for="item in  dict.script_class"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="脚本名称"  prop="scriptName">
                  <el-input v-model="form.scriptName" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生效版本"  prop="effectVersion">
                  <el-input v-model="form.effectVersion" style="width: 200px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><el-form-item/></el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                  <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item  v-if="checkPermission(['admin','scriptInfo:add','scriptInfo:edit','scriptInfo:del','scriptInfo:export','scriptInfo:import'])" title="操作" name="2">
        <div class="head-container">
          <!-- 新增 -->
          <el-button
            v-permission="['admin','scriptInfo:add']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="add">新增</el-button>
          <el-button
            v-if="multipleSelection.length === 1"
            v-permission="['admin','scriptInfo:edit']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="edit(multipleSelection[0])">修改</el-button>
          <el-popover
            v-if="multipleSelection.length !== 1"
            v-permission="['admin','scriptInfo:edit']"
            :ref="multipleSelection"
            placement="top"
            width="180">
            <p v-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
          </el-popover>
          <el-popover
            v-permission="['admin','scriptInfo:del']"
            ref="delpopver"
            placement="top"
            width="200">
            <p v-if="multipleSelection.length ===1">确定删除本条数据吗？</p>
            <p v-else-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <div style="text-align: right; margin: 0" v-if="multipleSelection.length ===1">
              <el-button size="mini" type="text" @click="$refs['delpopver'].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(multipleSelection[0].id)">确定</el-button>
            </div>
            <el-button slot="reference"  style="margin-left: 20px" size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
          </el-popover>
          <!-- 导出 -->
          <el-dropdown
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            style="margin-left: 20px;margin-bottom: 4px"
            v-permission="['admin','scriptInfo:export']"
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
            v-permission="['admin','scriptInfo:import']"
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


    <!--表单组件-->
    <eForm ref="form" :operate="operate"
           :dictScriptClass="dict.script_class"
           :dict-module-type="dict.module_type"
           :dict-product-id="dict.product_id"/>
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-tabs type="border-card" v-model="activeName"  @tab-click="tabHandleClick">
      <el-tab-pane   v-for="item in dict.module_type" :key="item.value">
        <span slot="label"><i>{{item.label}}</i></span>
        <el-table   v-loading="loading" :data="data" size="small" style="width: 100%;" border
                  @selection-change="handleSelectionChange"
                  @row-dblclick="rowDoubleClick"
                  @expand-change="expandChange"
                  :max-height="clientHeight"
                  @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','scriptInfo:add']))"
                  @row-contextmenu="rowContextMenu">
          <af-table-column
            type="selection"
            width="55">
          </af-table-column>
          <af-table-column type="expand">
            <template slot-scope="scope">
              <el-tabs v-if="scope.row.functions && scope.row.functions.length>0" tab-position="left" >
                <el-tab-pane label="关联功能">
                  <el-table :data="scope.row.functions" size="small" style="width: 100%;">
                    <af-table-column prop="productId" label="产品名称" width="80px">
                      <template slot-scope="scopef">
                        <div>{{getDictCaption(scopef.row.productId,dict.product_id)}}</div>
                      </template>
                    </af-table-column>
                    <af-table-column prop="functionName" label="功能名称"/>
                    <af-table-column prop="functionType" label="功能类型">
                      <template slot-scope="scopef">
                        <div>{{getDictCaption(scopef.row.functionType,dict.function_type)}}</div>
                      </template>
                    </af-table-column>
                    <af-table-column prop="functionMode" label="功能模式"/>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </af-table-column>
          <af-table-column prop="productId"  label="产品名称" width="80px">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="scriptClass" label="脚本类别" width="80px">
            <template slot-scope="scope">
              <div>{{getDictCaption(scope.row.scriptClass,dict.script_class)}}</div>
            </template>
          </af-table-column>
          <af-table-column prop="scriptName" label="脚本名称" :show-overflow-tooltip="true" width="250px"/>
          <af-table-column prop="effectVersion" label="生效版本"/>
          <af-table-column prop="userManualName" label="用户手册名称" :show-overflow-tooltip="true"/>
          <af-table-column prop="memo" label="备注" :show-overflow-tooltip="true"/>
          <af-table-column v-if="checkPermission(['admin','scriptInfo:edit','scriptInfo:del'])" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['admin','scriptInfo:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-popover
                v-permission="['admin','scriptInfo:del']"
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
          </af-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
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
import { del, downloadScriptInfo } from '@/api/scriptInfo'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption } from '@/utils/index'
import rightMenu from '@/views/business/rightmenu/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['script_class','module_type','product_id'],
  props:{
  },
  data() {
    return {
      delLoading: false,
      uploadApi:'api/scriptInfo',
      multipleSelection:[],
      form: {
        id: '',
        moduleType:'',
        scriptClass: '',
        scriptName: '',
        effectVersion: '',
        userManualName: '',
        memo: ''
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        },
      ],
      activeName:0
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight -200;
    this.$nextTick(() => {
      this.form.moduleType = String(this.activeName);
      this.init();
    })

  },
  methods: {
    getDictCaption,
    checkPermission,
    beforeInit() {
      this.url = 'api/scriptInfo'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
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
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.operate = '修改'
      const _this = this.$refs.form
      _this.form =  deepClone(data);
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
      downloadScriptInfo(data).then(result => {
        downloadFile(result, '脚本信息列表', 'xlsx')
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
    },
    tabHandleClick(tab,event){
      this.form = {
          id: '',
          moduleType:tab.paneName,
          scriptClass: '',
          scriptName: '',
          effectVersion: '',
          userManualName: '',
          memo: ''
      };
      this.toQuery();
    },
    expandChange(row){
      if(!row.functions || !row.functions.length){
        this.$message.warning("没有关联功能!")
      }
    }
  }
}
</script>

<style scoped>

</style>
