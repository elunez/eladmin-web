<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.id" clearable placeholder="输入名称或IP搜索" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
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
      <!-- 新增 -->
      <el-button
        v-permission="['admin','serverDeploy:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showAddFormDialog"
      >新增
      </el-button>
    </div>
    <!--表单组件-->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="getFormTitle()" width="470px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="55px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" style="width: 370px" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model.number="form.port" controls-position="right" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" style="width: 370px" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" style="width: 200px" />
          <el-button :loading="loading" type="success" style="align: right;" @click="testConnectServer">测试连接</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="ip" label="IP" />
      <el-table-column prop="port" label="端口" />
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','serverDeploy:edit','serverDeploy:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','serverDeploy:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','serverDeploy:del']"
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
import { crudServer, testConnect } from '@/api/mnt/serverDeploy'
import { validateIP } from '@/utils/validate'
export default {
  mixins: [crud],
  data() {
    return {
      title: '服务器',
      crudMethod: { ...crudServer },
      accountList: [],
      accountMap: {},
      form: { id: null, name: null, ip: null, port: 22, account: 'root', password: null },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          { validator: validateIP, trigger: 'change' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur', type: 'number' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
    async beforeInit() {
      this.url = 'api/serverDeploy'
      return true
    },
    testConnectServer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          testConnect(this.form).then((res) => {
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
