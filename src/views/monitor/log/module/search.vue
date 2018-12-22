<template>
  <div class="head-container">
    <el-input v-model="query.username" clearable placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-select v-model="query.logType" placeholder="日志类型" clearable class="filter-item" style="width: 110px" @change="toQuery">
      <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
  </div>
</template>

<script>
// 查询条件
export default {
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      enabledTypeOptions: [
        { key: 'INFO', display_name: 'INFO' },
        { key: 'ERROR', display_name: 'ERROR' }
      ]
    }
  },
  methods: {
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    }
  }
}
</script>
