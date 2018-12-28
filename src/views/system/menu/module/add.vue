<template>
  <div>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="dialog = true">新增</el-button>
    <el-dialog :visible.sync="dialog" :title="title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 460px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model.number="form.sort" placeholder="序号越小越靠前" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="内部菜单" prop="iframe">
          <el-radio v-model="form.iframe" label="false">是</el-radio>
          <el-radio v-model="form.iframe" label="true" >否</el-radio>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.path" placeholder="菜单路径" style="width: 460px;"/>
        </el-form-item>
        <el-form-item v-if="form.iframe === 'false'" label="组件路径">
          <el-input v-model="form.component" placeholder="菜单路径" style="width: 460px;"/>
        </el-form-item>
        <el-form-item label="上级类目">
          <treeselect v-model="form.pid" :options="menus" style="width: 460px;" placeholder="选择上级类目" />
        </el-form-item>
        <el-form-item style="margin-top: -10px;margin-bottom: 0px;" label="选择角色">
          <treeselect v-model="roleIds" :multiple="true" :options="roles" style="width: 460px;" placeholder="请选择角色" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { add } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect, IconSelect },
  props: {
    menus: {
      type: Array,
      required: true
    },
    roles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, title: '新增菜单',
      form: { name: '', sort: 999, path: '', component: '', iframe: 'false', roles: [], pid: 0, icon: '' }, roleIds: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        iframe: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
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
          this.form.roles = []
          const _this = this
          this.roleIds.forEach(function(data, index) {
            const role = { id: data }
            _this.form.roles.push(role)
          })
          add(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            setTimeout(() => {
              this.$parent.$parent.init()
              this.$parent.$parent.getMenus()
            }, 200)
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', sort: 999, path: '', component: '', iframe: 'false', roles: [], pid: 0, icon: '' }
      this.roleIds = []
    },
    selected(name) {
      this.form.icon = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  div{
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
