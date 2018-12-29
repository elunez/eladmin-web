<!--&lt;!&ndash;-->
 <!-- -    Copyright (c) 2018-2025, lengleng All rights reserved.-->
 <!-- - -->
 <!-- - Redistribution and use in source and binary forms, with or without-->
 <!-- - modification, are permitted provided that the following conditions are met:-->
 <!-- - -->
 <!-- - Redistributions of source code must retain the above copyright notice,-->
 <!-- - this list of conditions and the following disclaimer.-->
 <!-- - Redistributions in binary form must reproduce the above copyright-->
 <!-- - notice, this list of conditions and the following disclaimer in the-->
 <!-- - documentation and/or other materials provided with the distribution.-->
 <!-- - Neither the name of the pig4cloud.com developer nor the names of its-->
 <!-- - contributors may be used to endorse or promote products derived from-->
 <!-- - this software without specific prior written permission.-->
 <!-- - Author: lengleng (wangiegie@gmail.com)-->
<!--&ndash;&gt;-->

<!--<template>-->
  <!--<div class="app-container calendar-list-container" id="credentials" v-if="credentials">-->
    <!--<div v-if="rowsId" class="filter-container">-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(1,true,false,false)">还款计划</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(2,false,true,false)">流转记录</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(3,false,false,true)">历史凭证</el-button>-->
    <!--</div>-->
    <!--<div>-->
      <!--<img v-for="img in imgFiles" :src="img.ossUrl" style="width:33%;height: 360px">-->
   <!--</div>-->
  <!--</div>-->
  <!--<div class="app-container calendar-list-container" id="record" v-else-if="record">-->
    <!--<div v-if="rowsId" class="filter-container">-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(1,true,false,false)">还款计划</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(2,false,true,false)">流转记录</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(3,false,false,true)">历史凭证</el-button>-->
    <!--</div>-->
    <!--<div>-->
      <!--<el-steps direction="vertical" finish-status="success" :active="repays">-->
        <!--<el-step v-for="item in list" :key="item.id" :title="item.createTime |  parseTime('{y}-{m}-{d} {h}:{i}:{s}')" :dates="(item.status>=3?processDescription(item):'未到期或已逾期订单')" :description="(item.status>=3?'操作人：'+(item.updateBy===''?'系统':item.updateBy):'暂未操作')"></el-step>-->
      <!--</el-steps>-->
    <!--</div>-->
  <!--</div>-->
  <!--<div class="app-container calendar-list-container" id="reimbursement" v-else="reimbursement">-->
    <!--<div v-if="rowsId" class="filter-container">-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(1,true,false,false)">还款计划</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(2,false,true,false)">流转记录</el-button>-->
      <!--<el-button size="medium" type="primary" @click="handlePageName(3,false,false,true)">历史凭证</el-button>-->
      <!--<el-button v-if="sys_downline_confirm_repay" size="medium" type="primary" @click="handleUpdate(null)">确认还款</el-button>-->
      <!--<el-button v-if="sys_downline_confirm_repay" size="medium" type="primary" @click="handleUpdateAll()">提前结清</el-button>-->
    <!--</div>-->
    <!--<div v-if="rowsId" class="filter-container" align="right">-->
      <!--<span>姓名：{{this.$route.query.rows.userName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!--<span>手机号：{{this.$route.query.rows.phone}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!--<span>订单编号：{{this.$route.query.rows.id}} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!--<span>金额单位：元</span>-->
    <!--</div>-->
    <!--<el-table ref="multipleTable" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit-->
              <!--highlight-current-row style="width: 99%" @selection-change="checkedChange" :row-style="checkColor">-->

      <!--<el-table-column align="center" type="selection" width="55" :selectable="checkedIsOpen" @selection-change="checkedChange"></el-table-column>-->

      <!--<el-table-column align="center" label="期数">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.termNo}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="还款状态">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{handleStatusChange(scope.row.status)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" width="100 px" label="计划还款当期总金额">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{checkPlanAmount(scope.row)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="计划还款本金">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.planPrincipalAmount/100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="计划还款利息" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.planInterestAmount/100}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="计划还款服务费" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.serviceAmount/100}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" width="100 px" label="计划还款时间">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.planRepayTime | parseTime('{y}-{m}-{d}')}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" width="100 px" label="实际还款当期总金额" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{checkAmount(scope.row)}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="实际还款本金" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.actualPrincipalAmount/100}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="实际还款利息">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.actualInterestAmount/100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="实际还款服务费">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.actualServiceAmount/100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="溢出金额" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.excessAmount/100}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="逾期天数" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.overdueDays}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="逾期罚息" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.penaltyAmount/100}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="优惠金额">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.dicountAmount/100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" width="100 px" label="实还时间">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="checkTime(scope.row.actualRepayTime)">{{scope.row.actualRepayTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="最后操作人" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.updateBy===''?'系统':scope.row.updateBy}} </span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" width="100 px" label="最后操作时间">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="操作" width="100" v-if="checkApplyStatus() && sys_downline_confirm_repay">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="checkStatus(scope.row.status)" size="small" type="primary" @click="handleUpdate(scope.row)">确认还款</el-button>-->
          <!--<el-button v-else="checkStatus(scope.row.status)" size="small" type="info">已还款</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="描述" width="100" v-else="checkApplyStatus()">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button size="small" type="info">还款完成</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->

    <!--</el-table>-->

    <!--<div v-show="!listLoading" class="pagination-container" v-if="apply">-->
      <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
                     <!--:current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"-->
                     <!--layout="total, sizes, prev, pager, next, jumper" :total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->

    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRepayVisible">-->
      <!--<div class="app-container calendar-list-container" v-if="sys_downline_confirm_repay">-->
        <!--应还金额（元）：<el-input v-model="Math.round((planAllAmount - discountAmount / 100)*100)/100" disabled="disabled"></el-input>-->
        <!--溢出金额（元）：<el-input v-model="Math.round(allExcessAmount*100)/100" disabled="disabled"></el-input>-->
        <!--实还金额（元）：<el-input v-model="actualAllAmount" placeholder="例：88888888" clearable @change="allAmountChange"></el-input>-->
        <!--减免金额（元）：<el-input v-model="creditAmount" placeholder="例：88888888" clearable @change="breaksAmountChange"></el-input>-->
        <!--<template>-->
          <!--<div style="margin: 15px 0;"></div>-->
          <!--<el-checkbox-group v-model="checkedBreaks" @change="handleCheckedCitiesChange">-->
            <!--<el-checkbox v-for="bk in breaks" :label="bk" :key="bk">{{bk}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</template>-->
      <!--</div>-->
    <!--<div class="app-container calendar-list-container" v-if="confirmRepay">-->
      <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--:action="'/admin/loan/uploadHead/'+this.$route.query.rows.userId+'/'+this.$route.query.rows.id"-->
        <!--:on-preview="handlePreview"-->
        <!--:headers="headers"-->
        <!--:on-remove="handleRemove"-->
        <!--:on-success="handleSuccess"-->
        <!--:on-error="handleError"-->
        <!--:beforeUpload="beforeAvatarUpload"-->
        <!--:file-list="fileList2"-->
        <!--accept=".jpg,.jpeg,.png"-->
        <!--list-type="picture">-->
        <!--<el-button size="small" type="primary">点击上传</el-button>-->
        <!--<div slot="tip" class="el-upload__tip">只能上传：jpg/png/jpeg 格式文件，且不超过：2MB</div>-->
      <!--</el-upload>-->
    <!--</div>-->
      <!--<div align="right">-->
      <!--<el-button type="primary" @click="handleUpdateLoanRepay()">确 定</el-button>-->
      <!--<el-button type="primary" @click="cancelDialog()">取消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  <!--</div>-->

<!--</template>-->

<!--<script>-->
  <!--/* eslint-disable no-trailing-spaces updateRepay, queryFile */-->
<!--import { getRepay, deleteFile, queryFile, updateLoanRepay } from '@/api/loan'-->
<!--import waves from '@/directive/waves/index.js' // 水波纹指令-->
<!--import { mapGetters } from 'vuex'-->
<!--import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'-->
<!--import ElOption from 'element-ui/packages/select/src/option'-->
<!--import ElStep from 'element-ui/packages/steps/src/step'-->
<!--import { getToken } from '@/util/auth'-->

<!--const breaksOptions = ['利息费', '服务费', '逾期罚息']-->
<!--export default {-->
    <!--components: {-->
      <!--ElStep,-->
      <!--ElOption,-->
      <!--ElRadioGroup-->
    <!--},-->
    <!--name: 'table_user',-->
    <!--directives: {-->
      <!--waves-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--headers: {-->
          <!--Authorization: 'Bearer ' + getToken()-->
        <!--},-->
        <!--checkedBreaks: [],-->
        <!--breaks: breaksOptions,-->
        <!--fileList2: [-->
        <!--],-->
        <!--imgFiles: null,-->
        <!--multipleSelection: [],-->
        <!--pageNum: 1,-->
        <!--repays: 0,-->
        <!--rowsId: false,-->
        <!--apply: false,-->
        <!--confirmRepay: false,-->
        <!--record: false,-->
        <!--credentials: false,-->
        <!--reimbursement: true,-->
        <!--dialogRepayVisible: false,-->
        <!--actualAllAmount: null,-->
        <!--planAllAmount: 0,-->
        <!--allExcessAmount: 0,-->
        <!--allInterest: 0,-->
        <!--allServiceAmount: 0,-->
        <!--allPaymentAmount: 0,-->
        <!--discountAmount: 0,-->
        <!--creditAmount: null,-->
        <!--isAdvance: false,-->
        <!--loanRepayList: [],-->
        <!--list: null,-->
        <!--total: null,-->
        <!--listLoading: true,-->
        <!--listQuery: {-->
          <!--page: 1,-->
          <!--limit: 20-->
        <!--},-->
        <!--role: [],-->
        <!--rules: {-->
        <!--},-->
        <!--dialogStatus: '',-->
        <!--textMap: {-->
          <!--confirm: '确认还款',-->
          <!--advance: '提前结清'-->
        <!--},-->
        <!--tableKey: 0,-->
        <!--sys_downline_confirm_repay: false-->
      <!--}-->
  <!--},-->
    <!--computed: {-->
      <!--...mapGetters(['permissions'])-->
    <!--},-->
    <!--filters: {-->
      <!--statusFilter(status) {-->
        <!--const statusMap = {-->
          <!--0: '有效',-->
          <!--1: '无效',-->
          <!--9: '锁定'-->
        <!--}-->
        <!--return statusMap[status]-->
      <!--}-->
    <!--},-->
    <!--created() {-->
      <!--this.getList()-->
      <!--this.sys_downline_confirm_repay = this.permissions['sys_downline_confirm_repay']-->
    <!--},-->
    <!--methods: {-->
      <!--// 初始化数据-->
      <!--getList() {-->
        <!--this.listLoading = true-->
        <!--if (this.$route.query.rows.id) {-->
          <!--this.listQuery.applyId = this.$route.query.rows.id-->
          <!--this.rowsId = true-->
        <!--} else {-->
          <!--this.apply = true-->
          <!--this.listQuery.applyId = ''-->
        <!--}-->
        <!--getRepay(this.listQuery).then(response => {-->
          <!--this.list = response.data.records-->
          <!--this.total = response.data.total-->
          <!--this.listLoading = false-->
        <!--})-->
      <!--},-->
      <!--handleFilter() {-->
        <!--this.listQuery.page = 1-->
        <!--this.getList()-->
      <!--},-->
      <!--handleSizeChange(val) {-->
        <!--this.listQuery.limit = val-->
        <!--this.getList()-->
      <!--},-->
      <!--handleCurrentChange(val) {-->
        <!--this.listQuery.page = val-->
        <!--this.getList()-->
      <!--},-->
      <!--// 优惠金额-->
      <!--handleCheckedCitiesChange(bkList) {-->
        <!--this.checkedBreaks = bkList-->
        <!--this.discountAmount = 0-->
        <!--for (const bk of bkList) {-->
          <!--if (bk === '利息费') {-->
            <!--this.discountAmount += this.allInterest-->
          <!--} else if (bk === '服务费') {-->
            <!--this.discountAmount += this.allServiceAmount-->
          <!--} else if (bk === '逾期罚息') {-->
            <!--this.discountAmount += this.allPaymentAmount-->
          <!--}-->
        <!--}-->
        <!--this.allAmountChange(Math.round((this.planAllAmount - this.discountAmount / 100) * 100) / 100)-->
      <!--},-->
      <!--// 当期状态转译-->
      <!--handleStatusChange(status) {-->
        <!--if (status === '1') {-->
          <!--return '待还款'-->
        <!--} else if (status === '2') {-->
          <!--return '已逾期'-->
        <!--} else if (status === '3') {-->
          <!--return '逾期还款'-->
        <!--} else if (status === '4') {-->
          <!--return '已还款'-->
        <!--} else if (status === '5') {-->
          <!--return '提前还款'-->
        <!--} else if (status === '6') {-->
          <!--return '提前结清'-->
        <!--} else if (status === '0') {-->
          <!--return '未到期'-->
        <!--}-->
      <!--},-->
      <!--// 获取当期实际还款金额-->
      <!--checkAmount(obj) {-->
        <!--if (parseInt(obj.status) >= 3) {-->
          <!--return (obj.actualPrincipalAmount + obj.actualInterestAmount + obj.actualServiceAmount + obj.penaltyAmount + obj.excessAmount - obj.dicountAmount) / 100-->
        <!--} else {-->
          <!--return 0-->
        <!--}-->
      <!--},-->
      <!--// 获取当期应还款金额-->
      <!--checkPlanAmount(obj) {-->
        <!--return (obj.planPrincipalAmount + obj.planInterestAmount + obj.serviceAmount + obj.penaltyAmount - obj.dicountAmount) / 100-->
      <!--},-->
      <!--// 检查订单当期状态-->
      <!--checkStatus(status) {-->
        <!--if (parseInt(status) >= 3) {-->
          <!--return false-->
        <!--} else {-->
          <!--return true-->
        <!--}-->
      <!--},-->
      <!--// 检查时间是否是空-->
      <!--checkTime(time) {-->
        <!--if (time != null) {-->
          <!--return true-->
        <!--}-->
      <!--},-->
      <!--//  逾期数据表格背景色设置-->
      <!--checkColor({ row, rowIndex }) {-->
        <!--if (row.status === '2') {-->
          <!--return 'background-color: #f0c78a'-->
        <!--}-->
      <!--},-->
      <!--// 确认还款-->
      <!--handleUpdate(obj) {-->
        <!--this.$refs.multipleTable.setCurrentRow()-->
        <!--this.dialogStatus = 'confirm'-->
        <!--if (obj !== null) {-->
          <!--this.loanRepayList = []-->
          <!--this.allInterest = 0-->
          <!--this.allServiceAmount = 0-->
          <!--this.allPaymentAmount = 0-->
          <!--this.multipleSelection.push(obj)-->
          <!--this.loanRepayList.push(obj)-->
          <!--this.allInterest = obj.planInterestAmount-->
          <!--this.allServiceAmount = obj.serviceAmount-->
          <!--this.allPaymentAmount = obj.penaltyAmount-->
          <!--this.planAllAmount = this.checkPlanAmount(obj)-->
          <!--this.actualAllAmount = this.planAllAmount-->
        <!--}-->
        <!--if (this.multipleSelection.length === 0) {-->
          <!--this.$message.warning('请选择还款期数!')-->
        <!--} else {-->
          <!--this.confirmRepay = true-->
          <!--this.isAdvance = false-->
          <!--this.dialogRepayVisible = true-->
        <!--}-->
      <!--},-->
      <!--// 提前结清-->
      <!--handleUpdateAll() {-->
        <!--this.dialogStatus = 'advance'-->
        <!--if (this.list.length === 0) {-->
          <!--this.$message.warning('当前订单不需要还款操作!')-->
        <!--} else {-->
          <!--this.confirmRepay = true-->
          <!--this.isAdvance = true-->
          <!--this.dialogRepayVisible = true-->
          <!--this.planAllAmount = 0-->
          <!--this.loanRepayList = []-->
          <!--for (const item of this.list) {-->
            <!--if (parseInt(item.status) < 3) {-->
              <!--this.loanRepayList.push(item)-->
              <!--this.allInterest += item.planInterestAmount-->
              <!--this.allServiceAmount += item.serviceAmount-->
              <!--this.allPaymentAmount += item.penaltyAmount-->
              <!--this.planAllAmount += this.checkPlanAmount(item)-->
            <!--}-->
          <!--}-->
          <!--this.actualAllAmount = this.planAllAmount-->
        <!--}-->
      <!--},-->
      <!--// 确认还款-->
      <!--handleUpdateLoanRepay() {-->
        <!--if (this.actualAllAmount <= 0) {-->
          <!--this.$message.warning('请输入还款金额！')-->
          <!--return-->
        <!--}-->
        <!--if ((this.actualAllAmount + this.discountAmount) < this.planAllAmount) {-->
          <!--this.$message.warning('还款金额不足！')-->
          <!--return-->
        <!--}-->
        <!--if (this.loanRepayList.length <= 0) {-->
          <!--this.$message.warning('数据异常！')-->
          <!--return-->
        <!--}-->
        <!--if (parseInt(this.allExcessAmount) > 0) {-->
          <!--this.loanRepayList[this.loanRepayList.length - 1].excessAmount = Math.round(this.allExcessAmount * 100)-->
        <!--}-->
        <!--if (parseInt(this.discountAmount) > 0) {-->
          <!--this.loanRepayList[this.loanRepayList.length - 1].dicountAmount += this.discountAmount-->
        <!--}-->
        <!--console.log(this.loanRepayList[this.loanRepayList.length - 1].dicountAmount)-->
        <!--console.log(this.discountAmount)-->
        <!--updateLoanRepay(this.loanRepayList, Math.round(this.allExcessAmount * 100), this.isAdvance).then(response => {-->
          <!--this.$message.success('还款成功!')-->
          <!--this.dialogRepayVisible = false-->
          <!--this.actualAllAmount = null-->
          <!--this.allExcessAmount = null-->
          <!--this.creditAmount = null-->
          <!--this.getList()-->
        <!--})-->
      <!--},-->
      <!--// 弹窗取消-->
      <!--cancelDialog() {-->
        <!--this.dialogRepayVisible = false-->
        <!--this.actualAllAmount = null-->
        <!--this.allExcessAmount = null-->
        <!--this.creditAmount = null-->
        <!--this.multipleSelection = []-->
        <!--this.$refs.multipleTable.clearSelection()-->
      <!--},-->
      <!--// 减免金额-->
      <!--breaksAmountChange(value) {-->
        <!--this.creditAmount = value-->
        <!--this.planAllAmount = this.planAllAmount - value-->
        <!--this.actualAllAmount = this.actualAllAmount - value-->
        <!--const amount = this.actualAllAmount + this.discountAmount / 100-->
        <!--if (parseInt(this.actualAllAmount) > 0 && parseInt(this.planAllAmount) > 0 && parseInt(this.actualAllAmount) > parseInt(this.planAllAmount)) {-->
          <!--this.allExcessAmount = amount - this.planAllAmount-->
        <!--}-->
      <!--},-->
      <!--// 还款金额-->
      <!--allAmountChange(value) {-->
        <!--if (value === '') {-->
          <!--this.actualAllAmount = this.planAllAmount-->
        <!--} else {-->
          <!--this.actualAllAmount = value-->
        <!--}-->
        <!--const amount = this.actualAllAmount - this.discountAmount / 100-->
        <!--if (parseInt(this.actualAllAmount) > 0 && parseInt(this.planAllAmount) > 0 && parseInt(this.actualAllAmount) > parseInt(this.planAllAmount)) {-->
          <!--this.allExcessAmount = amount - this.planAllAmount-->
        <!--}-->
      <!--},-->
      <!--// 表格选择-->
      <!--checkedChange(obj) {-->
        <!--this.multipleSelection = obj-->
        <!--this.planAllAmount = 0-->
        <!--this.loanRepayList = []-->
        <!--for (const item of this.multipleSelection) {-->
          <!--this.loanRepayList.push(item)-->
          <!--this.allInterest += item.planInterestAmount-->
          <!--this.allServiceAmount += item.serviceAmount-->
          <!--this.allPaymentAmount += item.penaltyAmount-->
          <!--this.planAllAmount += this.checkPlanAmount(item)-->
        <!--}-->
        <!--this.actualAllAmount = this.planAllAmount-->
      <!--},-->
      <!--// 检查表格-->
      <!--checkedIsOpen(obj) {-->
        <!--if (obj.status >= 3) {-->
          <!--return false-->
        <!--}-->
        <!--return true-->
      <!--},-->
      <!--// 显示页面-->
      <!--handlePageName(p, page1, page2, page3) {-->
        <!--if (p === 2) {-->
          <!--this.checkRepayStatus()-->
        <!--}-->
        <!--if (this.pageNum !== p) {-->
          <!--this.pageNum = p-->
          <!--this.reimbursement = page1-->
          <!--this.record = page2-->
          <!--this.credentials = page3-->
        <!--}-->
        <!--if (this.credentials) {-->
          <!--queryFile(this.$route.query.rows.id).then(response => {-->
            <!--this.imgFiles = response.data-->
          <!--})-->
        <!--}-->
      <!--},-->
      <!--// 检查订单状态-->
      <!--checkApplyStatus() {-->
        <!--if (this.$route.query.rows.applyStatus === '8') {-->
          <!--return false-->
        <!--} else {-->
          <!--return true-->
        <!--}-->
      <!--},-->
      <!--// 检查期数状态-->
      <!--checkRepayStatus() {-->
        <!--this.repays = 0-->
        <!--for (let i = 0; i < this.list.length; i++) {-->
          <!--if (parseInt(this.list[i].status) >= 3) {-->
            <!--this.repays++-->
          <!--}-->
        <!--}-->
        <!--return this.repays-->
      <!--},-->
      <!--processDescription(item) {-->
        <!--if (item.updateBy !== '') {-->
          <!--return '操作结果：进行线下还款操作，选中客户【' + this.$route.query.rows.userName + '】当前期数第【' + item.termNo + '】期，实际还款总金额' + this.checkAmount(item) + '元'-->
        <!--} else {-->
          <!--return '操作结果：进行线上还款操作，还款客户【' + this.$route.query.rows.userName + '】当前期数第【' + item.termNo + '】期，实际还款总金额' + this.checkAmount(item) + '元'-->
        <!--}-->
      <!--},-->
      <!--handleRemove(file, fileList) {-->
        <!--deleteFile(file.businessNo)-->
      <!--},-->
      <!--handlePreview(file) {-->
        <!--console.log(file)-->
      <!--},-->
      <!--handleSuccess(response, file, fileList) {-->
        <!--file.businessNo = response.businessNo-->
      <!--},-->
      <!--handleError(er, file, fileList) {-->
        <!--this.$message({-->
          <!--message: '凭证：' + file.name + ' 上传失败！',-->
          <!--type: 'warning'-->
        <!--})-->
      <!--},-->
      <!--beforeAvatarUpload(file) {-->
        <!--const isLt2M = file.size / 1024 / 1024 < 2-->
        <!--if (!isLt2M) {-->
          <!--this.$message({-->
            <!--message: '上传文件大小不能超过 2MB!',-->
            <!--type: 'warning'-->
          <!--})-->
        <!--}-->
        <!--return isLt2M-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->
<!--&lt;!&ndash;A0220180403100027 ， A022018040241756&ndash;&gt;-->
