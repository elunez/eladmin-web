<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <Ad v-show="showAd" />
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span v-if="$store.state.settings.caseNumber"> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script>
import Ad from '@/components/Ad'
export default {
  name: 'AppMain',
  components: { Ad },
  data() {
    return {
      showAd: true,
      list: ['/dashboard', '/monitor/online', '/monitor/logs',
        '/monitor/errorLog', '/monitor/server', '/sys-tools/generator',
        '/sys-tools/storage', '/components/echarts', '/components/icon',
        '/components/markdown', '/components/yaml', '']
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  watch: {
    '$route.path'(newPath) {
      // 判断是否包含在list中
      this.checkAd(newPath)
    }
  },
  created() {
    this.checkAd(this.$route.path)
  },
  methods: {
    checkAd(path) {
      // 判断是否包含在list中
      this.showAd = !this.list.includes(path)
    }
  }

}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
