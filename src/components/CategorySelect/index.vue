<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" value="" :disabled="show" @change="handler1">
          <el-option v-for="item1 in category1List" :key="item1.id" :label="item1.name" :value="item1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" value="" :disabled="show" @change="handler2">
          <el-option v-for="item2 in category2List" :key="item2.id" :label="item2.name" :value="item2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" value="" :disabled="show" @change="handler3">
          <el-option v-for="item3 in category3List" :key="item3.id" :label="item3.name" :value="item3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List()
      console.log(res)
      if (res.code === 200) {
        this.category1List = res.data
      }
    },
    // 一级分类的select事件回调 当一级分类的option发生变化时展示相应二级分类
    async handler1() {
      // 一级分类发生变化时 二三级及分类要先清空
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const res = await this.$API.attr.reqCategory2List(category1Id)
      // console.log(res)
      if (res.code === 200) {
        this.category2List = res.data
      }
    },
    async handler2() {
      // 二级分类发生变化时 三级分类要先清空
      this.category3List = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const res = await this.$API.attr.reqCategory3List(category2Id)
      console.log(res)
      if (res.code === 200) {
        this.category3List = res.data
      }
    },
    handler3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
