<template>
  <div class="app-container" style="padding: 8px;">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <!-- 新增 -->
        <el-button
          slot="left"
          v-permission="['admin','storage:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="crud.toAdd"
        >上传
        </el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="文件名">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <!--   上传文件   -->
        <el-form-item v-if="crud.status.add" label="上传">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="fileUploadApi + '?name=' + form.name"
          >
            <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <el-popover
            :content="'file/' + scope.row.type + '/' + scope.row.realName"
            placement="top-start"
            title="路径"
            width="200"
            trigger="hover"
          >
            <a
              slot="reference"
              :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              target="_blank"
            >
              {{ scope.row.name }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/' + row.type + '/' + row.realName"
            :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="suffix" label="文件类型" />
      <el-table-column prop="type" label="类别" />
      <el-table-column prop="size" label="大小" />
      <el-table-column prop="operate" label="操作人" />
      <el-table-column prop="createTime" label="创建日期" />
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, name: '' }
export default {
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: { 'Authorization': getToken() },
      permission: {
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
 ::v-deep .el-image__error, .el-image__placeholder{
    background: none;
  }
 ::v-deep .el-image-viewer__wrapper{
    top: 55px;
  }
</style>
