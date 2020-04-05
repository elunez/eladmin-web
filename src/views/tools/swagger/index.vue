<template>
  <elFrame :src="swaggerApi" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Swagger',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'swaggerApi'
    ])
  }
}
</script>
