<template>
  <div class="container">
    <div v-if="article != null" class="article">
      <h1 class="title">{{article.title}}</h1>
      <div class="title-header">
        <div class="author">{{article.author_name}} 更新于：{{article.update_time}}
          <div class="view-count">
            <i class="el-icon-view"></i>
            <span>{{article.view_count}}</span>
          </div>
        </div>
        <div class="icon-list">
          <el-button class="btn-icon" type="info" plain>
            <span class="iconfont third-appreciate">
              <span class="btn-text">{{article.like_count}}</span>
            </span>
          </el-button>
          <el-button class="btn-icon" type="info" plain>
            <span class="iconfont third-like"></span>
            <span class="btn-text">{{article.star_count}}</span>
          </el-button>
          <el-button class="btn-icon" type="info" plain>
            <span class="iconfont third-share"></span>
          </el-button>
          <el-dropdown @command="handleMore">
            <el-button class="btn-icon" type="info" plain>
              <span class="iconfont third-more"></span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="article.author_id === this.$store.state.user.user_id" command="edit">编辑文章</el-dropdown-item>
              <el-dropdown-item v-if="article.author_id === this.$store.state.user.user_id" command="auth">设置权限</el-dropdown-item>
              <el-dropdown-item command="more">更多信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="article-body">
        <div class="tag-list">
          <el-tag
            class="tag-item"
            :key="tag"
            v-for="(tag, index) in article.tags"
            :disable-transitions="false"
            :type="tagList[index % tagList.length]">
            {{tag}}
          </el-tag>
        </div>
        <div class="markdown-body">
          <div v-html="article.content_html"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="ErrorPage-text"><h1 class="ErrorPage-title">404</h1>
        <p class="ErrorPage-subtitle">你似乎来到了没有知识存在的荒原</p>
        <a href="/index"><el-button type="primary" round>去往首页</el-button></a>
      </div>
    </div>
  </div>
</template>

<script>
import '../styles/markdown.css'

export default {
  name: 'ArticleDetails',
  data () {
    return {
      article: null,
      tagList: ['warning', 'info', 'success', 'danger', '']
    }
  },
  mounted () {
    this.loadArticle()
  },
  methods: {
    numFormat (num) {
      if (num >= 100000) {
        return '10w+'
      } else if (num >= 10000) {
        num = num / 10000
        num.toFixed(2)
        return num + 'w'
      } else if (num >= 1000) {
        num = num / 1000
        num.toFixed(2)
        return num + 'k'
      } else {
        return num
      }
    },
    loadArticle () {
      let that = this
      that.$axios.post('/article/getArticleById', {
        article_id: that.$route.params.article_id,
        user_id: that.$store.state.user.user_id
      }).then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.article = resp.data.article
          that.article.article_id = that.$route.params.article_id
          that.article.view_count = that.numFormat(resp.data.article.view_count)
          that.article.star_count = that.numFormat(resp.data.article.star_count)
          that.article.like_count = that.numFormat(resp.data.article.like_count)
        }
      })
    },
    handleMore (command) {
      if (command === 'edit') {
        this.$router.push({name: 'ArticleEditor', params: {article_id: this.article.article_id}})
      } else if (command === 'auth') {
        // TODO
      }
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .article {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0 24px;
    padding: 40px 0;
    border-bottom: 1px solid #eaecef;
    min-width: 60%;
    max-width: 100%;
  }

  .title-header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    color: #606266;
    border-bottom: 1px solid #eaecef;
  }

  .view-count {
    padding: 0 20px;
  }

  .btn-icon{
    color: #606266;
    background: none;
    border: none;
    padding: 5px;
  }

  .btn-icon:hover {
    background: #c6c6c6;
  }

  .author {
    margin: 10px 0;
    display: flex;
    font-size: 14px;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .title {
    text-align: left;
  }

  .article-body {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    font-size: 18px;
    line-height: 28px;
  }

  .tag {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: left;
  }

  .tag-item {
    margin-right: 10px;
  }

  .btn-text {
    font-size: 14px;
    font-weight: normal;
    margin-left: 3px;
  }

  .tag-list {
    margin: 20px 0;
    display: flex;
    justify-content: left;
  }
</style>
