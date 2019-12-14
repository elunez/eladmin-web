<!--增删改查-->
<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <el-button
        v-permission="parent.permission.add"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="crud.toAdd"
      >
        新增
      </el-button>
      <el-button
        v-permission="parent.permission.edit"
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1"
        @click="crud.toEdit(crud.selections[0])"
      >
        修改
      </el-button>
      <el-button
        slot="reference"
        v-permission="parent.permission.del"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        :disabled="parent.selections.length === 0"
        @click="toDelete(crud.selections)"
      >
        删除
      </el-button>
      <el-button
        :loading="parent.downloadLoading"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-download"
        @click="parent.doExport"
      >导出</el-button>
    </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-search"
        @click="toggleSearch()"
      />
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="crud.refresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
          icon="el-icon-s-grid"
        >
          <i
            class="fa fa-caret-down"
            aria-hidden="true"
          />
        </el-button>
        <el-checkbox
          v-for="item in parent.tableColumns"
          :key="item.label"
          v-model="item.visible"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script>
export default {
  props: {
    parent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.parent.updateProp('searchToggle', true)
  },
  methods: {
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (datas.length === 1) {
          this.crud.doDelete(datas[0])
        } else {
          this.crud.doDeletes(datas)
        }
      }).catch(() => {
      })
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle
    }
  }
}
</script>

<style>
  .crud-opts {
    padding: 6px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>
