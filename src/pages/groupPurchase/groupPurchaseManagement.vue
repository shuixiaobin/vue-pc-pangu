<template>
  <div>
    <div class="container-title">
      <h2>活动信息</h2>
    </div>
    <div class="container">
      <el-form :model="formData" ref="form">
        <el-col :span="12">
          <el-form-item inline required label="拼团开始时间">
            <el-date-picker :disabled="status1disabled" v-model="formData.beginAt" type="datetime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item inline required label="拼团结束时间">
            <el-date-picker v-model="formData.endAt" type="datetime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item inline required label="成团人数">
            <el-input-number 
							:disabled="status1disabled" 
							:step="1" 
							size="small" 
							v-model="formData.collagePeople" 
							:min="2" 
							:max="20"
						></el-input-number> 人
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item inline required label="成团有效时间">
            <el-input-number 
							:disabled="status1disabled" 
							:step="1" 
							size="small" 
							v-model="formData.activityLength" 
							:min="1"
						></el-input-number> 小时
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item inline required label="拼团限制--开团人">
            <i @click="showDoubtMsg" class="doubt el-icon-question"></i>
            <el-radio-group :disabled="status1disabled" v-model="formData.startLimitType">
              <el-radio v-for="(item, index) in userList" :label="item.value" :key="index">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item inline required label="机器人拼团开关">
            <el-switch
              :disabled="status1disabled"
              v-model="formData.robotStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              :active-value="1"
              inactive-text="关"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item inline required label="拼团限制--参团人">
            <i @click="showDoubtMsg" class="doubt el-icon-question"></i>
            <el-radio-group v-model="formData.limitType" :disabled="status1disabled">
              <el-radio size="small" v-for="(item, index) in userList" :label="item.value" :key="index">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item inline required label="前端展示加入团">
            <el-switch
              :disabled="status1disabled"
              v-model="formData.allowCollage"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              :active-value="1"
              inactive-text="关"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
        <h3 style="font-size: 18px;margin: 20px 0;">选择课程</h3>
        <el-form-item label="课程ID">
          <el-input type="number"  :disabled="status1disabled" style="width: 200px" v-model="classId"></el-input>
          <el-button :disabled="status1disabled" @click="addCourse">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData">
        <el-table-column prop="rid" label="课程ID" align="center" width="80px" />
        <el-table-column prop="title" label="课程名称" align="center" />
        <el-table-column prop="actualPrice" width="100px" label="实际价格" align="center" />
        <el-table-column prop="collagePrice" width="150px" label="拼团价格" align="center">
          <template slot-scope="{row}">
            <div>
              <el-input-number :disabled="status1disabled" :step="1" size="small" v-model="price" :min="0"></el-input-number>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100px" label="课程状态" align="center">
          <template slot-scope="scope">
            <div>
              {{scope.row.status | statusFormate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" width="180px" label="创建日期" align="center" />
        <el-table-column width="150px" label="选择状态" align="center">
          <template slot-scope="scope">
            <div>
              已选择
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 20px;">
        <el-button type="primary" @click="createActive" v-if="!$route.query.id">创建活动</el-button>
        <el-button type="primary" @click="editActive" v-else>确认修改</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getClasses, createActive, getActivityData, editActive } from '@/api/assemble.js'
import { userName } from '@/common/global.js'
import Util from '@/common/util.js'
function defaultForm () {
  return {
    beginAt: '',
    endAt: '',
    collagePeople: 2,
    activityLength: 1,
    startLimitType: 0,
    robotStatus: 1,
    limitType: 0,
    allowCollage: 1,
  }
}
export default {
  data () {
    return {
      userList: [
        { label: '不限', value: 0 },
        { label: '新用户', value: 1 },
        { label: '老用户', value: 2 },
      ],
      tableData: [],
      classId: '',
      formData: defaultForm(),
      price: 0,
      status: 0,
    }
  },
  computed: {
    status1disabled () {
      return this.status === 1
    }
  },
  // activated () {
  //   this.init()
  // },
	mounted() {
		this.init()
	},
  methods: {
    init () {
      if (this.$route.query.id) {
        getActivityData(this.$route.query.id).then(res => {
					if (res.code === 10000) {
            const form = defaultForm()
            const d = res.data
            Object.keys(form).forEach((prop) => {
              let v = d[prop]
              if (prop === 'beginAt' || prop === 'endAt') {
                v = new Date(d[prop])
              }
              form[prop] = v
            })
            this.formData = form
            this.classId = d.classId
            this.price = d.collagePrice
            this.tableData = [{
              actualPrice: d.discountPrice,
              createDate: "",
              rid: d.classId,
              status: d.status,
              title: d.classTitle,
            }]
            this.status = d.status
          } else {
            throw new Error(res.msg)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      } else {
        this.formData = defaultForm()
        this.tableData = []
        this.classId = ''
        this.price = 0
        this.status = 0
      }
    },
    showDoubtMsg () {
      this.$alert('老用户是指注册后购买过付费课程的用户, 新用户是指注册后未购买过课程或只购买过0元课程的用户')
    },
    cancel () {
      this.$router.back()
    },
    validate (cb) {
      try {
        const assert = Util.assert
        assert(this.tableData.length > 0, '请选择课程')
        const d = this.tableData[0]
        assert(this.price <= d.actualPrice, '拼团价格不能大于实际价格')
        assert(this.price > 0, '拼团价格不能为0')
        const formData = this.formData
        assert(formData.beginAt, '请选择开始时间')
        assert(formData.endAt, '请选择结束时间')
        assert(formData.beginAt.getTime() < formData.endAt.getTime(), '结束时间不能小于开始时间')
        cb()
      } catch (e) {
        cb(e)
      }
    },
    createActive () {
      this.validate((err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        const data = this.getParams()
				const newDate = new Date().getTime() - 300000; // 当前时间前五分钟可以添加开始时间
				const beginDate = new Date( data.beginAt ).getTime();
				if(newDate > beginDate){
					this.$message.error('活动时间有误')
					return false;
				}
				
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        createActive(data).then(res => {
          if (res.code === 10000) {
            this.$message.success(res.msg)
            this.cancel()
            loading.close()
          } else {
            throw new Error(res.msg)
          }
        }).catch(e => {
          loading.close()
          this.$message.error(String(e.message))
        })
      })
    },
    editActive () {
      this.validate((err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        const data = this.getParams()
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        editActive(data).then(res => {
          if (res.code === 10000) {
            this.$message.success(res.msg)
            this.cancel()
            loading.close()
          } else {
            throw new Error(res.msg)
          }
        }).catch(e => {
          loading.close()
          this.$message.error(String(e.message))
        })
      })
    },
    getParams () {
      const form = this.formData
      const d = this.tableData[0]

      const ret = {
        activityLength: form.activityLength,
        allowCollage: form.allowCollage,
        beginAt: Util.formatTime2(form.beginAt),
        endAt: Util.formatTime2(form.endAt),
        classTitle: d.title,
        collagePeople: form.collagePeople,
        collagePrice: this.price,
        discountPrice: d.actualPrice,
        limitType: form.limitType,
        robotStatus: form.robotStatus,
        startLimitType: form.startLimitType,
        userName,
      }
      if (this.$route.query.id) {
        ret.activityId = this.$route.query.id
        ret.classId = d.rid
      } else {
        ret.classId = [d.rid]
      }
      return ret
    },
    addCourse () {
      const classId = this.classId
      if (!classId) {
        this.tableData = []
        this.$message.warning('请填写课程id')
        return
      }
      if (!this.tableData.every((item) => item.classId != classId)) {
        this.$message.warning('该课程已添加')
        return
      }
      getClasses({
        keyWord: this.classId,
        type: 2,
        page: 1,
        pageSize: 10,
      }).then(res => {
        if (res.code === 10000) {
          this.price = 0
          if (res.data.data.length === 0) {
            this.$message.warning('无课程信息')
            this.tableData = []
            return
          }
          this.tableData = res.data.data.slice(0, 1)
        } else {
          throw new Error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
  },
  filters: {
    statusFormate (v) {
			const state = ['未上线', '已上线', '已失效', '已结束']
			if(v || v == 0){
				return state[v];
			}
      return v
    }
  }
}
</script>

<style>
.purchase-create .doubt {
  cursor: pointer;
}
</style>
