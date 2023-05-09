<template>
  <div>
    <el-card>
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table border style="width: 100%" :data="attrInfoList">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="date" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="item in row.attrValueList" :key="item.id" type="success" style="margin: 0 20px;">{{ item .valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form label-width="80px" :inline="true" :model="data">
          <el-form-item label="属性名">
            <el-input v-model="data.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!data.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button>取消</el-button>
        <el-table border style="width: 100%;margin: 20px 0;" :data="data.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80px" />
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定要删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="data.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrInfoList: [],
      isShowTable: true,
      data: {
        attrName: '',
        // 属性值
        attrValueList: [],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3
      }
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      // console.log(id)
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取商品
        this.getAttrList()
      }
    },
    async getAttrList() {
      const res = await this.$API.attr.reqAttrInfoList(this.category1Id, this.category2Id, this.category3Id)
      // console.log(res)
      if (res.code === 200) {
        this.attrInfoList = res.data
      }
    },
    addAttrValue() {
      // 像属性值的数组里添加元素
      this.data.attrValueList.push({
        attrId: this.data.id,
        valueName: '',
        // flag 给每个属性值添加一个标记flag 用户切换编辑模式与查看模式
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.data.attrValueList.length - 1].focus()
      })
    },
    // 添加属性
    addAttr() {
      this.isShowTable = false
      this.data = {
        attrName: '',
        // 属性值
        attrValueList: [],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3
      }
    },
    // 修改某个属性
    updateAttr(row) {
      this.isShowTable = false
      // 深拷贝 对象里面又有数组 数组里面又有对象 所以用深拷贝
      this.data = cloneDeep(row)
      this.data.attrValueList.forEach(item => {
        // 添加一个响应式属性 第一个参数是对象  第二个参数是 添加的新的响应式属性 第三个参数：对应的值
        this.$set(item, 'flag', false)
      })
    },
    toLook(row) {
      // row是当前用户添加的最新的属性值
      if (row.valueName.trim() === '') {
        this.$message('请输入正常的属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      const isRepeat = this.data.attrValueList.some(item => {
        // 把自己除去与剩下的比较是否重复
        if (row !== item) {
          return item.valueName === row.valueName
        }
      })
      if (isRepeat) return
      row.flag = false
    },
    // 点击span的回调 变为编辑模式
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 旗袍确认框的确认按钮的回调
    deleteAttrValue(index) {
      // alert(111)
      this.data.attrValueList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateAttr() {
      this.data.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        const res = await this.$API.attr.reqSaveAttrInfo(this.data)
        console.log(res)
        this.$message({ type: 'success', message: '保存成功' })
        this.isShowTable = true
        this.getAttrList()
      } catch (error) {
        alert(error.message)
      }
    }
  }
}
</script>

<style>

</style>
