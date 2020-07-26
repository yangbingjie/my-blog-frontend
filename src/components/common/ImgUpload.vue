<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="http://localhost:8443/api/file/uploadAvatar"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
      :data="upLoadData"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'ImgUpload',
  data () {
    return {
      upLoadData: {
        user_id: this.$store.state.user.user_id
      },
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess (res) {
      this.imageUrl = res
      this.$emit('onUpload')
      this.$message.success('上传成功')
    },
    handleAvatarError (res) {
      this.$message.warning('上传失败')
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
  .avatar-uploader{
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader :hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
