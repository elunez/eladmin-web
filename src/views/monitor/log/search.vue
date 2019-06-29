<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="请输入搜索内容" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="$parent.toQuery">搜索</el-button>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      queryTypeOptions: [
        { key: 'username', display_name: '用户名' },
        { key: 'description', display_name: '描述' }
      ]
    }
  }
}
</script>
