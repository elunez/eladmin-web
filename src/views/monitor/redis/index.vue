<template>
  <div class="app-container">
    <search :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="key" label="KEY"/>
      <el-table-column :show-overflow-tooltip="true" prop="value" label="VALUE"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <edit v-if="checkPermission(['ADMIN','REDIS_ALL','REDIS_EDIT'])" :data="scope.row" :sup_this="sup_this"/>
          <el-popover
            v-if="checkPermission(['ADMIN','REDIS_ALL','REDIS_DELETE'])"
            v-model="scope.row.delPopover"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" @click="scope.row.delPopover = true">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '../../../mixins/initData'
import { del } from '@/api/redis'
import { getPermissionTree } from '@/api/permission'
import { parseTime } from '@/utils/index'
import search from './module/search'
import edit from './module/edit'
export default {
  components: { search, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false, sup_this: this, permissions: []
    }
  },
  created() {
    this.getPermissions()
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
        row.delPopover = false
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        row.delPopover = false
        console.log(err.response.data.message)
      })
    },
    time(time) {
      return parseTime(time)
    },
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = res
      })
    }
  }
}
</script>

<style scoped>

</style>
