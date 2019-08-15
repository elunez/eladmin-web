<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <div class="feedback">
            <el-tooltip class="item" effect="dark" content="建议反馈" placement="left">
              <el-button type="text" @click="doFeedback">
                <svg-icon  style="font-size: 28px;color: #606266;" icon-class="codeConsole" />
              </el-button>
            </el-tooltip>
          </div>
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
    </div>
    <feedback :showDialog.sync="feedbackShow"></feedback>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import feedback from './feedback.vue'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView,
    RightPanel,
    feedback
  },
  data() {
    return {
      feedbackShow: false
    }
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    doFeedback() {
      console.log(111)
      this.feedbackShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    background: #ffffff;
    z-index: 99;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - #{$hideSidebarWidth})
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .feedback {
    position: fixed;
    z-index: 999999;
    right: 10px;
    bottom: 60px;
  }
</style>

