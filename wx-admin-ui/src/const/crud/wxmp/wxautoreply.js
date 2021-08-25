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
let dicDataRepType = [{
  label: '文本',
  value: 'text'
},{
  label: '图片',
  value: 'image'
},{
  label: '语音',
  value: 'voice'
},{
  label: '视频',
  value: 'video'
},{
  label: '音乐',
  value: 'music'
},{
  label: '图文',
  value: 'news'
}]
export const tableOption1 = {
  dialogDrag:true,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType:'text',
  addBtn:false,
  delBtn:false,
  editBtn:false,
  searchShow:false,
  searchMenuSpan: 6,
  // defaultSort:{
  //    prop: 'id',
  //    order: 'descending'
  // },
  column: [
    {
      label: '回复消息类型',
      prop: 'repType',
      type: 'select',
      dicData: dicDataRepType
    }
  ]
}
export const tableOption2 = {
  dialogDrag:true,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType:'text',
  searchShow:false,
  addBtn:false,
  delBtn:false,
  editBtn:false,
  searchMenuSpan: 6,
  // defaultSort:{
  //    prop: 'id',
  //    order: 'descending'
  // },
  column: [
    {
      label: '请求消息类型',
      prop: 'reqType',
      type: 'select',
      dicData: [{
        value: 'text',
        label: '文本'
      },{
        value: 'image',
        label: '图片'
      },{
        value: 'voice',
        label: '语音'
      },{
        value: 'video',
        label: '视频'
      },{
        value: 'shortvideo',
        label: '小视频'
      },{
        value: 'location',
        label: '地理位置'
      },{
        value: 'link',
        label: '链接消息'
      },{
        value: 'event',
        label: '事件推送'
      }],
      sortable:true
    },
    {
      label: '回复消息类型',
      prop: 'repType',
      type: 'select',
      dicData: dicDataRepType,
      sortable:true
    }
  ]
}
export const tableOption3 = {
  dialogDrag:true,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType:'text',
  searchShow:false,
  addBtn:false,
  delBtn:false,
  editBtn:false,
  searchMenuSpan: 6,
  // defaultSort:{
  //    prop: 'id',
  //    order: 'descending'
  // },
  column: [
	  {
      label: '关键词',
      prop: 'reqKey',
      search:true,
      sortable:true
    },
    {
      label: '匹配类型',
      prop: 'repMate',
      type: 'select',
      dicData: [{
        value: '1',
        label: '全匹配'
      },{
        value: '2',
        label: '半匹配'
      }],
      sortable:true
    },
	  {
      label: '回复消息类型',
      prop: 'repType',
      type: 'select',
        dicData: dicDataRepType,
      sortable:true
    }
  ]
}
