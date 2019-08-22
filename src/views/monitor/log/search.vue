<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="请输入你要搜索的内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
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
  }
}
</script>
