<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="存储配置" name="first">
      <Config/>
    </el-tab-pane>
    <el-tab-pane label="文件列表" name="second">
      <List/>
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <div>
        <blockquote class="my-blockquote">注意</blockquote>
        <pre class="my-code">
1、配置时外链域名需带上协议，也就是必须http/https开头
2、如果七牛云中存在数据，使用同步按钮即可将数据同步到数据库
3、本次集成了七牛云的常用操作，如：上传，下载，删除，同步，支持私有空间上传下载</pre>
        <blockquote class="my-blockquote">更多帮助</blockquote>
        <pre class="my-code">更多帮助请查看系统源码，或者七牛云java开发文档
七牛云官网：<a style="color: #00a2d4" href="https://sso.qiniu.com/" target="_blank">https://sso.qiniu.com/</a>
七牛云java开发文档：<a style="color: #00a2d4" href="https://developer.qiniu.com/kodo/sdk/1239/java#3" target="_blank">https://developer.qiniu.com/kodo/sdk/1239/java#3</a></pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import List from './list'
import '@/styles/description.scss'
export default {
  components: { Config, List },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
