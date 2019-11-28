<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--搜索-->
      <el-input v-model="query.filename" clearable size="small" placeholder="输入文件名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-date-picker
        v-model="query.createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 上传 -->
      <el-button
        v-permission="['admin','pictures:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="dialog = true"
      >上传图片</el-button>
      <el-button
        v-permission="['admin','pictures:del']"
        :loading="delAllLoading"
        :disabled="data.length === 0 || $refs.table.selection.length === 0"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="beforeDelAllMethod"
      >删除</el-button>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadMethod"
        >导出</el-button>
      </div>
    </div>
    <!--上传图片-->
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body width="600px" @close="doSubmit">
      <el-upload
        :on-preview="handlePictureCardPreview"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :file-list="fileList"
        :action="imagesUploadApi"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="filename" label="文件名" />
      <el-table-column prop="username" label="上传者" />
      <el-table-column ref="table" :show-overflow-tooltip="true" prop="url" label="缩略图">
        <template slot-scope="{row}">
          <el-image
            :src="row.url"
            :preview-src-list="[row.url]"
            fit="contain"
            lazy
            class="el-avatar"
          />
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小" />
      <el-table-column prop="height" label="高度" />
      <el-table-column prop="width" label="宽度" />
      <el-table-column width="180px" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','pictures:del'])" label="操作" width="100px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import { mapGetters } from 'vuex'
import crudPic from '@/api/tools/picture'
import { getToken } from '@/utils/auth'
export default {
  name: 'Pictures',
  mixins: [crud],
  data() {
    return {
      title: '图片',
      crudMethod: { ...crudPic },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
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
    beforeInit() {
      this.url = 'api/pictures'
      return true
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          this.crudMethod.del(this.pictures[i].id).then(res => {})
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
