<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input v-model="query.name" clearable placeholder="请输入表名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="序号" width="85" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tableName" label="表名"/>
      <el-table-column :show-overflow-tooltip="true" prop="engine" label="数据库引擎"/>
      <el-table-column :show-overflow-tooltip="true" prop="coding" label="字符编码集"/>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center" fixed="right">
        <template slot-scope="scope">
          <Generator :name="scope.row.tableName"/>
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
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import Generator from './generator'
export default {
  name: 'GeneratorIndex',
  components: { Generator },
  mixins: [initData],
  data() {
    return {
      loading: false, dialog: false,
      form: { author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '' },
      rules: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        pack: [
          { required: true, message: '包路径不能为空', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '包路径不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '前端代码生成路径不能为空', trigger: 'blur' }
        ],
        apiPath: [
          { required: true, message: '前端Api文件生成路径不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      this.url = 'api/generator/tables'
      const query = this.query
      const name = query.name
      this.params = { page: this.page, size: this.size }
      if (name) { this.params['name'] = name }
      return true
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.doUpdate()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
