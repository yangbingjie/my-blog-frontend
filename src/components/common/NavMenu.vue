<template>
  <div class="nav">
    <el-menu
      :default-active="activeIndex"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="#606266" class="menu">
      <h3 class="web-name">Pre</h3>
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
    </el-menu>
    <div class="dropdown">
      <el-dropdown @command="handleCommand">
        <div class="avatar-button">
          <el-avatar v-if="user != null && user.avatar !== null" shape="circle" :size="36" :src="user.avatar"></el-avatar>
          <i v-else class="el-icon-user default-icon"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">Profile</el-dropdown-item>
          <el-dropdown-item command="settings">Settings</el-dropdown-item>
          <el-dropdown-item command="stars">Stars</el-dropdown-item>
          <el-dropdown-item command="signout" divided>Sign out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      user: this.$store.state.user,
      activeIndex: this.$route.path,
      navList: [
        {name: '/index', navItem: 'Home'},
        {name: '/article', navItem: 'Blog'},
        {name: '/more', navItem: 'More'}
      ]
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
      if (command === 'profile') {
        let path = this.$route.query.redirect
        this.$router.replace({path: path === '/' || path === undefined ? '/profile' : path})
      }
    }
  }
}
</script>

<style scoped>
  .web-name{
    margin: 17px 0 17px;
    padding: 0 20px;
  }
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }
  .default-icon{
    font-size: 20px;
    padding: 10px;
    background-color: #E4E7ED;
    border-radius: 100%;
  }
  .avatar-button{
    border-radius: 100%;
    border: none;
    background: none;
  }
  .menu{
    display: flex;
    justify-content: space-around;
  }
  .nav{
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #e6e6e6;
    padding: 0 10px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .dropdown{
    padding: 9px;
  }
</style>
