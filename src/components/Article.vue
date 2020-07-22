<template>
  <div class="container">
    <div class="article">
      <h1 class="title">{{article.title}}</h1>
      <div class="title-header">
        <div class="author">{{article.author}} 更新于：{{article.time}}
          <div class="view-count">
            <i class="el-icon-view"></i>
            <span>1.2k</span>
          </div>
        </div>
        <div class="icon-list">
          <el-button class="icon btn-icon" type="info" plain>
            <span class="iconfont third-appreciate">
              <span class="btn-text">1.3k</span>
            </span>
          </el-button>
          <el-button class="icon btn-icon" type="info" plain>
            <span class="iconfont third-like"></span>
            <span class="btn-text">134</span>
          </el-button>
          <el-button class="icon btn-icon" type="info" plain>
            <span class="iconfont third-share"></span>
          </el-button>
          <el-dropdown @command="handleMore">
            <el-button class="icon btn-icon" type="info" plain>
              <span class="iconfont third-more"></span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="b">编辑</el-dropdown-item>
              <el-dropdown-item command="e">权限</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="article-body">
        <div class="tag">
          <el-tag class="tag-item" type="success" size="small">C++</el-tag>
          <el-tag class="tag-item" type="info" size="small">树状数组</el-tag>
          <el-tag class="tag-item" type="warning" size="small">排序</el-tag>
        </div>
        <div class="paragraph">
          树状数组是用数组来模拟树形结构，可以解决大部分基于区间上的更新以及求和问题。树状数组中修改和查询的复杂度都是O(logN)
          树状数组是用数组来模拟树形结构，可以解决大部分基于区间上的更新以及求和问题。树状数组中修改和查询的复杂度都是O(logN)
        </div>
        <div class="paragraph">
          黑色数组代表原来的数组（下面用A[i]代替），红色树代表我们的树状数组(下面用C[i]代替)。树状数组每个位置只有一个方框，令每个位置存的就是子节点的值的和：
        </div>
        <div class="paragraph">
          而本题中，需要另一种类似异或运算的规则。由此，我们可以设计这样一种规则（不是唯一的解决方案），我们需要两个变量M和N（初值均为0）来满足题目要求
        </div>
        <div class="paragraph">
          树状数组是用数组来模拟树形结构，可以解决大部分基于区间上的更新以及求和问题。树状数组中修改和查询的复杂度都是O(logN)
        </div>
        <div class="paragraph">
          黑色数组代表原来的数组（下面用A[i]代替），红色树代表我们的树状数组(下面用C[i]代替)。树状数组每个位置只有一个方框，令每个位置存的就是子节点的值的和：
        </div>
        <div class="paragraph">
          而本题中，需要另一种类似异或运算的规则。由此，我们可以设计这样一种规则（不是唯一的解决方案），我们需要两个变量M和N（初值均为0）来满足题目要求
        </div>
        <div class="paragraph">
          树状数组是用数组来模拟树形结构，可以解决大部分基于区间上的更新以及求和问题。树状数组中修改和查询的复杂度都是O(logN)
        </div>
        <div class="paragraph">
          黑色数组代表原来的数组（下面用A[i]代替），红色树代表我们的树状数组(下面用C[i]代替)。树状数组每个位置只有一个方框，令每个位置存的就是子节点的值的和：
        </div>
        <div class="paragraph">
          而本题中，需要另一种类似异或运算的规则。由此，我们可以设计这样一种规则（不是唯一的解决方案），我们需要两个变量M和N（初值均为0）来满足题目要求
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      article: {
        title: '未命名文章',
        time: '昨天 18:30',
        author: 'Bella'
      }
    }
  },
  methods: {
    handleMore (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style scoped>
  .container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .article{
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 680px;
    margin: 0 24px;
    padding: 40px 0;
    border-bottom: 1px solid #eaecef;
    min-width: 500px;
  }
  .title-header{
    display: flex;
    justify-content: space-between;
    color: #606266;
    border-bottom: 1px solid #eaecef;
  }
  .view-count{
    padding: 0 20px;
  }
  .icon{
    color: #606266;
    border: none;
    padding: 8px;
    background: none;
  }
  .btn-icon:hover{
    background: #C0C4CC;
  }
  .author{
    margin: 10px 0;
    display: flex;
    font-size: 14px;
  }
  .el-button+.el-button {
     margin-left: 0;
  }
  .title{
    text-align: left;
  }
  .article-body{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    font-size: 18px;
    line-height: 28px;
  }
  .paragraph{
    text-align: left;
    margin-top: 28px;
  }
  .tag{
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: left;
  }
  .tag-item{
    margin-right: 10px;
  }
  .btn-text{
    font-size: 14px;
    font-weight: normal;
    margin-left: 3px;
  }
</style>
