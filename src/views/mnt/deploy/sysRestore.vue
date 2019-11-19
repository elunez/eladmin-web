<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    title="系统还原"
    width="800px"
  >
    <!--工具栏-->
    <div class="head-container">
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入部署时间"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索
      </el-button>
    </div>
    <el-form size="small" label-width="80px">
      <!--表格渲染-->
      <el-table
        v-loading="loading"
        :data="data"
        size="small"
        style="width: 100%"
        @row-click="showRow"
      >
        <el-table-column width="30px">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index"/>
          </template>
        </el-table-column>
        <el-table-column prop="appName" label="应用名称"/>
        <el-table-column prop="ip" label="部署IP"/>
        <el-table-column prop="deployDate" label="部署时间"/>
        <el-table-column prop="deployUser" label="部署人员"/>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        v-permission="['admin','deploy:add']"
        :loading="loading"
        type="primary"
        @click="doSubmit"
      >确认
      </el-button>
    </div>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-dialog>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { reducte } from '@/api/deployHistory'
export default {
  mixins: [initData],
  props: {
    appName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      history: [],
      radio: '',
      appNames: '',
      selectIndex: ''
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
      this.url = 'api/deployHistory'
      this.deployId = this.$parent.deployId
      debugger
      if (this.deployId === '') {
        return false
      }
      const sort = 'deployDate,desc'
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort,
        deployId: this.$parent.deployId
      }
      const query = this.query
      const type = 'deployDate'
      const value = query.value
      this.params[type] = value
      return true
    },
    formatterAppId(row, column) {
      return this.appNames
    },
    showRow(row) {
      this.radio = this.data.indexOf(row)
      this.selectIndex = row.id
    },
    cancel() {
      this.dialog = false
      this.loading = false
    },
    doSubmit() {
      if (this.selectIndex === '') {
        this.$message.error('请选择要还原的备份')
      } else {
        reducte(JSON.stringify(this.data[this.radio]))
          .then(res => {
            this.dialog = false
            this.loading = false
            this.appNames = ''
            this.$parent.init()
          })
          .catch(err => {
            this.loading = false
            console.log('error:' + err.response.data.message)
          })
      }
    }
  }
}
</script>

<style scoped>
</style>
