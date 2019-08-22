<template>
  <div>
    <el-dialog
      :visible.sync="show"
      data-html2canvas-ignore="true"
      title="意见反馈"
      class
      width="60%"
      center
      @open="init"
      @close="close"
    >
      <el-form ref="form" :model="feedback" label-width="0px" class="feedback-add-form">
        <el-form-item label prop="info">
          <el-input v-model="feedback.info" :rows="2" type="textarea" placeholder="告诉我们你的建议或遇到的问题。"/>
        </el-form-item>
        <el-form-item label>
          <span>屏幕截图 (可选)：</span>
        </el-form-item>
        <el-form-item v-loading="dataLoading" v-show="submitScreenshot" label>
          <div id="screenshot"/>
        </el-form-item>
        <el-form-item label>
          <el-checkbox v-model="submitScreenshot">提交屏幕截图</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button
        slot="footer"
        :loading="confirmLoading"
        class="confirm-btn"
        type="primary"
        @click="submit"
      >提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import SimpleDrawingBoard from 'simple-drawing-board'
import html2canvas from 'html2canvas'
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      feedback: {
        info: ''
      },
      submitScreenshot: true,
      dataLoading: false,
      confirmLoading: false
    }
  },

  computed: {
    show: {
      get() {
        return this.showDialog
      },
      set(val) {
        this.$emit('update:showDialog', val)
      }
    }
  },

  methods: {
    async loadLibrary() {
      if (typeof html2canvas === 'undefined') {
        try {
          console.error('html2canvas not import')
        } catch (e) {
          console.error('html2canvas.min.js is missing', e.toString())
          return null
        }
      }
      return html2canvas
    },
    async init() {
      await this.loadLibrary()
      this.dataLoading = true
      this.$nextTick(() => {
        // modal层处理，截屏时忽略遮罩层
        const modals = document.getElementsByClassName('v-modal')
        for (let i = 0; i < modals.length; i++) {
          modals[i].setAttribute('data-html2canvas-ignore', 'true')
        }

        html2canvas(document.body, { logging: false })
          .then(canvas => {
            const screenshot = document.getElementById('screenshot')
            canvas.setAttribute('style', 'width:100%')
            screenshot.appendChild(canvas)
            this.dataLoading = false
            window.sdb = new SimpleDrawingBoard(
              screenshot.getElementsByTagName('canvas')[0],
              {
                lineColor: '#ff0000',
                lineSize: 4
              }
            )
          })
          .catch(e => {
            this.dataLoading = false
            console.log(e.toString())
          })
      })
    },

    close() {
      const screenshot = document.getElementById('screenshot')
      const canvas = screenshot.getElementsByTagName('canvas')[0]
      screenshot.removeChild(canvas)
    },

    async submit() {
      try {
        this.confirmLoading = true
        const formData = new FormData()
        if (window.sdb) {
          if (this.submitScreenshot) {
            const screenshot = window.sdb.getImg()
            formData.append('file', screenshot)
          }
          formData.append('feedback', this.feedback.info)
        }
        // let res = await axios.post('http://', formData, {
        //   headers: {
        //     'Origin': window.location.origin,
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   changeOrigin: true
        // })
        this.confirmLoading = false

        this.$notify({
          title: '反馈成功',
          type: 'success',
          duration: 2500
        })
        this.show = false
      } catch (e) {
        this.$notify({
          title: '提交失败',
          type: 'error',
          duration: 2500
        })
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style scoped>
#screenshot {
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAARpJREFUOBGdkr1KA0EUhTcxEkSQQIpAihQWPoedD2BnIVsZQiBVEkiR7SwtBDsJqXwBLQwEgoWNjY2FjYUQ38Ei5Oc7sBeGLTKze+Djzsyecxh2N4ryq0zkHpYQQ2H1SW5TNsxukaZzQsewACvTvIBg3eFUaABHMEv3OruBIN3icm8wZl+FZ3iBQ/AqweGW2FrlKlChV0McFsxOvaegm/T2lLzzTC/dqzaO7A1s/8GzE28Dhhj0f1jQnZ+c18CrKxxrcMO2/uK87m3AcAkrsKA7vzlvQJAmuNywrX84bwY1YBrBATyCFWj+QguCJKNCU1DZQ7r/Y55CsK5x2i2eWFcggTPIJd3Eiv5Zd3KlU3OJOQd9lVd4A5Xl1g4YG2GGhwRfegAAAABJRU5ErkJggg==)
      0 17,
    default;
}
.confirm-btn {
  width: 30%;
}
</style>
