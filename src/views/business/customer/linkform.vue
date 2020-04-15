<template>
    <div class="app-container">
      <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="关联主客户" width="500px">
        <el-form  ref="form" :model="form" :rules="rules"   size="small" label-width="80px">
          <el-form-item label="客户名称" prop="parentId" >
            <el-select
              v-model="form.parentId"
              filterable
              remote
              reserve-keyword
              placeholder="输入客户名称(支持模糊查询)"
              style="width: 300px;"
              :remote-method="custRemoteMethod"
              @change="selectChange"
              :loading="custLoading">
              <el-option
                v-for="item in custOption"
                :key="item.custName"
                :label="item.custName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { batchEdit } from '@/api/customer'
    import { deepClone } from '@/utils/index'
    import { queryCustName } from  '@/utils/business'
    export default {
        name: "linkform",
        props:{
          linkCust:{
            Object:Array,
            required:true
          }
        },
        data(){
          return{
            dialog: false,
            form:{
              parentId:''
            },
            rules: {
              parentId: [
                { required: true, message: '请选择主客户', trigger: 'blur' }
              ],
            },
            custLoading:false,
            custOption:[],
            parentCust:{}
          }
        },
      methods:{
        resetForm() {
          this.dialog = false;
        },
        cancel(){
          this.resetForm()
        },
        doSubmit(){
          this.$refs.form.validate((vaild)=>{
            if(vaild){
              var sameIdFlag = this.linkCust.filter(item=>item.id === this.form.parentId).length > 0;
              if(sameIdFlag){
                this.$message.warning("主客户不能和选择的子客户相同!");
                return;
              }
              var haveParentFlag =  this.parentCust.parentId !=  '*';
              if(haveParentFlag){
                this.$message.warning("不能选择子客户!");
                return;
              }
              var data = deepClone(this.linkCust);
              data.forEach(item=>{
                item.parentId = this.form.parentId;
              })
              batchEdit(data).then(res=>{
                this.resetForm()
                this.$notify({
                  title: '关联成功',
                  type: 'success',
                  duration: 2500
                })
                this.$parent.init()
              })
            }
          });
        },
        custRemoteMethod(custName){
          this.custLoading = true;
          queryCustName('','',custName).then(res=>{
            this.custOption  = res.option;
            this.custLoading = res.loading;
          });
        },
        selectChange(id){
          this.custOption.forEach(item=>{
            if(item.id == id){
              this.parentCust = deepClone(item);
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
