<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;" @tab-click="handleClick">
    <el-tab-pane label="邮箱配置" name="first">
      <Config/>
    </el-tab-pane>
    <el-tab-pane label="邮件测试" name="second">
      <Send/>
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <Description/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './module/config'
import Send from './module/send'
import Description from './module/description'
export default {
  components: { Config, Send, Description },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
</style>
