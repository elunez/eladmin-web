<template>
  <div>
    <div v-if="dictName === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable size="small" placeholder="输入字典标签查询" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" style="width: 100%;">
        <el-table-column label="所属字典">
          {{ dictName }}
        </el-table-column>
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission="['admin','dict:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','dict:del']"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
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
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDictDetail from '@/api/system/dictDetail'
export default {
  mixins: [crud],
  data() {
    return {
      title: '字典详情',
      sort: ['sort,asc', 'id,desc'],
      crudMethod: { ...crudDictDetail },
      dictName: '',
      form: { id: null, label: null, value: null, dict: { id: null }, sort: 999 },
      rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dictDetail'
      if (this.dictName) {
        this.params['dictName'] = this.dictName
      }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
