<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" title="应用部署" width="400px">
    <el-form ref="form" :model="form" :rules="rules" size="small">
      <el-upload
        :action="deployUploadApi"
        :data="deployInfo"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        class="upload-demo"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">多个应用上传文件名称为all.zip,数据库更新脚本扩展名为.sql,上传成功后系统自动部署系统。</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getApps, getServers } from '@/api/mnt/deploy'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  props: {},
  data() {
    return {
      loading: false,
      dialog: false,
      apps: [],
      servers: [],
      headers: {
        Authorization: getToken()
      },
      deployInfo: {},
      form: {
        id: '',
        appId: '',
        ip: '',
        selectIp: []
      },
      rules: {}
    }
  },
  computed: {
    ...mapGetters(['deployUploadApi'])
  },
  created() {
    this.initWebSocket()
  },
  mounted() {
    this.initSelect()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else {
        this.doEdit()
      }
    },
    joinIp() {
      this.form.ip = ''
      this.form.selectIp.forEach(ip => {
        if (this.form.ip !== '') {
          this.form.ip += ','
        }
        this.form.ip += ip
      })
    },
    doAdd() {
      this.joinIp()
      add(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    doEdit() {
      this.joinIp()
      edit(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        appId: '',
        ip: '',
        selectIp: []
      }
    },
    initSelect() {
      getApps().then(res => {
        this.apps = res.content
      })
      getServers().then(res => {
        this.servers = res.content
      })
    },
    handleSuccess(response, file, fileList) {
      this.cancel()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    initWebSocket() {
      const wsUri = (process.env.VUE_APP_WS_API === '/' ? '/' : (process.env.VUE_APP_WS_API + '/')) + 'webSocket/deploy'
      this.websock = new WebSocket(wsUri)
      this.websock.onerror = this.webSocketOnError
      this.websock.onmessage = this.webSocketOnMessage
    },
    webSocketOnError(e) {
      this.$notify({
        title: 'WebSocket连接发生错误',
        type: 'error',
        duration: 0
      })
    },
    webSocketOnMessage(e) {
      const data = JSON.parse(e.data)
      if (data.msgType === 'INFO') {
        this.$notify({
          title: '',
          message: data.msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
          duration: 5500
        })
      } else if (data.msgType === 'ERROR') {
        this.$notify({
          title: '',
          message: data.msg,
          dangerouslyUseHTMLString: true,
          type: 'error',
          duration: 0
        })
      }
    },
    webSocketSend(agentData) {
      this.websock.send(agentData)
    }
  }
}
</script>

<style scoped>
</style>
