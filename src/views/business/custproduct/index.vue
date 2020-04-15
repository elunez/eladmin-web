<template>
  <div class="app-container">
    <!--工具栏-->
    <el-collapse>
      <el-collapse-item   title="搜索查询" name="1">
        <div class="head-container">
            <!-- 搜索 -->
            <el-form ref="queryForm" :model="form"  size="small" label-width="100px">
                    <el-form-item label="客户id"  prop="custId">
                        <el-input v-model="form.custId" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="产品名称"  prop="productId">
                        <el-select v-model="form.productId" filterable  placeholder="请选择">
                          <el-option
                                  v-for="item in  dict.product_id"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存量账户数"  prop="stockAccountNum">
                        <el-input v-model="form.stockAccountNum" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="公募数量"  prop="publicNum">
                        <el-input v-model="form.publicNum" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="大集合数量"  prop="bigCollectionNum">
                        <el-input v-model="form.bigCollectionNum" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="专户数量"  prop="specialAccountNum">
                        <el-input v-model="form.specialAccountNum" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="小集合数量"  prop="smallCollectionNum">
                        <el-input v-model="form.smallCollectionNum" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="客户产品类型"  prop="custProductType">
                        <el-select v-model="form.custProductType" filterable  placeholder="请选择">
                          <el-option
                                  v-for="item in  dict.cust_product_type"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有余额理财"  prop="haveYeb">
                        <el-select v-model="form.haveYeb" filterable  placeholder="请选择">
                          <el-option
                                  v-for="item in  dict.yes_no"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="统计申请日期"  prop="statRequestDate">
                        <el-input v-model="form.statRequestDate" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="统计确认日期"  prop="statConfirmDate">
                        <el-input v-model="form.statConfirmDate" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="统计人员"  prop="statPerson">
                        <el-input v-model="form.statPerson" style="width: 200px;"/>
                    </el-form-item>
                    <el-form-item label="备注"  prop="memo">
                        <el-input v-model="form.memo" style="width: 200px;"/>
                    </el-form-item>
            </el-form>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item  v-if="checkPermission(['admin','custProduct:add','custProduct:edit','custProduct:del','custProduct:export','custProduct:import'])" title="操作" name="2">
        <div class="head-container">
          <!-- 新增 -->
          <el-button
                  v-permission="['admin','custProduct:add']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  style="margin-left: 20px"
                  @click="add">新增</el-button>
          <el-button
                  v-if="multipleSelection.length === 1"
                  v-permission="['admin','custProduct:edit']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  style="margin-left: 20px;margin-bottom: 4px"
                  @click="edit(multipleSelection[0])">修改</el-button>
          <el-popover
                  v-if="multipleSelection.length !== 1"
                  v-permission="['admin','custProduct:edit']"
                  :ref="multipleSelection"
                  placement="top"
                  width="180">
            <p v-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <el-button slot="reference" style="margin-left: 20px" size="mini" type="primary" icon="el-icon-edit" >修改</el-button>
          </el-popover>
          <el-popover
                  v-permission="['admin','custProduct:del']"
                  ref="delpopver"
                  placement="top"
                  width="200">
            <p v-if="multipleSelection.length ===1">确定删除本条数据吗？</p>
            <p v-else-if="multipleSelection.length <1">请选择一条数据!</p>
            <p v-else-if="multipleSelection.length > 1">只能选择一条数据!</p>
            <div style="text-align: right; margin: 0" v-if="multipleSelection.length ===1">
              <el-button size="mini" type="text" @click="$refs['delpopver'].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(multipleSelection[0].id)">确定</el-button>
            </div>
            <el-button slot="reference"  style="margin-left: 20px" size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
          </el-popover>
          <!-- 导出 -->
          <el-dropdown
                  class="filter-item"
                  type="primary"
                  icon="el-icon-download"
                  style="margin-left: 20px"
                  v-permission="['admin','custProduct:export']"
                  @command="download">
            <el-button type="primary" size="mini">
              导出EXECL<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="导出全部">导出全部</el-dropdown-item>
              <el-dropdown-item command="导出选择">导出选择</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--导入-->
          <el-button
                  v-permission="['admin','custProduct:import']"
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  icon="el-icon-upload"
                  @click="upload">导入EXECL
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>


    <!--表单组件-->
    <eForm ref="form" :operate="operate"  :dictProductId="dict.product_id"   :dictCustProductType="dict.cust_product_type"   :dictYesNo="dict.yes_no"  />
    <!--导入表单-->
    <uploadForm ref="upform" :uploadApi="uploadApi"/>
    <!--表格渲染-->
    <el-table :data="data" size="small" style="width: 100%;">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column prop="productId" label="产品名称">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.productId,dict.product_id)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stockAccountNum" label="存量账户数"/>
      <el-table-column prop="publicNum" label="公募数量"/>
      <el-table-column prop="bigCollectionNum" label="大集合数量"/>
      <el-table-column prop="specialAccountNum" label="专户数量"/>
      <el-table-column prop="smallCollectionNum" label="小集合数量"/>
      <el-table-column prop="custProductType" label="客户产品类型">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.custProductType,dict.cust_product_type)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="haveYeb" label="是否有余额理财">
        <template slot-scope="scope">
          <div>{{getDictCaption(scope.row.haveYeb,dict.yes_no)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="statRequestDate" label="统计申请日期"/>
      <el-table-column prop="statConfirmDate" label="统计确认日期"/>
      <el-table-column prop="statPerson" label="统计人员"/>
      <el-table-column prop="memo" label="备注"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <right-menu ref="rightMenu" :menu="menu"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadCustProduct } from '@/api/custProduct'
import uploadForm from  '@/views/business/upload/form'
import { parseTime, downloadFile, deepClone, getDictCaption } from '@/utils/index'
import rightMenu from '@/views/business/rightmenu/index'
import eForm from './form'
export default {
  components: { eForm, uploadForm, rightMenu },
  mixins: [initData],
  dicts:['product_id','cust_product_type','yes_no'],
  data() {
    return {
      delLoading: false,
      uploadApi:'api/custProduct',
      multipleSelection:[],
      form: {
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
      },
      menu:[
        {
          title:'复制新增',
          click:this.copyClick
        },
      ],
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight -200;
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    getDictCaption,
    beforeInit() {
      this.url = 'api/custProduct'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.assign(this.params,this.form);
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs['delpopver'].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs['delpopver'].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.operate = '新增';
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.operate = '修改'
      const _this = this.$refs.form
      _this.form = deepClone(data)
      _this.dialog = true
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    rowDoubleClick(row){
      const _this = this.$refs.form;
      _this.form = deepClone(row);
      this.operate = '详情';
      _this.dialog = true
    },
    // 导出
    download(command) {
      var data = [];
      if(command ==='导出选择'){
        if(!this.multipleSelection.length){
          this.$message({
            message: '请选择要导出的数据',
            type: 'warning'
          });
          return;
        }
        data = this.multipleSelection ;
      }
      this.downloadLoading = true
      downloadCustProduct(data).then(result => {
        downloadFile(result, '客户产品信息列表', 'xlsx')
      this.downloadLoading = false
    }).catch(() => {
        this.downloadLoading = false
      })
    },
    upload(){
      this.$refs.upform.dialog=true;
    },
    resetQuery(){
      this.$refs['queryForm'].resetFields();
    },
    rowContextMenu(row){
      this.rightClickRow = row;
    },
    copyClick(){
      const  _this = this.$refs.form;
      _this.form = deepClone(this.rightClickRow);
      this.operate = '新增'
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
