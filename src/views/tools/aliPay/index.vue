<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="参数配置" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane label="支付测试" name="second">
      <ToPay />
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <div>
        <blockquote class="my-blockquote">注意</blockquote>
        <pre class="my-code">
测试所用参数都是沙箱环境，仅供测试使用，申请地址：<a style="color: #00a0e9" href="https://openhome.alipay.com/platform/appDaily.htm?tab=info" target="_blank">支付宝开发平台</a>
如需付款测试，请使用
账号：uuxesw9745@sandbox.com
密码与支付密码：111111</pre>
        <blockquote class="my-blockquote"> 支付设置</blockquote>
        <pre class="my-code">
// 支付提供两个接口，
// PC端与手机端，并且在前端使用代码识别
if (/(Android)/i.test(navigator.userAgent)){     // 判断是否为Android手机
    url = "/aliPay/toPayAsWeb"
}else if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){  // 判断是否为苹果手机
    url = "/aliPay/toPayAsWeb"
} else {
    url = "/aliPay/toPayAsPC"
}</pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import ToPay from './toPay'
export default {
  name: 'AliPay',
  components: { Config, ToPay },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
