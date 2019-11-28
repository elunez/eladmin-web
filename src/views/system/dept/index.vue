<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.name" clearable size="small" placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
    <!--表单组件-->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
          <el-radio v-for="item in dict.dept_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item v-if="form.pid !== 0" style="margin-bottom: 0px;" label="上级部门" prop="pid">
          <treeselect v-model="form.pid" :options="depts" style="width: 370px;" placeholder="选择上级类目" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all :data="data" row-key="id" size="small">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','dept:edit','dept:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','dept:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','dept:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="scope.row.id === 1" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDept from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Dept',
  components: { Treeselect },
  mixins: [crud],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      title: '部门',
      crudMethod: { ...crudDept },
      depts: [],
      form: { id: null, name: null, pid: 1, enabled: 'true' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dept'
      return true
    },
    // 打开新增弹窗前做的操作
    beforeShowAddForm() {
      this.getDepts()
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      this.getDepts()
      this.form.enabled = data.enabled.toString()
    },
    // 提交前先做下验证
    beforeSubmitMethod() {
      if (!this.form.pid) {
        this.$message({
          message: '上级部门不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crudMethod.edit(data).then(res => {
          this.notify(this.dict.label.dept_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取所有部门
    getDepts() {
      this.crudMethod.getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    }
  }
}
</script>

<style scoped>

</style>
