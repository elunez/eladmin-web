<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 上传 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="$refs.form.dialog = true">上传文件</el-button>
      <eForm ref="form"/>
    </div>
    <!-- 同步 -->
    <el-button :icon="icon" class="filter-item" size="mini" type="primary" @click="synchronize">{{ buttonName }}</el-button>
  </div>
</template>

<script>
import eForm from './form'
import { sync } from '@/api/qiniu'
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      icon: 'el-icon-refresh',
      buttonName: '同步数据'
    }
  },
  methods: {
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    synchronize() {
      this.icon = 'el-icon-loading'
      this.buttonName = '同步中'
      sync().then(res => {
        this.icon = 'el-icon-refresh'
        this.buttonName = '同步数据'
        this.$message({
          showClose: true,
          message: '数据同步成功',
          type: 'success',
          duration: 1500
        })
        this.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        this.buttonName = '同步数据'
        console.log(err.response.data.message)
      })
    }
  }
}
</script>
