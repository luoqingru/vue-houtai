<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;" @click="showDialog">添加</el-button>
    <!-- :visible.sync控制对话框显示与隐藏
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- :model 把表单数据收集到对应的对象上 -->
      <el-form ref="ruleForm" style="width: 80%;" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action 设置图片上传的地址
               on-success可以检测图片上传成功
               before-upload 上传图片之前
        -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <!-- <el-input autocomplete="off" /> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
    <el-table style="width: 100%;" border :data="list">
      <!-- prop 对应列内容 -->
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      />
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
      >
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        label="操作"
        width="width"
      >
        <template slot-scope="{row}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- layout 设置分页器的布局 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3,5,10]"
      layout="prev, pager, next,jumper,->,sizes,total"
      style="text-align: center; margin-top: 20px;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      imgUrl: '',
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    // console.log(this.$API)
    this.getTradeMarkList()
  },
  methods: {
    async getTradeMarkList(pager = 1) {
      this.page = pager
      const result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit)
      console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(pager) {
      // console.log(pager)
      this.page = pager
      this.getTradeMarkList(pager)
    },
    // 随着展示条数改变来改变列表展示
    handleSizeChange(pagesize) {
      // console.log(pagesize)
      this.limit = pagesize
      this.getTradeMarkList(pagesize)
    },
    // 点击添加品牌按钮
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm.tmName = ''
      this.tmForm.logoUrl = ''
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true
      console.log(row)
      this.tmForm = { ...row }
    },
    // 上传图片相关
    handleAvatarSuccess(res, file) {
      // res是上传成功之后返回的前端数据
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    addOrUpdateTrademark() {
      // 当全部验证字段通过再写业务逻辑
      this.$refs.ruleForm.validate(async(success) => {
        console.log(success)
        if (success) {
          this.dialogFormVisible = false
          // 添加品牌
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (res.code === 200) {
            // 弹出一个添加成功信息或修改成功信息
            this.$message(
              {
                type: 'success',
                message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
              })

            // 成功之后再次展示
            this.getTradeMarkList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`确定要删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 用户点击确定按钮时触发
        const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTradeMarkList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
