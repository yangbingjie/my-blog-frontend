<template>
  <div>
    <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
  </div>
</template>

<script>
import ImgUpload from './common/ImgUpload'
export default {
  name: 'Profile',
  components: {ImgUpload},
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    uploadImg () {
      this.avatar = this.$refs.imgUpload.url
      this.$store.state.user.avatar = this.$refs.imgUpload.url
    }
  }
}
</script>

<style scoped>
</style>
