<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12">

        <Search />

      </el-col>
      <el-col :span="12">
        <Category />

      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './search/index.vue'
import Category from './category/index.vue'
export default {
  components: {
    Search,
    Category
  }
}
</script>

<style>

</style>
