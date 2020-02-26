<template>
  <div class="app-container">
    <!--工具栏-->
    <!-- 新增 -->
    <el-button
      v-permission="['admin','deliverConfig:add']"
      class="filter-item"
      type="primary"
      size="mini"
      icon="el-icon-plus"
      style="margin-left: 20px;margin-top: 7px"
      @click="add">新增</el-button>
    <el-button
      v-if="multipleSelection.length === 1"
      v-permission="['admin','deliverConfig:edit']"
      class="filter-item"
      type="primary"
      size="mini"
      icon="el-icon-edit"
      style="margin-left: 20px;margin-bottom: 4px"
      @click="edit(multipleSelection[0])">修改</el-button>
    <el-popover
      v-if="multipleSelection.length !== 1"
      v-permission="['admin','deliverConfig:edit']"
      :ref="multipleSelection"
      placement="top"
      width="180">
      <p v-if="multipleSelection.length <1">请选择一条数据!</p>
      <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
      <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
    </el-popover>
    <el-popover
      v-permission="['admin','deliverConfig:del']"
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
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictProductId="dict.product_id"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDoubleClick"
              :max-height="clientHeight">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="id" label="标识符"/>
      <el-table-column prop="productId" label="产品名称">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"/>
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
import { del, downloadDeliverConfig } from '@/api/deliverConfig'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption } from '@/utils/index'
import rightMenu from '@/views/business/rightmenu/index'
import eForm from './form'
import store from '@/store'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['product_id'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/deliverConfig',
      multipleSelection:[],
      form: {
        id: '',
        productId: '',
        address: '',
        username:store.getters.user.username
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
      this.url = 'api/deliverConfig'
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
      downloadDeliverConfig(data).then(result => {
        downloadFile(result, '交付物配置列表', 'xlsx')
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
