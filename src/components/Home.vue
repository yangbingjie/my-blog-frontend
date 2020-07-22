<template>
  <div>
    <nav-menu></nav-menu>
    <router-view/>
  </div>
</template>

<script>
import NavMenu from './common/NavMenu'
export default {
  name: 'Home',
  components: {NavMenu},
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>

</style>
