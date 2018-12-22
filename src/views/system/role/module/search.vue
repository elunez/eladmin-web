<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <add v-if="checkPermission(['ADMIN','ROLE_ALL','ROLE_CREATE'])" :permissions="permissions"/>
    <el-button v-if="checkPermission(['ADMIN'])" :loading="downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="download">导出</el-button>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'
import add from './add'
// 查询条件
export default {
  components: { add },
  props: {
    query: {
      type: Object,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    checkPermission,
    toQuery() {
      console.log(this.query)
      this.$parent.page = 0
      this.$parent.init()
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '名称', '描述', '创建日期']
        const filterVal = ['id', 'name', 'remark', 'createTime']
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
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
