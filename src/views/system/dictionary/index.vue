<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边目录数据-->
      <el-col :xs="5" :sm="5" :md="4" :lg="4" :xl="4">

        <el-checkbox v-model="cascadeShow" style="margin:0 0 10px 0;" @change="changeCascadeShow()">
          显示下级
        </el-checkbox>

        <el-tree
          :data="catalogDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
        />

      </el-col>

      <!--中间字典索引数据-->
      <el-col :xs="8" :sm="8" :md="7" :lg="7" :xl="7">
        <div class="head-container">
          <!-- 搜索 -->
          <el-input
            v-model="query.value"
            clearable
            placeholder="检索字典名"
            style="width: 100px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :xs="11" :sm="11" :md="13" :lg="13" :xl="13">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.value"
              clearable
              placeholder="搜索字典值"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <el-select v-model="query.type" clearable placeholder="字典对照码" class="filter-item" style="width: 130px">
              <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <rrOperation :crud="crud" />
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission" />
          <!--表单组件-->
          <el-dialog
            :close-on-click-modal="false"
            :before-close="crud.cancelCU"
            :visible.sync="crud.status.cu > 0"
            :title="crud.status.title"
            width="500px"
          >
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
              <el-form-item label="流水号" prop="id">
                <el-input v-model="form.id" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照码" prop="code">
                <el-input v-model="form.code" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照值" prop="desc">
                <el-input v-model="form.desc" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="当前状态" prop="status">
                <el-input v-model="form.status" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="所属字典流水号" prop="dicIndexId">
                <el-input v-model="form.dicIndexId" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照值1">
                <el-input v-model="form.desc1" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照值2">
                <el-input v-model="form.desc2" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照值3">
                <el-input v-model="form.desc3" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="字典对照值4">
                <el-input v-model="form.desc4" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="排序字段">
                <el-input v-model="form.sortNo" style="width: 370px;" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @row-click="clickRow"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column type="selection" width="30" />
            <el-table-column prop="code" label="字典对照码" width="80" />
            <el-table-column prop="desc" label="字典对照值" width="200" />
            <el-table-column prop="remark" label="备注" show-tooltip-when-overflow show-overflow-tooltip width="150" />
            <el-table-column prop="status" label="当前状态" width="80" />

          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudElSysDic from '@/api/system/elSysDic'
import { getCatalogTree } from '@/api/system/elSysCatalog'

import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  code: null,
  desc: null,
  status: null,
  dicIndexId: null,
  remark: null,
  desc1: null,
  desc2: null,
  desc3: null,
  desc4: null,
  sortNo: null
}
export default {
  name: 'ElSysDic',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '字典信息', url: 'api/elSysDic', sort: 'id,desc', crudMethod: { ...crudElSysDic }})
  },
  data() {
    return {
      cascadeShow: true,
      catalogName: '', catalogDatas: [],
      defaultProps: { children: 'children', label: 'label' },
      permission: {
        add: ['admin', 'elSysDic:add'],
        edit: ['admin', 'elSysDic:edit'],
        del: ['admin', 'elSysDic:del']
      },
      rules: {
        id: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典对照码不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '字典对照值不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '当前状态不能为空', trigger: 'blur' }
        ],
        dicIndexId: [
          { required: true, message: '所属字典流水号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'code', display_name: '字典对照码' },
        { key: 'desc', display_name: '字典对照值' },
        { key: 'remark', display_name: '备注' }
      ]
    }
  },
  mounted: function() {
    this.getCatalogDatas()
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    },
    // 获取左侧部门数据
    getCatalogDatas() {
      const sort = 'sortNo,asc'
      const params = { sort: sort }
      params['id'] = '21d03054afdf43d69972cf6f7db6cfa3'
      if (this.catalogName) {
        params['name'] = this.catalogName
      }
      getCatalogTree(params).then(res => {
        this.catalogDatas = res[0].children
      })
    },
    // 获取弹窗内部门数据
    getCatalogTree() {
      getCatalogTree({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    changeCascadeShow() {
      // this.cascadeShow = !this.cascadeShow;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 点击分类树
    handleNodeClick(data) {
      if (data.data.parentId === '0') {
        this.query.catalogId = null
        this.query.catalogCascadeId = null
      } else {
        if (!this.cascadeShow) {
          this.query.catalogId = data.data.id
        } else {
          this.query.catalogId = null
        }
        this.query.catalogCascadeId = data.data.cascadeId
      }
      this.crud.toQuery()
    }
  }
}
</script>

<style scoped>

</style>
