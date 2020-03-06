<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable placeholder="输入名称搜索" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <el-button
          slot="left"
          v-permission="['admin','app:add']"
          :disabled="!currentRow"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="copy"
        >复制</el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
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
        <el-form-item label="部署脚本" prop="deployScript">
          <el-input v-model="form.deployScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="启动脚本" prop="startScript">
          <el-input v-model="form.startScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="55" />
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
      <el-table-column v-permission="['admin','app:edit','app:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudApp from '@/api/mnt/app'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, port: 8080, uploadPath: '/opt/upload', deployPath: '/opt/app', backupPath: '/opt/backup', startScript: null, deployScript: null }
export default {
  name: 'App',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ title: '应用', url: 'api/app', crudMethod: { ...crudApp }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      currentRow: null,
      permission: {
        add: ['admin', 'app:add'],
        edit: ['admin', 'app:edit'],
        del: ['admin', 'app:del']
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
  methods: {
    copy() {
      for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key]
      }
      this.form.id = null
      this.form.createTime = null
      this.crud.toAdd()
    },
    handleCurrentChange(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
    }
  }
}
</script>

<style scoped>
</style>
