<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="operate" width="80%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" :disabled="operate==='详情'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户类型">
            <el-select v-model="cust.custType"   placeholder="请选择" disabled>
              <el-option
                v-for="item in dictCustType"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地区">
            <el-select v-model="cust.area" filterable  placeholder="请选择" disabled>
              <el-option
                v-for="item in dictArea"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-input v-model="cust.custName" style="width: 200px;" maxlength="50" placeholder="请输入内容" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称"  prop="productId">
            <el-select v-model="form.productId" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictProductId"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存量账户数"  prop="stockAccountNum">
            <el-input v-model="form.stockAccountNum" style="width: 200px;" maxlength="16" @keyup.native="upNumber" @keydown.native="upNumber"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公募数量"  prop="publicNum">
            <el-input v-model="form.publicNum" style="width: 200px;" maxlength="16" @keyup.native="upNumber" @keydown.native="upNumber"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="大集合数量"  prop="bigCollectionNum">
            <el-input v-model="form.bigCollectionNum" style="width: 200px;"  maxlength="16" @keyup.native="upNumber" @keydown.native="upNumber"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专户数量"  prop="specialAccountNum">
            <el-input v-model="form.specialAccountNum" style="width: 200px;" maxlength="16" @keyup.native="upNumber" @keydown.native="upNumber"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="小集合数量"  prop="smallCollectionNum">
            <el-input v-model="form.smallCollectionNum" style="width: 200px;" maxlength="16"  @keyup.native="upNumber" @keydown.native="upNumber"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户产品类型"  prop="custProductType">
            <el-select v-model="form.custProductType" multiple filterable  placeholder="请选择">
              <el-option
                v-for="item in dictCustProductType"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否有余额理财"  prop="haveYeb">
            <el-select v-model="form.haveYeb" filterable  placeholder="请选择">
              <el-option
                v-for="item in dictYesNo"
                :key="item.value"
                :label="item.label"
                :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="统计申请日期"  prop="statRequestDate">
            <el-date-picker
              v-model="form.statRequestDate"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="统计确认日期"  prop="statConfirmDate">
            <el-date-picker
              v-model="form.statConfirmDate"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="统计人员"  prop="statPerson">
            <el-select
              v-model="form.statPerson"
              filterable
              remote
              reserve-keyword
              placeholder="输入发放人(支持模糊查询)"
              style="width: 200px;"
              :remote-method="userRemoteMethod"
              :loading="userLoading">
              <el-option
                v-for="item in userOption"
                :key="item.id"
                :label="item.username"
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注"  prop="memo">
          <el-input v-model="form.memo"  type="textarea"/>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="operate!=='详情'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import  {  queryUser } from  '@/utils/business'
  import { add, edit,del } from '@/api/custProduct'
  import { parseTimeymd, deepClone } from '@/utils/index'
  import { upNumber } from '@/utils/validate'

  export default {
  props: {
    operate: {
      type: String,
      required: true
    }
   ,dictProductId: {
     type: Array,
     required: true
    }
   ,dictCustProductType: {
     type: Array,
     required: true
    }
   ,dictYesNo: {
     type: Array,
     required: true
    },
    dictCustType: {
      type: Array,
      required: true
    },
    dictArea: {
      type: Array,
      required: true
    },
    cust:{
      type:Object,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        custId: '',
        productId: '',
        stockAccountNum: '',
        publicNum: '',
        bigCollectionNum: '',
        specialAccountNum: '',
        smallCollectionNum: '',
        custProductType: [],
        haveYeb: '',
        statRequestDate: '',
        statConfirmDate: '',
        statPerson: '',
        memo: ''
      },
      rules: {
        productId:[
          { required: true, message: '请选择产品名称', trigger: 'blur' },
        ],
        stockAccountNum:[
          { required: true, message: '请输入存量账户数', trigger: 'blur' },
        ],
        publicNum:[
          { required: true, message: '请输入公募数量', trigger: 'blur' },
        ],
        bigCollectionNum:[
          { required: true, message: '请输入大集合数量', trigger: 'blur' },
        ],
        specialAccountNum:[
          { required: true, message: '请输入专户数量', trigger: 'blur' },
        ],
        smallCollectionNum:[
          { required: true, message: '请输入小集合数量', trigger: 'blur' },
        ],
        custProductType:[
          { required: true, message: '请选择客户产品类型', trigger: 'blur' },
        ],
        haveYeb:[
          { required: true, message: '请选择是否有余额理财', trigger: 'blur' },
        ],
        statRequestDate:[
          { required: true, message: '请选择统计申请日期', trigger: 'blur' },
        ],
        statConfirmDate:[
          { required: true, message: '请选择统计确认日期', trigger: 'blur' },
        ],
        statPerson:[
          { required: true, message: '请选择统计人员', trigger: 'blur' },
        ],
        memo:[
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
      },
      userLoading:false,
      userOption:[]
    }
  },
  methods: {
    upNumber,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate((vaild)=>{
          if(vaild) {
            this.loading = true
            this.dealData();
            if (this.operate ==='新增') {
              this.doAdd();
            } else if(this.operate ==='修改'){
              this.doEdit();
            }
          }
        })

    },
    dealData(){
      this.form.custId = this.cust.id;
      this.form.statRequestDate = parseTimeymd(this.form.statRequestDate)
      this.form.statConfirmDate = parseTimeymd(this.form.statConfirmDate);
      if(this.form.custProductType.length){
        this.form.custProductType = this.form.custProductType.join(",");
      }
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
        this.$parent.queryCustOtherInfo()
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
        this.$parent.queryCustOtherInfo()
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
        custId: '',
        productId: '',
        stockAccountNum: '',
        publicNum: '',
        bigCollectionNum: '',
        specialAccountNum: '',
        smallCollectionNum: '',
        custProductType: '',
        haveYeb: '',
        statRequestDate: '',
        statConfirmDate: '',
        statPerson: '',
        memo: ''
      }
    },
    del(data){
      del(data).then(res=>{
        this.$parent.dleChangePage();
        this.$parent.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.$parent.queryCustOtherInfo()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    userRemoteMethod(username){
      this.userLoading = true;
      queryUser(username).then(res=>{
        this.userOption  = res.option;
        this.userLoading = res.loading;
      })
    },
  }
}
</script>

<style scoped>

</style>
