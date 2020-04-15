<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :operate="operate"
           :data-id="dataId"
           :menu-id="menuId"
           :columns="columns"
           :data-detail="dataDetail"
           :userId="multipleSelection"/>

    <!-- 新增 -->
    <el-button
      v-permission="['admin','userPermission:add']"
      class="filter-item"
      type="primary"
      size="mini"
      icon="el-icon-plus"
      @click="add('新增')">新增</el-button>

    <!-- 新增 -->
    <el-button
      v-permission="['admin','userPermission:add']"
      class="filter-item"
      type="primary"
      size="mini"
      icon="el-icon-orange"
      @click="add('全选')">设置全部</el-button>

    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;"
              @selection-change="handleSelectionChange"
              :max-height="clientHeight">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column v-if="checkPermission(['admin','userPermission:list'])" label="操作"  align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','userPermission:list']" size="mini" type="primary" icon="el-icon-view" @click="view(scope.row)">
            查看用户数据
          </el-button>
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
import { getData } from '@/api/data'
import { del, downloadUserPermission } from '@/api/userPermission'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone} from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm },
  mixins: [initData],
  props:{
    dataId:{
      Object:Array,
      required: true
    },
    menuId:{
      Object: String,
      required: true
    },
    columns:{
      Object:Array,
      required:true
    }
  },
  data() {
    return {
      multipleSelection:[],
      dataDetail:[]
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
    beforeInit() {
      this.url = 'api/users'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      this.params['enabled'] = "1";
      return true
    },
    add(operate) {
      if((operate == '新增') && (!this.dataId  || !this.dataId.length)){
         this.$message.warning("请选择限制数据!")
        return;
      }
      if(!this.multipleSelection  || !this.multipleSelection.length){
        this.$message.warning("请选择用户数据!")
        return;
      }
      this.operate = operate;
      this.$refs.form.dialog = true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    view(data){
      this.dataDetail = []
      this.operate = '详情';
      const _this = this.$refs.form
      //查询关联的id
      var url = 'api/userPermission';
      const sort = 'id,desc'
      var params = {
        page: 0,
        size: 99999,
        sort: sort,
        userId:data.id,
        menuId: this.menuId
      };
      getData(url,params).then(res=>{
        if(res.content && res.content.length){
          var dataId = res.content.map(item=>{return item.dataId});
          if(!dataId || !dataId.length){
            this.$message.warning("没有设置用户数据权限!")
          }else if(dataId.contains("*")) {
            var detail = {};
            this.columns.forEach((item)=>{
              detail[item.prop] = "全部"
            })
            this.dataDetail.push(detail);
            _this.dialog = true
          }else {
            url = "api/"+this.menuId;
            params = {
              page: 0,
              size: 99999,
              sort: sort,
              id:dataId.join(','),
            };
            getData(url,params).then(res=>{
              this.dataDetail = res.content;
              _this.dialog = true
            }).catch(e=>{
              this.$message.error("查询当前界面用户数据出错!")
            })
          }
        }else {
          this.$message.warning("没有设置用户数据权限!")
        }
      }).catch(e=>{
         this.$message.error("查询用户权限出错!")
      })
    },
  }
}
</script>

<style scoped>

</style>
