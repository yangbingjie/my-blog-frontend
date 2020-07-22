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
      cover: ''
    }
  },
  methods: {
    uploadImg () {
      this.cover = this.$refs.imgUpload.url
    }
  }
}
</script>

<style scoped>
</style>
