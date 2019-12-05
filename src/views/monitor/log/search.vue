<template>
  <div class="head-container">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
    />
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
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      @click="$parent.toQuery"
    >搜索</el-button>
    <!-- 导出 -->
    <el-button
      :loading="$parent.downloadLoading"
      size="mini"
      class="filter-item"
      type="warning"
      icon="el-icon-download"
      @click="$parent.downloadMethod"
    >导出</el-button>
    <el-button
      slot="reference"
      v-popover:del_all
      :loading="$parent.delAllLoading"
      type="danger"
      size="mini"
      class="filter-item"
      icon="el-icon-delete"
    >清空数据</el-button>
    <el-popover ref="del_all" placement="top" width="200" trigger="click">
      <p>确定删除所有数据吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="$refs['del_all'].doClose()">取消</el-button>
        <el-button
          :loading="$parent.delAllLoading"
          type="primary"
          size="mini"
          @click="$parent.confirmDelAll"
        >确定</el-button>
      </div>
    </el-popover>
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
