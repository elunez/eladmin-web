<template>
  <div class="app-container">
    <!--工具栏-->
<!--    <div class="head-container">-->
<!--      &lt;!&ndash; 搜索 &ndash;&gt;-->
<!--      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>-->
<!--      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
<!--      </el-select>-->
<!--      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>-->
<!--     </div>-->
<!--     <div class="head-container">-->
<!--        &lt;!&ndash; 新增 &ndash;&gt;-->
<!--        <el-button-->
<!--                v-permission="['admin','custProduct:add']"-->
<!--                class="filter-item"-->
<!--                type="primary"-->
<!--                size="mini"-->
<!--                icon="el-icon-plus"-->
<!--                style="margin-left: 20px"-->
<!--                @click="add">新增</el-button>-->
<!--        &lt;!&ndash; 导出 &ndash;&gt;-->
<!--        <el-dropdown-->
<!--                class="filter-item"-->
<!--                split-button-->
<!--                type="primary"-->
<!--                size="mini"-->
<!--                icon="el-icon-download"-->
<!--                style="margin-left: 20px"-->
<!--                v-permission="['admin','custProduct:export']"-->
<!--                @command="download">-->
<!--          导出EXECL-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item command="导出全部">导出全部</el-dropdown-item>-->
<!--            <el-dropdown-item command="导出选择">导出选择</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
<!--        &lt;!&ndash;导入&ndash;&gt;-->
<!--        <el-button-->
<!--                v-permission="['admin','custProduct:import']"-->
<!--                class="filter-item"-->
<!--                type="primary"-->
<!--                size="mini"-->
<!--                style="margin-left: 20px"-->
<!--                icon="el-icon-upload"-->
<!--                @click="upload">导入EXECL-->
<!--        </el-button>-->
<!--     </div>-->
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"  :dictCustVersionType="dict.cust_version_type"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column prop="versionType" label="客户版本类型">
        <template slot-scope="scope">
          <div v-if=" scope.row.versionType in dict.cust_version_type">{{dict.cust_version_type[scope.row.versionType].label}}</div>
          <div v-else-if=" !scope.row.versionType in dict.cust_version_type">{{scope.row.versionType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="product.productId"  label="产品名称">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.product.productId,dict.product_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="product.versionNo" label="版本号"/>
      <el-table-column prop="product.versionType" label="版本类型">
        <template slot-scope="scope">
          <div v-if="scope.row.product.versionType in  dict.version_type">{{dict.version_type[scope.row.product.versionType].label}}</div>
          <div v-else-if=" !scope.row.product.versionType in dict.version_type">{{scope.row.product.versionType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="product.baseVersionNo" label="基础版本号"/>
      <el-table-column prop="product.releaseStatus" label="发布状态">
        <template slot-scope="scope">
          <div v-if="scope.row.product.releaseStatus in dict.release_status">{{dict.release_status[scope.row.product.releaseStatus].label}}</div>
          <div v-else-if="!scope.row.product.releaseStatus in dict.release_status">{{scope.row.product.releaseStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="product.releaseTime" label="发布时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.product.releaseTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','custProduct:edit','custProduct:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
<!--          <el-button v-permission="['admin','custProduct:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>-->
          <el-popover
            v-permission="['admin','custProduct:del']"
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
import { del, downloadCustProduct } from '@/api/custProduct'
import uploadForm from  '@/views/business/upload/form'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm },
  mixins: [initData],
  dicts:['cust_version_type','product_id','version_type','release_status'],
  props: {
    cust:{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      delLoading: false,
      uploadApi:'api/custProduct/upload',
      multipleSelection:[],
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'custId', display_name: '客户ID' },
        { key: 'productId', display_name: '产品ID' },
        { key: 'versionType', display_name: '版本类型' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch:{
    cust(){
      this.init();
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/custProduct'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort,custId:this.cust.id }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
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
      this.isAdd = true
      this.$refs.form.cust = this.cust;
      this.$refs.form.getProducts();
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        custId: data.custId,
        productId: data.productId,
        versionType: data.versionType
      }
      _this.dialog = true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
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
      downloadCustProduct(data).then(result => {
        downloadFile(result, 'CustProduct列表', 'xlsx')
      this.downloadLoading = false
    }).catch(() => {
        this.downloadLoading = false
      })
    },
    upload(){
      this.$refs.upform.dialog=true;
    }
  }
}
</script>

<style scoped>

</style>
