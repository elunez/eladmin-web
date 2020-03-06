<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者服务地址" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model.number="form.port" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.number="form.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="state" label="状态" width="50px">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '1' ? 'success' : 'info'"
            disable-transitions
          >
            <i v-if="scope.row.state === '1'" class="el-icon-success" />
            <i v-if="scope.row.state === '0'" class="el-icon-error" />
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="port" label="端口" width="80px" align="center" />
      <el-table-column :formatter="formatCpuRate" prop="cpuRate" label="CPU使用率" width="100px" align="center" />
      <el-table-column prop="cpuCore" label="CPU内核数" width="100px" align="center" />
      <el-table-column prop="memTotal" label="物理内存" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatMem(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.memUsed,scope.row.memTotal)" :status="percentStatus(scope.row.memUsed,scope.row.memTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="diskTotal" :formatter="formatDisk" label="磁盘使用情况" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatDisk(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.diskUsed,scope.row.diskTotal)" :status="percentStatus(scope.row.diskUsed,scope.row.diskTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="swapTotal" label="交换空间" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatSwap(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.swapUsed,scope.row.swapTotal)" :status="percentStatus(scope.row.swapUsed,scope.row.swapTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','server:edit','server:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudServer from '@/api/monitor/server'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, address: 'localhost', name: null, ip: null, port: 8777, state: null, cpuRate: null, cpuCore: null, memTotal: null, memUsed: null, diskTotal: null, diskUsed: null, swapTotal: null, swapUsed: null, sort: 999 }
export default {
  name: 'ServerMonitor',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ title: '监控', url: 'api/server', sort: 'sort,asc', crudMethod: { ...crudServer }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'server:add'],
        edit: ['admin', 'server:edit'],
        del: ['admin', 'server:del']
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入IP', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入访问端口', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  created() {
    this.crud.optShow.download = false
  },
  methods: {
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
