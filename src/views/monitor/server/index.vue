<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','server:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增
        </el-button>
      </div>
      <!-- 刷新 -->
      <div style="display: inline-block;">
        <el-button
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-refresh"
          @click="refresh">刷新
        </el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="状态" width="50px">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '1' ? 'success' : 'info'"
            disable-transitions>
            <i v-if="scope.row.state === '1'" class="el-icon-success"/>
            <i v-if="scope.row.state === '0'" class="el-icon-error"/>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="ip" label="IP地址"/>
      <el-table-column prop="port" label="访问端口" width="80px" align="center"/>
      <el-table-column :formatter="formatCpuRate" prop="cpuRate" label="CPU使用率" width="100px" align="center"/>
      <el-table-column prop="cpuCore" label="CPU内核数" width="100px" align="center"/>
      <el-table-column label="物理内存" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatMem(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.memUsed,scope.row.memTotal)" :status="percentStatus(scope.row.memUsed,scope.row.memTotal)" :show-text="false"/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatDisk" label="磁盘使用情况" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatDisk(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.diskUsed,scope.row.diskTotal)" :status="percentStatus(scope.row.diskUsed,scope.row.diskTotal)" :show-text="false"/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="交换空间" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatSwap(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.swapUsed,scope.row.swapTotal)" :status="percentStatus(scope.row.swapUsed,scope.row.swapTotal)" :show-text="false"/>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','server:edit','server:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','server:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','server:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
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
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/server'
import eForm from './form'
export default {
  name: 'ServerMonitor',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'ip', display_name: 'IP地址' }
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
      this.url = 'api/server'
      const sort = 'sort,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
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
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        ip: data.ip,
        port: data.port,
        state: data.state,
        cpuRate: data.cpuRate,
        cpuCore: data.cpuCore,
        memTotal: data.memTotal,
        memUsed: data.memUsed,
        diskTotal: data.diskTotal,
        diskUsed: data.diskUsed,
        swapTotal: data.swapTotal,
        swapUsed: data.swapUsed,
        sort: data.sort
      }
      _this.dialog = true
    },
    refresh() {
      this.init()
    },
    formatCpuRate(row, column) {
      const value = row.cpuRate
      if (!value) {
        return 0
      }
      return (Math.floor(value * 10000) / 100) + '%'
    },
    percentNumber(value, total) {
      if (!value || !total) {
        return 0
      }
      return value / total * 100
    },
    percentStatus(value, total) {
      const percent = this.percentNumber(value, total)
      if (percent < 60) {
        return 'success'
      } else if (percent < 90) {
        return 'warning'
      } else {
        return 'exception'
      }
    },
    convertToGb(num) {
      if (!num) {
        return '-'
      }
      let unit = 'G'
      if (num > 1024) {
        num = num / 1024
        unit = 'T'
      }
      num = Math.floor(num * 100) / 100
      return num + unit
    },
    formatMem(row, column) {
      return this.convertToGb(row.memUsed) + ' / ' + this.convertToGb(row.memTotal)
    },
    formatDisk(row, column) {
      return this.convertToGb(row.diskUsed) + ' / ' + this.convertToGb(row.diskTotal)
    },
    formatSwap(row, column) {
      return this.convertToGb(row.swapUsed) + ' / ' + this.convertToGb(row.swapTotal)
    }
  }
}
</script>

<style scoped>
  .el-col {
    text-align: center;
  }
</style>
