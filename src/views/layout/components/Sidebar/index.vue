<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- 修改logo -->
      <el-menu-item :class="{'submenu-title-noDropdown':isCollapse}" index="0" style="pointer-events: none;">
        <!-- 缩小时显示的logo，可以自定义，这里直接使用图标库中的 -->
        <svg-icon v-if="isCollapse" icon-class="run" />
        <!--正常状态下显示的，可以使用本地的logoImg-->
        <div class="logo-con">
          <img src="https://aurora-1255840532.cos.ap-chengdu.myqcloud.com/logo.png">
        </div>
      </el-menu-item>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// import logoImg from '@/assets/logo/logo.png'
export default {
  components: { SidebarItem },
  data() {
    return {
      // logoImg: logoImg
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
