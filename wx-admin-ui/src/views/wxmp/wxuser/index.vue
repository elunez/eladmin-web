<!--
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
-->
<template>
    <div class="app-container">
        <avue-crud ref="crud"
                   :page="page"
                   :data="tableData"
                   :table-loading="tableLoading"
                   :option="tableOption"
                   :permission="permissionList"
                   @on-load="getPage"
                   @refresh-change="refreshChange"
                   @row-update="handleUpdate"
                   @row-save="handleSave"
                   @row-del="handleDel"
                   @sort-change="sortChange"
                   @search-change="searchChange"
                   @selection-change="selectionChange">
            <template slot="subscribe" slot-scope="scope">
                <el-tag size="mini" effect="dark"
                        :type="scope.row.subscribe == '1' ? 'success' : scope.row.subscribe == '0' ? 'danger' : 'warning'">
                    {{scope.row.$subscribe}}
                </el-tag>
            </template>
            <template slot="sex" slot-scope="scope">
                <el-tag size="mini" effect="light"
                        :type="scope.row.sex == '1' ? '' : scope.row.sex == '2' ? 'danger' : 'warning'">
                    {{scope.row.$sex}}
                </el-tag>
            </template>
            <template slot="latitude" slot-scope="scope">
                <el-link v-if="scope.row.longitude" type="primary" target="_blank"
                         :href="'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx='+scope.row.longitude+'&pointy='+scope.row.latitude+'&name='+scope.row.nickName+'&ref=joolun'">
                    <i class="el-icon-map-location"></i>
                </el-link>
            </template>
            <template slot="menuLeft">
                <el-button type="success"
                           @click="dialogTagging = true; taggingType = 'tagging'"
                           size="small"
                           icon="el-icon-document"
                           v-hasPermi="['wxmp:wxuser:tagging']">打标签
                </el-button>
                <el-button type="warning"
                           @click="dialogTagging = true; taggingType = 'unTagging'"
                           size="small"
                           icon="el-icon-document"
                           v-hasPermi="['wxmp:wxuser:tagging']">去除标签
                </el-button>
                <el-button type="danger"
                           @click="synchroWxUser"
                           size="small"
                           icon="el-icon-refresh"
                           v-hasPermi="['wxmp:wxuser:synchro']">同步用户
                </el-button>
                <el-dialog
                        :title='taggingType == "tagging"?"请选择要打的标签":"请选择要去除的标签"'
                        :visible.sync="dialogTagging"
                        width="30%">
                    <el-checkbox-group v-model="checkedTags">
                        <el-checkbox v-for="tag in userTagsData" :label="tag.id" :key="tag.id">{{tag.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogTagging = false">取 消</el-button>
                  <el-button type="primary" @click="toTagging">确 定</el-button>
                </span>
                </el-dialog>
            </template>
            <template slot="menu" slot-scope="scope">
                <el-button type="text"
                           v-hasPermi="['wxmp:wxuser:edit:remark']"
                           icon="el-icon-edit"
                           size="small"
                           plain
                           @click="updateRemark(scope.row,scope.index)">修改备注
                </el-button>
                <el-button type="text"
                           v-hasPermi="['wxmp:wxuser:index']"
                           icon="el-icon-chat-line-round"
                           size="small"
                           plain
                           @click="wxMsgDo(scope.row,scope.index)">消息
                </el-button>
            </template>
            <template slot="tagidListSearch" slot-scope="scope">
                <el-select v-model="scope.row.tagidList" placeholder="请选择">
                    <el-option
                            v-for="item in userTagsData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </template>
        </avue-crud>
        <el-dialog title="用户消息" :visible.sync="dialogMsgVisible" width="40%">
            <WxMsg :wxUserId="wxUserId" v-if="dialogMsgVisible"></WxMsg>
        </el-dialog>
    </div>
</template>

<script>
    import {checkPermi, checkRole} from "@/utils/permission"
    import {getPage, getObj, addObj, putObj, delObj, synchroWxUser, updateRemark, tagging} from '@/api/wxmp/wxuser'
    import {getList as listUserTags} from '@/api/wxmp/wxusertags'
    import {tableOption} from '@/const/crud/wxmp/wxuser'
    import WxMsg from '@/components/wx-msg/main.vue'

    export default {
        name: 'wxuser',
        components: {
            WxMsg
        },
        data() {
            return {
                tableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20, // 每页显示多少条
                    ascs: [],
                    descs: 'subscribe_time'
                },
                paramsSearch: {},
                tableLoading: false,
                tableOption: tableOption,
                selectionData: [],
                dialogTagging: false,
                checkedTags: [],
                userTagsData: [],
                taggingType: '',
                dialogMsgVisible: false,
                wxUserId: '',
            }
        },
        created() {
            this.listUserTags()
        },
        mounted: function () {
        },
        computed: {
            permissionList() {
                return {
                    addBtn: checkPermi(['wxmp:wxuser:add']),
                    delBtn: checkPermi(['wxmp:wxuser:del']),
                    editBtn: checkPermi(['wxmp:wxuser:edit']),
                    viewBtn: checkPermi(['wxmp:wxuser:get'])
                }
            }
        },
        methods: {
            listUserTags() {
                this.tableLoading = true
                listUserTags().then(response => {
                    if (response.code == 200) {
                        let userTagsData = response.data
                        this.userTagsData = userTagsData
                        this.$refs.crud.DIC.tagidList = userTagsData
                    } else {
                        this.$message.error('获取用户标签出错：' + response.msg)
                    }
                    this.tableLoading = false
                    this.getPage(this.page)
                }).catch(() => {
                    this.tableLoading = false
                    this.getPage(this.page)
                })
            },
            wxMsgDo(row) {
                this.wxUserId = row.id
                this.dialogMsgVisible = true
            },
            toTagging() {
                let openIdList = []
                for (let i = 0; i < this.selectionData.length; i++) {
                    openIdList.push(this.selectionData[i].openId)
                }
                if (this.checkedTags.length <= 0) {
                    this.$message.error('请选择标签')
                    return
                }
                if (openIdList.length <= 0) {
                    this.$message.error('请选择用户')
                    return
                }
                this.tableLoading = true
                tagging({
                    taggingType: this.taggingType,
                    tagIds: this.checkedTags,
                    openIds: openIdList
                }).then(response => {
                    this.tableLoading = false
                    this.checkedTags = []
                    this.$refs.crud.selectClear()
                    if (response.code == 200) {
                        this.getPage(this.page)
                    } else {
                        this.$message.error('打标签出错：' + response.msg)
                    }
                }).catch(() => {
                    this.tableLoading = false
                })
                this.dialogTagging = false
            },
            selectionChange(list) {
                this.selectionData = list
            },
            searchChange(params, done) {
                params = this.filterForm(params)
                this.paramsSearch = params
                this.page.currentPage = 1
                this.getPage(this.page, params)
                done()
            },
            synchroWxUser() {
                this.$confirm('同步用户需要一定时间，用户量越大、用时越久，请耐心等待，勿重复提交；确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableLoading = true
                    synchroWxUser().then(response => {
                        this.tableLoading = false
                        if (response.code == 200) {
                            this.getPage(this.page)
                        } else {
                            this.$message.error('同步微信用户出错：' + response.msg)
                        }
                    }).catch(() => {
                        this.tableLoading = false
                    })
                    setTimeout(() => {
                        if (this.tableLoading) {
                            this.tableLoading = false
                            this.$alert('同步请求发送成功，系统正在处理中，请稍后刷新查看同步结果，用户量越大用时越久，请耐心等待，勿重复提交', '提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    }, 3000)
                }).catch(() => {
                })
            },
            sortChange(val) {
                let prop = val.prop ? val.prop.replace(/([A-Z])/g, "_$1").toLowerCase() : '';
                if (val.order == 'ascending') {
                    this.page.descs = []
                    this.page.ascs = prop
                } else if (val.order == 'descending') {
                    this.page.ascs = []
                    this.page.descs = prop
                } else {
                    this.page.ascs = []
                    this.page.descs = []
                }
                this.getPage(this.page)
            },
            getPage(page, params) {
                this.tableLoading = true
                getPage(Object.assign({
                    current: page.currentPage,
                    size: page.pageSize,
                    descs: this.page.descs,
                    ascs: this.page.ascs,
                    appType: '2'
                }, params, this.paramsSearch)).then(response => {
                    this.tableData = response.data.records
                    this.page.total = response.data.total
                    this.page.currentPage = page.currentPage
                    this.page.pageSize = page.pageSize
                    this.tableLoading = false
                }).catch(() => {
                    this.tableLoading = false
                })
            },
            updateRemark(row, index) {
                this.$prompt('请输入备注', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '输入不能为空'
                }).then(({value}) => {
                    this.tableLoading = true
                    row.remark = value
                    updateRemark(row).then(response => {
                        this.tableLoading = false
                        if (response.code == 200) {
                            this.tableData.splice(index, 1, Object.assign({}, row))
                            this.$message({
                                showClose: true,
                                message: '修改成功',
                                type: 'success'
                            })
                            this.getPage(this.page)
                        } else {
                            this.$message.error(response.msg)
                        }
                    }).catch(() => {
                        this.tableLoading = false
                    })
                })
            },
            handleDel: function (row, index) {
                var _this = this
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.id)
                }).then(data => {
                    _this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    })
                    this.getPage(this.page)
                }).catch(function (err) {
                })
            },
            /**
             * @title 数据更新
             * @param row 为当前的数据
             * @param index 为当前更新数据的行数
             * @param done 为表单关闭函数
             *
             **/
            handleUpdate: function (row, index, done, loading) {
                putObj(row).then(data => {
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    })
                    done()
                    this.getPage(this.page)
                }).catch(() => {
                    loading()
                })
            },
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            handleSave: function (row, done, loading) {
                addObj(row).then(data => {
                    this.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    })
                    done()
                    this.getPage(this.page)
                }).catch(() => {
                    loading()
                })
            },
            /**
             * 刷新回调
             */
            refreshChange(page) {
                this.getPage(this.page)
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
