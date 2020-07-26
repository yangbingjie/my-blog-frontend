<template>
  <div>
    Index!
    <el-button type="success" plain v-on:click="newArticle">新建文章</el-button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    newArticle () {
      this.$router.push({name: 'ArticleEditor', params: {article_id: 'create'}})
    }
  }
}
</script>

<style scoped>

</style>
