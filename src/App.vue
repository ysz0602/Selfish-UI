<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
import { isEmpty } from './utils'
export default {
    name: "app",
    components: {},
    created() {
      if(localStorage.getItem('eleToken')) {
        // 解析 token
        const decoded = jwt_decode(localStorage.getItem('eleToken'))
        // token 存储到 vuex 中
        this.$store.dispatch('setAuthenticated', !isEmpty(decoded))
        this.$store.dispatch('setUser', decoded)
      }
    },
    methods: {
      isEmpty(value) {
        return (
          value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0)
        )
      }
    }
}
</script>
<style>
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
