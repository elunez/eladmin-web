<template>
  <div class="app-container">
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
      <crudOperation :permission="permission">
        <template slot="left" />
      </crudOperation>

      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="600px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">

          <el-form-item label="分类类型" prop="type">
            <el-radio-group v-model="form.type" size="mini" style="width: 450px">
              <el-radio-button label="0">一级分类</el-radio-button>
              <el-radio-button label="1">下级分类</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-show="form.type.toString() === '0'" label="分类标识" prop="rootKey">
            <el-input v-model="form.rootKey" style="width: 450px;" />
          </el-form-item>
          <el-form-item v-show="form.type.toString() === '0'" label="分类名称" prop="rootName">
            <el-input v-model="form.rootName" style="width: 450px;" />
          </el-form-item>

          <!-- 上级目录选择 -->
          <el-form-item v-show="form.type.toString() === '1'" label="上级分类" prop="parentId">
            <treeselect
              v-model="form.parentId"
              :options="menus"
              style="width: 450px;"
              placeholder="选择上级分类"
              :default-expand-level="2"
              @select="parentSelect"
            />
          </el-form-item>

          <el-form-item v-show="form.type.toString() === '1'" label="分类名称" prop="name">
            <el-input v-model="form.name" style="width: 450px;" />
          </el-form-item>

          <el-form-item label="图标文件" prop="iconName">
            <el-popover
              placement="bottom-start"
              width="450"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.iconName" style="width: 450px;" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.iconName"
                  slot="prefix"
                  :icon-class="form.iconName"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>

          <el-form-item label="排序号" prop="sortNo">
            <el-input-number
              v-model.number="form.sortNo"
              :min="0"
              :max="999"
              controls-position="right"
              style="width: 178px;"
            />
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
        :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="name" label="分类名称" width="300" />

        <el-table-column prop="iconName" label="图标" align="center" width="60px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.iconName ? scope.row.iconName : ''" />
          </template>
        </el-table-column>

        <el-table-column prop="sortNo" label="排序号" />

        <el-table-column prop="rootKey" label="所属分类标识键" />
        <el-table-column prop="rootName" label="所属分类名称" />

        <el-table-column
          v-permission="['admin','elSysCatalog:edit','elSysCatalog:del']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>

        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import crudElSysCatalog from '@/api/system/elSysCatalog'

import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import CRUD, { presenter, header, form, crud } from '@crud/crud'

import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = {
  id: null,
  cascadeId: '0',
  rootKey: '',
  rootName: '',
  name: '',
  hotkey: '',
  parentId: '0',
  isLeaf: 0,
  isAutoExpand: 1,
  iconName: 'catalog',
  sortNo: 0,
  type: '0'
}
export default {
  name: 'ElSysCatalog',
  components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '分类科目', url: 'api/elSysCatalog', sort: 'sortNo,asc', crudMethod: { ...crudElSysCatalog }})
  },
  data() {
    const validateRootKey = (rule, value, callback) => {
      if (this.form.type.toString() === '1') {
        callback()
      } else if (value === '') {
        callback(new Error('请输入分类代码'))
      } else {
        callback()
      }
    }

    const validateRootName = (rule, value, callback) => {
      if (this.form.type.toString() === '1') {
        callback()
      } else if (value === '') {
        callback(new Error('请输入分类名称'))
      } else {
        callback()
      }
    }

    const validatePass = (rule, value, callback) => {
      if (this.form.type.toString() === '0') {
        callback()
      } else if (value === '') {
        callback(new Error('请输入分类名称'))
      } else {
        callback()
      }
    }
    return {
      menus: [],
      permission: {
        add: ['admin', 'elSysCatalog:add'],
        edit: ['admin', 'elSysCatalog:edit'],
        del: ['admin', 'elSysCatalog:del']
      },
      rules: {
        rootKey: [
          { validator: validateRootKey, trigger: 'blur' }
        ],
        rootName: [
          { validator: validateRootName, trigger: 'blur' }
        ],
        name: [
          { validator: validatePass, trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '排序号不能为空', trigger: 'blur' }
        ],
        iconName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '分类名称' }
      ]

    }
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
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      crudElSysCatalog.getCatalogTree({ parentId: '0' }).then(res => {
        this.menus = []
        const menu = { id: 0, label: '顶级类目', children: [] }
        menu.children = res
        this.menus.push(menu)
      })
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      if (form.parentId === '0') {
        form.type = '0'
      } else {
        form.type = '1'
      }
    },
    [CRUD.HOOK.beforeSubmit]() {
      if (this.form.type.toString() === '0' && this.form.name === '') {
        this.form.name = this.form.rootName
      }
      return true
    },
    // 选中图标
    selected(name) {
      this.form.iconName = name
    },

    // 新建一级分类
    addRootCatalog() {

    },
    parentSelect(node, instanceId) {
      console.dir(node)
      this.form.rootKey = node.rootKey
      this.form.rootName = node.rootName
    }
  }
}
</script>

<style scoped>

</style>
