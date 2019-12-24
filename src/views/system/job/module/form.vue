<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="排序"
        prop="sort"
      >
        <el-input-number
          v-model.number="form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        v-if="form.pid !== 0"
        label="状态"
        prop="enabled"
      >
        <el-radio
          v-for="item in jobStatus"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="所属部门"
        prop="dept.id"
        :rules="rules.dept"
      >
        <treeselect
          v-model="form.dept.id"
          :options="depts"
          style="width: 370px"
          placeholder="选择部门"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, { form } from '@crud/crud'
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultForm = {
  id: null,
  name: '',
  sort: 999,
  enabled: true,
  dept: {
    id: 1
  }
}
export default {
  components: { Treeselect },
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      depts: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        dept: { required: true, message: '所属部门不能为空', trigger: 'select' }
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeToCU]() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.dept.id) {
        this.$notify({
          title: '所属部门不能为空',
          type: 'warning'
        })
        return false
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
