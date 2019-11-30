<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable size="small" placeholder="输入部门名称搜索" prefix-icon="el-icon-search" class="filter-item" @input="getDeptDatas" />
        </div>
        <el-tree :data="deptDatas" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者邮箱搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
          <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="showAddFormDialog"
          >新增</el-button>
          <!-- 导出 -->
          <el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="downloadMethod"
          >导出</el-button>
        </div>
        <!--表单渲染-->
        <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="部门" prop="dept.id">
              <treeselect v-model="form.dept.id" :options="depts" style="width: 178px" placeholder="选择部门" @select="selectFun" />
            </el-form-item>
            <el-form-item label="岗位" prop="job.id">
              <el-select v-model="form.job.id" style="width: 178px" placeholder="请先选择部门">
                <el-option
                  v-for="(item, index) in jobs"
                  :key="item.name + index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex" style="width: 178px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.enabled">
                <el-radio v-for="item in dict.user_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select v-model="form.roles" style="width: 437px" multiple placeholder="请选择">
                <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" width="120" label="电话" />
          <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />
          <el-table-column :show-overflow-tooltip="true" width="120" label="部门 / 岗位">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} / {{ scope.row.job.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled,)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" width="150" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="125" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-permission="['admin','user:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
              <el-popover
                :ref="scope.row.id"
                v-permission="['admin','user:del']"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'User',
  components: { Treeselect },
  mixins: [crud],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      crudMethod: {
        ...crudUser
      },
      title: '用户',
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'name' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      form: { username: null, nickName: null, sex: '男', email: null, enabled: 'false', roles: [], job: { id: null }, dept: { id: null }, phone: null },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDeptDatas()
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    beforeInit() {
      this.url = 'api/users'
      return true
    },
    // 打开新增弹窗前做的操作
    beforeShowAddForm() {
      this.getDepts()
      this.getRoles()
      this.getRoleLevel()
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      this.getDepts()
      this.getRoles()
      this.getRoleLevel()
      this.getJobs(this.form.dept.id)
      this.form.enabled = data.enabled.toString()
      const roles = []
      data.roles.forEach(function(role, index) {
        roles.push(role.id)
      })
      this.form.roles = roles
    },
    // 提交前做的操作
    beforeSubmitMethod() {
      if (!this.form.dept.id) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (!this.form.job.id) {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return false
      } else if (this.form.roles.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      const roles = []
      this.form.roles.forEach(function(data, index) {
        const role = { id: data }
        roles.push(role)
      })
      this.form.roles = roles
      return true
    },
    // 获取左侧部门数据
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDepts(params).then(res => {
        this.deptDatas = res.content
      })
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.init()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crudMethod.edit(data).then(res => {
          this.notify(this.dict.label.user_status[val] + '成功', 'success')
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => {})
    },
    // 获取弹窗内岗位数据
    getJobs(id) {
      getAllJob(id).then(res => {
        this.jobs = res.content
      }).catch(() => {})
    },
    // 点击部门搜索对应的岗位
    selectFun(node, instanceId) {
      this.getJobs(node.id)
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
