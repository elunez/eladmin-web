<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input v-model="query.name" clearable size="small" placeholder="请输入表名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="序号" width="85" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tableName" label="表名" />
      <el-table-column :show-overflow-tooltip="true" prop="engine" label="数据库引擎" />
      <el-table-column :show-overflow-tooltip="true" prop="coding" label="字符编码集" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-right: 2px" type="text">预览</el-button>
          <el-button size="mini" style="margin-left: -1px;margin-right: 2px" type="text">
            <router-link :to="'/sys-tools/generator/config/' + scope.row.tableName">
              编辑
            </router-link>
          </el-button>
          <el-button type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">生成</el-button>
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
import { generator } from '@/api/generator/generator'
export default {
  name: 'GeneratorIndex',
  mixins: [crud],
  data() {
    return {
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/generator/tables'
      return true
    },
    toGen(tableName) {
      // 生成代码
      generator(tableName, 0).then(data => {
        this.$notify({
          title: '生成成功',
          type: 'success',
          duration: 2500
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
