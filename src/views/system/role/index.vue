<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <div :style="'height: auto;max-height:' + height + 'overflow-y: auto;'">
      <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @current-change="handleCurrentChange">
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="dataScope" label="数据权限"/>
        <el-table-column prop="remark" label="描述"/>
        <el-table-column prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <edit v-if="checkPermission(['ADMIN','ROLES_ALL','ROLES_EDIT'])" :data="scope.row" :sup_this="sup_this"/>
            <el-popover
              v-if="checkPermission(['ADMIN','ROLES_ALL','ROLES_DELETE'])"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <!--这里是授权模块代码-->
    <el-row :gutter="20" style="margin-top: 5px;">
      <!--权限分配-->
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">权限分配</span>
            <el-button
              v-if="showButton && checkPermission(['ADMIN','ROLES_ALL','ROLES_EDIT'])"
              :loading="permissionLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 4px 10px"
              type="info"
              @click="savePermission">保存</el-button>
          </div>
          <div style="min-height: 320px;max-height:500px;overflow-y: auto;">
            <el-tree
              ref="permission"
              :data="permissions"
              :default-checked-keys="permissionIds"
              :props="defaultProps"
              show-checkbox
              node-key="id"/>
          </div>
        </el-card>
      </el-col>
      <!--菜单分配-->
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">菜单分配</span>
            <el-button
              v-if="showButton && checkPermission(['ADMIN','ROLES_ALL','ROLES_EDIT'])"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 4px 10px"
              type="info"
              @click="saveMenu">保存</el-button>
          </div>
          <div style="min-height: 320px;max-height:500px;overflow-y: auto;">
            <el-tree
              ref="menu"
              :data="menus"
              :default-checked-keys="menuIds"
              :props="defaultProps"
              show-checkbox
              node-key="id"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/role'
import { getPermissionTree } from '@/api/permission'
import { getMenusTree } from '@/api/menu'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import { editPermission, editMenu, get } from '@/api/role'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: 0, permissionLoading: false, menuLoading: false, showButton: false,
      delLoading: false, sup_this: this, permissions: [], permissionIds: [], menus: [], menuIds: [],
      height: document.documentElement.clientHeight - 94.5 - 260 + 'px;'
    }
  },
  created() {
    this.getPermissions()
    this.getMenus()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 - 260 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.$refs.permission.setCheckedKeys([])
      this.$refs.menu.setCheckedKeys([])
      this.showButton = false
      this.url = 'api/roles'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['name'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = res
      })
    },
    getMenus() {
      getMenusTree().then(res => {
        this.menus = res
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空权限与菜单的选中
        this.$refs.permission.setCheckedKeys([])
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        this.permissionIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          let add = true
          for (let i = 0; i < val.menus.length; i++) {
            if (data.id === val.menus[i].pid) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })
        // 处理权限数据
        val.permissions.forEach(function(data, index) {
          _this.permissionIds.push(data.id)
        })
      }
    },
    savePermission() {
      this.permissionLoading = true
      const role = { id: this.currentId, permissions: [] }
      this.$refs.permission.getCheckedKeys().forEach(function(data, index) {
        const permission = { id: data }
        role.permissions.push(permission)
      })
      editPermission(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.permissionLoading = false
        this.update()
      }).catch(err => {
        this.permissionLoading = false
        console.log(err.response.data.message)
      })
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const permission = { id: data.id }
        role.menus.push(permission)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const permission = { id: data }
        role.menus.push(permission)
      })
      editMenu(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    update() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i] = res
            break
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
