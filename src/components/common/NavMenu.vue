<template>
  <div class="nav">
    <el-menu
      :default-active="activeIndex"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="#606266" class="menu">
      <h3 class="web-name">Bella's Blog</h3>
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
        {{ item.navItem }}
      </el-menu-item>
    </el-menu>
    <el-dropdown @command="handleCommand">
      <el-button plain round type="info" icon="el-icon-user" class="icon"></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">Profile</el-dropdown-item>
        <el-dropdown-item command="a">Settings</el-dropdown-item>
        <el-dropdown-item command="d">Stars</el-dropdown-item>
        <el-dropdown-item command="e" divided>Sign out</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      activeIndex: this.$route.path,
      navList: [
        {name: '/index', navItem: 'Home'},
        {name: '/article', navItem: 'Blog'},
        {name: '/profile', navItem: 'More'}
      ]
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style scoped>
  .web-name{
    margin: 17px;
    padding: 0 20px;
  }
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }
  .icon{
    font-size: 20px;
    margin: 10px;
    padding: 10px;
    border-radius: 100%;
    border: none;
  }
  .icon:hover{
    background: #C0C4CC;
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
</style>
