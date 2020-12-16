<template>
  <div style="padding:30px;">
    <el-input v-model="input" placeholder="请输入内容" />
  </div>
</template>
<script>
export default {
  name: 'Test',
  data() {
    return {
      input: ''
    }
  }
}
</script>
