<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="添加脚本" width="80%">
    <div style="text-align: center">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="value"
        filterable
        :titles="[ '剩余脚本','包含的脚本']"
        :button-texts="[ '取消关联','添加关联']"
        :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}'}"
        :data="transferData">
        <span slot-scope="{ option }">{{ option.label }}</span>
        <div class="transfer-footer" slot="left-footer">
          <el-form   ref="form" v-model="form">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="productId" label="产品名称" >
                  <el-select v-model="form.productId" filterable  size="mini" style="width: 80px" placeholder="" @change="productIdAndMoudleTypeChange">
                    <el-option
                      v-for="item in dictProductId"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="moduleType" label="模块">
                  <el-select v-model="form.moduleType" filterable size="mini" style="width: 80px" placeholder="" @change="productIdAndMoudleTypeChange">
                    <el-option
                      v-for="item in dictModuleType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" icon="el-icon-document-add" @click="saveValueClick">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import { queryScriptNoFunc } from '@/utils/business'
    import { addList } from '@/api/functionScript'
    export default {
        name: "transfer",
        props:{
          dictModuleType: {
            type: Array,
            required: true
          },
          dictProductId:{
            type: Array,
            required: true
          }
        },
        data(){
          return{
            dialog: false,
            transferData: [],
            value: [],
            form: {
              productId:'',
              moduleType:'',
            },
            allData:{},
            func:{}
          }
        },
        created(){
        },
        methods:{
          getTransferData(){
            queryScriptNoFunc(this.form.productId,this.form.moduleType,'').then(res=>{
              this.transferData = this.adjustFormt(res.option);
            });
          },
          queryScript(productId,moduleType){
            this.form.productId = productId;
            this.getTransferData();
          },
          getScriptsKey(data){
            var  result = []
            if(data){
              result= data.map((item,index)=>{
                return  item.id;
              })
            }
            return result;
          },
          adjustFormt(data){
            var  result = [];
            var  havaKey = new Map();
            if(data){
              result= data.map((item,index)=>{
                var obj = {key:item.id,label:item.scriptName};
                this.allData[obj.key] = obj;
                havaKey.set(obj.key,obj);
                return obj;
              })
            }
            if(this.value && this.value.length){
               this.value.forEach((item)=>{
                 if(!havaKey.has(item)){
                   result.push(this.allData[item])
                 }
               })
            }
            return result;
          },
          cancel(){
             this.dialog = false;
             this.$refs['form'].resetFields();
             this.form = {
               productId:'',
               moduleType:'',
             }
          },
          productIdAndMoudleTypeChange(){
            this.getTransferData();
          },
          saveValueClick(){
            var data = [];
            if(!this.value){
               this.$message.warning("未选择关联数据无法保存!")
            }else {
              this.value.forEach((item)=>{
                data.push({
                  id:'',
                  functionId:this.func.id,
                  scriptId:item
                })
              })
              addList(data).then(res=>{
                this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 2500
                });
                this.dialog = false;
                this.$parent.init();
              })
            }

          }

        }

    }
</script>

<style>
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
    background: #FFFFFF;
    margin: 0;
    padding: 0;
    border-top: 1px solid #e6ebf5;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .el-transfer-panel{
    width: 300px;
    height: 400px;
  }
  .el-transfer-panel__list.is-filterable{
    height: 300px;
  }

</style>
