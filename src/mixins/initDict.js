import { get, getDictMap } from '@/api/dictDetail'

export default {
  data() {
    return {
      dicts: [], dictMap: {}
    }
  },
  methods: {
    async getDict(name) {
      return new Promise((resolve, reject) => {
        get(name).then(res => {
          this.dicts = res.content
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 多个字典查询时使用逗号拼接， 如：
    // 加载多个数据字典，如何调用如下：
    // this.getDict('user_status,job_status')
    // 在vue中使用加载出来的字典：
    // dictMap.[字典名称] 如：dictMap.user_status、 dictMap.job_status
    async getDictMap(names) {
      // 优先放入到dictMap中，避免页面加载时 undefined
      const arr = names.split(',')
      for (let i = 0; i < arr.length; i++) {
        this.dictMap[arr[i]] = []
      }
      return new Promise((resolve, reject) => {
        getDictMap(names).then(res => {
          this.dictMap = res
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
