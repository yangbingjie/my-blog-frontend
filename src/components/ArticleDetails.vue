<template>
  <div class="container">
    <div id="loading" :v-loading="article_loading"></div>
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
          <el-button class="btn-icon" type="info" plain v-on:click="likeArticle"
                     :loading="this.like_loading" >
            <span :class="this.article.is_like ? 'iconfont third-appreciatefill' : 'iconfont third-appreciate'">
              <span class="btn-text">{{article.like_count}}</span>
            </span>
          </el-button>
          <el-button class="btn-icon" type="info" plain v-on:click="starArticle"
                     :loading="this.star_loading">
            <span :class="this.article.is_star ? 'iconfont third-favorfill': 'iconfont third-favor'"></span>
            <span class="btn-text">{{article.star_count}}</span>
          </el-button>
          <el-button class="btn-icon share-btn" type="info" plain
                     @click="shareArticle">
            <span class="iconfont third-share"></span>
          </el-button>
          <el-dropdown @command="handleMore">
            <el-button class="btn-icon" type="info" plain>
              <span class="iconfont third-more"></span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="article.author_id === this.$store.state.user.user_id" command="edit">编辑文章</el-dropdown-item>
              <el-dropdown-item v-if="article.author_id === this.$store.state.user.user_id" command="auth">设置权限</el-dropdown-item>
              <el-dropdown-item command="download">下载markdown</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="article-body">
        <div class="tag-list">
          <el-tag
            class="tag-item"
            :key="tag.tag_name"
            v-for="(tag, index) in tag_list"
            :disable-transitions="false"
            :type="tagColors[index % tagColors.length]">
            {{tag.tag_name}}
          </el-tag>
        </div>
        <div class="markdown-body">
          <div v-html="article.content_html"></div>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%">
          <span>是否{{this.article.is_public === 1 ? '取消发布': '发布文章'}}</span>
          <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAuth">确 定</el-button>
    </span>
        </el-dialog>
      </div>
    </div>
    <div v-else-if="!article_loading">
      <div class="ErrorPage-text"><h1 class="ErrorPage-title">404</h1>
        <p class="ErrorPage-subtitle">你似乎来到了没有知识存在的荒原</p>
        <a href="/index"><el-button type="primary" round>去往首页</el-button></a>
      </div>
    </div>

    <mavon-editor
      class="editor"
      ref=md>
    </mavon-editor>
  </div>
</template>

<script>
export default {
  name: 'ArticleDetails',
  data () {
    return {
      article: null,
      tag_list: [],
      tagColors: ['warning', 'info', 'success', 'danger', ''],
      like_loading: false,
      star_loading: false,
      article_loading: true,
      dialogVisible: false,
      share_url: window.location.href
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
      that.article_loading = true
      that.$axios.post('/article/getArticleById', {
        article_id: that.$route.params.article_id,
        user_id: that.$store.state.user.user_id
      }).then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.article = resp.data.article
          that.article.article_id = that.$route.params.article_id
          that.tag_list = resp.data.article.tag_list
          that.article.view_count = that.numFormat(resp.data.article.view_count)
          that.article.star_count = that.numFormat(resp.data.article.star_count)
          that.article.like_count = that.numFormat(resp.data.article.like_count)
        }
        that.article_loading = false
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '网络错误'
        })
        that.article_loading = false
      })
    },
    handleMore (command) {
      if (command === 'edit') {
        this.$router.push({name: 'ArticleEditor', params: {article_id: this.article.article_id}})
      } else if (command === 'auth') {
        this.dialogVisible = true
      } else if (command === 'download'){
        this.downloadMarkdown(this.article.title + '.md', this.article.content_markdown)
      }
    },
    downloadMarkdown(fileName, content){
      let aTag = document.createElement('a');
      let blob = new Blob([content]);
      aTag.download = fileName;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
      this.$message.success('下载成功')
    },
    likeArticle(){
      let that = this
      that.like_loading = true
      that.$axios.post('/article/like',{
        article_id: that.article.article_id,
        user_id: that.$store.state.user.user_id
      }). then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.article.is_like = resp.data.is_like
          that.article.like_count = resp.data.like_count
        }else{
          that.$message({
            type: 'error',
            message: '点赞失败'
          })
        }
        that.like_loading = false
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '点赞失败'
        })
        that.like_loading = false
      })
    },
    starArticle(){
      let that = this
      that.star_loading = true
      that.$axios.post('/article/star',{
        article_id: that.article.article_id,
        user_id: that.$store.state.user.user_id
      }). then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.article.is_star = resp.data.is_star
          that.article.star_count = resp.data.star_count
        }else{
          that.$message({
            type: 'error',
            message: '收藏失败'
          })
        }
        that.star_loading = false
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '收藏失败'
        })
        that.star_loading = false
      })
    },
    editAuth(){
      let that = this
      that.$axios.post('/article/editAuth',{
        article_id: that.article.article_id,
        user_id: that.$store.state.user.user_id
      }). then(resp => {
        if (resp && resp.data && resp.data.code === 200) {
          that.article.is_public = resp.data.is_public
          that.$message({
            type: 'success',
            message: resp.data.is_public ? '发布成功': '取消发布成功'
          })
        }else{
          that.$message({
            type: 'error',
            message: '网络错误'
          })
        }
        that.dialogVisible = false
      }).catch(failResponse => {
        that.$message({
          type: 'error',
          message: '网络错误'
        })
        that.dialogVisible = false
      })
    },
    shareArticle () {
      let input = document.createElement("input")
      input.value = this.share_url
      let parent = document.getElementById("loading")
      parent.appendChild(input)
      input.select()
      document.execCommand("Copy")
      parent.removeChild(input);
      this.$message.success('已复制分享链接')
    }
  }
}
</script>

<style scoped>
  .editor{
    height: 0;
    display: none;
  }
  .clipboard{
    display: none;
  }
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
    max-width: 80%;
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
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
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
