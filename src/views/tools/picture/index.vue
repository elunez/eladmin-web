<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--搜索-->
      <el-input v-model="query.filename" clearable placeholder="输入文件名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 上传 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PICTURE_ALL','PICTURE_UPLOAD']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="dialog = true">上传图片</el-button>
      </div>
      <div v-permission="['ADMIN','PICTURE_ALL','PICTURE_DELETE']" style="display: inline-block;">
        <el-button
          :loading="delAllLoading"
          :disabled="data.length === 0 || $refs.table.selection.length === 0"
          class="filter-item"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="open">删除</el-button>
      </div>
    </div>
    <!--上传图片-->
    <el-dialog :visible.sync="dialog" append-to-body width="600px" @close="doSubmit">
      <el-upload
        :on-preview="handlePictureCardPreview"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :file-list="fileList"
        :action="imagesUploadApi"
        list-type="picture-card">
        <i class="el-icon-plus"/>
      </el-upload>
      <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="filename" label="文件名"/>
      <el-table-column prop="username" label="上传者"/>
      <el-table-column ref="table" :show-overflow-tooltip="true" prop="url" label="缩略图">
        <template slot-scope="scope">
          <a :href="scope.row.url" style="color: #42b983" target="_blank"><img :src="scope.row.url" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小"/>
      <el-table-column prop="height" label="高度"/>
      <el-table-column prop="width" label="宽度"/>
      <el-table-column width="180px" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PICTURE_ALL','PICTURE_DELETE'])" label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover
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
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { del, delAll } from '@/api/picture'
import { getToken } from '@/utils/auth'
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false, downloadLoading: false,
      delAllLoading: false,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      dialog: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      pictures: []
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
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
      this.url = 'api/pictures'
      const sort = 'id,desc'
      const query = this.query
      const filename = query.filename
      this.params = { page: this.page, size: this.size, sort: sort }
      if (filename) { this.params[filename] = filename }
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
    doDelete() {
      this.delAllLoading = true
      const data = this.$refs.table.selection
      const ids = []
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id)
      }
      delAll(ids).then(res => {
        this.delAllLoading = false
        this.init()
        this.dleChangePage(ids.length)
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
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          del(this.pictures[i].id).then(res => {})
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
    }
  }
}
</script>

<style scoped>

</style>
