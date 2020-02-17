<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog"  width="600px" title="导出Execl">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item>
        <div>
          <h4 v-if="fileProcess.code>=0">{{fileProcess.status}}&nbsp;&nbsp;&nbsp;&nbsp;
            总数量:{{fileProcess.count}}&nbsp;&nbsp;&nbsp;&nbsp;
            完成数量:{{fileProcess.finish}}</h4>
          <div v-if="fileProcess.count>0">
            <el-progress  :text-inside="true" :stroke-width="26" :percentage="Number((fileProcess.finish*100/fileProcess.count).toFixed(2))"></el-progress>
          </div>
          <div v-if="fileProcess.code!=1&&fileProcess.finish===fileProcess.count&&fileProcess.count>0">
            <h4>正在提交数据库数据...</h4>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import {download} from  '@/api/data'
import initData from '@/mixins/initData'
import { randomString, downloadFile } from '@/utils/index'
export default {
  props: {
    uploadApi: {
      type: String,
      required: true
    }
  },
  mixins: [initData],
  data() {
    return {
      fileName: '', dialog: false,
      headers: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        id: '',
        name: ''
      },
      baseURL: process.env.NODE_ENV === 'production' ? process.env.BASE_API+'/' : '/',
      rules: {
      },
      fileProcess:{
        status:'',
        code:-1,
        count:0,
        finish:0
      },
    }
  },
  computed: {
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: ''
      }
      this.fileProcess = {
          status:'',
          code:-1,
          count:0,
          finish:0
      }
    },
    handleSuccess(response, param,form) {
      console.log(response)
      if(response){
         var res = response.data;
        if(res.code == 0 || res.code == 3){
            this.loadingInstance.text = "";
            this.fileProcess.status = res.status;
            this.fileProcess.code = res.code;
            if('count' in res ){
               this.fileProcess.count = res.count
            }
            if('haveInsert' in  res){
              this.fileProcess.finish = res.haveInsert;
            }
            this.postFile(param,form);
        }else if(res.code == 1){
          this.loadingInstance.close();
          this.dialog = false;
          this.$parent.init();
          this.$notify({
            title: '文件导出成功',
            type: 'success',
            duration: 2500
          });
          downloadFile(response,this.fileName, 'xlsx')
        }else{
           this.handleError(res.status);
        }
      }
    },
    // 监听上传失败
    handleError(msg) {
      this.dialog = false;
      this.loadingInstance.close();
      this.$refs.upload.clearFiles();
      this.$notify({
        title: msg,
        type: 'error',
        duration: 2500
      });
      this.fileName = ''
    },
    downloadFile(param){
      param["id"] = randomString(32);
      this.openFullScreen('导出',this.fileName);
      this.postFile(param,param);
    },
    postFile(param,form){
      download(this.uploadApi,form).then((response)=>{
        this.handleSuccess(response,param,form);
      }).catch(e=>{
        this.handleError(e.message);
      });
    }
  }
}
</script>

<style scoped>

</style>
