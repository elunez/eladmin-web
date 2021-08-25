/*
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
let dicDataSubscribeScene = [{
  label: '公众号搜索',
  value: 'ADD_SCENE_SEARCH'
}, {
  label: '公众号迁移',
  value: 'ADD_SCENE_ACCOUNT_MIGRATION'
}, {
  label: '名片分享',
  value: 'ADD_SCENE_PROFILE_CARD'
}, {
  label: '扫描二维码',
  value: 'ADD_SCENE_QR_CODE'
}, {
  label: '图文页内名称点击',
  value: 'ADD_SCENE_PROFILE_LINK'
}, {
  label: '图文页右上角菜单',
  value: 'ADD_SCENE_PROFILE_ITEM'
}, {
  label: '支付后关注',
  value: 'ADD_SCENE_PAID'
}, {
  label: '其他',
  value: 'ADD_SCENE_OTHERS'
}]

let dicDataSubscribe = [{
  label: '取消关注',
  value: '0'
}, {
  label: '已关注',
  value: '1'
}]

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
  selection: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: true,
  searchShow: false,
  menuWidth: 150,
  menuType:'text',
  searchMenuSpan: 6,
  defaultSort:{
    prop: 'subscribeTime',
    order: 'descending'
  },
  column: [
    {
      label: '头像',
      prop: 'headimgUrl',
      type:'upload',
      imgWidth:50,
      listType:'picture-img',
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
      label: '是否订阅',
      prop: 'subscribe',
      width:80,
      type: 'select',
      sortable:true,
      search:true,
      editDisplay:false,
      slot:true,
      dicData: dicDataSubscribe
    },
    {
      label: 'openId',
      prop: 'openId',
      search:true
    },
    {
      label: '关注渠道',
      prop: 'subscribeScene',
      type: 'select',
      sortable:true,
      search:true,
      editDisplay:false,
      dicData: dicDataSubscribeScene
    },
    {
      label: '关注时间',
      prop: 'subscribeTime',
      type: 'datetime',
      width:95,
      sortable:true,
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
      label: '国家',
      prop: 'country',
      sortable:true,
      search:true,
      editDisplay:false,
      width: 60
    },
    {
      label: '省份',
      prop: 'province',
      sortable:true,
      editDisplay:false,
      width: 60
    },
    {
      label: '城市',
      prop: 'city',
      sortable: true,
      search: true,
      editDisplay: false,
      width: 60
    },
    {
      label: '语言',
      prop: 'language',
      sortable:true,
      editDisplay:false,
      width: 60
    },
    {
      label: '标签',
      prop: 'tagidList',
      type: 'select',
      editDisplay: false,
      searchslot:true,
      search:true,
      props: {
        label: 'name',
        value: 'id'
      }
    },
    {
      label: '备注',
      prop: 'remark'
    },
    {
      label: '二维码扫码场景',
      prop: 'qrSceneStr',
      sortable: true,
      search: true,
      editDisplay: false
    },
    {
      label: 'union_id',
      prop: 'unionId',
      hide:true,
      editDisplay:false
    },
    // {
    //   label: '手机号码',
    //   prop: 'phone'
    // },
    {
      label: '关注次数',
      prop: 'subscribeNum',
      width:50,
      sortable:true,
      editDisplay:false
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      sortable:true,
      hide:true,
      editDisplay:false
    },
    {
      label: '更新时间',
      prop: 'updateTime',
      type: 'datetime',
      sortable:true,
      hide:true,
      editDisplay:false
    },
    {
      label: '取关时间',
      prop: 'cancelSubscribeTime',
      type: 'datetime',
      sortable:true,
      hide:true,
      editDisplay:false
    }
  ]
}

export const tableOption2 = {
  border: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  selection: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  excelBtn: false,
  printBtn: false,
  viewBtn: false,
  searchShow: true,
  menu: false,
  menuWidth: 150,
  menuType:'text',
  searchMenuSpan: 6,
  defaultSort:{
    prop: 'subscribeTime',
    order: 'descending'
  },
  column: [
    {
      label: '头像',
      prop: 'headimgUrl',
      type:'upload',
      imgWidth:50,
      listType:'picture-img',
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
      label: '关注渠道',
      prop: 'subscribeScene',
      type: 'select',
      sortable:true,
      search:true,
      editDisplay:false,
      dicData: dicDataSubscribeScene
    },
    {
      label: '关注时间',
      prop: 'subscribeTime',
      type: 'datetime',
      width:95,
      sortable:true,
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
      dicUrl: dicDataSex
    },
    {
      label: '国家',
      prop: 'country',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '省份',
      prop: 'province',
      sortable:true,
      editDisplay:false
    },
    {
      label: '城市',
      prop: 'city',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '语言',
      prop: 'language',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '二维码扫码场景',
      prop: 'qrSceneStr',
      sortable:true,
      search:true,
      editDisplay:false
    },
    {
      label: '用户标识',
      prop: 'openId',
      hide:true,
      editDisplay:false
    },
    {
      label: 'union_id',
      prop: 'unionId',
      hide:true,
      editDisplay:false
    },
    {
      label: '关注次数',
      prop: 'subscribeNum',
      width:50,
      sortable:true,
      editDisplay:false
    }
  ]
}
