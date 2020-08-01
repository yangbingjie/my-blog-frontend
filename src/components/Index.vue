<template>
  <div class="index">
<!--    <el-button type="success" plain v-on:click="newArticle">新建文章</el-button>-->
    <el-input placeholder="搜索文章" v-model="keyWord" @change="search" class="input-with-select">
      <el-select v-model="search_type" slot="prepend">
        <el-option label="所有" value="1"></el-option>
        <el-option label="标题" value="2"></el-option>
        <el-option label="作者" value="3"></el-option>
      </el-select>
      <i slot="suffix" class="iconfont third-search search-btn" v-on:click="search"></i>
    </el-input>
    <div class="tag-list">
      <el-tag
        class="tag-item"
        :key="tag.tag_name"
        v-for="(tag, index) in all_tag_list"
        :disable-transitions="false"
        :effect="tag.type"
        v-on:click="chooseTag(index)"
        :type="tagColors[index % tagColors.length]">
        {{tag.tag_name}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
    </div>
    <div class="container">
      <div id="macy-container">
        <div macy-complete="1" v-on:click="toArticle(article.article_id, $event)" class="article-item" v-for="(article, index) in article_list">
          <img :src="article.cover !== '' ? article.cover : '../static/default_cover.jpg'" alt="" class="article-img">
          <div class="author-container">
            <div class="author">
              <el-avatar class="author-avatar" :src="article.author_avatar" :size="28"></el-avatar>
              <span>{{article.author_name}} 更新于：{{article.update_time}}</span>
            </div>
          </div>
          <div class="article-text">
            <h2 class="article-title">{{article.title}}</h2>
            <p class="article-preview">{{article.preview}}</p>
              <div class="btn-list">
                <el-button class="view-count" type="info" plain >
                  <span class="iconfont el-icon-view"></span>
                  <span class="btn-text">{{article.view_count}}</span>
                </el-button>
                <el-button class="btn-icon" type="info" plain v-on:click="likeArticle(article.article_id, index, $event)"
                           :loading="article.like_loading" >
            <span :class="article.is_like ? 'iconfont third-appreciatefill' : 'iconfont third-appreciate'">
              <span class="btn-text">{{article.like_count}}</span>
            </span>
                </el-button>
                <el-button class="btn-icon" type="info" plain v-on:click="starArticle(article.article_id, index, $event)"
                           :loading="article.star_loading">
                  <span :class="article.is_star ? 'iconfont third-favorfill': 'iconfont third-favor'"></span>
                  <span class="btn-text">{{article.star_count}}</span>
                </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data () {
      return {
        macy: {},
        inputVisible: false,
        search_type: "所有",
        inputValue: '',
        keyWord: "",
        leftInd: 1,
        rightInd: 2,
        all_tag_list: [],
        tagColors: ['warning', 'info', 'success', 'danger', ''],
        article_list: []
      }
    },
    mounted () {
      this.macy = Macy({
        container: '#macy-container',
        trueOrder: false,
        waitForImages: false,
        margin: 20,
        columns: 4,
        breakAt: {
          1024: 4,
          800: 3,
          600: 2,
          450: 1
        }
      });
    },
    methods: {
      toArticle: function(article_id, $event){
        this.$router.push({name: 'ArticleDetails', params: {article_id: article_id}})
      },
      likeArticle: function(article_id, index, event){
        if(event) {
          event.stopPropagation ? event.stopPropagation(): event.cancelBubble = true;
        }
        let that = this
        that.article_list[index].like_loading = true
        that.$axios.post('/article/like',{
          article_id: article_id,
          user_id: that.$store.state.user.user_id
        }). then(resp => {
          if (resp && resp.data && resp.data.code === 200) {
            that.article_list[index].is_like = resp.data.is_like
            that.article_list[index].like_count = resp.data.like_count
          }else{
            that.$message({
              type: 'error',
              message: '点赞失败'
            })
          }
          that.article_list[index].like_loading = false
        }).catch(failResponse => {
          that.$message({
            type: 'error',
            message: '点赞失败'
          })
          that.article_list[index].like_loading = false
        })
      },
      starArticle(article_id, index, event){
        if(event) {
          event.stopPropagation ? event.stopPropagation(): event.cancelBubble = true;
        }
        let that = this
        that.article_list[index].star_loading = true
        that.$axios.post('/article/star',{
          article_id: article_id,
          user_id: that.$store.state.user.user_id
        }). then(resp => {
          if (resp && resp.data && resp.data.code === 200) {
            that.article_list[index].is_star = resp.data.is_star
            that.article_list[index].star_count = resp.data.star_count
          }else{
            that.$message({
              type: 'error',
              message: '收藏失败'
            })
          }
          that.article_list[index].star_loading = false
        }).catch(failResponse => {
          that.$message({
            type: 'error',
            message: '收藏失败'
          })
          that.article_list[index].star_loading = false
        })
      },
      numFormat (num) {
        if (num >= 100000) {
          return '10w+'
        } else if (num >= 10000) {
          num = num / 10000
          num.toFixed(1)
          return num + 'w'
        } else if (num >= 1000) {
          num = num / 1000
          num.toFixed(1)
          return num + 'k'
        } else {
          return num
        }
      },
      getSearchType (search_name) {
        if (search_name === '所有'){
          return 'all'
        }else if(search_name === '标题'){
          return 'title'
        }else if(search_name === '作者'){
          return 'author_name'
        }
      },
      search (){
        let that = this
        that.article_loading = true
        that.$axios.post('/article/search', {
          user_id: that.$store.state.user.user_id,
          search_type: 'all',
          query: that.keyWord
        }).then(resp => {
          if (resp && resp.data && resp.data.code === 200) {
            that.article_list = resp.data.article_list
            that.all_tag_list = resp.data.all_tag_list
            for (let i = 0; i < that.all_tag_list.length; i++) {
              that.all_tag_list[i]['type'] = 'plain'
            }
            for (let i = 0; i < that.article_list.length; i++) {
              that.article_list[i].star_loading = false
              that.article_list[i].like_loading = false
              that.article_list[i].view_count = that.numFormat(resp.data.article_list[i].view_count)
              that.article_list[i].star_count = that.numFormat(resp.data.article_list[i].star_count)
              that.article_list[i].like_count = that.numFormat(resp.data.article_list[i].like_count)
            }
          }
          that.macy.recalculate();
          that.macy.runOnImageLoad();
          that.article_loading = false
        }).catch(failResponse => {
          that.$message({
            type: 'error',
            message: '网络错误'
          })
          that.article_loading = false
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          inputValue = inputValue.toLowerCase()
          this.all_tag_list.push({
            type: 'plain',
            tag_name: inputValue
          })
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      newArticle () {
        this.$router.push({name: 'ArticleEditor', params: {article_id: 'create'}})
      },
      chooseTag (index){
        let tag = this.all_tag_list[index]
        if (tag.type === 'plain'){
          tag.type = 'light'
          this.all_tag_list.splice(index, 1)
          this.all_tag_list.splice(this.leftInd + 1, 0, tag)
          this.leftInd++
          this.rightInd++
        }else{
          tag.type = 'plain'
          this.all_tag_list.splice(index, 1)
          this.all_tag_list.splice(this.rightInd - 1, 0, tag)
          this.leftInd--
          this.rightInd--
        }
      }
    },
  }
</script>

<style scoped>
  .input-with-select >>> .el-input__suffix{
    right: 1px;
  }
  .input-with-select >>> .el-input__suffix-inner{
    padding: 11px 15px;
  }
  .index{
    padding: 50px;
  }
  .el-button {
     margin-left: 0;
  }
  .article-item{
    width: calc((100% - 160px) / 4);
    cursor: default;
    display: flex;
    text-align: left;
    align-items: flex-start;
    flex-direction: column;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,.1);
    box-shadow: 0 0.333333333333333rem 0.833333333333333rem 0 rgba(0,0,0,.1);
  }
  .img-shadow{
    width: 100%;
    border: 1px solid chartreuse;
    background: linear-gradient(180deg,transparent,rgba(0,0,0,.6));
  }
  .article-img{
    width: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .article-text{
    width: 95%;
    padding: 10px;
  }
  .article-title{
    width: 100%;
    overflow: hidden;
    margin: 10px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .article-preview{
    margin: 3px 0;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
  }
  .author-container{
    position: relative;
    width: 100%;
  }
  .author{
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 15px;
    display: flex;
    align-items: center;
    color: white;
    background: linear-gradient(180deg,transparent,rgba(0,0,0,.9));
  }
  .author-avatar{
    margin: 20px 10px 20px 20px;
    border: 1px solid white;
  }
  .btn-text {
    font-size: 13px;
    font-weight: normal;
    margin-left: 0;
  }
  .btn-icon{
    color: #606266;
    background: none;
    border: none;
    padding: 5px;
  }
  .btn-list{
    display: flex;
    justify-content: right;
  }

  .btn-icon:hover {
    background: #c6c6c6;
  }

  .el-select {
    width: 90px;
  }
  .input-with-select{
    height: 50px;
    font-size: 18px;
  }
  .input-with-select>>>.el-input__inner{
    height: 50px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    background-color: rgba(43, 43, 43, 0.05);
  }
  .el-input-group__prepend >>> .el-input__inner:focus{
    outline: none;
    border: none;
    background-color: white;
  }
  .input-with-select >>> .el-input-group__prepend+.el-input__inner:focus{
    border-color: #C0C4CC;
    background-color: white;
  }
  .el-select >>> .el-input__inner{
    background-color: rgba(43, 43, 43, 0.05);
  }

  .input-with-select >>>.el-input-group__prepend{
    background-color: rgba(43, 43, 43, 0.05);
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }
  .input-with-select >>>.el-input__suffix{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tag-list {
    margin: 20px 20px 20px 90px;
    display: flex;
    justify-content: left;
  }
  .tag-list >>> .el-tag{
    font-size: 16px;
  }
  .tag-item {
    margin-right: 10px;
    cursor: default;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    font-size: 16px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .view-count{
    color: #606266;
    background: none;
    border: none;
    padding: 5px;
  }
  .view-count:hover{
    background: none;
    color: #606266;
    cursor: default;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
