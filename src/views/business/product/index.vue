<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-form ref="queryForm" :model="form"  size="small" label-width="120px">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="产品名称" prop="productId">
              <el-select v-model="form.productId" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.product_id"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="versionNo">
              <el-input v-model="form.versionNo"  maxlength="50" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本类型" prop="versionType">
              <el-select v-model="form.versionType" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.version_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="基础版本号" prop="baseVersionNo">
              <el-input v-model="form.baseVersionNo" style="width: 200px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布状态" prop="releaseStatus">
              <el-select v-model="form.releaseStatus" filterable  placeholder="请选择">
                <el-option
                  v-for="item in dict.release_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker v-model="form.releaseTime" type="datetime" style="width: 200px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item/></el-col>
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
     <div class="head-container">
        <!-- 新增 -->
        <el-button
                v-permission="['admin','product:add']"
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
         v-permission="['admin','product:export']"
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
                v-permission="['admin','product:import']"
                class="filter-item"
                type="primary"
                size="mini"
                style="margin-left: 20px"
                icon="el-icon-upload"
                @click="upload">导入EXECL
        </el-button>
     </div>
    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictProductId="dict.product_id"   :dictVersionType="dict.version_type"   :dictReleaseStatus="dict.release_status"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="rowDoubleClick"
              @contextmenu.prevent.native="$refs.rightMenu.openMenu($event,checkPermission(['admin','product:add']))" @row-contextmenu="rowContextMenu">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="productId"  label="产品名称">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="versionNo" label="版本号"/>
      <el-table-column prop="versionType" label="版本类型">
        <template slot-scope="scope">
          <div v-if="scope.row.versionType in  dict.version_type">{{dict.version_type[scope.row.versionType].label}}</div>
          <div v-else-if=" !scope.row.versionType in dict.version_type">{{scope.row.versionType}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="baseVersionNo" label="基础版本号"/>
      <el-table-column prop="releaseStatus" label="发布状态">
        <template slot-scope="scope">
          <div v-if="scope.row.releaseStatus in dict.release_status">{{dict.release_status[scope.row.releaseStatus].label}}</div>
          <div v-else-if="!scope.row.releaseStatus in dict.release_status">{{scope.row.releaseStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="releaseTime" label="发布时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注"/>
      <el-table-column v-if="checkPermission(['admin','product:edit','product:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','product:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','product:del']"
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
    <right-menu ref="rightMenu" :menu="menu"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadProduct } from '@/api/product'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile,deepClone } from '@/utils/index'
import eForm from './form'
import rightMenu from '@/views/business/rightmenu/index'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['product_id','version_type','release_status'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/product',
      multipleSelection:[],
      form: {
        id: '',
        productId: '',
        versionNo: '',
        versionType: '',
        baseVersionNo: '',
        releaseStatus: '',
        releaseTime: null,
        memo: ''
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    deepClone,
    checkPermission,
    beforeInit() {
      this.url = 'api/product'
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
      this.operate = '新增'
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.operate = '修改'
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        productId: data.productId,
        versionNo: data.versionNo,
        versionType: data.versionType,
        baseVersionNo: data.baseVersionNo,
        releaseStatus: data.releaseStatus,
        releaseTime: data.releaseTime,
        memo: data.memo
      };
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
    },    // 导出
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
      this.openFullScreen('导出','产品信息列表');
      downloadProduct(data).then(result => {
        downloadFile(result, '产品信息列表', 'xlsx')
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
    }
  }
}
</script>

<style scoped>

</style>
