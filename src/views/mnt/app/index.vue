<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.name" clearable placeholder="输入名称搜索" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
      <el-date-picker
        v-model="query.createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        class="el-range-editor--small date-item"
        style="width: 220px;height: 30.5px"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        v-permission="['admin','app:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showAddFormDialog"
      >新增</el-button>
      <el-button
        v-permission="['admin','app:add']"
        :disabled="!currentRow"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="copy"
      >复制新增</el-button>
    </div>
    <!--表单组件-->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="getFormTitle()" width="800px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="form.name" style="width: 670px" placeholder="部署后的文件或者目录名称，用于备份" />
        </el-form-item>
        <el-form-item label="应用端口" prop="port">
          <el-input-number v-model.number="form.port" placeholder="例如：8080" />
        </el-form-item>
        <el-form-item label="上传目录" prop="uploadPath">
          <el-input v-model="form.uploadPath" style="width: 670px" placeholder="例如: /opt/upload" />
        </el-form-item>
        <el-form-item label="部署目录" prop="deployPath">
          <el-input v-model="form.deployPath" style="width: 670px" placeholder="例如: /opt/app" />
        </el-form-item>
        <el-form-item label="备份目录" prop="backupPath">
          <el-input v-model="form.backupPath" style="width: 670px" placeholder="例如: /opt/backup" />
        </el-form-item>
        <el-form-item label="启动脚本" prop="startScript">
          <el-input v-model="form.startScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="部署脚本" prop="deployScript">
          <el-input v-model="form.deployScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column prop="name" label="应用名称" />
      <el-table-column prop="port" label="端口号" />
      <el-table-column prop="uploadPath" label="上传目录" />
      <el-table-column prop="deployPath" label="部署目录" />
      <el-table-column prop="backupPath" label="备份目录" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','app:edit','app:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','app:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','app:del']"
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
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudApp from '@/api/mnt/app'
export default {
  mixins: [crud],
  data() {
    return {
      title: '应用',
      crudMethod: { ...crudApp },
      currentRow: null,
      form: {
        id: null,
        name: null,
        port: 8080,
        uploadPath: '/opt/upload',
        deployPath: '/opt/app',
        backupPath: '/opt/backup',
        startScript: null,
        deployScript: null
      },
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入应用端口', trigger: 'blur', type: 'number' }
        ],
        uploadPath: [
          { required: true, message: '请输入上传目录', trigger: 'blur' }
        ],
        deployPath: [
          { required: true, message: '请输入部署目录', trigger: 'blur' }
        ],
        backupPath: [
          { required: true, message: '请输入备份目录', trigger: 'blur' }
        ],
        startScript: [
          { required: true, message: '请输入启动脚本', trigger: 'blur' }
        ],
        deployScript: [
          { required: true, message: '请输入部署脚本', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/app'
      return true
    },
    copy() {
      this.isAdd = true
      this.dialog = true
      this.form = this.currentRow
    },
    handleCurrentChange(row) {
      this.currentRow = row
    }
  }
}
</script>

<style scoped>
</style>
