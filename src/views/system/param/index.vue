<template>
  <div class="app-container">

    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="5" :sm="5" :md="4" :lg="4" :xl="4">
        <!--        <div class="head-container">-->

        <!--          <el-input-->
        <!--            v-model="catalogName"-->
        <!--            clearable-->
        <!--            size="small"-->
        <!--            placeholder="输入分類搜索"-->
        <!--            prefix-icon="el-icon-search"-->
        <!--            class="filter-item"-->
        <!--            @input="getCatalogDatas"-->
        <!--          />-->
        <!--          -->
        <!--        </div>-->
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

      <!--用户数据-->
      <el-col :xs="19" :sm="19" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.value"
              clearable
              placeholder="输入搜索内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
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
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
              <el-form-item label="流水号" prop="id">
                <el-input v-model="form.id" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="参数键" prop="key">
                <el-input v-model="form.key" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="参数值">
                <el-input v-model="form.value" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="所属分类流水号" prop="catalogId">
                <el-input v-model="form.catalogId" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="参数名称" prop="name">
                <el-input v-model="form.name" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="是否可覆盖" prop="isOverwrite">
                未设置字典，请手动设置 Select
              </el-form-item>
              <el-form-item label="覆盖来源字段">
                <el-input v-model="form.overwriteField" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
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
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="name" label="参数名称" />
            <el-table-column prop="key" label="参数键" />
            <el-table-column prop="value" label="参数值" />
            <el-table-column prop="isOverwrite" label="是否可覆盖" width="80" />
            <el-table-column prop="overwriteField" label="覆盖来源字段" />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip show-tooltip-when-overflow>
              <!--              <template slot-scope="scope">-->
              <!--                <el-popover placement="top-start" title="备注" width="300" trigger="hover">-->
              <!--                  <div>{{scope.row.remark}}</div>-->
              <!--                  <span slot="reference">{{ scope.row.remark != null && scope.row.remark.length > 10 ? scope.row.remark.substr(0,10)+'...' : scope.row.remark}}</span>-->
              <!--                </el-popover>-->
              <!--              </template>-->
            </el-table-column>
            <!--            <el-table-column v-permission="['admin','elSysParam:edit','elSysParam:del']" label="操作" width="150px" align="center">-->
            <!--              <template slot-scope="scope">-->
            <!--                <udOperation-->
            <!--                  :data="scope.row"-->
            <!--                  :permission="permission"-->
            <!--                />-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { getCatalogTree } from '@/api/system/elSysCatalog'
import crudElSysParam from '@/api/system/elSysParam'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  key: null,
  value: null,
  catalogId: null,
  catalogCascadeId: null,
  name: null,
  isOverwrite: null,
  overwriteField: null,
  remark: null
}
export default {
  name: 'ElSysParam',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'ElSystemParamService',
      url: 'api/elSysParam',
      sort: 'id,desc',
      crudMethod: { ...crudElSysParam }
    })
  },
  data() {
    return {
      cascadeShow: true,
      catalogName: '', depts: [], catalogDatas: [],
      defaultProps: { children: 'children', label: 'label' },
      permission: {
        add: ['admin', 'elSysParam:add'],
        edit: ['admin', 'elSysParam:edit'],
        del: ['admin', 'elSysParam:del']
      },
      rules: {
        id: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '参数键不能为空', trigger: 'blur' }
        ],
        catalogId: [
          { required: true, message: '所属分类流水号不能为空', trigger: 'blur' }
        ],
        catalogCascadeId: [
          { required: true, message: '所属分类节点语义ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        isOverwrite: [
          { required: true, message: '是否可覆盖不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'key', display_name: '参数键' },
        { key: 'value', display_name: '参数值' },
        { key: 'name', display_name: '参数名称' },
        { key: 'isOverwrite', display_name: '是否可覆盖' },
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
      params['id'] = 'cd14928a239b448b867c2e45246cd038'
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
    // 点击分类树
    handleNodeClick(data) {
      console.dir(data)
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
    },
    changeCascadeShow() {
      this.crud.toQuery()
    }
  }
}
</script>
<style scoped>
</style>
