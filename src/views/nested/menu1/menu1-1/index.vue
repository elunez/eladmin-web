<template>
  <div class="app-container">
    <el-alert :closable="false" title="三级菜单1" type="success" />
    <el-form label-width="170px" style="margin-top: 20px">
      <el-form-item label="三级菜单缓存功能测试区">
        <el-input v-model="input" placeholder="请输入内容" style="width: 360px;" />
      </el-form-item>
    </el-form>
    <div>
      <blockquote class="my-blockquote"> 三级菜单缓存配置教程</blockquote>
      <pre class="my-code">
 1、将前后端代码更新为最新版版本，或对照提交记录修改,点击查看-> <a href="https://gitee.com/elunez/eladmin/commit/43d1a63577f9d5347924355708429a2d210e29f7" target="_blank">提交(1)</a>、<a href="https://gitee.com/elunez/eladmin/commit/46393875148fcca5eaa327d4073f72edb3752f5c" target="_blank">提交(2)</a>、<a href="https://gitee.com/elunez/eladmin-web/commit/c93c99d8921abbb2c52afc806635f5ca08d6bda8" target="_blank">提交(3)</a>
 2、将 二级菜单 的 菜单类型 设置为 目录 级别，并且原有的 组件路径 需要清空
 3、将 三级菜单 的 菜单缓存 设置为 是，最后将 组件名称 填写正确
 4、具体设置可参考 菜单管理 的 多级菜单 配置进行进行相应的修改
 </pre>
      <blockquote class="my-blockquote">更多帮助</blockquote>
      <pre class="my-code">QQ交流群：一群：891137268、二群：947578238</pre>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Test',
  data() {
    return {
      input: ''
    }
  }
}
</script>
<style scoped>
  .my-code a{
    color:#009688;
  }
</style>
