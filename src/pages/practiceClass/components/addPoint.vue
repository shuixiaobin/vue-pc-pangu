<template>
  <div class="titleButton">
    <el-form :inline="true"
      :model="formInline"
      :rules="rules"
      ref="formInline"
      class="demo-form-inline">
      <el-form-item v-show="inputIsShow"
        label="节点名称"
        prop="name">
        <el-input v-model="formInline.name"
          placeholder="节点名称"
          size="mini"
          style="width:360px"></el-input>
      </el-form-item>
      <el-form-item v-show="inputIsShow">
        <el-input v-model="formInline.setTimer"
          @blur="setPlayTime"
          size="mini"
          style="width:100px"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
          v-if="!inputIsShow"
          @click="add"
          size="mini"
          plain>添加</el-button>
        <el-button type="primary"
          v-if="inputIsShow"
          @click="save('formInline')"
          size="mini"
          plain>保存</el-button>
        <el-button type="primary"
          v-show="addList.length > 0"
          @click="edit"
          size="mini"
          plain>修改</el-button>
        <el-button type="primary"
          v-show="addList.length > 0"
          @click="deleteItem"
          size="mini"
          plain>删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          setTimer: '',
          name: ''
        },
        rules: {
          name: [
            { min: 0, max: 20, message: '只能录入20个字符以内', trigger: 'blur' }
          ]
        },
        inputIsShow: false
      }
    },
    props: {
      curTime: Number,
      addList: Array,
      multipleSelection: Array
    },
    watch: {
      curTime: function(newVal, oldVal) {
        if (this.inputIsShow)
          this.formInline.setTimer = this.sec_to_time(this.curTime)
      }
    },
    computed: {
      userId() {
        return localStorage.getItem('userId') //localStorage.getItem("userId") 842;
      }
    },
    methods: {
      setPlayTime() {
        console.log(this.time_to_sec(this.formInline.setTimer))
        this.$emit('seekMethod', this.time_to_sec(this.formInline.setTimer))
        this.$emit('pauseMethod')
        //this.player.seek(this.time_to_sec(this.formInline.setTimer));
        //this.player.pause();
      },
      add() {
        this.inputIsShow = true
        this.formInline.setTimer = this.sec_to_time(this.curTime)
        this.$emit('pauseMethod')
      },
      edit() {
        console.log(this.multipleSelection)
        if (this.multipleSelection.length > 1) {
          this.$message.warning('一次只能修改一条记录')
          return
        } else {
          if (this.multipleSelection[0] && this.multipleSelection[0].id) {
            this.$emit('editInputNum', this.multipleSelection[0].id)
          } else {
            this.$message.warning('请选择要修改的节点')
          }
        }
      },
      deleteItem() {
        if (this.multipleSelection.length > 0) {
          this.$confirm('是否确认删除？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          })
            .then(() => {
              let id = []
              for (let i = 0; i < this.multipleSelection.length; i++) {
                id.push(this.multipleSelection[i].id)
              }
              this.myDelete1(
                'pand/backend/courseBreakpoint/' + id,
                {},
                {
                  userId: this.userId
                }
              )
                .then(result => {
                  this.$emit('RefreshNodeList', null)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                })
                .catch(err => {
                  this.$message.error(err.message)
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.inputIsShow = false
            let positionArry = []
            for (let i = 0; i < this.addList.length; i++) {
              positionArry.push(this.addList[i].position)
            }
            if (positionArry.indexOf(this.curTime) > -1) {
              this.$message({
                type: 'error',
                message: '一个时间点只能创建一次!'
              })
            } else {
              if (!this.formInline.setTimer || !this.formInline.name) {
                return
              }
              this.$emit('Savepoint', this.formInline.name, this.curTime)
              this.formInline.name = ''
            }
          } else {
            return false
          }
        })
      },
      sec_to_time(s) {
        var t
        if (s > -1) {
          var hour = Math.floor(s / 3600)
          var min = Math.floor(s / 60) % 60
          var sec = s % 60
          if (hour < 10) {
            t = '0' + hour + ':'
          } else {
            t = hour + ':'
          }

          if (min < 10) {
            t += '0'
          }
          t += min + ':'
          if (sec < 10) {
            t += '0'
          }
          t += sec
        }
        return t
      },
      time_to_sec(time) {
        var s = ''
        var hour = time.split(':')[0]
        var min = time.split(':')[1]
        var sec = time.split(':')[2]
        s = Number(hour * 3600) + Number(min * 60) + Number(sec)
        return s
      }
    }
  }
</script>   
<style lang='less' scoped>
  .titleButton {
    float: right;
  }
</style>  