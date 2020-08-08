<template>
  <div class="container">
    <el-card class="left-profile">
      <img-upload @onUpload="uploadImg" v-bind:isEdit="isEdit" v-bind:imageUrl="user.avatar"
                  ref="imgUpload"></img-upload>
      <div class="user-form">
        <el-form ref="form" :model="user" label-width="80px">
          <el-form-item label="用户名：">
            <el-input
              :disabled='!isEdit'
              class="user-input"
              placeholder=""
              v-model="user.username">
            </el-input>
          </el-form-item>
          <el-form-item label="介绍：">
            <el-input
              :disabled='!isEdit'
              class="user-input"
              type="textarea"
              resize="none"
              placeholder="这个人很懒，什么都没写"
              v-model="user.description">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div v-if="isEdit" class="btn-list">
              <el-button size="mini" v-on:click="cancelEdit" plain>取消</el-button>
              <el-button size="mini" type="primary" v-on:click="saveProfile">保存</el-button>
            </div>
            <div v-else class="btn-list">
              <el-button type="primary" size="mini" v-on:click="editProfile">编辑</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="block">
      <el-timeline>
        <el-timeline-item timestamp="2018/4/12" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/3" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/3 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/2" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/2 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import ImgUpload from './common/ImgUpload'
export default {
  name: 'Profile',
  components: {ImgUpload},
  data () {
    return {
      isEdit: false,
      user: {
        avatar: '',
        description: '',
        username: ''
      }
    }
  },
  mounted () {
    this.getProfile()
  },
  methods: {
    saveProfile (){
      let that = this
      that.$axios.post('/user/editProfile', {
        user_id: this.$route.params.user_id,
        user_name: that.user.username,
        description: that.user.description
      }).then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.user = resp.data.user
        }
        this.isEdit = false
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '网络错误'
        })
      })
    },
    getProfile (){
      let that = this
      that.$axios.post('/user/getProfile', {
        user_id: this.$route.params.user_id
      }).then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.user = resp.data.user
        }
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '网络错误'
        })
      })
    },
    editProfile() {
      this.isEdit = true
    },
    cancelEdit() {
      this.isEdit = false
    },
    uploadImg () {
      this.user.avatar = this.$refs.imgUpload.url
      this.$store.state.user.avatar = this.$refs.imgUpload.url
    }
  }
}
</script>

<style scoped>
  .user-text{
    font-style: normal;
    text-align: left;
    font-weight: 300;
    line-height: 40px;
    color: #666;
  }
  .block{
    flex-grow: 2;
    text-align: left;
  }
  .container{
    display: flex;
    flex-wrap: wrap;
    padding: 30px;
  }
  .el-form >>> .el-form-item__label{
    font-style: normal;
    text-align: left;
    line-height: 40px;
    font-weight: 300;
    color: #666;
  }
  .user-input >>> input{
    border: 1px dashed #DCDFE6;
  }
  .user-input >>> input:disabled{
    border: 1px dashed white;
  }
  .user-input >>> .el-input__inner {
    background-color: white;
    font-style: normal;
    text-align: left;
    font-weight: 300;
    line-height: 40px;
    cursor:default;
    color: #666;
  }
  .user-form{
    margin-top: 20px;
  }
  .left-profile >>> .el-card__body {
    padding: 20px 20px 0 20px;
  }
  .user-input >>> textarea{
    border: 1px dashed #DCDFE6;
  }
  .user-input >>> textarea:disabled{
    border: 1px dashed white;
  }
  .user-input >>>.el-textarea__inner{
    background-color: white;
    cursor:default;
    font-style: normal;
    text-align: left;
    font-weight: 300;
    line-height: 40px;
    color: #666;
  }
  .left-profile{
    margin: 20px;
    width: 30%;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .btn-list{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
</style>
