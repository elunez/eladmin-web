<template>
  <el-dialog :visible.sync="dialog" append-to-body title="执行日志" width="88%">
    <!-- 搜索 -->
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-date-picker
        v-model="query.date"
        type="daterange"
        range-separator=":"
        class="el-range-editor--small filter-item"
        style="height: 30.5px;width: 220px"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-select v-model="query.isSuccess" placeholder="日志状态" clearable class="filter-item" style="width: 110px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;margin-top: -10px;">
      <el-table-column :show-overflow-tooltip="true" prop="jobName" label="任务名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="beanName" label="Bean名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="执行方法"/>
      <el-table-column :show-overflow-tooltip="true" prop="params" width="120px" label="参数"/>
      <el-table-column :show-overflow-tooltip="true" prop="cronExpression" label="cron表达式"/>
      <el-table-column prop="createTime" label="异常详情" width="110px">
        <template slot-scope="scope">
          <el-button v-show="scope.row.exceptionDetail" size="mini" type="text" @click="info(scope.row.exceptionDetail)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="time" width="100px" label="耗时(毫秒)"/>
      <el-table-column align="center" prop="isSuccess" width="80px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">{{ scope.row.isSuccess ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="errorDialog" append-to-body title="异常详情" width="85%">
      <span>
        {{ errorInfo }}
      </span>
    </el-dialog>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      :page-size="6"
      style="margin-top:8px;"
      layout="total, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </el-dialog>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { downloadLogs } from '@/api/timing'
import { parseTime, downloadFile } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      errorInfo: '', errorDialog: false,
      dialog: false, delLoading: false,
      enabledTypeOptions: [
        { key: 'true', display_name: '成功' },
        { key: 'false', display_name: '失败' }
      ]
    }
  },
  methods: {
    parseTime,
    checkPermission,
    doInit() {
      this.$nextTick(() => {
        this.init()
      })
    },
    toQuery() {
      this.page = 0
      this.doInit()
    },
    beforeInit() {
      this.url = 'api/jobs/logs'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      const isSuccess = query.isSuccess
      this.size = 6
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['jobName'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      if (isSuccess !== '' && isSuccess !== null) { this.params['isSuccess'] = isSuccess }
      return true
    },
    info(errorInfo) {
      this.errorInfo = errorInfo
      this.errorDialog = true
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadLogs(this.params).then(result => {
        downloadFile(result, '任务日志列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
