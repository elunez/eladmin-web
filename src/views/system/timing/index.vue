<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.jobName" clearable size="small" placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
      <!-- 任务日志 -->
      <el-button
        class="filter-item"
        size="mini"
        type="info"
        icon="el-icon-tickets"
        @click="doLog"
      >日志</el-button>
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" style="width: 460px;" />
        </el-form-item>
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="form.beanName" style="width: 460px;" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="form.methodName" style="width: 460px;" />
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input v-model="form.params" style="width: 460px;" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" style="width: 460px;" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio v-model="form.isPause" :label="false">启用</el-radio>
          <el-radio v-model="form.isPause" :label="true">暂停</el-radio>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="form.remark" style="width: 460px;" rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="jobName" width="100px" label="任务名称" />
      <el-table-column :show-overflow-tooltip="true" prop="beanName" label="Bean名称" />
      <el-table-column :show-overflow-tooltip="true" prop="methodName" width="90px" label="执行方法" />
      <el-table-column :show-overflow-tooltip="true" prop="params" width="80px" label="参数" />
      <el-table-column :show-overflow-tooltip="true" prop="cronExpression" width="100px" label="cron表达式" />
      <el-table-column :show-overflow-tooltip="true" prop="isPause" width="90px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{ scope.row.isPause ? '已暂停' : '运行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','timing:edit','timing:del'])" label="操作" width="180px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="showEditFormDialog(scope.row)">编辑</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">执行</el-button>
          <el-button v-permission="['admin',,'timing:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.isPause ? '恢复' : '暂停')">
            {{ scope.row.isPause ? '恢复' : '暂停' }}
          </el-button>
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','timing:del']"
            placement="top"
            width="200"
          >
            <p>确定停止并删除该任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">删除</el-button>
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
import crudJob from '@/api/system/timing'
import Log from './log'
export default {
  name: 'Timing',
  components: { Log },
  mixins: [crud],
  data() {
    return {
      title: '定时任务',
      crudMethod: { ...crudJob },
      form: { jobName: null, beanName: null, methodName: null, params: null, cronExpression: null, isPause: false, remark: null },
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: '请输入Bean名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请输入Cron表达式', trigger: 'blur' }
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
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/jobs'
      return true
    },
    // 执行
    execute(id) {
      this.crudMethod.execution(id).then(res => {
        this.$notify({
          title: '执行成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 改变状态
    updateStatus(id, status) {
      this.crudMethod.updateIsPause(id).then(res => {
        this.init()
        this.$notify({
          title: status + '成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 显示日志
    doLog() {
      this.$refs.log.dialog = true
      this.$refs.log.doInit()
    }
  }
}
</script>
