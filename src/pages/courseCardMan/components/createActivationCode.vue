<template>
  <el-dialog
    class="createActivationCode"
    title="生成激活码"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose">
    <el-form label-width="80px" :model="form">
      <el-form-item label="适用范围">
        <el-select v-model="form.scopeId" style="width: 150px" placeholder="请选择">
          <el-option
            v-for="item in scopeList"
            :key="item.scopeId"
            :label="item.scopeName"
            :value="item.scopeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发行数量">
        <el-input style="width: 200px"  @keyup.native="handleInput" v-model="form.issueNumber"></el-input>
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width: 120px" class="btn" @click="create">生 成</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Course from '@/api/courseApi.js'
	export default {
		name: "createActivationCode",
    props: ['scopeList'],
    data(){
		  return {
		    dialogVisible: false,
        form: {
		      scopeId: '',
          issueNumber: '',
          time: []
        },
      }
    },
    methods: {
		  show(){
		    this.dialogVisible = true;
      },
      close(){
		    this.dialogVisible = false;
      },
      handleClose(){
        Object.assign(this.$data, this.$options.data())
      },
      handleInput(){
        this.form.issueNumber = this.form.issueNumber.replace(/[^\.\d]/g, '')
        this.form.issueNumber = this.form.issueNumber.replace('.', '')
      },
      async create(){
        if(this.form.scopeId===''){
          this.$message.warning('请选择适用范围')
          return
        }
        if(this.form.issueNumber===''){
          this.$message.warning('请填写发行数量')
          return
        }
        if(this.form.time.length===0){
          this.$message.warning('请选择有效期')
          return
        }
        const cardId = this.$route.params.id;
        let params = {
          cardId,
          startTime: this.form.time[0],
          endTime: this.form.time[1],
          issueNumber: this.form.issueNumber,
          scopeId: this.form.scopeId
        }
        let data = await Course.createActivationCard(params)
        if(data){
          this.$message.success('创建成功')
          this.$emit('created')
          this.close()
        }
      }
    }
	}
</script>

<style scoped lang="less">
  .createActivationCode{
    .dialog-footer{
      display: block;
      text-align: center;
    }
  }
</style>
