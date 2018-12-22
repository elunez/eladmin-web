<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <add v-if="checkPermission(['ADMIN','PERMISSION_ALL','PERMISSION_CREATE'])" :permissions="permissions"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
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
    }
  }
}
</script>
