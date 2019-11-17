<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="基本配置" name="first">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="90px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="form.moduleName"/>
        </el-form-item>
        <el-form-item label="至于包下" prop="pack">
          <el-input v-model="form.pack"/>
        </el-form-item>
        <el-form-item label="前端路径" prop="path">
          <el-input v-model="form.path"/>
        </el-form-item>
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="form.author"/>
        </el-form-item>
        <el-form-item label="去表前缀" prop="prefix">
          <el-input v-model="form.prefix" placeholder="默认不去除表前缀"/>
        </el-form-item>
        <!--        <el-form-item label="Api路径">-->
        <!--          <el-input v-model="form.apiPath"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="是否覆盖" prop="cover">
          <el-radio-group v-model="form.cover" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="字段配置" name="second">
      <el-form size="small" label-width="90px">
        <el-table v-loading="loading" :data="data" :height="tableHeight" size="small" style="width: 100%;margin-bottom: 15px">
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="scope">
              <div>{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="columnName" label="字段名称"/>
          <el-table-column prop="columnType" label="字段类型"/>
          <el-table-column prop="columnComment" label="字段描述">
            <template slot-scope="scope">
              <el-input v-model="data[scope.$index].columnComment" size="mini" class="edit-input"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="columnShow" label="必填">
            <template slot-scope="scope">
              <el-switch
                v-model="data[scope.$index].columnShow"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="true"
                inactive-value="false"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="columnShow" label="表单">
            <template slot-scope="scope">
              <el-switch
                v-model="data[scope.$index].columnShow"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="true"
                inactive-value="false"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="columnShow" label="列表">
            <template slot-scope="scope">
              <el-switch
                v-model="data[scope.$index].columnShow"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="true"
                inactive-value="false"/>
            </template>
          </el-table-column>
          <el-table-column label="查询方式">
            <template slot-scope="scope">
              <el-select v-model="data[scope.$index].columnQuery" class="edit-input" clearable size="mini" placeholder="请选择">
                <el-option
                  label="模糊查询"
                  value="1"/>
                <el-option
                  label="精确查询"
                  value="2"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="关联字典">
            <template slot-scope="scope">
              <el-select v-model="data[scope.$index].columnQuery" class="edit-input" clearable size="mini" placeholder="请选择">
                <el-option
                  label="模糊查询"
                  value="1"/>
                <el-option
                  label="精确查询"
                  value="2"/>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import initData from '@/mixins/initData'
import { update, get } from '@/api/genConfig'
export default {
  name: 'GeneratorConfig',
  components: {},
  mixins: [initData],
  data() {
    return {
      activeName: 'second', tableName: '', tableHeight: 550,
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
        cover: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 260
    this.tableName = this.$route.params.tableName
    this.$nextTick(() => {
      this.init()
      get().then(data => {
        this.form = data
        this.form.cover = this.form.cover.toString()
      })
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/generator/columns'
      const tableName = this.tableName
      this.params = { tableName }
      return true
    },
    cancel() {
      this.$refs['form'].resetFields()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          update(this.form).then(res => {
          }).catch(err => {
            this.cancel()
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .edit-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
