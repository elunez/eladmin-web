<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.jobName" clearable size="small" placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
        <!-- 任务日志 -->
        <el-button
          slot="right"
          class="filter-item"
          size="mini"
          type="info"
          icon="el-icon-tickets"
          @click="doLog"
        >日志</el-button>
      </crudOperation>
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="730px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="form.beanName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="form.methodName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="子任务ID">
          <el-input v-model="form.subTask" placeholder="多个用逗号隔开，按顺序执行" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务负责人" prop="personInCharge">
          <el-input v-model="form.personInCharge" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="告警邮箱" prop="email">
          <el-input v-model="form.email" placeholder="多个邮箱用逗号隔开" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="失败后暂停">
          <el-radio-group v-model="form.pauseAfterFailure" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.isPause" style="width: 220px">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input v-model="form.params" style="width: 556px;" rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="任务ID" />
      <el-table-column :show-overflow-tooltip="true" prop="jobName" label="任务名称" />
      <el-table-column :show-overflow-tooltip="true" prop="beanName" label="Bean名称" />
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="执行方法" />
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数" />
      <el-table-column :show-overflow-tooltip="true" prop="cronExpression" label="cron表达式" />
      <el-table-column :show-overflow-tooltip="true" prop="isPause" width="90px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{ scope.row.isPause ? '已暂停' : '运行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="description" width="150px" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="136px" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','timing:edit','timing:del']" label="操作" width="170px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">执行</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.isPause ? '恢复' : '暂停')">
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
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/system/timing'
import Log from './log'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, jobName: null, subTask: null, beanName: null, methodName: null, params: null, cronExpression: null, pauseAfterFailure: true, isPause: false, personInCharge: null, email: null, description: null }
export default {
  name: 'Timing',
  components: { Log, pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ title: '定时任务', url: 'api/jobs', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false,
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      },
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: '请输入Bean名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请输入Cron表达式', trigger: 'blur' }
        ],
        personInCharge: [
          { required: true, message: '请输入负责人名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob.execution(id).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 改变状态
    updateStatus(id, status) {
      if (status === '恢复') {
        this.updateParams(id)
      }
      crudJob.updateIsPause(id).then(res => {
        this.crud.toQuery()
        this.crud.notify(status + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    updateParams(id) {
      console.log(id)
    },
    delMethod(id) {
      this.delLoading = true
      crudJob.del([id]).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    // 显示日志
    doLog() {
      this.$refs.log.dialog = true
      this.$refs.log.doInit()
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>
