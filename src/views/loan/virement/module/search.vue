<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-select v-model="query.type" clearable placeholder="搜索类型" class="filter-item" style="width: 130px">
      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-select v-model="query.enabled" clearable placeholder="扣款状态" class="filter-item" style="width: 110px" @change="toQuery">
      <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-date-picker
      v-model="query.time"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      default-time="['00:00:00', '23:59:59']"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>

    <el-button v-if="checkPermission(['ADMIN','OPERATION_ALL','FINANCE_ALL'])" :loading="downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="download">导出</el-button>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'

// 查询条件
export default {
  props: {
    roles: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: '扣款编号' },
        { key: 'applyId', display_name: '订单编号' },
        { key: 'repayId', display_name: '还款编号' }
      ],
      enabledTypeOptions: [
        { key: '1', display_name: '扣款中' },
        { key: '2', display_name: '扣款成功' },
        { key: '3', display_name: '扣款失败' }
      ]
    }
  },
  methods: {
    checkPermission,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '手机号', '申请时间']
        const filterVal = ['id', 'userName', 'phone', 'applyTime']
        const data = this.formatJson(filterVal, this.$parent.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
