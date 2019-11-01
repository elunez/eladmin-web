<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增菜单' : '编辑菜单'" append-to-body width="580px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单类型">
        <el-radio-group v-model="form.type" size="mini" style="width: 178px">
          <el-radio-button label="0">目录</el-radio-button>
          <el-radio-button label="1">菜单</el-radio-button>
          <el-radio-button label="2">按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标">
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="外链菜单">
        <el-radio-group v-model="form.iframe" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存">
        <el-radio-group v-model="form.cache" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="菜单可见">
        <el-radio-group v-model="form.hidden" size="mini">
          <el-radio-button label="false">是</el-radio-button>
          <el-radio-button label="true">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="菜单标题" prop="name">
        <el-input v-model="form.name" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题"/>
      </el-form-item>
      <el-form-item v-show="form.type.toString() === '2'" label="按钮名称">
        <el-input v-model="form.name" placeholder="按钮名称" style="width: 178px;"/>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '0'" label="权限标识">
        <el-input :disabled="form.iframe === 'true'" v-model="form.permission" placeholder="权限标识" style="width: 178px;"/>
      </el-form-item>
      <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;"/>
      </el-form-item>
      <el-form-item label="菜单排序">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 178px;"/>
      </el-form-item>
      <el-form-item v-show="form.iframe === 'false' && form.type.toString() === '1'" label="组件名称">
        <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段"/>
      </el-form-item>
      <el-form-item v-show="form.iframe === 'false' && form.type.toString() === '1'" label="组件路径">
        <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径"/>
      </el-form-item>
      <el-form-item label="上级类目">
        <treeselect v-model="form.pid" :options="menus" style="width: 450px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getMenusTree } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect, IconSelect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, menus: [],
      form: { name: '', sort: 999, path: '', component: '', componentName: '', iframe: 'false', roles: [], pid: 0, icon: '', cache: false, hidden: false, type: 0, permission: '' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(() => {
        this.loading = false
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', sort: 999, path: '', component: '', componentName: '', iframe: 'false', roles: [], pid: 0, icon: '', cache: false, hidden: false, type: 0, permission: '' }
    },
    selected(name) {
      this.form.icon = name
    },
    getMenus() {
      getMenusTree().then(res => {
        this.menus = []
        const menu = { id: 0, label: '顶级类目', children: [] }
        menu.children = res
        this.menus.push(menu)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
