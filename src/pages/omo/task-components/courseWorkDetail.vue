<template>
  <el-dialog
    title="作业批改"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose">
    <div v-if="title">
      <div>
        <div class="work-detail-title">{{title}}</div>
        <div v-html="content"></div>
      </div>
      <div>
        <div class="work-detail-title">学员回答</div>
        <div v-if="videoUrl">
          <span>语音作答: </span> <a :href="videoUrl" target="_blank"><el-button>点击打开窗口</el-button></a>
        </div>
        <div>
          <span>文字作答:</span>
          <div @click="handleImageClick">{{answerText}}</div>
          <img @click="showImg(item.imageUrl)" class="userPic" v-for="item in imageList" :src="item.imageUrl" :key="item.imageUrl" />
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div class="work-detail-title">批改</div>
        <div>总评: </div>
        <el-input type="textarea" :disabled="disabled" v-model="correctRemark" :rows="5"></el-input>
      </div>
    </div>
    <div :key="id">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-for="(item, index) in commentRule"
          :label="item.dimension"
          :name="String(index)"
          :key="index"
        >
          <CorrectDetail
            ref="correctDetail"
            @add="handleAdd($event, item)"
            @remove="handleRemove($event, item)"
            :disabled="disabled"
            :id="item.examCommentId"
            :examComments="item.examComments"
          />
      </el-tab-pane>
    </el-tabs>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox label="提交时发送推送提醒学员" v-if="!disabled" v-model="pushState"></el-checkbox>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="warning" v-if="!disabled" @click="saveData">保 存</el-button>
      <el-button type="primary" v-if="!disabled" @click="submitData">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getCourseWorkDetail, getCorrectTemplate, saveCorrect } from '@/api/omoApi'
import CorrectDetail from './correctDetail'
export default {
  data () {
    this.weakMap = new WeakMap()
    this.correctData = []
    this.courseId = ''
    this.courseWorkId = ''
    return {
      dialogVisible: false,
      title: '',
      content: '',
      answerText: '',
      commentRule: [],
      activeName: '0',
      correctRemark: '',
      pushState: true,
      id: '',
      imageList: [],
      disabled: false,
    }
  },
  created () {
    this.getTemplate()
  },
  methods: {
    handleImageClick (e) {
      const target = e.target
      if (target && target.tagName.woLowerCase() === 'img') {
        this.showImg(target.src)
      }
    },
    showImg (url) {
      window.open(url)
    },
    getTemplate () {
      getCorrectTemplate().then(res => {
        if (res.code === 1000000) {
          this.commentRule = res.data
        } else {
          throw res
        }
      }).catch(e => this.$message.error(e.message))
    },
    handleClose () {
      this.correctData = []
      this.weakMap = new WeakMap()
      this.dialogVisible = false
    },
    handleAdd (v, parent) {
      const correctData = this.correctData
      for (var i = 0; i < correctData.length; i++) {
        const item = correctData[i]
        if (item.id === v.id) {
          item.text = v.text
          return
        }
      }
      if (!this.weakMap.has(parent)) {
        this.weakMap.set(parent, [])
      }
      this.weakMap.get(parent).push(v)
      correctData.push(v)
      return
    },
    handleRemove (id, parent) {
      this.correctData = this.correctData.filter(item => item.id !== id)
      const d = this.weakMap.get(parent)
      if (d.length) {
        this.weakMap.set(parent, d.filter(item => item.id !== id))
      }
    },
    concatCorrentContent () {
      var ret = []
      this.commentRule.forEach(item => {
        if (this.weakMap.has(item)) {
          const d = this.weakMap.get(item)
          var c = item.dimension + ':\n'
          d.forEach(item => {
            c += item.text + '\n'
          })
          ret.push(c)
        }
      })
      return ret.join('\n')
    },
    getParams (type) {
      return {
        correctContent: this.concatCorrentContent(),
        correctDetail: JSON.stringify(this.correctData),
        correctRemark: this.correctRemark,
        courseId: this.courseId,
        courseWorkId: this.courseWorkId,
        pushStatus: this.pushState ? 1 : 0,
        type,
      }
    },
    validate (next) {
      if (this.correctRemark) return next()
      if (this.correctData.length > 0) return next()
      return next(new Error('未批改不能提交'))
    },
    submitData () {
      this.validate((v) => {
        if (v) {
          this.$message.error(v.message)
          return
        }
        saveCorrect(this.id, this.getParams(2)).then(res => {
          if (res.code === 1000000) {
            this.$message.success(res.message)
            this.$emit('submitSuccess')
            this.handleClose()
          } else {
            throw res
          }
        }).catch(e => this.$message.error(e.message))
      })
    },
    saveData () {
      saveCorrect(this.id, this.getParams(1)).then(res => {
        if (res.code === 1000000) {
          this.$message.success(res.message)
          this.handleClose()
        } else {
          throw res
        }
      }).catch(e => this.$message.error(e.message))
    },
    showData (d) {
      this.baseData = d
      this.disabled = d.cardStatus !== 1
      this.id = d.id
      this.getCourseWorkDetail(d)
      this.dialogVisible = true
    },
    setCorrectsData (corrects) {
      const map = {}
      corrects.forEach(item => {
        var c = map
        const ids = item.id.split(',')
        if (ids.length === 3) {
          if (!map[ids[0]]) map[ids[0]] = {}
          map[ids[0]][ids[1]] = {
            id: ids[2],
            text: item.text
          }
        }
      })
      this.$refs.correctDetail.forEach(item => item.setData(map))
    },
    getCourseWorkDetail (d) {
      getCourseWorkDetail(d.id).then(res => {
        if (res.code === 1000000) {
          const data = res.data
          this.title = data.title
          this.content = data.content
          this.answerText = data.answerText
          this.videoUrl = data.videoUrl
          this.correctRemark = data.correctRemark
          this.courseId = data.courseId
          this.courseWorkId = data.courseWorkId
          this.pushState = data.pushStatus !== 0
          this.imageList = data.imageList || []
          if (data.correctDetail) {
            const correctDetail = JSON.parse(data.correctDetail)
            this.setCorrectsData(correctDetail)
          }
        } else {
          throw res
        }
      }).catch(e => this.$message.error(e.message))
    }
  },
  components: {
    CorrectDetail,
  }
}
</script>

<style scoped>
.work-detail-title {
  font-size: 16px;
  font-weight: 500;
  margin: 10px 0 20px;
}
.userPic {
  max-width: 100%;
  max-height: 300px;
}
</style>
