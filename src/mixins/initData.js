import { initData } from '@/api/data'

export default {
  data() {
    return {
      // 表格 Loading 属性
      loading: true,
      // 表格数据
      data: [],
      // 页码
      page: 0,
      // 每页数据条数
      size: 10,
      // 总数据条数
      total: 0,
      // 请求数据的url
      url: '',
      // 查询数据的参数
      params: {},
      // 待查询的对象
      query: {},
      // 等待时间
      time: 50,
      // 是否为新增类型的表单
      isAdd: false,
      // 导出的 Loading
      downloadLoading: false
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        // 请求数据
        initData(this.url, this.params).then(res => {
          this.total = res.totalElements
          this.data = res.content
          // time 毫秒后显示表格
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    // 改变页码
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    // 改变每页显示数
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    // 查询方法
    toQuery() {
      this.page = 0
      this.init()
    }
  }
}
