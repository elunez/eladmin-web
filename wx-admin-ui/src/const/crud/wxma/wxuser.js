/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，项目使用请保留此说明
 */
let dicDataSex = [{
  label: '未知',
  value: '0'
}, {
  label: '男',
  value: '1'
}, {
  label: '女',
  value: '2'
}]

export const tableOption = {
  dialogDrag:true,
  border: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  excelBtn: true,
  printBtn: true,
  viewBtn: true,
  searchShow: false,
  menuWidth: 150,
  menuType:'text',
  searchMenuSpan: 6,
  defaultSort:{
    prop: 'createTime',
    order: 'descending'
  },
  column: [
    {
      label: '用户标识',
      prop: 'openId',
      editDisplay:false
    },
    {
      label: '头像',
      prop: 'headimgUrl',
      imgWidth:50,
      dataType: 'string',
      type: 'upload',
      listType: 'picture-img',
      editDisplay:false
    },
    {
      label: '昵称',
      prop: 'nickName',
      width:100,
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '性别',
      prop: 'sex',
      width: 60,
      type: 'select',
      sortable:true,
      search:true,
      editDisplay:false,
      slot:true,
      dicData: dicDataSex
    },
    {
      label: '所在国家',
      prop: 'country',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '所在省份',
      prop: 'province',
      sortable:true,
      editDisplay:false
    },
    {
      label: '所在城市',
      prop: 'city',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '用户语言',
      prop: 'language',
      sortable:true,
      editDisplay:false
    },
    {
      label: '用户备注',
      prop: 'remark',
      hide:true
    },
    {
      label: 'union_id',
      prop: 'unionId',
      hide:true,
      editDisplay:false
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      sortable:true,
      editDisplay:false
    },
    {
      label: '更新时间',
      prop: 'updateTime',
      type: 'datetime',
      sortable:true,
      hide:true,
      editDisplay:false
    }
  ]
}
