<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="客户名称">
        <el-input v-model="cust.custName" style="width: 370px;"  :disabled="true"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="实施人员" >
        <el-select v-model="userId" style="width: 370px;"  filterable  placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.username"
            :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/custUser'
import { getAllUser } from '@/api/user'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        custId: '',
        user: { id: '' },
      },
      cust:{},
      userId:'',
      rules: {
      },
      users:[]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
        if(vaild){
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      });
    },
    doAdd() {
      this.form.user.id = this.userId;
      this.form.custId = this.cust.id;
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
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
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.userId = '';
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        custId: '',
        userId: ''
      }
    },
    getUsers(){
      getAllUser().then(res => {
        this.users = res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  },
  watch: {
  }
}
</script>

<style scoped>

</style>
