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
export const tableOption = {
  dialogDrag:true,
  border: true,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType:'text',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  searchBtn: true,
  searchMenuSpan: 6,
  defaultSort:{
    prop:'createTime',
    order:'descending'
  },
  column: [
    {
      label: '消息类型',
      prop: 'repType',
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
      search:true,
      sortable:true,
      width: 120
    },
    {
      label: '用户',
      prop: 'nickName',
      overHidden: false,
      align: 'right',
      search: true,
      slot: true,
      width: 100
    },{
      label: '内容',
      prop: 'repContent',
      overHidden: true,
      align: 'left',
      slot: true
    },{
      label: '时间',
      type: 'date',
      prop: 'createTime',
      sortable: true,
      width: 200
    },
	  {
      label: '是否已读',
      prop: 'readFlag',
      type: 'select',
      dicData: [
        {
          value: '1',
          label: '是'
        },{
          value: '0',
          label: '否'
        }
      ],
      search:true,
      sortable:true,
      slot:true,
      width: 50
    }
  ]
}
