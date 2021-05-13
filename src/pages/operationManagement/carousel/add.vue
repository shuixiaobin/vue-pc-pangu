<template>
  <div class="carousel-add">
    <div class="title">
      <span>{{ (addFlag == 0 ? "添加" : "修改") + "轮播广告" }}</span>
      <span>{{ addFlag == 0 ? `(${cateName})` : "" }}</span>
    </div>
    <div class="carousel-form">
      <el-form
        :model="form"
        :rules="formRules"
        ref="form"
        label-width="100px"
        class="demo-form"
      >
        <el-form-item label="排序" prop="sort">
          <el-input-number style="width:200px" :min="1" v-model.number="form.sort" placeholder="请输入排列序号，升序排列"></el-input-number>
        </el-form-item>
        <el-form-item label="活动链接" prop="activeUrl">
          <el-input v-model="form.activeUrl" placeholder="请如示例填写：/z/14411ssy/"></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="ImgUrl">
          <el-input v-model="form.ImgUrl" placeholder="请如示例填写：http://p.htwx.net/z/1505Imjgj/680x260.jpg"></el-input>
        </el-form-item>
        <el-form-item label="文字描述" prop="decribe">
          <el-input v-model="form.decribe" maxlength="100" placeholder="请输入带关键字的描述，方便搜索引擎抓取"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')"
            >保存</el-button
          >
          <el-button @click="resetForm('form')">清空</el-button>
        </el-form-item>
      </el-form>
      <div class="img-preview" v-if="form.ImgUrl">
        <img :src="form.ImgUrl" alt="图片预览" @error="imgErr" @load="imgLoad">
      </div>
    </div>
  </div>
</template>

<script>
import * as operationManagement from "../../../api/operationManagement";
export default {
  name: "carouselAdd",
  data() {
    return {
      id: 0,
      addFlag: 0,
      cateId: '',
      cateName: "",
      form: {
        sort: undefined,
        activeUrl: '',
        ImgUrl: '',
        decribe: ''
      },
      formRules: {
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        activeUrl: [{ required: true, message: '请输入活动链接', trigger: 'blur' }],
        ImgUrl: [{ required: true, message: '请输入图片链接', trigger: 'blur' }],
        decribe: [{ required: true, message: '请输入文字描述', trigger: 'blur' }],
      },
      imgerrFlag: false
    };
  },
  created() {
    const { id, addFlag, cateName, cateId } = this.$route.query;
    this.id = id;
    this.cateId = cateId
    this.addFlag = addFlag;
    this.cateName = cateName;
    if (addFlag == 1) {
      // 修改
      this.title = "修改轮播广告";
      // 调用详情接口
      this.getCarouselInfo()
    } else {
      this.title = `添加轮播广告`;
    }
  },
  methods: {
    async getCarouselInfo() {
       try {
        const res = await operationManagement.getCarouselInfo({id: this.id})
        this.form = res.data
      } catch (error) {
        console.log(error);
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.imgerrFlag) {
            this.$message.error('图片地址无效')
            return
          }
          let params = {
            cateId: this.cateId,
            sort: this.form.sort,
            activeUrl: this.form.activeUrl,
            imgUrl: this.form.ImgUrl,
            decribe: this.form.decribe
          }
          if (this.addFlag == 1) {
            params.id = this.form.id
          }
          operationManagement.addOrUpdateCarousel({...params}).then(res => {
            if (res.code === 10000) {
              this.$message.success(`${this.addFlag == 0 ? '添加' : '修改' }成功`)
              this.$router.push({
                path: '/operationManagement/carouselList'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    imgErr() {
      this.imgerrFlag = true
    },
    imgLoad() {
      this.imgerrFlag = false
    }
  }
};
</script>

<style scoped lang="less">
.carousel-add {
  .carousel-form {
    padding-bottom: 40px;
  }
  .title {
    padding: 10px 0;
    margin-bottom: 20px;
    background: #fff;
    font-weight: 600;
    span:nth-child(1) {
      font-size: 32px;
    }
    span:nth-child(2) {
      font-size: 20px;
    }
  }
  .img-preview {
    height: 260px;
    text-align: center;
    img {
      height: 100%;
      width: auto;
    }
  }
}
</style>