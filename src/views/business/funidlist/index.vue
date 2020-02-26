<template>
  <div class="app-container">
    <!--工具栏-->
    <el-collapse>
      <el-collapse-item   title="搜索查询" name="1">
        <div class="head-container">
            <!-- 搜索 -->
            <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="产品名称"  prop="productId">
                      <el-select v-model="form.productId" filterable  placeholder="请选择" style="width: 200px;">
                        <el-option
                          v-for="item in  dict.product_id"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="功能编号"  prop="functionNo">
                      <el-input v-model="form.functionNo" style="width: 200px;"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否控制"  prop="controled">
                      <el-select v-model="form.controled" filterable  placeholder="请选择">
                        <el-option
                          v-for="item in  dict.yes_no"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="功能脚本"  prop="scripts">
                      <el-input v-model="form.scripts" style="width: 200px;"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8"><el-form-item/></el-col>
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
      <el-collapse-item  v-if="checkPermission(['admin','delivery:import'])" title="操作" name="2">
        <div class="head-container">
          <!--导入-->
          <el-button
                  v-permission="['admin','delivery:import']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  icon="el-icon-upload"
                  @click="upload">导入EXECL
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>


    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictYesNo="dict.yes_no"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDoubleClick">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="productId"  label="产品名称" width="80px">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="functionNo" label="功能编号" width="100px"/>
      <el-table-column prop="controled" label="是否控制" width="80px">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.controled,dict.yes_no)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="scripts" label="功能脚本"/>
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
import { del, downloadFunIdAccount } from '@/api/funIdAccount'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption } from '@/utils/index'
import rightMenu from '@/views/business/rightmenu/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['yes_no','product_id'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/funIdAccount',
      multipleSelection:[],
      form: {
        id: '',
        productId: '',
        functionNo: '',
        controled: '',
        scripts: ''
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        },
      ],
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
      this.url = 'api/funIdAccount'
      const sort = 'productId,functionNo,desc'
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
      downloadFunIdAccount(data).then(result => {
        downloadFile(result, '功能编号清单列表', 'xlsx')
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

<style>
  .el-table .cell {
    white-space: pre-line;
  }
</style>
