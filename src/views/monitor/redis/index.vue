<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入关键词搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <div style="display: inline-block;">
        <!-- 清空缓存 -->
        <el-button v-permission="['ADMIN','REDIS_ALL','REDIS_DELETE']" :loading="deleteAllLoading" type="warning" size="mini" class="filter-item" icon="el-icon-delete" @click="deleteAll">清空缓存</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="key" label="KEY"/>
      <el-table-column prop="value" label="VALUE">
        <template slot-scope="scope">
          <div style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            {{ scope.row.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','REDIS_ALL','REDIS_EDIT','REDIS_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-popover
            v-permission="['ADMIN','REDIS_ALL','REDIS_DELETE']"
            :ref="scope.$index"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
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
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import { del, delAll } from '@/api/redis'
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false, permissions: [], deleteAllLoading: false
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
      this.url = 'api/redis'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size }
      if (value) {
        this.params['key'] = value
      } else {
        this.params['key'] = '*'
      }
      return true
    },
    subDelete(index, row) {
      this.delLoading = true
      del(row.key).then(res => {
        this.delLoading = false
        this.$refs[index].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[index].doClose()
        console.log(err.response.data.message)
      })
    },
    deleteAll() {
      this.$confirm('你确定要清空缓存数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAllLoading = true
        delAll().then(res => {
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
