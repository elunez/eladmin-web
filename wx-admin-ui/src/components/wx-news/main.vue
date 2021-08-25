<!--
  - Copyright (C) 2018-2019
  - All rights reserved, Designed By www.joolun.com
-->
<template>
  <div class="news-home">
    <div v-for="(news, index) in objData" :key="index" class="news-div">
      <a target="_blank" :href="news.url" v-if="index==0">
        <div class="news-main">
          <div class="news-content">
            <img class="material-img" :src="news.thumbUrl" width="280px" height="120px"/>
            <div class="news-content-title">
              <span>{{news.title}}</span>
            </div>
          </div>
        </div>
      </a>
      <a target="_blank" :href="news.url" v-if="index>0">
        <div class="news-main-item">
          <div class="news-content-item">
            <div class="news-content-item-title">{{news.title}}</div>
            <div class="news-content-item-img">
              <img class="material-img" :src="news.thumbUrl" height="100%"/>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "wxNews",
    props: {
      objData:{
        type:Array
      }
    },
    data() {
      return {
      }
    },
    created() {

    },
    mounted(){

    },
    computed: {

    },
    methods:{

    }
  };
</script>

<style lang="scss" scoped>
  .news-home{
    background-color: #FFFFFF;
    width: 100%;
    margin: auto;
  }
  .news-main{
    width: 100%;
    margin: auto;
  }
  .news-content{
    background-color: #acadae;
    width: 100%;
    position: relative;
  }
  .news-content-title{
    display: inline-block;
    font-size: 12px;
    color: #FFFFFF;
    position: absolute;
    left: 0px;
    bottom: 0px;
    background-color: black;
    width: 98%;
    padding: 1%;
    opacity: 0.65;
    white-space: normal;
    box-sizing: unset!important
  }
  .news-main-item{
    background-color: #FFFFFF;
    padding: 5px 0px;
    border-top: 1px solid #eaeaea;
  }
  .news-content-item{
    position: relative;
  }
  .news-content-item-title{
    display: inline-block;
    font-size: 10px;
    width: 70%;
    margin-left: 1%;
    white-space: normal
  }
  .news-content-item-img{
    display: inline-block;
    width: 25%;
    background-color: #acadae;
    margin-right: 1%;
  }
  .material-img {
    width: 100%;
  }
</style>
