<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;">
    <el-tab-pane label="本地存储" name="first">
      <Local/>
    </el-tab-pane>
    <el-tab-pane label="七牛云存储" name="second">
      <QiNiu/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import QiNiu from './qiniu/list'
import Local from './local/index'
import '@/styles/description.scss'
export default {
  name: 'Storage',
  components: { QiNiu, Local },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style scoped>
</style>
