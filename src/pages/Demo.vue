<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Your Build App">
        <a-skeleton active :paragraph="{ rows: 15 }" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Call Micro Service">
        <a-card title="hello" style="width: 300px">
          <a slot="extra" @click="hello">获取</a>
          <p>{{ helloInfo }}</p>
        </a-card>
        <a-card title="获取用户信息" style="width: 300px">
          <a slot="extra" @click="getGafUser">获取</a>
          <p>{{ userInfo }}</p>
        </a-card>
      </a-tab-pane>
    </a-tabs>
    <div>
      <!-- <TestComponent /> -->
    </div>
  </div>
</template>

<script>
// const yfzxgis = require('@gis/yfzxgis.umd.js') //
// const TestComponent = yfzxgis
// console.log(yfzxgis)
export default {
  components: {

  },
  data() {
    return {
      userInfo: '',
      helloInfo: ''
    }
  },
  mounted() {
    // yfzxgis.yfLayer.log()
  },
  methods: {
    async getGafUser() {
      try {
        const res = await this.$axios({
          method: 'get',
          url: '/bzgis/user'
        })
        if (res.status === 200) {
          this.userInfo = res.data
        }
      } catch (ex) {
        console.error(ex)
      }
    },
    async hello() {
      try {
        const res = await this.$axios({
          method: 'get',
          url: '/bzgis/hello'
        })
        if (res.status === 200) {
          this.helloInfo = res.data
        }
      } catch (ex) {
        console.error(ex)
      }
    }
  }
}
</script>
