/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 */
export const tableOption = {
  dialogDrag: true,
  border: true,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType: 'text',
  searchShow: false,
  viewBtn: true,
  searchMenuSpan: 6,
  column: [
	  {
      label: '父分类',
      prop: 'parentId',
      type: 'tree',
      hide: true,
      props: {
        label: 'name',
        value: 'id'
      },
      rules: [{
        required: true,
        message: '请选择父分类',
        trigger: 'change'
      }]
    },
	  {
      label: '名称',
      prop: 'name',
      align: 'left',
      rules: [{
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      },{
        max: 16,
        message: '长度在不能超过16个字符'
      }]
    },
    {
      label: '是否显示',
      prop: 'enable',
      type: 'radio',
      search: true,
      sortable: true,
      span: 24,
      slot: true,
      rules: [{
        required: true,
        message: '请选择显示状态',
        trigger: 'blur'
      }],
      dicData: [{
        label: '关闭',
        value: '0'
      }, {
        label: '启用',
        value: '1'
      }]
    },
    {
      label: '排序',
      type: 'number',
      prop: 'sort',
      rules: [{
        required: true,
        message: '排序不能为空',
        trigger: 'blur'
      }]
    },
    {
      label: '图片',
      prop: 'picUrl',
      type: 'upload',
      listType: 'picture-img',
      width: 250,
      rules: [{
        required: true,
        message: '图片不能为空',
        trigger: 'change'
      }],
      canvasOption: {
        text: 'joolun',
        ratio: 0.1
      },
      oss: 'ali',
      loadText: '附件上传中，请稍等',
      span: 24,
      tip: '只能上传jpg/png文件，且不超过50kb',
    },
    {
      label: '描述',
      prop: 'description',
      hide: true,
      rules: [{
        max: 255,
        message: '长度在不能超过255个字符'
      }]
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      editDisplay:false,
      addDisplay:false
    },
	  {
      label: '更新时间',
      prop: 'updateTime',
      editDisplay:false,
      addDisplay:false
    },
  ]
}
