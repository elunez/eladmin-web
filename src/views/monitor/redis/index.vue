<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.key" clearable size="small" placeholder="输入Key搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 清空缓存 -->
      <el-button v-permission="['admin','redis:del']" :loading="deleteAllLoading" type="danger" size="mini" class="filter-item" icon="el-icon-delete" @click="deleteAll">清空</el-button>
      <!-- 导出 -->
      <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="downloadMethod"
      >导出</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="key" label="KEY" />
      <el-table-column prop="value" label="VALUE">
        <template slot-scope="scope">
          <div style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            {{ scope.row.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','redis:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin','redis:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudRedis from '@/api/monitor/redis'
export default {
  name: 'Redis',
  mixins: [crud],
  data() {
    return {
      title: '系统缓存',
      crudMethod: { ...crudRedis },
      deleteAllLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {

    beforeInit() {
      this.url = 'api/redis'
      if (!this.query.key) {
        this.params['key'] = '*'
      }
      return true
    },
    delMethod(index, row) {
      this.delLoading = true
      this.crudMethod.del(row.key).then(res => {
        this.delLoading = false
        this.$refs[index].doClose()
        this.dleChangePage()
        this.init()
        this.notify('删除成功', 'success')
      }).catch(() => {
        this.delLoading = false
        this.$refs[index].doClose()
      })
    },
    deleteAll() {
      this.$confirm('你确定要清空缓存数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAllLoading = true
        this.crudMethod.delAll().then(res => {
          this.page = 0
          this.init()
          this.deleteAllLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
