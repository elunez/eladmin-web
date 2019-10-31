<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-button
              v-permission="['admin','dict:add']"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.form.dialog = true;isAdd = true">新增</el-button>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-input v-model="query.value" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
            <!-- 导出 -->
            <div style="display: inline-block;">
              <el-button
                :loading="downloadLoading"
                size="mini"
                class="filter-item"
                type="warning"
                icon="el-icon-download"
                @click="download">导出</el-button>
            </div>
          </div>
          <!--表格渲染-->
          <el-table v-loading="loading" :data="data" size="small" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称"/>
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述"/>
            <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-permission="['admin','dict:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
                  v-permission="['admin','dict:del']"
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="checkPermission(['admin','dict:add']) && this.$refs.dictDetail && this.$refs.dictDetail.dictName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail.$refs.form.dialog = true;$refs.dictDetail.isAdd = true">新增</el-button>
          </div>
          <dictDetail ref="dictDetail"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadDict } from '@/api/dict'
import dictDetail from '../dictDetail/index'
import { downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'Dict',
  components: { dictDetail, eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/dict'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const value = query.value
      if (value) { this.params['blurry'] = value }
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.data = []
        this.$refs.dictDetail.dictName = ''
      }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.dictName = val.name
        this.$refs.dictDetail.dictId = val.id
        this.$refs.dictDetail.init()
      }
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        remark: data.remark
      }
      _this.dialog = true
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadDict(this.params).then(result => {
        downloadFile(result, '字典列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
