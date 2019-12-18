<template>
  <div class="tags-view-container">
    <ul v-show="rightMenuVisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="copyClick">复制新增</li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "rightMenu",
        data(){
          return {
            rightMenuVisible: false,
            left: 0,
            top: 0
          }
        },
      watch: {
        rightMenuVisible(value){
          if (value) {
            document.body.addEventListener('click', this.closeMenu)
          } else {
            document.body.removeEventListener('click', this.closeMenu)
          }
        }
      },
      methods:{
        openMenu(e,permission) {
          const menuMinWidth = 105
          const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
          const offsetWidth = this.$el.offsetWidth // container width
          const maxLeft = offsetWidth - menuMinWidth // left boundary
          const left = e.clientX - offsetLeft + 15 // 15: margin right
          if (left > maxLeft) {
            this.left = maxLeft
          } else {
            this.left = left
          }
          this.top = e.pageY;
          this.rightMenuVisible = permission;
        },
        closeMenu() {
          this.rightMenuVisible = false
        },
        copyClick(){
            this.$emit("copyClick");
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>
