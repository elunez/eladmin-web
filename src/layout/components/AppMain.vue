<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt"/>
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    z-index: 88;
    /*84 = navbar + tags-view = 50 +34 */
    min-height: calc(100vh - 84px);
    width: 100%;
    position: relative;
    overflow: hidden;
    padding-bottom: 12px;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
      padding-top: 85px;
    }
  }
</style>

