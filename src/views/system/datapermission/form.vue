<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="1000px">
    <el-form ref="form" :model="form"  size="small" label-width="80px" label-position="top" :disabled="operate==='详情'">
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            <el-form-item label="方案名称"  prop="name" required :rules="[
                      { required: true, message: '请输入方案名称', trigger: 'blur' },
                      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ]">
              <el-input v-model="form.name" placeholder="请输入"  maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-dropdown @command="onAddTableClick" :hide-on-click="true">
            <el-button type="primary" size="small">
              增加表数据权限
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,key,index) in sets"
                :key="key"
                :disabled = "item.disabled"
                :command="key">{{item.tableName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
      </el-card>
      <el-card class="box-card" v-for="(table,tableIndex) in form.tables" :key="tableIndex">
        <div slot="header" class="clearfix">
          <el-tag>{{table.tableName}}</el-tag>
          <el-button style="float: right;" type="text" @click="onDelTableClick(tableIndex)">删除表数据权限</el-button>
          <el-dropdown @command="(command)=>{onAddFieldClick(command,tableIndex)}" :hide-on-click="true">
            <el-button type="primary" size="small">
              增加字段数据权限
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(field,key,index) in sets[table.tableCode].fields"
                :key="index"
                :command="key">{{field.fieldName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-card class="box-card"  shadow="never" v-for="(field,fieldIndex) in table.fields" :key="fieldIndex">
          <div slot="header" class="clearfix">
            <el-tag>{{field.tableName}}</el-tag>
            <el-tag type="info">{{field.fieldName}}</el-tag>
            <el-button style="float: right;" type="text" @click="onDelFieldClick(tableIndex,fieldIndex)">删除字段数据权限</el-button>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作类型"  :prop="`tables.${tableIndex}.fields.${fieldIndex}.operateType`" :rules="[
                      { required: true, message: '请选择操作类型', trigger: 'blur' }
                    ]">
                <el-select v-model="field.operateType"   placeholder="请选择">
                  <el-option
                    v-for="item in dict['operate_type']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字段值"  :prop="`tables.${tableIndex}.fields.${fieldIndex}.operateValue`"   :rules="[
                      { required: true, message: '请'+(field.dictName!=''?'选择':'输入')+'字段值', trigger: 'blur' },
                      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ]">
                <el-select  v-model="field.operateValue" v-if="field.dictName != ''">
                  <el-option
                    v-for="item in dict[field.dictName]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-input v-model="field.operateValue" v-if="field.dictName == ''"  maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-card>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button  v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getAllSet } from '@/api/dataPermission'
import { deepClone, getDictCaption, getDictValue, } from '@/utils/index'
import { queryField } from '@/api/dataPermissionField'
const tableModel = {
        tableCode: '',
        tableName: '',
        fields: []
      };
const fieldModel = {
        tableCode: '',
        tableName: '',
        fieldCode: '',
        fieldName: '',
        operateType:'',
        dictName: ''
      };
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
      form: {
        id: '',
        name:'',
        tables:[]
      },
      rules: {
      },
      roles:[],
      sets:{}
    }
  },
  created(){
    this.$nextTick(() => {
      this.getSet();
    })
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    checkTableAndField(){
       var result = true;
       if(this.form.tables && this.form.tables.length){
         var haveFieldTable = this.form.tables.filter((item)=>item.fields.length > 0);
         if(haveFieldTable.length === 0){
           result = false;
         }
       }else {
         result = false;
       }
       return result;
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild && this.checkTableAndField()) {
            this.loading = true;
            if (this.operate ==='新增') {
              this.doAdd();
            } else if(this.operate ==='修改'){
              this.doEdit();
            }
          }else{
            this.$message.warning("未设置表和字段权限或字段校验未通过!")
          }
        })

    },
    dealFormData(){
       var data = {};
       data.id = this.form.id;
       data.name = this.form.name;
       data.fields = [];
       this.form.tables.forEach((table)=>{
         data.fields =  data.fields.concat(table.fields);
       })
      return data;
    },
    regroupFormData(data){
      var tables = {};
      if(data){
        this.form.id = data.id;
        this.form.name = data.name;
        this.form.tables = [];
        if(data.fields && data.fields.length){
           data.fields.forEach((field)=>{
             var table;
              if(tables.hasOwnProperty(field.tableCode)){
                table = table[field.tableCode];
              }else {
                table = deepClone(tableModel);
                tables[field.tableCode] = table;
                table.tableCode = field.tableCode;
                table.tableName = field.tableName;
              }
              table.fields.push(field);
           })
          for(var tableCode in tables){
            this.form.tables.push(tables[tableCode]);
          }
        }
        console.log(JSON.stringify(this.form))
      }
    },
    doAdd() {
      var data = this.dealFormData();
      add(data).then(res => {
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
      var data = this.dealFormData();
      edit(data).then(res => {
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
        name:'',
        tables:[]
      }
      for(var key in this.sets){
         var item = this.sets[key];
         item.disabled = false;
      }

    },
    dealSet(sets){
       if(sets && sets.length){
         sets.forEach((item,index)=>{
            item.disabled = false;
           this.sets[item.tableCode] = item;
            var fields = {};
            if(item.fields && item.fields.length){
              item.fields.forEach((field)=>{
                fields[field.fieldCode] = field;
              })
            }
            item.fields = fields;

         })
       }
    },
    getSet(){
      getAllSet().then(res => {
         this.dealSet(res);
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    onAddTableClick(tableCode){
      var table = deepClone(tableModel);
      table.tableCode = tableCode;
      table.tableName = this.sets[tableCode].tableName;
      this.form.tables.push(table);
      this.$set(this.sets[tableCode],"disabled",true);
    },
    onDelTableClick(index){
      var  tableCode =  this.form.tables[index].tableCode;
      this.form.tables.splice(index,1);
      this.sets[tableCode].disabled = false;
    },
    onAddFieldClick(command,tableIndex){
      var field = deepClone(fieldModel);
      var tableCode = this.form.tables[tableIndex].tableCode;
      var fieldSet = this.sets[tableCode].fields[command];
      field.tableCode = tableCode;
      field.tableName = this.sets[tableCode].tableName;
      field.fieldCode = fieldSet.fieldCode;
      field.fieldName = fieldSet.fieldName;
      field.dictName  = fieldSet.dictName;
      this.form.tables[tableIndex].fields.push(field);
    },
    onDelFieldClick(tableIndex,fieldIndex){
      this.form.tables[tableIndex].fields.splice(fieldIndex,1);
    }
  },
  watch:{

  }
}
</script>

<style scoped>

</style>
