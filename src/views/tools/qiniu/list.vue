<template>
  <div class="app-container" style="padding: 8px;">
    <!-- 工具栏 -->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 上传 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">上传文件</el-button>
      </div>
      <!-- 同步 -->
      <el-button :icon="icon" class="filter-item" size="mini" type="warning" @click="synchronize">同步数据</el-button>
      <!-- 多选删除 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PICTURE_ALL','PICTURE_DELETE']"
          :loading="delAllLoading"
          :disabled="data.length === 0 || $refs.table.selection.length === 0"
          class="filter-item"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="open">删除</el-button>
      </div>
    </div>
    <!-- 文件上传 -->
    <el-dialog :visible.sync="dialog" append-to-body width="500px" @close="doSubmit">
      <el-upload
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
        :headers="headers"
        :action="qiNiuUploadApi"
        class="upload-demo"
        multiple>
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55"/>
      <el-table-column :show-overflow-tooltip="true" label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="文件类型">
        <template slot-scope="scope">
          <span>{{ getExtensionName(scope.row.key) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bucket" label="空间名称"/>
      <el-table-column prop="size" label="文件大小"/>
      <el-table-column prop="type" label="空间类型"/>
      <el-table-column width="180px" prop="updateTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PICTURE_ALL','PICTURE_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button
            :loading="downloadLoading"
            size="mini"
            type="primary"
            icon="el-icon-download"
            @click="download(scope.row.id)"/>
          <el-popover
            v-permission="['ADMIN','PICTURE_ALL','PICTURE_DELETE']"
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
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import { del, download, sync, delAll } from '@/api/qiniu'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  mixins: [initData],
  data() {
    return {
      icon: 'el-icon-refresh', delAllLoading: false,
      url: '', headers: { 'Authorization': 'Bearer ' + getToken() }, dialog: false,
      dialogImageUrl: '', dialogVisible: false, fileList: [], files: [],
      newWin: null, downloadLoading: false, delLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'qiNiuUploadApi'
    ])
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/qiNiuContent'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['key'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
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
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      download(id).then(res => {
        this.downloadLoading = false
        this.url = res.url
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    getExtensionName(name) {
      const dot = name.lastIndexOf('.')
      if ((dot > -1) && (dot < (name.length - 1))) {
        return name.substring(dot + 1)
      }
      return name
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          del(this.files[i].id).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.init()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    synchronize() {
      this.icon = 'el-icon-loading'
      this.buttonName = '同步中'
      sync().then(res => {
        this.icon = 'el-icon-refresh'
        this.buttonName = '同步数据'
        this.$message({
          showClose: true,
          message: '数据同步成功',
          type: 'success',
          duration: 1500
        })
        this.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        this.buttonName = '同步数据'
        console.log(err.response.data.message)
      })
    },
    doDelete() {
      this.delAllLoading = true
      const data = this.$refs.table.selection
      const ids = []
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id)
      }
      delAll(ids).then(res => {
        this.delAllLoading = false
        this.dleChangePage(ids.length)
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delAllLoading = false
        console.log(err.response.data.message)
      })
    },
    open() {
      this.$confirm('你确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete()
      })
    }
  }
}
</script>

<style scoped>

</style>
