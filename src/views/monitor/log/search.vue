<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="请输入你要搜索的内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-date-picker
      v-model="query.date"
      type="daterange"
      range-separator=":"
      class="el-range-editor--small filter-item"
      style="height: 30.5px;width: 220px"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始日期"
      end-placeholder="结束日期"/>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="$parent.toQuery">搜索</el-button>
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
</template>

<script>
import { downloadFile } from '@/utils/index'
import { downloadLog } from '@/api/log'
export default {
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    download() {
      this.$parent.beforeInit()
      this.downloadLoading = true
      downloadLog(this.$parent.params).then(result => {
        downloadFile(result, '系统日志列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
