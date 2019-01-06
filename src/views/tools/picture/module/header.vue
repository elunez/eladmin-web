<template>
  <div class="head-container">
    <!--搜索-->
    <el-input v-model="query.value" clearable placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 上传 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="checkPermission(['ADMIN','PICTURE_ALL','PICTURE_UPLOAD'])"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="$refs.form.dialog = true">上传图片</el-button>
      <eForm ref="form"/>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  methods: {
    checkPermission,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    }
  }
}
</script>
