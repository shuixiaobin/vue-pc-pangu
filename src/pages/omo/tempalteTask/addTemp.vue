<template>
  <el-dialog :title="title"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose">
    <el-form ref="form"
      :model="form"
      label-width="100px">
      <el-form-item label="模板标题">
        <el-input placeholder="请输入模板标题"
          :maxlength="20" style="margin-left: 30px;width:80%"
          v-model="form.title" />
      </el-form-item>
      <el-form-item label="考试类型">
        <el-checkbox-group v-model="form.categoryId"  style="line-height: 20px;">
          <el-checkbox v-for="cate in categoryList" :key="cate.id" class="setItem"
             :label="cate.categoryId">{{cate.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="适用地区" >
        <el-checkbox-group  v-model="form.areaId" style="line-height: 20px;">
          <el-checkbox v-for="area in areaList" :key="Number(area.ProvinceId)" class="setItem"
             :label="Number(area.ProvinceId)">{{area.Province}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-radio-group v-model="form.templateType" style="margin-left: 30px;">
          <el-radio :label="0">开课前</el-radio>
          <el-radio :label="1">开课后</el-radio>
        </el-radio-group>
        <p style="margin-left: 30px;"><span style="color: red;">*</span>开课前作业从报名到开课期间推送，开课后作业从开课到结课期间推送</p>
      </el-form-item>

    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="saveData">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
  /**
   * 华图第三区委提醒您
   * 代码千万行, 注释第一行,
   * 编码不规范, 同事两行泪.
   */
  import Um from '@/components/um'
  import { saveTemplate, taskOperate } from '@/api/omoApi'
  import Util, { assert } from '@/common/util'
  function formInitVal() {
    return {
      title:'',
      categoryId:[],
      areaId:[],
      templateType:1
    }
  }
  export default {
    props: ['courseId','areaList','categoryList'],
    computed: {
      title() {
        if (this.id) {
          return '模板编辑'
        } else {
          return '添加模板'
        }
      },
    },
    data() {
      return {
        dialogVisible: false,
        form: {},
        id: undefined,
        init: false
      }
    },
    methods: {
      saveData() {
        try {
          const form = this.form;
					const title = form.title && form.title.trim()
          assert(title, '模板标题必填')
          assert(form.categoryId, '考试类型必填')
          assert(form.areaId, '适用地区必填')
 
          const params = {
            title: form.title,
            templateType:form.templateType,
            areaIds: form.areaId,
            categoryIds: form.categoryId,
            id: this.id,
          }
          saveTemplate(params)
            .then((res) => {
              if (res.code === 1000000) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.$emit('refresh')
              } else {
                throw res
              }
            })
            .catch((e) => this.$message.error(e.message))
        } catch (e) {
          this.$message.error(e.message)
        }
      },
      show() {
        this.form = formInitVal()
        this.id = ''
        this.dialogVisible = true
      },

      showData(d) {
        this.id = d.id;
        this.form={
          title:d.title,
          categoryId:d.categories.map(i=>i.categoryId),
          areaId:d.areas.map(i=>i.areId),
          templateType:d.templateType
        }
        this.dialogVisible = true
      },
      handleClose() {
        this.dialogVisible = false
      },
    },
    components: {
      Um,
    },
  }
</script>

<style scoped>
 .setItem:first-child{
   margin-left: 30px !important;
 } 
</style>
