<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.appName" clearable placeholder="输入应用名称查询" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
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
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showAddFormDialog"
      >新增
      </el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="sysRestore"
      >系统还原
      </el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="serverStatus"
      >状态查询
      </el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-upload"
        @click="startServer"
      >启动
      </el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-upload"
        @click="stopServer"
      >停止
      </el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-upload"
        @click="deploy"
      >一键部署
      </el-button>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="getFormTitle()" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="应用" prop="app.id">
          <el-select v-model.number="form.app.id" placeholder="请选择" style="width: 370px">
            <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器" prop="deploys">
          <el-select v-model="form.deploys" multiple placeholder="请选择" style="width: 370px">
            <el-option v-for="item in servers" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--统还原组件-->
    <fForm ref="sysRestore" :key="times" :app-name="appName" />
    <dForm ref="deploy" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" highlight-current-row stripe style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column prop="app.name" label="应用名称" />
      <el-table-column prop="servers" label="服务器列表" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','deploy:edit','deploy:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','deploy:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','deploy:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right;margin: 0">
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
import crudDeploy from '@/api/mnt/deploy'
import dForm from './deploy'
import fForm from './sysRestore'
export default {
  components: { dForm, fForm },
  mixins: [crud],
  data() {
    return {
      title: '部署',
      crudMethod: { ...crudDeploy },
      currentRow: {},
      selectIndex: '',
      appName: '',
      urlHistory: '',
      times: 0,
      appId: '',
      deployId: '',
      apps: [],
      servers: [],
      form: {
        id: null,
        app: { id: null },
        deploys: []
      },
      rules: {
        'app.id': [
          { required: true, message: '应用不能为空', trigger: 'blur', type: 'number' }
        ],
        deploys: [
          { required: true, message: '服务器不能为空', trigger: 'blur' }
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
      this.url = 'api/deploy'
      this.selectIndex = ''
      return true
    },
    // 打开新增弹窗前做的操作
    beforeShowAddForm() {
      this.initSelect()
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      this.initSelect()
      const deploys = []
      data.deploys.forEach(function(deploy, index) {
        deploys.push(deploy.id)
      })
      this.form.deploys = deploys
    },
    // 提交前
    beforeSubmitMethod() {
      const deploys = []
      this.form.deploys.forEach(function(data, index) {
        const deploy = { id: data }
        deploys.push(deploy)
      })
      this.form.deploys = deploys
      return true
    },
    deploy() {
      if (!this.selectIndex) {
        this.$message.error('请先选择服务')
      } else {
        this.$refs.deploy.dialog = true
        this.$refs.deploy.deployInfo = this.currentRow
      }
    },
    sysRestore() {
      if (!this.selectIndex) {
        this.$message.error('请先选择服务')
      } else {
        this.$refs.sysRestore.dialog = true
      }
    },
    handleCurrentChange(row) {
      this.currentRow = row
      this.selectIndex = !row ? null : row.id
      this.appName = !row ? null : row.app.name
      this.times = this.times + !row ? 0 : 1
      this.appId = !row ? null : row.appId
      this.deployId = !row ? null : row.id
    },
    startServer() {
      if (!this.selectIndex) {
        this.$message.error('请先选择服务')
      } else {
        this.crudMethod.startServer(JSON.stringify(this.currentRow))
          .then(res => {
          })
          .catch(err => {
            console.log('error:' + err.response.data.message)
          })
      }
    },
    stopServer() {
      if (!this.selectIndex) {
        this.$message.error('请先选择服务')
      } else {
        this.crudMethod.stopServer(JSON.stringify(this.currentRow))
          .then(res => {
          })
          .catch(err => {
            console.log('error:' + err.response.data.message)
          })
      }
    },
    serverStatus() {
      if (!this.selectIndex) {
        this.$message.error('请先选择服务')
      } else {
        this.crudMethod.serverStatus(JSON.stringify(this.currentRow))
          .then(res => {
          })
          .catch(err => {
            console.log('error:' + err.response.data.message)
          })
      }
    },
    initSelect() {
      this.crudMethod.getApps().then(res => {
        this.apps = res.content
      })
      this.crudMethod.getServers().then(res => {
        this.servers = res.content
      })
    }
  }
}
</script>

<style scoped>
</style>
