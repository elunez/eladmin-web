<!--
  - Copyright (C) 2018-2019
  - All rights reserved, Designed By www.joolun.com
-->
<template>
  <div v-loading="mainLoading" class="wx-voice-div" @click="outTime ? '' : playVoice(objData)">
    <i v-if="!outTime" :class="objData.amrPlaying != true ? 'icon-yuyin': 'icon-playing1'">
      <span class="amr-duration" v-if="objData.amrDuration">{{objData.amrDuration}}"</span>
    </i>
    <i v-if="outTime" class="el-icon-time">
      <span class="amr-duration">该语音已过期</span>
    </i>
    <div v-if="objData.repContent"><el-tag type="success" size="mini">语音识别</el-tag>{{objData.repContent}}</div>
  </div>
</template>

<script>
  import { getTempMaterialOther, getMaterialOther } from '@/api/wxmp/wxmaterial'
  const BenzAMRRecorder = require('benz-amr-recorder')

  export default {
    name: "wxVoicePlayer",
    props: {
      objData:{
        type: Object
      }
    },
    data() {
      return {
        outTime: false,
        mainLoading: false
      }
    },
    created() {
      this.outTime = this.objData.type === '1' && (parseInt(new Date().getTime() - new Date(this.objData.createTime).getTime()) >= 259200000)
    },
    mounted(){
    },
    computed: {

    },
    methods:{
      amrPlay(amr,val){
        this.$set(val, 'amrPlaying', true)
        amr.play()
      },
      amrStop(amr,val){
        this.$set(val, 'amrPlaying', false)
        amr.stop()
      },
      playVoice(val){
        let amr = val.amr
        if(amr == undefined){
          if(val.type == '2'){
            this.getMaterialOther(val.repMediaId , val.repName)
              .then(url => {
                this.$set(val,'repUrl',url)
                this.handleAudio(val)
              })
          }else if(val.type == '1'){
            this.getTempMaterialOther(val.repMediaId , val.repName)
              .then(url => {
                this.$set(val,'repUrl',url)
                this.handleAudio(val)
              })
          }
        }else{
          if(amr.isPlaying()){
            this.amrStop(amr, val)
          }else{
            this.amrPlay(amr, val)
          }
        }
      },
      async getTempMaterialOther(repMediaId,fileName){
        let url
        this.mainLoading = true
        await getTempMaterialOther({
          mediaId: repMediaId,
          fileName: fileName
        }).then(response => {
          this.mainLoading = false
          url = window.URL.createObjectURL(new Blob([response.data]))
        }).catch(() => {
          this.mainLoading = false
        })
        return url
      },
      async getMaterialOther(repMediaId,fileName){
        let url
        this.mainLoading = true
        await getMaterialOther({
          mediaId: repMediaId,
          fileName: fileName
        }).then(response => {
          this.mainLoading = false
          url = window.URL.createObjectURL(new Blob([response.data]))
        }).catch(() => {
          this.mainLoading = false
        })
        return url
      },
      handleAudio(val){
        this.$set(val,'amr',new BenzAMRRecorder())
        let amr = val.amr
        let that = this
        amr.initWithUrl(val.repUrl).then(function() {
          that.amrPlay(amr, val)
          that.$set(val,'amrDuration',amr.getDuration())
        })
        amr.onEnded(function() {
          that.$set(val, 'amrPlaying', false)//播放完了
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wx-voice-div{
    padding: 5px;
    background-color: #eaeaea;
    border-radius: 10px;
  }
  .amr-duration{
    font-size: 11px;
    margin-left: 5px;
  }
</style>
