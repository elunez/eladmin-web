<template>
  <el-tabs type="border-card" v-model="activeName"  @tab-click="tabHandleClick">
    <el-tab-pane v-if="dict.deliver_type"  v-for="item in dict.deliver_type" :key="item.value">
      <span slot="label"><i>{{item.label}}</i></span>
      <!--表格渲染-->
      <el-table v-if="activeName ==0" v-loading="loading" :data="data" size="small" border style="width: 100%"
                @selection-change="handleSelectionChange"
                :max-height="clientHeight"
                @row-dblclick="rowDoubleClick">
        <af-table-column
          type="selection"
          width="35">
        </af-table-column>
        <af-table-column prop="deliverId" label="交付ID"/>
        <af-table-column prop="productId"  label="产品名称"/>
        <af-table-column prop="custType" label="客户类型">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="area" label="地区" >
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
          </template>
        </af-table-column>
        <el-table-column prop="custName" label="客户名称" :show-overflow-tooltip="true" width="100px"/>
        <af-table-column prop="noTrunkVersion" label="非主干版本":show-overflow-tooltip="true" width="200px"/>
        <af-table-column prop="trunkVersion" label="对应主干版本":show-overflow-tooltip="true" width="200px"/>
        <af-table-column prop="packageDetails" label="程序包明细"/>
        <af-table-column prop="taskNo" label="任务号/修改单号"/>
        <af-table-column prop="svnNo" label="SVN日志号"/>
        <af-table-column prop="requireNo" label="需求编号"/>
        <af-table-column prop="issueGist" label="发放依据">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_no_accretion)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="issueDate" label="发放日期"/>
        <af-table-column prop="issuePerson" label="发放人"/>
        <af-table-column prop="approver" label="审批人">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="memo" label="备注"/>
      </el-table>
      <el-table v-if="activeName ==1" v-loading="loading" :data="data" size="small" border style="width: 100%;"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDoubleClick"
                :max-height="clientHeight">
        <af-table-column
          type="selection"
          width="35">
        </af-table-column>
        <af-table-column prop="deliverId" label="交付ID"/>
        <af-table-column prop="productId"  label="产品名称"/>
        <af-table-column prop="custType" label="客户类型">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="area" label="地区" :show-overflow-tooltip="true" width="45px">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="custName" label="客户名称"/>
        <af-table-column prop="functionModule" label="功能模块"/>
        <af-table-column prop="configName" label="配置项名称">
        </af-table-column>
        <af-table-column prop="functionMode" label="功能模式"/>
        <af-table-column prop="projectNo" label="项目编号"/>
        <af-table-column prop="issueGist" label="发放依据">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_accretion)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="issueDate" label="发放日期"/>
        <af-table-column prop="issuePerson" label="发放人"/>
        <af-table-column prop="approver" label="审批人">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="memo" label="备注"/>
      </el-table>
      <el-table v-if="activeName ==2 || activeName==3" v-loading="loading" :data="data" border size="small" style="width: 100%;"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDoubleClick"
                :max-height="clientHeight">
        <af-table-column
          type="selection"
          width="35">
        </af-table-column>
        <af-table-column prop="deliverId" label="交付ID"/>
        <af-table-column prop="productId"  label="产品名称"/>
        <af-table-column prop="custType" label="客户类型">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="area" label="地区">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="custName" label="客户名称"/>
        <af-table-column prop="moduleType" label="模块">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.moduleType,dict.module_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="configName" label="配置项名称">
        </af-table-column>
        <af-table-column prop="issueGist" label="发放依据">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_no_accretion)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="issueDate" label="发放日期"/>
        <af-table-column prop="issuePerson" label="发放人"/>
        <af-table-column prop="approver" label="审批人">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.approver,dict.delivery_approver)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="memo" label="备注"/>
      </el-table>
      <el-table v-if="activeName ==4" v-loading="loading" :data="data" size="small" border style="width: 100%;"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDoubleClick"
                :max-height="clientHeight">
        <af-table-column
          type="selection"
          width="35">
        </af-table-column>
        <af-table-column prop="deliverId" label="交付ID"/>
        <af-table-column prop="productId"  label="产品名称"/>
        <af-table-column prop="custType" label="客户类型">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.custType,dict.cust_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="area" label="地区">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.area,dict.area)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="custName" label="客户名称"/>
        <af-table-column prop="taCode" label="TA代码"/>
        <af-table-column prop="module" label="模块">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.module,dict.module)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="functionNo" label="功能编号"/>
        <af-table-column prop="configName" label="配置项名称"/>
        <af-table-column prop="authorDateType" label="授权期限">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.authorDateType,dict.author_date_type)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="issueGist" label="发放依据">
          <template slot-scope="scope">
            <div>{{getDictCaption(scope.row.issueGist,dict.issue_gist_author)}}</div>
          </template>
        </af-table-column>
        <af-table-column prop="projectNo" label="项目编号"/>
        <af-table-column prop="issueDate" label="发放日期"/>
        <af-table-column prop="issuePerson" label="发放人"/>
        <af-table-column prop="memo" label="备注"/>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
    import initData from '@/mixins/initData'
    import { parseTime, downloadFile, deepClone, getDictCaption, strDate } from '@/utils/index'
    export default {
      mixins: [initData],
      dicts:['deliver_type','cust_type','area','issue_source','require_type','issue_gist_accretion','issue_gist_no_accretion','module_type','module','author_date_type','issue_gist_author','product_id','delivery_approver'],
      props:{
          formModel:{
            type: Object,
            required: true
          },
          rowDoubleClick:{
             type:Function,
             default:()=>{}
          },
          handleSelectionChange:{
             type:Function,
             default:()=>{}
          },
        },
        data(){
          return {
            multipleSelection:[],
            activeName:0,
            form:{}
          }
        },
        watch:{
          loading(loading){
            if(!loading){
              this.data.sort((a,b)=>{
                var deliveryIdA = a.deliverId?a.deliverId:"";
                var deliveryIdB = b.deliverId?b.deliverId:"";
                if(deliveryIdA.length===deliveryIdB.length){
                  return deliveryIdB.localeCompare(deliveryIdA);
                }else{
                  return deliveryIdB.length-deliveryIdA.length;
                }
              })
            }
          },
          activeName(activeName){
            this.$emit('activeName',activeName);
          },
          formModel(formModel){
            Object.assign(this.form,this.formModel);
          }
        },
        created() {
          this.clientHeight = document.body.clientHeight -200;
          this.$nextTick(() => {
            this.form.deliverType = String(this.activeName);
            this.init();
          })
        },
        methods:{
          getDictCaption,
          beforeInit() {
            this.url = 'api/delivery'
            const sort = 'deliverId,desc'
            this.params = { page: this.page, size: this.size, sort: sort }
            Object.assign(this.params,this.form);
            return true
          },
          tabHandleClick(tab,event){
            //修改查询条件
            this.form= {
              ...this.form,
              deliverType: tab.paneName
            };
            this.toQuery();
          },
        },

    }
</script>

<style scoped>

</style>
