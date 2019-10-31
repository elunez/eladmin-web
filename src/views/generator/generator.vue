<template>
  <div>
    <el-button type="primary" size="mini" @click="toGen">生成代码</el-button>
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" title="代码生成配置" append-to-body width="880px">
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
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;margin-bottom: 15px">
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="scope">
              <div>{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="columnName" label="字段名称"/>
          <el-table-column prop="columnType" label="字段类型"/>
          <el-table-column prop="columnComment" label="字段标题">
            <template slot-scope="scope">
              <el-input v-model="data[scope.$index].columnComment" class="edit-input"/>
            </template>
          </el-table-column>
          <el-table-column label="查询方式">
            <template slot-scope="scope">
              <el-select v-model="data[scope.$index].columnQuery" class="edit-input" clearable placeholder="请选择">
                <el-option
                  label="模糊查询"
                  value="1"/>
                <el-option
                  label="精确查询"
                  value="2"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="columnShow" label="列表显示">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.columnShow === 'true' ?'显示':'不显示'" placement="top">
                <el-switch
                  v-model="data[scope.$index].columnShow"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="true"
                  inactive-value="false"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="form.author"/>
        </el-form-item>
        <el-form-item label="去表前缀" prop="prefix">
          <el-input v-model="form.prefix" placeholder="默认不去除表前缀"/>
        </el-form-item>
        <!--    可自定义显示配置    -->
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
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="genLoading" type="primary" @click="doSubmit">生成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { update, get } from '@/api/genConfig'
import { generator } from '@/api/generator'
export default {
  name: 'Generator',
  mixins: [initData],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      genLoading: false, dialog: false, columnQuery: '',
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
  methods: {
    toGen() {
      this.dialog = true
      this.time = 130
      this.$nextTick(() => {
        this.init()
        get().then(data => {
          this.form = data
          this.form.cover = this.form.cover.toString()
        })
      })
    },
    beforeInit() {
      this.url = 'api/generator/columns'
      const tableName = this.name
      this.params = { tableName }
      return true
    },
    cancel() {
      this.dialog = false
      this.genLoading = false
      this.$refs['form'].resetFields()
      this.form = { author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '' }
    },
    doSubmit() {
      this.genLoading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          update(this.form).then(res => {
            generator(this.data, this.name).then(res => {
              this.$notify({
                title: '生成成功',
                type: 'success',
                duration: 2500
              })
              this.cancel()
            }).catch(err => {
              this.cancel()
              console.log(err.response.data.message)
            })
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
      border: none;
    }
  }
</style>

<style scoped>
  /deep/ .el-dialog__body{
    padding-bottom: 5px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
