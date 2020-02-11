<template>
  <div class="app-container">
    <!--工具栏-->
    <el-collapse>
      <el-collapse-item   title="搜索查询" name="1">
        <div class="head-container">
          <!-- 搜索 -->
          <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
            <el-row :gutter="8">
              <el-col :span="8">
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
              <el-col :span="8">
                <el-form-item label="功能名称"  prop="functionName">
                  <el-input v-model="form.functionName" style="width: 200px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="功能类型"  prop="functionType">
                  <el-select v-model="form.functionType" filterable  placeholder="请选择">
                    <el-option
                      v-for="item in  dict.function_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="8">
                <el-form-item label="功能模式"  prop="functionMode">
                  <el-select v-model="form.functionMode" filterable  placeholder="请选择">
                    <el-option
                      v-for="item in  dict.function_mode"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                  <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item  v-if="checkPermission(['admin','scriptInfo:list','functionInfo:add','functionInfo:edit','functionInfo:del','functionInfo:export','functionInfo:import'])" title="操作" name="2">
        <div class="head-container">
          <!-- 新增 -->
          <el-button
            v-permission="['admin','functionInfo:add']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="add">新增</el-button>
          <el-button
            v-if="multipleSelection.length === 1"
            v-permission="['admin','functionInfo:edit']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="edit(multipleSelection[0])">修改</el-button>
          <el-popover
            v-if="multipleSelection.length !== 1"
            v-permission="['admin','functionInfo:edit']"
            :ref="multipleSelection"
            placement="top"
            width="180">
            <p v-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
          </el-popover>
          <el-popover
            v-permission="['admin','functionInfo:del']"
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
          <el-button
            v-if="multipleSelection.length === 1"
            v-permission="['admin','scriptInfo:list']"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-link"
            style="margin-left: 20px;margin-bottom: 4px"
            @click="addScripts(multipleSelection[0])">关联脚本</el-button>
          <el-popover
            v-if="multipleSelection.length !== 1"
            v-permission="['admin','scriptInfo:list']"
            :ref="multipleSelection"
            placement="top"
            width="180">
            <p v-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-link" >关联脚本</el-button>
          </el-popover>
          <!-- 导出 -->
          <el-dropdown
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            style="margin-left: 20px;margin-bottom: 4px"
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
            style="margin-left: 20px;margin-bottom: 4px"
            icon="el-icon-upload"
            @click="upload">导入EXECL
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictProductId="dict.product_id"   :dictFunctionType="dict.function_type"    />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" border
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDoubleClick"
              :max-height="clientHeight"
              @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','functionInfo:add']))" @row-contextmenu="rowContextMenu"
              @expand-change="expandChange">
      <af-table-column
              type="selection"
              width="55">
      </af-table-column>
      <af-table-column type="expand">
        <template slot-scope="scope">
          <el-tabs v-if="scope.row.scripts && scope.row.scripts.length > 0" tab-position="left" :value="expandActiveName[scope.row.id].activeName" @tab-click="(tab,event)=>{expandTabClick(tab,event,scope.row)}">
            <el-tab-pane lazy v-for="item in expandModuleType.concat(dict.module_type)" :label="item.label" :key="item.value" :name="item.value">
              <el-table   :data="expandActiveName[scope.row.id].data" size="small" style="width: 100%;">
                <af-table-column prop="scriptClass" label="脚本类别">
                  <template slot-scope="scopest">
                    <div>{{getDictCaption(scopest.row.scriptClass,dict.script_class)}}</div>
                  </template>
                </af-table-column>
                <af-table-column prop="scriptName" label="脚本名称"/>
                <af-table-column prop="effectVersion" label="生效版本"/>
                <af-table-column prop="userManualName" label="用户手册名称"/>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </af-table-column>
      <af-table-column prop="productId" label="产品名称"  width="85px">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
        </template>
      </af-table-column>
      <af-table-column prop="functionName" label="功能名称"  :show-overflow-tooltip="true" width="200px"/>
      <af-table-column prop="functionMode" label="功能模式" :show-overflow-tooltip="true" width="80px"/>
      <af-table-column label="脚本明细">
        <template slot-scope="scope">
          <div>{{getColScript(scope.row)}}</div>
        </template>
      </af-table-column>
<!--      <af-table-column prop="functionType" label="功能类型"  :show-overflow-tooltip="true" width="100px">-->
<!--        <template slot-scope="scope">-->
<!--          <div>{{getDictCaption(scope.row.functionType,dict.function_type)}}</div>-->
<!--        </template>-->
<!--      </af-table-column>-->
      <af-table-column prop="memo" label="备注" :show-overflow-tooltip="true"/>
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
    <transfer-dialog ref="transfer" :dict-module-type="dict.module_type" :dict-product-id="dict.product_id"></transfer-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadFunctionInfo } from '@/api/functionInfo'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption } from '@/utils/index'
import eForm from './form'
import rightMenu from '@/views/business/rightmenu/index'
import transferDialog from  './transfer'
export default {
  components: { eForm, uploadForm, rightMenu, transferDialog},
  mixins: [initData],
  dicts:['product_id','function_type','script_class','module_type'],
  data() {
    return {
      delLoading: false,
      dialog:false,
      uploadApi: 'api/functionInfo',
      multipleSelection:[],
      form: {
        id: '',
        productId: '',
        functionName: '',
        functionType: '',
        functionMode: '',
        memo: ''
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        },
      ],
      expandActiveName:{},
      expandModuleType: [{value:'all',label:'全部'}]
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight -200;
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    getDictCaption,
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
      _this.form = deepClone(data)
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
    },
    expandChange(row,expandedRows){
      if(row.scripts && row.scripts.length){
        this.getActiveName(row);
        this.getScript(row);
      }else {
       this.$message.warning("没有关联脚本!")
      }
    },
    addScripts(row){
       const  _this = this.$refs.transfer;
       _this.func = row;
       _this.queryScript(row.productId,'');
       _this.value  = _this.getScriptsKey(row.scripts);
      _this.dialog = true;
    },
    getScript(row){
      this.$set(this.expandActiveName[row.id],'data',[])
      if(row.scripts){
        if(this.expandActiveName[row.id].activeName == 'all'){
          this.$set(this.expandActiveName[row.id],'data',row.scripts)
        }else {
          var i = 0;
          row.scripts.forEach((item,index)=>{
            if(this.expandActiveName[row.id].activeName == item.moduleType){
              this.$set(this.expandActiveName[row.id].data,i,item);
              i++;
            }
          })
        }
      }
    },
    getActiveName(row){
      if(!this.expandActiveName.hasOwnProperty(row.id)){
        this.$set(this.expandActiveName,row.id,{
          activeName : 'all',
          data:[]
        });

      }
    },
    getColScript(row){
      if(row.scripts && row.scripts.length){
        return row.scripts.map((item)=>{
          if(item.moduleType !== '4'){
            return item.scriptName;
          }
        }).join("\n");
      }
    },
    expandTabClick(tab,event,row){
       console.log(tab.paneName);
      this.$set(this.expandActiveName[row.id],'activeName',tab.paneName);
      this.getScript(row);
    }
  }
}
</script>

<style>
  .el-table .cell {
    white-space: pre-line;
  }
</style>
