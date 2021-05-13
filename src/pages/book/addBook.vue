<template>
  <div>
    <div class="container-title">
      <h2>{{bookId?'修改图书':'新增图书'}}</h2>
    </div>
    <div class="container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
      >
        <el-form-item label="图书类型">
          <el-radio
            v-model="ruleForm.bookType"
            :label="0"
          >实体图书</el-radio>
        </el-form-item>
        <el-form-item
          label="图书名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否为图书套餐">
          <el-radio-group v-model="ruleForm.isCombo">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="关联图书"
          v-if="ruleForm.isCombo === 1"
        >
          <div class="banner">
            <div
              class="imgContainer"
              v-for="(item,index) in related"
              :key="index"
            >
              <img :src="item.bookCover">
              <i
                @click="deleteRelated(index)"
                class="el-icon-delete"
              ></i>
            </div>

            <div class="addCombo">
              <i
                class="el-icon-plus"
                @click="showDialog"
              ></i>
            </div>
          </div>

        </el-form-item>
        <el-form-item label="适用考试类型及科目">
          <div class="categoryAndSujectList">
            <div
              class="categoryAndSujectItem"
              v-for="(item, index) in ruleForm.categoryAndSuject"
              :key="index"
            >
              <el-select
                v-model="item.categoryId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in categoryData"
                  :key="item.CategoryId"
                  :disabled="categoryDisabled(item.CategoryId)"
                  :label="item.CategoryName"
                  :value="item.CategoryId"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="item.subjectId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in subjectData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <i
                v-if="index===0"
                class="el-icon-plus"
                @click="addSubject"
              ></i>
              <i
                v-else
                class="el-icon-minus"
                @click="subSubject(index)"
              ></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图书封面">
          <div class="imgWrapper">
            <draggable
              v-model="ruleForm.imageUrl"
              draggable=".item"
              class="draggable"
            >
              <div
                class="item"
                v-for="(url,index) in ruleForm.imageUrl"
                :key="url"
              >
                <img
                  :src="url"
                  class="itemUrl"
                >
                <i
                  @click="deleteFn(index)"
                  class="el-icon-delete"
                ></i>
                <span
                  class="download"
                  @click="download(url)"
                >下载原图</span>
              </div>
            </draggable>
            <el-upload
              class="avatar-uploader"
              name="image"
              list-type="picture-card"
              :action="imgUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <p>上传图片的最佳尺寸：800像素*800像素，其他尺寸会影响页效果。<br>
            格式png，jpeg，jpg，gif。大小不超过2M，图书图片一共可以上传5张，默认第一张为主图封面。拖拽可调整图片顺序。</p>
        </el-form-item>
        <el-form-item label="图书参数">
        </el-form-item>
        <div class="wrapper">
          <el-form-item label="图书售价">
            <div class="inputWrapper">
              <el-input
                v-model="ruleForm.price"
                placeholder="请输入内容"
              ></el-input>元
            </div>
          </el-form-item>
          <el-form-item label="图书原价">
            <div class="inputWrapper">
              <el-input
                v-model="ruleForm.originalPrice"
                placeholder="请输入内容"
              ></el-input>元
            </div>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input
              v-model="ruleForm.press"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="书号或自编码">
            <el-input
              v-model="ruleForm.bookNum"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="总页数">
            <div class="inputWrapper">
              <el-input
                :disabled="ruleForm.isCombo===1"
                v-model="ruleForm.pageNum"
                placeholder="请输入内容"
              ></el-input>页
            </div>
          </el-form-item>
          <el-form-item label="重量">
            <div class="inputWrapper">
              <el-input
                disabled
                v-model="ruleForm.kg"
                placeholder="请输入内容"
              ></el-input>kg
            </div>
          </el-form-item>
          <el-form-item label="图书印张">
            <div class="inputWrapper">
              <el-input
                v-model="ruleForm.sheet"
                placeholder="请输入内容"
              ></el-input>张
            </div>
          </el-form-item>
          <el-form-item label="单本书成本">
            <div class="inputWrapper">
              <el-input
                disabled
                v-model="ruleForm.bookCost"
                placeholder="请输入内容"
              ></el-input>元
            </div>
          </el-form-item>
        </div>
        <el-form-item label="内容简介">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <combo-dialog
      ref="dialog"
      :status="status"
      @selectTabel="selectTabel"
    ></combo-dialog>
  </div>
</template>

<script>
  import {
    getCategroy,
    getCostPerSheet,
    addBook,
    bookDetail
  } from '@/api/bookApi'
  import { getParams } from '@/config/utils'
  import E from 'wangeditor'
  import draggable from 'vuedraggable'
  import comboDialog from './components/comboDialog'
  export default {
    data() {
      return {
        ruleForm: {
          bookType: 0, //图书类型
          name: '', //图书名称
          isCombo: 0, //是否为套餐
          categoryAndSuject: [
            {
              categoryId: '',
              subjectId: ''
            }
          ], //适用考试类型及科目
          imageUrl: [], //图书封面
          price: '', //图书售价
          originalPrice: '', //图书原价
          press: '', //出版社
          bookNum: '', //书号或自编码
          pageNum: '', //总页数
          kg: '', //重量
          sheet: '', //图书印张
          bookCost: '', //单本书成本
          desc: '' //内容简介
        },
        creatorName: this.$route.query.username, //创建人用户
        bookId: this.$route.query.id, //图书id
        related: [], //关联图书数据
        status: null, //是否上线
        subjectData: [
          {
            value: 1,
            label: '笔试'
          },
          {
            value: 2,
            label: '面试'
          },
          {
            value: 3,
            label: '纯图书',
            disabled: true
          },
          {
            value: 4,
            label: '综合',
            disabled: true
          }
        ],
        categoryData: [],
        editor: null,
        imgUpload: `${PHP_URL}/v4/blue/class/upload`, //图片上传服务器地址
        costPerSheet: '', //每印张成本
        rules: {
          name: [
            { required: true, message: '请输入图书名称', trigger: 'blur' },
            { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.editor = new E('#editor')
      this.editor.customConfig.uploadImgServer = this.imgUpload //图片上传地址
      this.editor.create()
      getCategroy()
        .then(res => {
          this.categoryData = res
          if (this.bookId) {
            bookDetail({
              bookId: this.bookId
            })
              .then(res => {
                this.ruleForm.bookType = res.data.bookType
                this.ruleForm.name = res.data.bookName
                this.ruleForm.isCombo = res.data.isSuit
                this.ruleForm.categoryAndSuject =
                  res.data.categoryIdsSubjects !== ''
                    ? JSON.parse(res.data.categoryIdsSubjects)
                    : [
                        {
                          categoryId: '',
                          subjectId: ''
                        }
                      ]
                this.ruleForm.imageUrl = res.data.bookCover || []
                this.ruleForm.price = res.data.actualPrice
                this.ruleForm.originalPrice = res.data.price
                this.ruleForm.press = res.data.press
                this.ruleForm.bookNum = res.data.bookNum
                this.ruleForm.pageNum = res.data.totalPage
                this.ruleForm.kg = res.data.weight
                this.ruleForm.sheet = res.data.bookPrint
                this.ruleForm.bookCost = res.data.singleCost
                this.ruleForm.desc = res.data.summary
                this.related = res.data.related
                this.status = res.data.status
                this.editor.txt.html(this.ruleForm.desc)
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
      getCostPerSheet()
        .then(res => {
          this.costPerSheet = res.data.costPerSheet
        })
        .catch(err => {
          console.log(err)
        })
    },
    watch: {
      'ruleForm.pageNum'(val) {
        this.ruleForm.kg = ((Number(val) / 2) * 0.0039 + 0.04).toFixed(2)
      },
      'ruleForm.sheet'(val) {
        this.ruleForm.bookCost = (val * this.costPerSheet).toFixed(2)
      }
    },
    components: {
      draggable,
      comboDialog
    },
    methods: {
      // 关联图书返回数据
      selectTabel(val) {
        let selected = [...val, ...this.related]
        let ret = []
        let arr = []
        selected.forEach(item => {
          arr[item.id] ? '' : (arr[item.id] = true && ret.push(item))
        })
        this.ruleForm.pageNum = ret.reduce((prev, next) => {
          return prev + next.totalPage
        }, 0)
        this.ruleForm.price = ret.reduce((prev, next) => {
          return prev + Number(next.price)
        }, 0)
        this.ruleForm.sheet = ret
          .reduce((prev, next) => {
            return prev + Number(next.bookPrint)
          }, 0)
          .toFixed(3)
        this.related = ret
      },
      // 已选科目禁止再次选择
      categoryDisabled(id) {
        const selectedData = this.ruleForm.categoryAndSuject
        if (!selectedData.length) {
          return false
        }
        return selectedData.findIndex(item => item.categoryId === id) > -1
      },
      showDialog() {
        this.$refs.dialog.show()
      },
      // 添加适用考试类型及科目
      addSubject() {
        this.ruleForm.categoryAndSuject.push({
          categoryId: '',
          subjectId: ''
        })
      },
      // 减少适用考试类型及科目
      subSubject(i) {
        this.ruleForm.categoryAndSuject.splice(i, 1)
      },
      // 添加或者更新图书
      updateBookFn() {
        let categoryAndSuject = []
        let relatedId = []
        this.ruleForm.categoryAndSuject.forEach(item => {
          if (item.categoryId !== '' && item.subjectId !== '') {
            categoryAndSuject.push(item)
          }
        })
        this.related.forEach(item => {
          relatedId.push(item.id)
        })
        console.log(this.ruleForm.sheet)

        addBook({
          id: this.bookId,
          actualPrice: this.ruleForm.price,
          bookCover: this.ruleForm.imageUrl.join(','),
          bookName: this.ruleForm.name,
          bookNo: this.ruleForm.bookNum,
          bookPrint: Number(this.ruleForm.sheet).toFixed(3),
          bookType: this.ruleForm.bookType,
          categoryIdsSubjects: categoryAndSuject,
          creatorName: this.creatorName,
          isSuit: this.ruleForm.isCombo,
          press: this.ruleForm.press,
          price: this.ruleForm.originalPrice,
          relatedId: this.ruleForm.isCombo ? relatedId.join(',') : '',
          singleCost: this.ruleForm.bookCost,
          summary: this.ruleForm.desc,
          totalPage: this.ruleForm.pageNum,
          weight: this.ruleForm.kg
        })
          .then(res => {
            if (res.code === 10000) {
              if (!this.bookId) {
                this.$message.success('添加成功')
              } else {
                this.$message.success('修改成功')
              }
              setTimeout(() => {
                this.$router.replace('/bookList')
              }, 2000)
            } else {
              this.$notify({
                message: res.msg,
                position: 'top-left'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 删除封面
      deleteFn(i) {
        this.$confirm('确认删除？')
          .then(_ => {
            this.ruleForm.imageUrl.splice(i, 1)
          })
          .catch(_ => {})
      },
      //删除关联图书
      deleteRelated(i) {
        this.$confirm('确认删除？')
          .then(_ => {
            this.ruleForm.pageNum =
              this.ruleForm.pageNum - this.related[i].totalPage
            this.related.splice(i, 1)
          })
          .catch(_ => {})
      },
      // 下载原图
      download(url) {
        window.open(url)
      },
      handleAvatarSuccess(res) {
        this.ruleForm.imageUrl.push(res.data.src)
      },
      beforeAvatarUpload(file) {
        if (this.ruleForm.imageUrl.length === 5) {
          this.$message.warning('最多只能上传5张图片')
          return false
        }
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isGIF = file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG && !isPNG && !isGIF) {
          this.$message.error('上传图片只能是 png，jpeg，jpg，gif 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return (isJPG || isPNG || isGIF) && isLt2M
      },
      submitForm(formName) {
        this.ruleForm.desc = this.editor.txt.html()

        this.$refs[formName].validate(valid => {
          if (valid) {
            this.updateBookFn()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .inputWrapper {
    display: flex;
    .el-input {
      margin-right: 5px;
    }
  }
  .categoryAndSujectList {
    float: left;
    margin-right: 20px;
  }
  .categoryAndSujectItem {
    margin-bottom: 10px;
    i {
      margin-left: 20px;
    }
  }
  .el-form {
    margin: 0 auto;
    width: 1000px;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .imgWrapper {
    display: flex;
  }
  .draggable {
    display: flex;
    margin-right: 5px;
    .item {
      background-color: #fbfdff;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      position: relative;
      cursor: pointer;
      line-height: 146px;
      vertical-align: top;
      margin-left: 5px;
      .download {
        line-height: 2;
        text-align: center;
        display: block;
        width: 100%;
        color: #3399ff;
      }
      img {
        display: block;
        width: 148px;
        height: 148px;
      }
      i {
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 5px;
        color: #ff3333;
        display: inline-block;
      }
    }
  }
  .imgContainer {
    position: relative;
    i {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 5px;
      color: #ff3333;
      display: inline-block;
    }
  }
  .banner {
    display: flex;
    flex-wrap: wrap;
    img {
      display: inline-block;
      width: 148px;
      height: 148px;
      border: 1px solid #000;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .addCombo {
    margin-top: 10px;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    text-align: center;
    i {
      font-size: 28px;
      color: #8c939d;
    }
  }
</style>