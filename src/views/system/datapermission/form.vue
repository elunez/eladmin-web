<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="1000px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" label-position="top">
      <el-row :gutter="8">
         <el-col :span="8">
           <el-form-item style="margin-bottom: 0px;" label="角色">
             <el-select v-model="form.roleId"  placeholder="请选择">
               <el-option
                 v-for="(item, index) in roles"
                 :key="item.name + index"
                 :label="item.name"
                 :value="item.id"/>
             </el-select>
           </el-form-item>
         </el-col>
        <el-col :span="8">
          <el-form-item label="表名称"  prop="tableIndex">
            <el-select v-model="form.tableIndex"  placeholder="请选择">
              <el-option
                v-for="(item, index) in sets"
                :key="item.tableName + index"
                :label="item.tableName"
                :value="index"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="form.tableIndex>=0 && sets[form.tableIndex]&&('fields' in sets[form.tableIndex]) ">
            <el-dropdown @command="selectField" style="margin-top: 13%">
              <el-button type="primary">
                选择字段
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(field,index) in sets[form.tableIndex].fields"
                  :key="field.fieldCode"
                  :command="index">{{field.fieldName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8" v-for="(field, index) in form.fields" :key="field.index">
        <el-col :span="5">
          <el-form-item label="字段代码"  :prop="'fields.'+index+'.fieldCode'">
            <el-input v-model="field.fieldCode" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="字段名称"  :prop="'fields.'+index+'.fieldName'">
            <el-input v-model="field.fieldName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="操作类型"  :prop="'fields.'+index+'.operateType'">
            <el-select v-model="field.operateType" filterable  placeholder="请选择">
              <el-option
                v-for="item in dict['operate_type']"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="字段值"  :prop="'fields.'+index+'.operateValue'">
            <el-select  v-model="field.operateValue" v-if="field.dictName != ''" required>
              <el-option
                v-for="item in dict[field.dictName]"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
            <el-input v-model="field.operateValue" v-if="field.dictName == ''" required maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button @click.prevent="removeField(index)" style="margin-top: 26%;margin-left: 10%">删除字段设置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button  :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getAllSet } from '@/api/dataPermission'
import { getAll } from '@/api/role'
export default {
  props: {
    operate: {
      type: String,
      required: true
    },
    dict: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      field:{
        fieldCode: '',
        fieldName: '',
        operateType:'',
        dictName: ''
      },
      form: {
        id: '',
        roleId: null,
        tableCode: '',
        className:'',
        tableName: '',
        tableIndex:null,
        fields:[]
      },
      rules: {
      },
      roles:[],
      sets:[]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    genFormData(){
       this.form.className = this.sets[this.form.tableIndex].className;
       this.form.tableCode = this.sets[this.form.tableIndex].tableCode;
       this.form.tableName = this.sets[this.form.tableIndex].tableName;
       delete  this.form.tableIndex;
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild) {
            this.loading = true;
            this.genFormData();
            if (this.operate ==='新增') {
              this.doAdd();
            } else if(this.operate ==='修改'){
              this.doEdit();
            }
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
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        roleId: null,
        className:'',
        tableCode: '',
        tableName: '',
        tableIndex:null,
        fields:[]
      }
    },
    getSet(){
      getAllSet().then(res => {
        this.sets = res;
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    removeField(index){
        if(index>=0 && index<this.form.fields.length){
           this.form.fields.splice(index,1);
        }
    },
    selectField(index){
      this.form.fields.push({
        fieldCode: this.sets[this.form.tableIndex].fields[index].fieldCode,
        fieldName: this.sets[this.form.tableIndex].fields[index].fieldName,
        dictName:  this.sets[this.form.tableIndex].fields[index].dictName,
        operateType:'',
        operateValue:null
      })
    }
  }
}
</script>

<style scoped>

</style>
