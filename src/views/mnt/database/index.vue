<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.blurry" clearable placeholder="模糊搜索" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        v-permission="['admin','database:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showAddFormDialog"
      >新增
      </el-button>
      <el-button
        v-permission="['admin','database:add']"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-upload"
        @click="execute"
      >执行脚本
      </el-button>
    </div>
    <!--表单组件-->
    <eForm ref="execute" :database-info="currentRow" />
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="getFormTitle()" width="530px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="数据库名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="连接地址" prop="jdbcUrl">
          <el-input v-model="form.jdbcUrl" style="width: 300px" />
          <el-button :loading="loading" type="info" @click="testConnectDatabase">测试</el-button>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.pwd" type="password" style="width: 370px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" highlight-current-row stripe style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column prop="name" label="数据库名称" width="180" />
      <el-table-column prop="jdbcUrl" label="连接地址" />
      <el-table-column prop="userName" label="用户名" width="100" />
      <el-table-column v-if="checkPermission(['admin','database:edit','database:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','database:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','database:del']"
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
import crudDatabase from '@/api/mnt/database'
import { testDbConnect } from '@/api/mnt/connect'
import eForm from './execute'
export default {
  components: { eForm },
  mixins: [crud],
  data() {
    return {
      title: '数据库',
      crudMethod: { ...crudDatabase },
      currentRow: {},
      selectIndex: '',
      databaseInfo: '',
      form: { id: null, name: null, jdbcUrl: null, userName: null, pwd: null },
      rules: {
        name: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        jdbcUrl: [
          { required: true, message: '请输入数据库连接地址', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入数据库密码', trigger: 'blur' }
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
      this.url = 'api/database'
      return true
    },
    testConnectDatabase() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          testDbConnect(this.form).then((res) => {
            this.loading = false
            this.$notify({
              title: res ? '连接成功' : '连接失败',
              type: res ? 'success' : 'error',
              duration: 2500
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    execute() {
      if (!this.selectIndex) {
        this.$message.error('请先选择数据库')
      } else {
        this.$refs.execute.dialog = true
      }
    },
    handleCurrentChange(row) {
      this.currentRow = row
      this.selectIndex = !row ? null : row.id
    }
  }
}
</script>

<style scoped>
</style>
