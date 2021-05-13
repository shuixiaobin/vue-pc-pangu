<template>
  <div>
    <div class="player">
      <!-- <p>视频播放测试</p> -->
      <div class="main-contianer">
        <div class="box-header with-border clearfix">
          <h3 class="box-title box-title-h40">视频节点</h3>
          <addPoint @seekMethod="SeekMethod"
            @pauseMethod="PauseMethod"
            :addList="addList"
            :multipleSelection="multipleSelection"
            @editInputNum="getEditInputNum"
            @RefreshNodeList="refreshNodeList"
            :curTime="curTime"
            @Savepoint="savepoint"></addPoint>
        </div>
        <practicePlayer :addList="addList"
          @multipleSelection="getMultipleSelection"
          :editInputNum="editInputNum"
          @editInputTitle="EditInputTitle"
          @courseBreakpointId="getcourseBreakpointId"
          @Relatedexercises="getSelectData"></practicePlayer>
        <div class="box-header with-border mrl20">
          <h3 class="box-title">随堂练习</h3>
        </div>
        <selected-exercises :selectData="selectData"
          :isFlag="false"
          :breakpointId="courseBreakpointId"
          @update="update"></selected-exercises>
        <div class="infoButton">
          <el-button size="mini"
            plain
            @click="addexercises=!addexercises">展开添加习题</el-button>
        </div>
      </div>
      <transition name="fade">
        <div class="main-contianer"
          v-show="addexercises">
          <div class="box-header with-border mrl20">
            <h3 class="box-title">筛选条件</h3>
          </div>
          <search :ids="ids"
            ref="searchResult"></search>
          <div class="box-header with-border mrl20">
            <h3 class="box-title">未选习题</h3>
          </div>
          <unselected-exercises :isFlag="false"
            :lastSort="lastSort"
            :breakpointId="courseBreakpointId"
            @joinUpdate="joinUpdate"
            :addList="addList"></unselected-exercises>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import { getParams} from '@/config/utils'

  import addPoint from '@/pages/practiceClass/components/addPoint'
  import practicePlayer from '@/pages/practiceClass/components/practicePlayer'
  import search from '@/pages/relevanceExercises/components/Search'
  import selectedExercises from '@/pages/relevanceExercises/components/SelectedExercises'
  import unselectedExercises from '@/pages/relevanceExercises/components/UnselectedExercises'
  export default {
    data() {
      return {
        curTime: 0,
        addList: [],
        multipleSelection: [],
        editInputNum: -1,
        addexercises: false,
        selectData: [], //已选试题
        selectList: [],
        courseBreakpointId: 0,
        ids: '',
        courseType: getParams('rouse'), //1：录播，2：直播  getParams('rouse')
        courseId: getParams('lessionId'), //课件id  getParams('lessionId')
        bjyRoomId: getParams('bjyRoomId'), //百家云RoomId（回放） getParams('bjyRoomId')
        bjySessionId: getParams('bjySessionId'), //百家云RoomId（回放）
        videoId: getParams('videoId') //百家云videoId getParams('videoId')
      }
    },
    components: {
      addPoint,
      practicePlayer,
      search,
      selectedExercises,
      unselectedExercises
    },
    computed: {
      lastSort() {
        if (this.selectData && this.selectData.length > 1) {
          return this.selectData[this.selectData.length - 1].sort
        }
      },
      userId() {
        return localStorage.getItem('userId') //localStorage.getItem("userId") 842;
      }
    },
    created() {
      this.nodeListPort(null, null) //视频节点列表初始化
      this.getVideoToken()
    },
    methods: {
      // 初始化播放器
      initPlayer(token) {
        var that = this
        this.player = new bjcPlayer('#main', {
          //视频初始化
          token: token,
          //token:'BZRcSaHG_PhMyA0LsBVeTDfqRotnZzuGBa0mSorKfMY_xri6f97A5g',
          definition: 'hign', // hign 高清 low 低清
          onended: function() {
            console.log('onended')
          },
          onplaybegin: function() {
            console.log('onplay')
          },
          onpause: function() {
            console.log('onpause')
          },
          onerror: function(e) {
            console.log('onerror')
            console.log(e)
          },
          ontimeupdate: function(time) {
            //console.log("ontimeupdate-->" + time);
            that.curTime = time
          },
          onseeked: function(time) {
            //console.log("onseeked-->" + time);
          }
        })
        this.player.play(this.videoId)
        //this.player.play(11981544);
      },
      // 获取视频token
      getVideoToken() {
        this.myGet(`${PHP_URL}/v4/app/lession/token`, {
          bjyRoomId: this.bjyRoomId,
          bjySessionId: this.bjySessionId,
          videoId: this.videoId
        })
          .then(result => {
            this.initPlayer(result.data.token)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      SeekMethod(msg) {
        this.player.seek(msg)
      },
      PauseMethod() {
        this.player.pause()
      },
      getMultipleSelection(msg) {
        this.multipleSelection = msg
      },
      getEditInputNum(msg) {
        this.editInputNum = msg
      },
      savepoint(name, curTime) {
        this.nodeEditPort(null, name, curTime)
      },
      refreshNodeList(msg) {
        this.nodeListPort(msg, msg)
      },
      EditInputTitle(row) {
        this.nodeEditPort(row.id, row.pointName, row.position)
        this.editInputNum = -1
      },
      getcourseBreakpointId(id) {
        this.courseBreakpointId = id
      },
      nodeEditPort(id, pointName, position) {
        this.myPost2(
          'pand/backend/courseBreakpoint/edit',
          {
            courseId: this.courseId, //课程id this.courseId
            courseType: this.courseType, //课程类型 this.courseType
            sort: 1, //排列序号
            id: id, //id 不传为新增操作
            pointName: pointName, //断点名称
            position: position //断点位置
          },
          {
            userId: this.userId
          }
        )
          .then(result => {
            if (result.code == 1000000) {
              this.nodeListPort(null, null)
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      nodeListPort(pointName, position) {
        this.myGet(
          `/pand/backend/courseBreakpoint/${this.courseType}/${this.courseId}`,
          // `/pand/backend/courseBreakpoint/2/2333`,
          {
            pointName: pointName,
            position: position
          }
        )
          .then(result => {
            this.addList = result.data
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 切换题目监听事件
      update() {
        this.nodeListPort()
        this.getSelectData()
      },
      // 加入题目监听事件
      joinUpdate() {
        this.nodeListPort()
        this.getSelectData()
      },
      // 获取已选习题数据
      getSelectData() {
        this.myGet(
          `/pand/backend/courseBreakpointQuestion/list/${this.courseBreakpointId}`
        )
          .then(result => {
            this.selectList = result.data
            let questionIdArr = []
            result.data.forEach(item => {
              questionIdArr.push(item.questionId)
            })
            this.ids = questionIdArr.length !== 0 ? questionIdArr.join(',') : ''
            return this.myGet('/q/v3/questions/batch', {
              ids: this.ids
            })
          })
          .then(result => {
            //将selectList中的sort遍历赋值给selectData
            this.selectList.forEach((item, index) => {
              result.data[index].sort = item.sort
            })
            this.selectData = result.data
            this.operationScreening(this.selectData)
            this.$emit('selectData', this.selectData)
            //判断筛选条件是否显示，如果显示更新相对应的内容
            if (this.addexercises) {
              this.$refs.searchResult.search()
            }
          })
          .catch(err => {
            this.$emit('selectData')
            this.$message.error(err.message)
          })
      },
      operationScreening(data) {
        data.forEach((item, index) => {
          if (index === 0) {
            item.handleArr = [
              {
                text: '下降',
                value: 2
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          } else if (index === data.length - 1) {
            item.handleArr = [
              {
                text: '上移',
                value: 1
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          } else {
            item.handleArr = [
              {
                text: '上移',
                value: 1
              },
              {
                text: '下降',
                value: 2
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .mrl20 {
    margin: 0 20px;
  }
  .infoButton {
    padding: 0 20px 20px;
  }
  .player {
    .main-contianer {
      background: #ecf0f5;
      position: relative;
      border-radius: 3px;
      border-top: 3px solid #d2d6de;
      margin-bottom: 20px;
      width: 100%;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      .box-header {
        border-bottom: 1px solid #e2e2e2;
        padding: 10px;
        .box-title {
          display: inline-block;
          font-size: 18px;
          margin: 0;
          line-height: 1;
        }
        .box-title-h40 {
          line-height: 40px;
        }
      }
    }
  }
  //显示动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

