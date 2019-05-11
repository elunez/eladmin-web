<template>
  <div>
    <svg
      t="1508738709248"
      class="screenfull-svg"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2069"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
      @click="click"><path d="M921.9 468.6H749.6c-9.4 0-18.4 3.8-25 10.5-6.6 6.7-10.3 15.7-10.3 25.1v11.1c0 19.6 15.9 35.5 35.4 35.5h172.2c19.5 0 35.3-15.9 35.3-35.5v-11.1c0-9.4-3.7-18.4-10.3-25.1-6.6-6.7-15.6-10.5-25-10.5zM522.4 163.9c-53.6 42.6-165.7 102.3-246.3 159.8h-0.1c-0.9 0.6-1.8 3.8-2.8 4.3-9.5 5.4-13.8 20.1-65.6 20.1h-101c-26 0-42 12.2-42 39.6V631c0 27.4 14.7 40.9 42 40.9H208c51.5 0.1 55.7 14.8 65.2 20.1 0.9 0.5 1.8 3.7 2.7 4.3h0.1c78.2 57.5 191 121.8 246.4 162.7 16.7 12.3 72.1 33.9 72.1-42.1v-614c0-76.1-55.9-51.8-72.1-39z m159 167.8c9.2 16.1 27.3 20.2 40.5 9l141.5-119.3c13.3-11.1 16.5-33.2 7.4-49.4l-5.2-9.1c-9.1-16.1-27.3-20.1-40.5-9L683.6 273.2c-13.2 11.2-16.5 33.2-7.4 49.4l5.2 9.1z m40.4 347.4c-13.2-11.1-31.3-7-40.4 9l-5.2 9.1c-9.1 16.1-5.8 38.2 7.4 49.4L825.1 866c13.2 11.1 31.3 7.1 40.4-9l5.2-9.1c9.1-16.1 5.8-38.2-7.4-49.4L721.8 679.1z m0 0" p-id="1259"/></svg>
    <el-dialog :append-to-body="true" :visible.sync="dialogTableVisible" width="60%" title="更新公告">
      <blockquote class="my-blockquote">1.7版本更新说明</blockquote>
      <div class="my-code">
        <div style="font-weight: bold">一、后端</div>
        <ol>
          <li>修复用户存在多角色时登录失败的bug</li>
          <li>修复在修改用户角色时缓存不刷新的bug</li>
          <li>修复修改邮箱配置需要重新启动才生效的bug</li>
          <li>修复上级目录选择自己导致列表不显示的bug</li>
          <li>新增部分工具类的单元测试</li>
          <li>common模块新增 SecurityUtils 工具类、可获取当前用户的 id和 username</li>
          <li>配置文件新增 Swagger 的开启开关</li>
        </ol>
        <div style="font-weight: bold">二、前端</div>
        <ol>
          <li>新增系统设置，可设置logo、</li>
          <li>新增首屏加载动画</li>
          <li>新增系统Logo显示</li>
          <li>优化首页的 Tag 不可删除，由 affix 属性控制</li>
          <li>修复顶级部门不能修改的问题</li>
          <li>其他细节优化</li>
        </ol>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    click() {
      this.dialogTableVisible = true
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.my-blockquote{
  margin: 0px 0px 10px;
  padding: 12px;
  line-height: 22px;
  border-left: 5px solid #00437B;
  border-radius: 0 2px 2px 0;
  background-color: #f2f2f2;
}
.my-code{
  position: relative;
  padding: 15px;
  line-height: 20px;
  border-left: 5px solid #ddd;
  color: #333;
  font-family: Courier New;
  font-size: 12px
}
</style>
