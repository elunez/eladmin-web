<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="客户名称">
        <el-input v-model="cust.custName" style="width: 200px;"  :disabled="true"/>
      </el-form-item>
      <el-form-item  label="产品名称" >
        <el-select v-model="productId" style="width: 200px;" filterable  placeholder="请选择">
          <el-option
            v-for="item in products"
            :key="item.id"
            :label="item.productId+'_'+item.versionNo"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="版本类型" >
        <el-select v-model="form.versionType" filterable  placeholder="请选择">
          <el-option
                  v-for="item in dictCustVersionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" ></el-option>
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
import { add, edit } from '@/api/custProduct'
import {getAllProduct} from '@/api/product'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
   ,dictCustVersionType: {
     type: Array,
     required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        custId: '',
        product: {id:''},
        versionType: ''
      },
      rules: {
      },
      cust:{},
      productId:'',
      products:[]
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
      this.form.custId = this.cust.id;
      this.form.product.id = this.productId;
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
      this.dialog = false;
      this.productId='';
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        custId: '',
        product: {id:''},
        versionType: ''
      }
    },
    getProducts(){
      getAllProduct().then(res => {
        this.products = res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
