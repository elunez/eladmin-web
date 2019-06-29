<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input v-model="query.name" clearable placeholder="请输入表名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-setting"
          @click="openConfig">生成器配置</el-button>
      </div>
    </div>
    <!--生成器配置-->
    <el-dialog :visible.sync="dialog" title="生成器配置" append-to-body width="550px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="78px">
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="form.author" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="去表前缀" prop="prefix">
          <el-input v-model="form.prefix" placeholder="默认不去除表前缀" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="form.moduleName" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="至于包下" prop="pack">
          <el-input v-model="form.pack" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="前端路径" prop="path">
          <el-input v-model="form.path" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="API路径" prop="apiPath">
          <el-input v-model="form.apiPath" style="width: 420px;"/>
        </el-form-item>
        <el-form-item label="是否覆盖" prop="cover">
          <el-radio v-model="form.cover" label="true">是</el-radio>
          <el-radio v-model="form.cover" label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
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
      <el-table-column label="操作" width="140px" align="center">
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
import { get, update } from '@/api/genConfig'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import Generator from './generator'
export default {
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
    openConfig() {
      get().then(data => {
        this.form = data
        this.form.cover = this.form.cover.toString()
      })
      this.dialog = true
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
    },
    doUpdate() {
      update(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '更新成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '' }
    }
  }
}
</script>

<style scoped>

</style>
