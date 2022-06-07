<template>
  <el-dialog :visible.sync="dialog" append-to-body title="执行日志" width="88%">
    <!-- 搜索 -->
    <div class="head-container">
      <el-input v-model="query.jobName" clearable size="small" placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <date-range-picker v-model="query.createTime" class="date-item" />
      <el-select v-model="query.isSuccess" placeholder="日志状态" clearable size="small" class="filter-item" style="width: 110px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
          @click="downloadMethod"
        >导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" style="width: 100%;margin-top: -10px;">
      <el-table-column :show-overflow-tooltip="true" prop="jobName" label="任务名称" />
      <el-table-column :show-overflow-tooltip="true" prop="beanName" label="Bean名称" />
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="执行方法" />
      <el-table-column :show-overflow-tooltip="true" prop="params" width="120px" label="参数" />
      <el-table-column :show-overflow-tooltip="true" prop="cronExpression" label="cron表达式" />
      <el-table-column prop="createTime" label="异常详情" width="110px">
        <template slot-scope="scope">
          <el-button v-show="scope.row.exceptionDetail" size="mini" type="text" @click="info(scope.row.exceptionDetail)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="time" width="100px" label="耗时(毫秒)" />
      <el-table-column align="center" prop="isSuccess" width="80px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">{{ scope.row.isSuccess ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" />
    </el-table>
    <el-dialog :visible.sync="errorDialog" append-to-body title="异常详情" width="85%">
      <pre>{{ errorInfo }}</pre>
    </el-dialog>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      :page-size="6"
      style="margin-top:8px;"
      layout="total, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { DateRangePicker },
  mixins: [crud],
  data() {
    return {
      title: '任务日志',
      errorInfo: '', errorDialog: false,
      enabledTypeOptions: [
        { key: 'true', display_name: '成功' },
        { key: 'false', display_name: '失败' }
      ]
    }
  },
  methods: {
    doInit() {
      this.$nextTick(() => {
        this.init()
      })
    },
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/jobs/logs'
      this.size = 6
      return true
    },
    // 异常详情
    info(errorInfo) {
      this.errorInfo = errorInfo
      this.errorDialog = true
    }
  }
}
</script>

<style scoped>
  .java.hljs{
    color: #444;
    background: #ffffff !important;
  }
 ::v-deep .el-dialog__body{
    padding: 0 20px 10px 20px !important;
  }
</style>
