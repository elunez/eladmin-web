<!--
  - Copyright (C) 2018-2019
  - All rights reserved, Designed By www.joolun.com
-->
<template>
  <div>
    <div v-if="!outTime"><i class="icon-shipinbofang" style="font-size: 80px!important;" @click="playVideo()"></i><p>点击播放视频</p></div>
    <div v-if="outTime">
      <i class="el-icon-video-play shipin-i"></i><p/>
      <i class="el-icon-time">&nbsp;该视频已过期</i>
    </div>
    <el-dialog
      title="视频播放"
      :visible.sync="dialogVideo"
      width="40%"
      v-loading="mainLoading"
      append-to-body>
      <video-player v-if="playerOptions.sources[0].src"
                    class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
      >
      </video-player>
    </el-dialog>
  </div>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  import { getTempMaterialOther, getMaterialOther } from '@/api/wxmp/wxmaterial'
  require('video.js/dist/video-js.css')
  require('vue-video-player/src/custom-theme.css')
  export default {
    name: "wxVideoPlayer",
    props: {
      objData: {
        type: Object
      }
    },
    components: {
      videoPlayer
    },
    data() {
      return {
        dialogVideo:false,
        outTime: false,
        mainLoading: false,
        playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: "" //你的视频地址（必填）
          }],
          poster: "", //你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
//        controlBar: {
//          timeDivider: true,
//          durationDisplay: true,
//          remainingTimeDisplay: false,
//          fullscreenToggle: true  //全屏按钮
//        }
        }
      }
    },
    created() {
      this.outTime = this.objData.type === '1' && (parseInt(new Date().getTime() - new Date(this.objData.createTime).getTime()) >= 259200000)
    },
    mounted() {

    },
    computed: {},
    methods: {
      playVideo(){
        this.dialogVideo = true
        this.getVideo()
      },
      async getTempMaterialOther(repMediaId, fileName) {
        let url
        this.mainLoading = true
        await getTempMaterialOther({
          mediaId: repMediaId,
          fileName: fileName
        }).then(response => {
          this.mainLoading = false
          url = window.URL.createObjectURL(new Blob([response.data]))
        })
        return url
      },
      async getMaterialOther(repMediaId, fileName) {
        let url
        this.mainLoading = true
        await getMaterialOther({
          mediaId: repMediaId,
          fileName: fileName
        }).then(response => {
          this.mainLoading = false
          url = window.URL.createObjectURL(new Blob([response.data]))
        })
        return url
      },
      getVideo() {
        if (this.objData.type == '2') {
          this.$set(this.playerOptions.sources[0], 'src', this.objData.repUrl)
        } else if (this.objData.type == '1') {
          this.getTempMaterialOther(this.objData.repMediaId, this.objData.repMediaId + '.mp4')
            .then(val => {
              this.$set(this.playerOptions.sources[0], 'src', val)
            })
        }
      },
      onPlayerPlay(player) {

      },
      onPlayerPause(player) {

      },
    }
  };
</script>

<style lang="scss" scoped>
</style>
