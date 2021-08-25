<!--
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<template>
  <div class="app-container">
      <avue-crud ref="crud"
                     :page="page"
                     :data="tableData"
                     :permission="permissionList"
                     :table-loading="tableLoading"
                     :option="tableOption"
                     @on-load="getPage"
                     @refresh-change="refreshChange"
                     @row-update="handleUpdate"
                     @row-save="handleSave"
                     @row-del="handleDel"
                     @sort-change="sortChange"
                     @search-change="searchChange">
            <template slot="appName" slot-scope="scope" >
              <el-tag type="success" size="mini">{{scope.row.appName}}</el-tag>
            </template>
            <template slot="nickName" slot-scope="scope" >
              <el-badge :value="scope.row.countMsg" class="count-msg">
                <img class="head-img" :src="scope.row.headimgUrl"/>
              </el-badge>
            </template>
            <template slot="readFlag" slot-scope="scope" >
              <el-tag :type="scope.row.readFlag == '1' ? 'success' : 'danger'" size="mini">{{scope.row.$readFlag}}</el-tag>
            </template>
            <template slot="repContent" slot-scope="scope" >
              <div class="nick-name">{{scope.row.nickName}}</div>
              <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'subscribe'"><el-tag type="success" size="mini">关注</el-tag></div>
              <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'unsubscribe'"><el-tag type="danger" size="mini">取消关注</el-tag></div>
              <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'CLICK'"><el-tag size="mini">点击菜单</el-tag>：【{{scope.row.repName}}】</div>
              <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'VIEW'"><el-tag size="mini">点击菜单链接</el-tag>：【{{scope.row.repUrl}}】</div>
              <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'scancode_waitmsg'"><el-tag size="mini">扫码结果：</el-tag>：【{{scope.row.repContent}}】</div>
              <div v-if="scope.row.repType == 'text'">{{scope.row.repContent}}</div>
              <div v-if="scope.row.repType == 'image'">
                <a target="_blank" :href="scope.row.repUrl"><img :src="scope.row.repUrl" style="width: 100px"></a>
              </div>
              <div v-if="scope.row.repType == 'voice'">
                <WxVoicePlayer :objData="scope.row"></WxVoicePlayer>
              </div>
              <div v-if="scope.row.repType == 'video'">
                <WxVideoPlayer :objData="scope.row" style="margin-top: 40px"></WxVideoPlayer>
              </div>
              <div v-if="scope.row.repType == 'shortvideo'">
                <WxVideoPlayer :objData="scope.row" style="margin-top: 40px"></WxVideoPlayer>
              </div>
              <div v-if="scope.row.repType == 'link'"><el-tag size="mini">链接</el-tag>：<a :href="scope.row.repUrl" target="_blank">{{scope.row.repName}}</a></div>
            </template>
            <template slot-scope="scope"
                      slot="menu">
              <el-button type="text"
                         icon="el-icon-chat-line-round"
                         size="small"
                         plain
                         @click="wxMsgDo(scope.row,scope.index)">消息</el-button>
            </template>
          </avue-crud>
      <el-dialog title="用户消息" :visible.sync="dialogMsgVisible" width="40%">
        <WxMsg :wxUserId="wxUserId" v-if="dialogMsgVisible"></WxMsg>
      </el-dialog>
  </div>
</template>

<script>
  import { getPage, getObj, addObj, putObj, delObj } from '@/api/wxmp/wxmsg'
  import { tableOption } from '@/const/crud/wxmp/wxmsg'
  import {checkPermi, checkRole} from "@/utils/permission"
  import WxMsg from '@/components/wx-msg/main.vue'
  import WxVideoPlayer from '@/components/wx-video-play/main.vue'
  import WxVoicePlayer from '@/components/wx-voice-play/main.vue'
  export default {
    name: 'wxmsg',
    components: {
      WxMsg,
      WxVideoPlayer,
      WxVoicePlayer
    },
    data() {
      return {
        dialogMsgVisible: false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
          ascs:[],//升序字段
          descs:"create_time"//降序字段
        },
        paramsSearch:{},
        tableLoading: false,
        tableOption: tableOption,
        wxUserId: ''
      }
    },
    created() {

    },
    mounted: function() { },
    computed: {
      permissionList() {
        return {
          addBtn: checkPermi(['wxmp:wxmsg:add']),
          delBtn: checkPermi(['wxmp:wxmsg:del']),
          editBtn: checkPermi(['wxmp:wxmsg:edit']),
          viewBtn: checkPermi(['wxmp:wxmsg:get'])
        };
      }
    },
    methods: {
      wxMsgDo(row){
        this.wxUserId = row.wxUserId
        this.dialogMsgVisible = true
        this.$set(row, 'readFlag', '1')
      },
      searchChange(params,done){
        params = this.filterForm(params)
        this.paramsSearch = params
        this.page.currentPage = 1
        this.getPage(this.page,params)
        done()
      },
      sortChange(val){
        let prop = val.prop ? val.prop.replace(/([A-Z])/g,"_$1").toLowerCase() : '';
        if(val.order=='ascending'){
          this.page.descs = []
          this.page.ascs = prop
        }else if(val.order=='descending'){
          this.page.ascs = []
          this.page.descs = prop
        }else{
          this.page.ascs = []
          this.page.descs = []
        }
        this.getPage(this.page)
      },
      getPage(page, params) {
        this.tableLoading = true
        getPage(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          descs: this.page.descs,
          ascs: this.page.ascs,
          type: '1'
        }, params, this.paramsSearch)).then(response => {
          this.tableData = response.data.records
          this.page.total = response.data.total
          this.page.currentPage = page.currentPage
          this.page.pageSize = page.pageSize
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      handleDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除此数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return delObj(row.id)
          }).then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getPage(this.page)
        }).catch(function(err) { })
      },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      handleUpdate: function(row, index, done, loading) {
        putObj(row).then(data => {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done()
          this.getPage(this.page)
        }).catch(() => {
          loading()
        })
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function(row, done, loading) {
        addObj(row).then(data => {
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
          this.getPage(this.page)
        }).catch(() => {
          loading()
        })
      },
      /**
       * 刷新回调
       */
      refreshChange(page) {
        this.getPage(this.page)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .head-img{
    width: 50px;
  }
</style>
