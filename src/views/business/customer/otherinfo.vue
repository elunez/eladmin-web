<template>
 <div style="padding: 5px">
   <el-page-header @back="goback" content="客户其他信息">
     <span slot="content">客户其他信息</span>
     <el-tag slot="content"  size="mini" effect="plain" type="info"  style="margin-left: 5px;margin-bottom: 5px" v-if="cust.custType && cust.custType.length">{{getDictCaption(cust.custType,dictCustType)}}</el-tag>
     <el-tag slot="content"  size="mini" effect="plain" type="info" style="margin-left: 5px"  v-if="cust.area && cust.area.length">{{getDictCaption(cust.area,dictArea)}}</el-tag>
     <el-tag slot="content"  size="mini" effect="plain" type="info" style="margin-left: 5px" v-if="cust.custName && cust.custName.length">{{cust.custName}}</el-tag>
     <el-tag slot="content"  size="mini" effect="plain" type="info" style="margin-left: 5px" v-if="cust.custProductType && cust.custProductType.length">{{getDictCaption(cust.custProductType,dictCustProductType1)}}</el-tag>
     <el-tag slot="content"  size="mini" effect="plain" type="info" style="margin-left: 5px" v-if="cust.custNo && cust.custNo.length">{{cust.custNo}}</el-tag>
   </el-page-header>
   <el-collapse v-model="activeNames">
     <el-collapse-item v-if="custOtherInfoTabName != 4" :title="'查询'+productTabName+operateType[Number(custOtherInfoTabName)].name" name="2">
        <el-form :model="custQueryForm[operateType[Number(custOtherInfoTabName)].type]" size="mini" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="统计申请日期" prop="statRequestDate">
                <el-input v-model="custQueryForm[operateType[Number(custOtherInfoTabName)].type].statRequestDate" style="width: 200px;" maxlength="8"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统计人员" prop="statPerson">
                <el-input v-model="custQueryForm[operateType[Number(custOtherInfoTabName)].type].statPerson" style="width: 200px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="operateType[Number(custOtherInfoTabName)].type == 'custHaveValueAdded'">
              <el-form-item label="功能模块" prop="functionModule">
                <el-input v-model="custQueryForm[operateType[Number(custOtherInfoTabName)].type].functionModule" style="width: 200px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><el-form-item></el-form-item></el-col>
            <el-col :span="8"><el-form-item></el-form-item></el-col>
            <el-col :span="8">
              <el-button style="margin-left: 60px" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="queryCustOtherInfo">搜索</el-button>
              <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-right" @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
     </el-collapse-item>
     <el-collapse-item :title="'操作'+operateType[Number(custOtherInfoTabName)].name" name="3">
       <el-button
         v-permission="['admin',operateType[Number(custOtherInfoTabName)].type+':add']"
         class="filter-item"
         type="primary"
         size="mini"
         icon="el-icon-plus"
         style="margin-left: 20px"
         @click="add('新增')">新增</el-button>
<!--       <el-button-->
<!--         v-permission="['admin',operateType[Number(custOtherInfoTabName)].type+':add']"-->
<!--         class="filter-item"-->
<!--         type="primary"-->
<!--         size="mini"-->
<!--         icon="el-icon-plus"-->
<!--         style="margin-left: 20px"-->
<!--         @click="add('批量新增')">批量新增</el-button>-->
       <el-button
         v-permission="['admin',operateType[Number(custOtherInfoTabName)].type+':edit']"
         class="filter-item"
         type="primary"
         size="mini"
         icon="el-icon-edit"
         style="margin-left: 20px"
         @click="edit">修改</el-button>
       <el-button
         v-permission="['admin',operateType[Number(custOtherInfoTabName)].type+':del']"
         v-if="custOtherInfoTabName != 4"
         class="filter-item"
         type="primary"
         size="mini"
         icon="el-icon-delete"
         style="margin-left: 20px"
         @click="del">删除</el-button>
     </el-collapse-item>
   </el-collapse>
   <el-tabs tab-position="left" v-model="productTabName" @tab-click="productTabClick">
     <el-tab-pane v-if="tabType && tabType.length" v-for="item in tabType" :label="item" :key="item" :name="item">
       <el-tabs type="border-card" v-model="custOtherInfoTabName" @tab-click="custOtherInfoTabClick">
         <el-tab-pane :label="operateType[0].name"  name="0"  v-if="checkPermission(['admin',operateType[0].type+':list'])">
           <el-table v-loading="custLoading" :data="custData[operateType[0].type]"
                     size="mini"
                     border
                     @selection-change="handleSelectionChange"
                     style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="osVersion" label="OS版本" width="140px">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.osVersion,dictOsVersion)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="dbVersion" label="DB版本" :show-overflow-tooltip="true" width="80px">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.dbVersion,dictDbVersion)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="midVersion" label="中间件版本" :show-overflow-tooltip="true" width="90px">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.midVersion,dictMidVersion)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="mergeDeploy" label="合并部署" :show-overflow-tooltip="true" width="80px">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.mergeDeploy,dictYesNo)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="appConfig" label="应用配置" :show-overflow-tooltip="true" width="90px"/>
             <af-table-column prop="dbConfig" label="数据库配置":show-overflow-tooltip="true" width="90px"/>
             <af-table-column prop="statRequestDate" label="统计申请日期" width="100px"/>
             <af-table-column prop="statConfirmDate" label="统计确认日期" width="100px"/>
             <af-table-column prop="statPerson" label="统计人员" width="80px"/>
             <af-table-column prop="memo" label="备注" :show-overflow-tooltip="true"/>
           </el-table>
           <!--分页组件-->
           <el-pagination
             :total="custTotal"
             :current-page="custPage + 1"
             style="margin-top: 8px;"
             layout="total, prev, pager, next, sizes"
             @size-change="custOtherInfoSizeChange"
             @current-change="custOtherInfoPageChange"/>
         </el-tab-pane>
         <el-tab-pane :label="operateType[1].name"  name="1" v-if="checkPermission(['admin',operateType[1].type+':list'])">
           <el-table v-loading="custLoading" :data="custData[operateType[1].type]" size="mini"
                     @selection-change="handleSelectionChange"
                     border style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="stockAccountNum" label="存量账户数"/>
             <af-table-column prop="publicNum" label="公募数量"/>
             <af-table-column prop="bigCollectionNum" label="大集合数量"/>
             <af-table-column prop="specialAccountNum" label="专户数量"/>
             <af-table-column prop="smallCollectionNum" label="小集合数量"/>
             <af-table-column prop="custProductType" label="客户产品类型">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.custProductType,dictCustProductType)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="haveYeb" label="是否有余额理财">
               <template slot-scope="scope">
                 <div>{{getDictCaption(scope.row.haveYeb,dictArea)}}</div>
               </template>
             </af-table-column>
             <af-table-column prop="statRequestDate" label="统计申请日期"/>
             <af-table-column prop="statConfirmDate" label="统计确认日期"/>
             <af-table-column prop="statPerson" label="统计人员"/>
             <af-table-column prop="memo" label="备注"/>
           </el-table>
           <!--分页组件-->
           <el-pagination
             :total="custTotal"
             :current-page="custPage + 1"
             style="margin-top: 8px;"
             layout="total, prev, pager, next, sizes"
             @size-change="custOtherInfoSizeChange"
             @current-change="custOtherInfoPageChange"/>
         </el-tab-pane>
         <el-tab-pane v-if="liquidationTime.contains(item) && checkPermission(['admin',operateType[2].type+':list'])" :label="item+operateType[2].name" name="2">
           <el-table v-if="liquidationTime[0] === item" v-loading="custLoading" :data="custData[operateType[2].type]" size="mini"
                     @selection-change="handleSelectionChange"
                     border style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="statRequestDate" label="统计申请日期"/>
             <af-table-column prop="requestImport" label="申请数据导入"/>
             <af-table-column prop="marketImport" label="行情导入"/>
             <af-table-column prop="marketReview" label="行情复核"/>
             <af-table-column prop="marketExport" label="行情数据导出"/>
             <af-table-column prop="befBackup" label="处理前备份"/>
             <af-table-column prop="accoPreDeal" label="账户预处理"/>
             <af-table-column prop="reqPreDeal" label="交易预处理"/>
             <af-table-column prop="batchDeal" label="交易批处理"/>
             <af-table-column prop="afterStat" label="批后统计"/>
             <af-table-column prop="yebDeal" label="余额理财处理"/>
             <af-table-column prop="afterBackup" label="处理后备份"/>
             <af-table-column prop="exportAccount" label="清算数据导出"/>
             <af-table-column prop="exportConfirm" label="确认数据导出"/>
             <af-table-column prop="exportCrm" label="客服接口导出"/>
             <af-table-column prop="statPerson" label="统计人员"/>
             <af-table-column prop="memo" label="备注"/>
           </el-table>
           <el-table v-if="liquidationTime[1] === item" v-loading="custLoading" :data="custData[operateType[2].type]" size="mini"
                     @selection-change="handleSelectionChange"
                     border style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="statRequestDate" label="统计申请日期"/>
             <af-table-column prop="backup" label="备份"/>
             <af-table-column prop="restoreBackup" label="恢复备份"/>
             <af-table-column prop="confirmToImport" label="待确认数据导入"/>
             <af-table-column prop="confirmToDeal" label="待确认数据处理"/>
             <af-table-column prop="confirmExport" label="确认数据导出"/>
             <af-table-column prop="szInterfaceImport" label="深圳接口导入"/>
             <af-table-column prop="szInterfaceExport" label="深圳接口导出"/>
             <af-table-column prop="reportImport" label="回报数据导入"/>
             <af-table-column prop="reportDeal" label="回报数据处理"/>
             <af-table-column prop="checkAfterStat" label="对账与批后统计"/>
             <af-table-column prop="accountInvestInterExport" label="会计投资接口导出"/>
             <af-table-column prop="marketImport" label="行情导入"/>
             <af-table-column prop="marketReview" label="行情复核"/>
             <af-table-column prop="marketExport" label="行情数据导出"/>
             <af-table-column prop="twiceAfterStat" label="二次批后统计"/>
             <af-table-column prop="shAccountLiquidateDataExport" label="上海会计清算数据导出"/>
             <af-table-column prop="shCurrencyInterExport" label="上海货币接口导出"/>
             <af-table-column prop="szCurrencyInterExport" label="深圳货币接口导出"/>
             <af-table-column prop="exportCrm" label="客服接口导出"/>
             <af-table-column prop="statPerson" label="统计人员"/>
             <af-table-column prop="memo" label="备注"/>
           </el-table>
           <el-table v-if="liquidationTime[2] === item" v-loading="custLoading" :data="custData[operateType[2].type]" size="mini"
                     @selection-change="handleSelectionChange"
                     border style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="statRequestDate" label="统计申请日期"/>
             <af-table-column prop="accountInvestInterExport" label="会计投资接口导出"/>
             <af-table-column prop="twiceAfterStat" label="二次批后统计"/>
             <af-table-column prop="shAccountLiquidateDataExport" label="上海会计清算数据导出"/>
             <af-table-column prop="szCurrencyInterExport" label="上海货币接口导出"/>
             <af-table-column prop="onceDataImport" label="一次数据导入"/>
             <af-table-column prop="marketImport" label="行情导入"/>
             <af-table-column prop="marketReview" label="行情复核"/>
             <af-table-column prop="marketExport" label="行情数据导出"/>
             <af-table-column prop="befBackup" label="处理前备份"/>
             <af-table-column prop="preDeal" label="预处理"/>
             <af-table-column prop="batchDeal" label="批处理"/>
             <af-table-column prop="exportConfirm" label="确认数据导出"/>
             <af-table-column prop="reportPreBackup" label="回报前备份"/>
             <af-table-column prop="twiceDataImport" label="二次数据导入"/>
             <af-table-column prop="twiceDataDeal" label="二次数据处理"/>
             <af-table-column prop="checkAfterStat" label="批后与对账"/>
             <af-table-column prop="accountLiquidateInterExport" label="会计清算接口导出"/>
             <af-table-column prop="exportCrm" label="客服接口导出"/>
             <af-table-column prop="dayEndBackup" label="日终备份"/>
             <af-table-column prop="statPerson" label="统计人员"/>
             <af-table-column prop="memo" label="备注"/>
           </el-table>
           <!--分页组件-->
           <el-pagination
             :total="custTotal"
             :current-page="custPage + 1"
             style="margin-top: 8px;"
             layout="total, prev, pager, next, sizes"
             @size-change="custOtherInfoSizeChange"
             @current-change="custOtherInfoPageChange"/>
         </el-tab-pane>
         <el-tab-pane :label="operateType[3].name" name="3"  v-if="checkPermission(['admin',operateType[3].type+':list'])">
           <el-table  v-loading="custLoading" :data="custData[operateType[3].type]" size="mini"
                      @selection-change="handleSelectionChange"
                      border style="width: 100%;">
             <af-table-column
               type="selection"
               width="55">
             </af-table-column>
             <af-table-column prop="functionModule" label="功能模块"/>
             <af-table-column prop="onlineDate" label="上线日期"/>
             <af-table-column prop="useCondition" label="使用情况"/>
             <af-table-column prop="statRequestDate" label="统计日期"/>
             <af-table-column prop="statPerson" label="统计人员"/>
             <af-table-column prop="memo" label="备注"/>
           </el-table>
           <!--分页组件-->
           <el-pagination
             :total="custTotal"
             :current-page="custPage + 1"
             style="margin-top: 8px;"
             layout="total, prev, pager, next, sizes"
             @size-change="custOtherInfoSizeChange"
             @current-change="custOtherInfoPageChange"/>
         </el-tab-pane>
         <el-tab-pane :label="operateType[4].name" name="4" v-if="checkPermission(['admin',operateType[4].type+':list'])">
           <div v-if="custData[operateType[4].type].length == 0">
             <span>请先新增里程碑!</span>
           </div>
           <el-timeline v-else :reverse="true">
             <el-card>
               <span slot="header">
                 统计人员:{{custData[operateType[4].type].statPerson}}
               </span>
               <el-timeline-item  v-for=" (item,index) in custData[operateType[4].type].timeStmp"
                                  :timestamp="item.timestamp"
                                  :key="index"
                                  placement="top">
                 <el-card>
                   <h4>{{item.content}}</h4>
                 </el-card>
               </el-timeline-item>
             </el-card>
           </el-timeline>
         </el-tab-pane>
       </el-tabs>
     </el-tab-pane>
   </el-tabs>
   <env-form :operate="operate" ref="custEnvForm"
             :dict-area="dictArea"
             :dict-cust-type="dictCustType"
             :dict-product-id="dictProductId"
             :dict-os-version="dictOsVersion"
             :dict-db-version="dictDbVersion"
             :dict-mid-version="dictMidVersion"
             :cust="cust"
             :dict-yes-no="dictYesNo"></env-form>
   <value-add-form :operate="operate" ref="custHaveValueAddedForm"
                   :dict-area="dictArea"
                   :cust="cust"
                   :dict-cust-type="dictCustType"
                   :dict-product-id="dictProductId"></value-add-form>
   <mile-stone-form :operate="operate" ref="custMilestoneForm"
                    :dict-area="dictArea"
                    :cust="cust"
                    :dict-cust-type="dictCustType"
                    :dict-product-id="dictProductId"></mile-stone-form>
   <product-form :operate="operate" ref="custProductForm"
                 :cust="cust"
                 :dict-area="dictArea"
                 :dict-yes-no="dictYesNo"
                 :dict-cust-type="dictCustType"
                 :dict-cust-product-type="dictCustProductType"
                 :dict-product-id="dictProductId"></product-form>
   <product-liq-time-form
                 :operate="operate"
                 ref="custProductLiqTimeForm"
                :dict-area="dictArea"
                :cust="cust"
                 :liquidation-time="liquidationTime"
                :dict-cust-type="dictCustType"
                :dict-product-id="dictProductId"></product-liq-time-form>
 </div>
</template>

<script>
    import checkPermission from '@/utils/permission'
    import { downloadFile,deepClone, getDictCaption, getDictValue, strDate } from '@/utils/index'
    import { getData } from '@/api/data'
    import envForm from '@/views/business/custenv/form'
    import valueAddForm from '@/views/business/custhavevalueadded/form'
    import mileStoneForm from '@/views/business/custmilestone/form'
    import productForm from '@/views/business/custproduct/form'
    import productLiqTimeForm from '@/views/business/custproducliqtime/form'
    import store from '@/store'
    export default {
        name: "otherinfo",
        components: { envForm, valueAddForm, mileStoneForm, productForm, productLiqTimeForm },
        props:{
          cust:{
            type:Object,
            required:true
          },
          dictCustType:{
            type:Array,
            required: true
          },
          dictArea:{
            type:Array,
            required: true
          },
          dictProductId:{
            type:Array,
            required: true
          },
          dictOsVersion:{
            type:Array,
            required: true
          },
          dictDbVersion:{
            type:Array,
            required: true
          },
          dictMidVersion:{
            type:Array,
            required: true
          },
          dictYesNo:{
            type:Array,
            required: true
          },
          dictCustProductType: {
            type: Array,
            required: true
          },
          dictCustProductType1:{
            type: Array,
            required: true
          },
        },
        data(){
          return {
            operate:'',
            tabType: this.cust && this.cust.custHaveProduct && this.cust.custHaveProduct.length?getDictCaption(this.cust.custHaveProduct,this.dictProductId).split(','):[],
            liquidationTime:['TA4','ETF分TA','分TA'],
            activeNames: ['1'],
            productTabName:'',
            custOtherInfoTabName:'0',
            operateType:[
              {
                type:'custEnv',
                name:'客户环境信息'
              },
              {
                type:'custProduct',
                name:'客户产品信息'
              },
              {
                type:'custProductLiqTime',
                name:'日常清算时间'
              },
              {
                type:'custHaveValueAdded',
                name:'客户已上线增值功能'
              },
              {
                type:'custMilestone',
                name:'客户里程碑'
              },
            ],
            custMilestoneColumns:{
              systemOnlineDate:'系统上线',
              firstReleaseDate:'首次发行产品',
              firstPublicDate:'首次公募',
              firstBigCollectionDate:'首只大集合',
              firstSpecialAccountDate:'首只专户产品',
              productReleaseDateOne:'产品发行1',
              productReleaseDateTwo:'产品发行2',
            },
            custData:{
              custEnv: [],
              custProduct:[],
              custProductLiqTime:[],
              custHaveValueAdded:[],
              custMilestone:[],
            },
            selectRow:{
              custEnv: [],
              custProduct:[],
              custProductLiqTime:[],
              custHaveValueAdded:[],
              custMilestone:[],
            },
            custPage:0,
            custSize:10,
            custTotal:0,
            custLoading:false,
            custQueryForm:{
              custEnv:{
                custId:'',
                productId:'',
                statRequestDate:'',
                statPerson:'',
              },
              custProduct:{
                custId:'',
                productId:'',
                statRequestDate:'',
                statPerson:'',
              },
              custProductLiqTime:{
                custId:'',
                productId:'',
                statRequestDate:'',
                statPerson:'',
              },
              custHaveValueAdded:{
                custId:'',
                productId:'',
                statRequestDate:'',
                statPerson:'',
                functionModule:'',
              },
              custMilestone:{
                custId:'',
                productId:'',
              }
            },

          }
        },
        created(){
          this.$nextTick(()=>{
             this.productTabName = this.tabType[0]
             this.queryCustOtherInfo()
          })
        },
        methods:{
          getDictCaption,
          checkPermission,
          getDictValue,
          strDate,
          queryCustOtherInfo(){
            var type = this.operateType[Number(this.custOtherInfoTabName)].type;
            var url = 'api/'+type;
            const sort = 'id,desc'
            this.custQueryForm[type].custId    = this.cust.id;
            this.custQueryForm[type].productId = getDictValue(this.productTabName,this.dictProductId);
            var params = {
              page: this.custPage,
              size: this.custSize,
              sort: sort,
              ...this.custQueryForm[type]
            };
            this.custLoading = true;
            getData(url,params).then(res=>{
              this.custLoading = false;
              this.custTotal = res.totalElements;
              if(type === 'custMilestone' && res.content.length){
                this.custData[type] =  this.getMileStoneTime(res.content[0]);
              }else {
                this.custData[type] = res.content
              }

            }).catch(err=>{
              this.custLoading = false;
              this.$message.error("查询出错!")
            })
          },
          productTabClick(tab,event){
            if(this.custOtherInfoTabName === '2' && !this.liquidationTime.contains(getDictValue(tab.paneName))){
               this.custOtherInfoTabName = '0'
            }
            this.queryCustOtherInfo();
          },
          custOtherInfoTabClick(tab,event){
            this.queryCustOtherInfo();
          },
          custOtherInfoPageChange(e){
            this.custPage = e - 1;
            this.queryCustOtherInfo();
          },
          custOtherInfoSizeChange(e){
            this.custPage = 0
            this.custSize = e
            this.queryCustOtherInfo();
          },
          dleChangePage(size) {
            if (size === undefined) {
              size = 1
            }
            var operateType = this.operateType[this.custOtherInfoTabName];
            var data = this.custData[operateType.type];
            if (data.length === size && this.custPage !== 0) {
              this.custPage = this.custPage - 1
            }
          },
          goback(){
            this.$parent.dialog = false;
            this.productTabName = '';
            this.custOtherInfoTabName = '0';
          },
          handleSelectionChange(row){
            var operateType = this.operateType[this.custOtherInfoTabName];
            this.selectRow[operateType.type] = row;
          },
          add(operate){
            this.operate = operate;
            var operateType = this.operateType[this.custOtherInfoTabName];

            if(operateType.type === 'custMilestone'){
              console.log(JSON.stringify(this.custData))
              var select = this.custData[operateType.type];
              if(select.length){
                this.$message.warning("只能新增一条"+operateType.name);
                return;
              }
            }
            const _this = this.$refs[this.operateType[this.custOtherInfoTabName].type+'Form'];
            _this.dialog = true;
            _this.form.productId = getDictValue(this.productTabName,this.dictProductId);
            _this.form.statPerson = store.getters.user.username;
            _this.form.statRequestDate = strDate(new Date())
            if(_this.form.hasOwnProperty('statConfirmDate')){
              _this.form.statConfirmDate = strDate(new Date())
            }
          },
          edit(){
            var operateType = this.operateType[this.custOtherInfoTabName];
            var select;
            if(operateType.type === 'custMilestone'){
              select = this.custData[operateType.type].data;
              console.log(JSON.stringify(this.custData[operateType.type]))
              if(!select || !select.length){
                this.$message.warning("请先新增"+operateType.name);
                return;
              }
            }else {
              select = this.selectRow[operateType.type];
              if(!select || !select.length){
                this.$message.warning("请选择"+operateType.name);
                return;
              }else if(select.length > 1){
                this.$message.warning("只能选择一条"+operateType.name);
                return;
              }
            }
            this.operate = '修改';
            const _this = this.$refs[this.operateType[this.custOtherInfoTabName].type+'Form'];
            _this.form = deepClone(select[0]);
            for(var key in _this.form){
              if(key.indexOf('Date') !== -1){
                _this.form[key] = strDate( _this.form[key]);
              }
            }
            if(_this.form.hasOwnProperty('custProductType')){
              _this.form.custProductType =  _this.form.custProductType.split(',')
            }
            _this.dialog = true;
          },
          del(){
            var operateType = this.operateType[this.custOtherInfoTabName];
            var select = this.selectRow[operateType.type];
            if(!select || !select.length){
              this.$message.warning("请选择"+operateType.name);
              return;
            }
            var data = select.map(item=>{return item.id});
            const _this = this.$refs[this.operateType[this.custOtherInfoTabName].type+'Form'];
            this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.del(data);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });

          },
          getMileStoneTime(obj){
            var data = {statPerson:obj.statPerson,data:[deepClone(obj)]};
            data.timeStmp = []
            for(var key in obj){
              if(this.custMilestoneColumns.hasOwnProperty(key)){
                data.timeStmp.push({timestamp:strDate(obj[key],'-'),content:this.custMilestoneColumns[key]})
              }
            }
            if(data.timeStmp.length){
              data.timeStmp.sort((a,b)=>{
                return a.timestamp.localeCompare(b.timestamp);
              })
            }
            return data;
          },
          resetQuery(){
            var type = this.operateType[Number(this.custOtherInfoTabName)].type;
            for(var key in this.custQueryForm[type]){
              this.custQueryForm[type][key] = '';
            }
          }
        }
    }
</script>

<style>
  .el-table .cell {
    white-space: pre-line;
  }
  .el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none;
    padding: 0px;
  }
</style>
