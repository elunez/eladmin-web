<template>
  <div class="app-container">
    <!--工具栏-->
<!--    <div class="head-container">-->
<!--      &lt;!&ndash; 搜索 &ndash;&gt;-->
<!--      <el-form ref="queryForm" :model="form"  size="small" label-width="100px">-->
<!--              <el-form-item label="文件名"  prop="fileName">-->
<!--                  <el-input v-model="form.fileName" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="是否目录"  prop="isDir">-->
<!--                  <el-select v-model="form.isDir" filterable  placeholder="请选择">-->
<!--                    <el-option-->
<!--                            v-for="item in  dict.is_dir"-->
<!--                            :key="item.value"-->
<!--                            :label="item.label"-->
<!--                            :value="item.value" ></el-option>-->
<!--                  </el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="文件大小"  prop="fileSize">-->
<!--                  <el-input v-model="form.fileSize" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="最近访问时间"  prop="fileAtime">-->
<!--                  <el-input v-model="form.fileAtime" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="最近修改时间"  prop="fileMtime">-->
<!--                  <el-input v-model="form.fileMtime" style="width: 200px;"/>-->
<!--              </el-form-item>-->
<!--      </el-form>-->
<!--      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>-->
<!--      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>-->
<!--     </div>-->
     <div class="head-container">
        <!-- 新增 -->
         选择FTP:
       <el-select v-model="ftpUser" filterable  placeholder="请选择">
         <el-option
           v-for="item in ftp"
           :key="item.id"
           :label="item.sftpHost"
           :value="item.id" ></el-option>
       </el-select>
        <!--操作 -->
         <el-dropdown
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 style="margin-left: 20px"
                 v-permission="['admin','ftpFile:add']"
                 @command="operateSftp">
           <el-button type="primary" size="mini">
             操作<i class="el-icon-arrow-down el-icon--right"></i>
           </el-button>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item command="all">全局扫描</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>

     </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;"
              @selection-change="handleSelectionChange">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="fileName" label="文件名"/>
      <el-table-column prop="isDir" label="是否目录">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.isDir,dict.is_dir)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小"/>
      <el-table-column prop="fileAtime" label="最近访问时间"/>
      <el-table-column prop="fileMtime" label="最近修改时间"/>
      <el-table-column v-if="checkPermission(['admin','ftpFile:edit','ftpFile:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','ftpFile:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','ftpFile:del']"
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

  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, refresh } from '@/api/ftpFile'
import {   deepClone, getDictCaption } from '@/utils/index'
import { queryFtpByPerson } from '@/utils/business'
export default {
  mixins: [initData],
  dicts:['is_dir'],
  props:{
    useType:{
      type:String,
      default:'0'
    }
  },
  data() {
    return {
      delLoading: false,
      uploadApi:'api/ftpFile',
      multipleSelection:[],
      form: {
        id: '',
        fileName: '',
        isDir: '',
        fileSize: '',
        fileAtime: '',
        fileMtime: ''
      },
      ftp:[],
      ftpUser:null
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
      queryFtpByPerson(this.useType).then(res=>{
        this.ftp = res.option;
      });
    })
  },
  methods: {
    checkPermission,
    getDictCaption,
    beforeInit() {
      this.url = 'api/ftpFile'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    operateSftp(command) {
      if(command==='all'){
         var data = {}
         this.ftp.forEach((item)=>{
           if(item.id ===this.ftpUser ){
             data.user  = item;
           }
         })
         data.pathName = '';
         data.parentId = 0;
         console.log(data);
         this.openFullScreen('扫描FTP:',this.ftpUser.sftpHost);
         refresh(data).then(res=>{
           this.loadingInstance.close();
         }).catch(e=>{
           this.loadingInstance.close();
           })
      }
    },
    resetQuery(){
      this.$refs['queryForm'].resetFields();
    },
    rowContextMenu(row){
      this.rightClickRow = row;
    },

  }
}
</script>

<style scoped>

</style>
