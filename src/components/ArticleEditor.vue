<template>
  <div class="editor-body">
    <el-input v-model="article.title" type="text" class="editor-title"
              placeholder="请输入标题" show-word-limit maxlength="20"></el-input>
    <el-input
      class="editor-title editor-textarea"
      type="textarea"
      placeholder="请输入描述"
      :autosize="{minRows: 3, maxRows: 3}"
      v-model="article.preview"
      maxlength="30"
      show-word-limit>
    </el-input>
    <el-row class="tag-list">
      <el-tag
        :key="tag.tag_name"
        v-for="(tag, index) in tag_list"
        closable
        :disable-transitions="false"
        :type="tagColors[index % tagColors.length]"
        @close="handleClose(tag.tag_name)">
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
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建标签</el-button>
    </el-row>
    <el-row class="mavon-editor">
      <mavon-editor
        v-model="article.content_markdown"
        @imgAdd="$imgAdd"
        class="editor"
        ref=md
        :toolbars="toolbar"
        fontSize="16px">
        <button type="button" class="third-save iconfont op-icon" id="icon-save" :title="'保存'" slot="right-toolbar-before"
                @click="saveArticle">
          <span class="icon-text">保存</span>
        </button>
        <button type="button" class="third-publish iconfont op-icon" id="icon-publish" :title="'发布'" slot="right-toolbar-before"
                @click="publishArticle">
          <span class="icon-text">发布</span>
        </button>
      </mavon-editor>
    </el-row>
  </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'ArticleEditor',
  data () {
    return {
      article: {
        article_id: null,
        title: '',
        preview: '',
        content_html: '',
        content_markdown: '',
        is_public: false,
        img_folder: 'null',
      },
      tag_list: [],
      inputVisible: false,
      inputValue: '',
      tagColors: ['warning', 'info', 'success', 'danger', ''],
      toolbar: { bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      imgFile: {}
    }
  },
  mounted () {
    this.loadArticle()
    this.$refs.md.$refs.toolbar_left.imgFile = []
  },
  methods: {
    loadArticle () {
      let that = this
      if (that.$route.params.article_id !== 'create') {
        that.$axios.post('/article/getArticleById', {
          article_id: that.$route.params.article_id,
          user_id: that.$store.state.user.user_id
        }).then(resp => {
          if (resp && resp.data && resp.data.code === 200) {
            that.article = resp.data.article
            that.tag_list = resp.data.article.tag_list
            that.article.article_id = that.$route.params.article_id
          }
        })
      }
    },
    saveArticle (value, render) {
      if (this.article.title !== '') {
        this.$confirm('是否仅保存文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendRequest(value, render, false)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存'
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: '标题不能为空'
        })
      }
    },
    publishArticle (value, render) {
      this.$confirm('是否发布文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendRequest(value, render, true)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消发布'
        })
      })
    },
    sendRequest: function (value, render, isPublic = false) {
      value = this.$refs.md.d_value
      this.article.content_markdown = value
      render = this.$refs.md.d_render
      this.article.content_html = render
      let that = this

      let img_list = []
      console.log(that.article != null)
      let cover = ""
      if (that.article != null && that.article.img_folder != null && that.article.img_folder !== "null") {
        let match_list = value.match(/!\[(.)*\]\(http(\w|\/|:|\.)*(\w)*\.(jpg|png)\)/g)
        console.log("match_list", match_list)
        cover = match_list[0].match(/http(.)*\.(jpg|png)/)[0]
        console.log("cover", cover)
        for (let i = 0; match_list != null && i < match_list.length; ++i) {
          if (match_list[i].indexOf(that.article.img_folder) !== -1) {
            let str = match_list[i].match(/\/(\w)*\.(jpg|png)/)[0]
            img_list.push(str.substr(1))
          }
        }
      }
      console.log("img_list", img_list)
      that.$axios
        .post('/article/save', {
          article_id: that.article.article_id,
          author_id: that.$store.state.user.user_id,
          title: that.article.title,
          tag_list: that.tag_list,
          content_markdown: value,
          content_html: render,
          is_public: isPublic,
          preview: that.article.preview,
          img_folder: that.article.img_folder,
          cover: cover,
          img_list: img_list
        }).then(res => {
        if (res && res.data && res.data.code === 200) {
          that.$message({
            type: 'success',
            message: (isPublic ? '发布' : '保存') + '成功'
          })
          that.$router.push({name: 'ArticleDetails', params: {article_id: res.data.article_id}})
        } else {
          that.$message({
            type: 'error',
            message: (isPublic ? '发布' : '保存') + '失败'
          })
        }
      })
        .catch(failResponse => {
          this.$message({
            type: 'error',
            message: (isPublic ? '发布' : '保存') + '失败'
          })
        })
    },
    handleClose (tag_name) {
      this.tag_list.splice(this.findTagIndex(tag_name), 1)
    },
    findTagIndex(tag_name){
      if (this.article && this.tag_list){
        for (let i = 0; i < this.tag_list.length; i++) {
          if (this.tag_list[i].tag_name === tag_name){
            return i
          }
        }
      }
      return -1
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      inputValue = inputValue.trim()
      if(inputValue.length > 10){
        this.$message.error('标签长度不能超过10')
        this.inputVisible = true
        return
      }
      if (this.findTagIndex(inputValue) !== -1){
        this.$message.error('该标签已存在')
        this.inputVisible = true
        return
      }
      if (inputValue) {
        if(this.tag_list == null){
          this.tag_list = []
        }
        this.tag_list.push({
          tag_name: inputValue,
          tag_id: null
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    checkImg (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('图片只能是 jpg 或 png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    $imgAdd (pos, $file) {
      if (!this.checkImg($file)){
        this.$refs.md.$refs.toolbar_left.$imgDel(pos)
        return
      }
      let formdata = new FormData()
      let that = this
      formdata.append('image', $file)
      that.$axios({
        url: 'file/uploadArticleImg?folder=' + that.article.img_folder,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res && res.data && res.data.code === 200) {
          that.$refs.md.$img2Url(pos, res.data.url)
          that.article.img_folder = res.data.folder
          const result = res.data
          const url = res.data.url
          that.imgFile[url] = result
          that.$message({
            type: 'success',
            message: '图片上传成功'
          })
        } else {
          that.$message({
            type: 'error',
            message: '图片上传失败'
          })
          that.$refs.editor.$refs.toolbar_left.$imgDel(pos)
        }
      })
    }
  }
}
</script>

<style scoped>
  .editor-body {
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  .el-tag {
    margin: 10px;
  }
  .editor{
    height: 100%;
  }

  .button-new-tag {
    margin: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin: 10px;
    vertical-align: bottom;
  }

  .tag-list {
    margin: 20px 0;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
  }
  .editor-title{
    margin-left: 10px;
    max-width: 600px;
    min-width: 320px;
  }
  .editor-title >>> input {
    border: none;
    border-bottom: 1px solid #DCDFE6;
    border-radius: 0;
    margin-right: 20px;
  }
  .mavon-editor{
    height: calc(100vh - 20px);
    margin-left: 10px;
  }
  #icon-publish{
    width: 57px;
    margin-right: 20px;
  }
  #icon-save{
    width: 57px;
  }
  .icon-text{
    padding-left: 3px;
  }
  .editor-textarea{
    margin-top: 20px;
  }
  .editor-textarea >>> textarea {
    border: 1px dashed #DCDFE6;
    border-radius: 0;
    margin-right: 20px;
  }
  .editor-body >>> .dropdown-images{
    display: none;
  }
</style>
