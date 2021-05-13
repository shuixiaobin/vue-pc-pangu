<template>
  <div class="teacher-add">
    <div class="container-title">
      <h2>{{$route.query.id?'修改':'新增'}}</h2>
    </div>
    <div class="container">
      <el-form
        ref="form"
        size="small"
        :rules="rules"
        :model="form"
        label-width="130px"
        :disabled="!$route.query.roleType"
      >
        <h3 class="form-title">基础信息</h3>
        <el-row :gutter="22">
          <el-col :span="11">
            <el-form-item prop="telNo">
              <template slot="label">
                手机号
                <el-tooltip
                  effect="dark"
                  content="请输入该教师在盘古中心的注册手机号！"
                  placement="top"
                >
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </template>
              <el-input
                v-model="form.telNo"
                :disabled="!!$route.query.id"
                placeholder="请输入该教师在盘古中心的注册手机号"
                @blur="handleBlur($event)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="性别"
              prop="gender"
            >
              <el-select
                style="width:100%"
                v-model="form.gender"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item) in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="学历"
              prop="degree"
            >
              <el-input
                v-model="form.degree"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="账号"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="电子邮件"
              prop="email"
            >
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item
              label="爱好"
              prop="hobby"
            >
              <el-input
                v-model="form.hobby"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="姓名"
              prop="teacherName"
            >
              <el-input
                v-model="form.teacherName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="生日"
              prop="birthDate"
            >
              <el-date-picker
                style="width:100%"
                value-format="yyyy-MM-dd"
                v-model="form.birthDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="毕业院校"
              prop="schoolGraduation"
            >
              <el-input
                v-model="form.schoolGraduation"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="微信号"
              prop="wechat"
            >
              <el-input
                v-model="form.wechat"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="微博地址"
              prop="weibo"
            >
              <el-input
                v-model="form.weibo"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="座右铭"
              prop="motto"
            >
              <el-input
                v-model="form.motto"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h3 class="form-title">教学信息</h3>
        <el-row :gutter="22">
          <el-col :span="11">
            <el-form-item
              label="专长考试"
              prop="netClassCategoryId"
            >
              <el-select
                style="width:100%"
                v-model="form.netClassCategoryId"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item) in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="专长科目"
              prop="subjectType"
            >
              <el-select
                style="width:100%"
                v-model="form.subjectType"
                placeholder="请选择"
                @focus="handleSubjectFocus"
              >
                <el-option
                  v-for="(item) in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="教授科目"
              prop="xueKe"
            >
              <el-input
                v-model="form.xueKe"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="教学风格"
              prop="teachingStyle"
            >
              <el-input
                v-model="form.teachingStyle"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="教学经验"
              prop="teachingExperience"
            >
              <el-input
                v-model="form.teachingExperience"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="开始教学年份"
              prop="teacherYear"
            >
              <el-date-picker
                v-model="form.teacherYear"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="教师介绍视频ID"
              prop="videoIntro"
            >
              <el-input
                v-model="form.videoIntro"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="百家云账号"
              prop="bjyAccount"
            >
              <el-input
                v-model="form.bjyAccount"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="分成比例"
              prop="ratio"
            >
              <el-input
                v-model="form.ratio"
                type="Number"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="首页显示"
              prop="isShowIndex"
            >
              <el-switch
                v-model="form.isShowIndex"
                class="switch-in-word"
                :active-value="0"
                :inactive-value="1"
              ></el-switch>
            </el-form-item>
            <el-form-item
              label="所属分校"
              prop="fenXiao"
            >
              <el-select
                style="width:100%"
                v-model="form.fenXiao"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item) in schoolTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="正装照片">
              <TearcherUpload
                :format={width:200,height:200,kb:90}
                :imageUrl.sync="form.photoUrl"
              />
            </el-form-item>
            <el-form-item label="头像">
              <TearcherUpload
                :format={width:100,height:100,kb:90}
                :imageUrl.sync="form.roundPhoto"
              />
            </el-form-item>
            <el-form-item label="教师介绍视频封面">
              <TearcherUpload
                :format={width:750,height:424,kb:90}
                :imageUrl.sync="form.videoURL"
              />
            </el-form-item>
						<el-form-item label="官网首页教师照片">
						  <TearcherUpload
						    :format={width1:210,height1:280,width2:420,height2:560,kb:90}
						    :imageUrl.sync="form.teacherTeamUrl"
						  />
						</el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="简介"
          prop="brief"
        >
          <el-input
            type="textarea"
            v-model="form.brief"
            placeholder="请简单介绍教育工作经历，所获从业资格，工作经历，字数不超过4000字。"
            maxlength="4000"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="易面库简介"
          prop="coolBrief"
        >
          <el-input
            type="textarea"
            v-model="form.coolBrief"
            placeholder="请简单介绍教育工作经历，所获从业资格，工作经历，字数不超过4000字。"
            maxlength="4000"
          ></el-input>
        </el-form-item>
        <h3 class="form-title">教务信息（排课用）</h3>
        <el-form-item
          label="专兼职"
          prop="jobType"
        >
          <el-radio-group v-model="form.jobType">
            <el-radio :label="1">专职</el-radio>
            <el-radio :label="2">兼职</el-radio>
          </el-radio-group>
        </el-form-item>
        <TeacherGroup
          :pk-group="pkGroup"
          :pk-category-options="pkCategoryOptions"
          v-if="$route.query.id ? (pkCategoryOptions.length > 0 && isFinish) : pkCategoryOptions.length > 0"
        />
        <div
          class="teacher-subjects-wrapper"
          v-if="pkCategoryOptions.length > 0"
        >
          <el-form-item
            v-for="(subject, index) in form.teachSubjects"
            :label="'讲授科目' + (index + 1)"
            :key="subject.examType+''+index"
          >
            <TeacherAddSubject
              :teach-subject="subject"
              :pk-category-options="pkCategoryOptions"
            />
            <i
              v-if="form.teachSubjects.length>1"
              class="el-icon-remove-outline"
              @click="removeSubject(index)"
            ></i>
          </el-form-item>
          <i
            class="el-icon-circle-plus-outline"
            @click="addSubject"
          ></i>
        </div>
        <el-form-item
          label="参与课时排名"
          prop="pkJoinClassHourRank"
        >
          <el-switch
            v-model="form.pkJoinClassHourRank"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="教师级别"
          prop="pkTeacherLevel"
        >
          <el-select
            v-model="form.pkTeacherLevel"
            placeholder="请选择"
          >
            <el-option
              v-for="(item) in teacherLevelOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属学校"
          prop="pkSchool"
        >
          <el-select
            v-model="form.pkSchool"
            placeholder="请选择"
          >
            <el-option
              v-for="(item) in schoolOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
          >{{$route.query.id?'修改':'添加'}}</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {
    getTeacherInfo,
    getAccountInfo,
    getTeacherPhoneRegister,
    postTeacherPhoneUpdate,
    getCategory,
    getSubjectList,
    getTeacherLevel,
    getSchoolList,
    setTeacher,
    setFenXiaoTeacher,
    getSchoolType,
    getExamTypeOne,
  } from '@/api/teacher'
  import TearcherUpload from './components/TearcherUpload'
  import TeacherAddSubject from './components/TeacherAddSubject'
  import TeacherGroup from './components/TeacherGroup'
  export default {
    components: {
      TearcherUpload,
      TeacherAddSubject,
      TeacherGroup,
    },
    data() {
      return {
        isFinish: false,
        genderOptions: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 2,
          },
        ],
        pkGroup: {
          pkExamType: '',
          pkSubjectType: '',
          pkGroupType: '',
        },
        schoolTypeOptions: [], //所属分校列表
        schoolOptions: [], //所属学校列表
        teacherLevelOptions: [], //教师级别列表
        categoryList: [], //专长考试列表
        subjectList: [], //专长科目
        pkCategoryOptions: [], //排课考试列表
        form: {
          // roleType: '', //角色类型
          createUser: '', //操作人姓名
          teacherId: '', //教师ID
          // 基础信息
          userName: '', //账号名称
          userId: '', //账号ID
          teacherName: '', //姓名
          birthDate: '', //生日
          gender: '', //性别
          degree: '', //学历
          telNo: '',
          schoolGraduation: '', //毕业院校
          wechat: '',
          email: '',
          weibo: '',
          hobby: '',
          motto: '',
          // 教学信息
          netClassCategoryId: '',
          subjectType: '',
          xueKe: '',
          teachingStyle: '',
          teachingExperience: '',
          teacherYear: '',
          videoIntro: '',
          bjyAccount: '', //百家云账号
          ratio: '',
          isShowIndex: 0,
          fenXiao: '',
          photoUrl: '', //正装照片
          roundPhoto: '',
          videoURL: '',
					teacherTeamUrl: '', //官网首页教师照片
          brief: '',
          coolBrief: '',
          //教务信息（排课用）
          jobType: 1,
          pkTeacherLevel: '',
          pkSchool: 0,
          pkExamType: '',
          pkSubjectType: '',
          pkGroupType: '',
          pkJoinClassHourRank: 1,
          teachSubjects: [
            {
              examType: '',
              subjectType: '',
              teacherCourseLevel: '',
            },
          ], // 教授科目列表
        },
        rules: {
          userName: [{ required: true, message: '请填写账号', trigger: 'blur' }],
          teacherName: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
          telNo: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
          netClassCategoryId: [{ required: true, message: '请选择专长考试', trigger: 'change' }],
          subjectType: [{ required: true, message: '请选择专长科目', trigger: 'change' }],
          pkSchool: [{ required: true, message: '请选择所属学校', trigger: 'change' }],
        },
        // 记录注册的账号，若是新注册的账号则在提交时更新账号的 邮箱等信息
        createdUserIds: []
      }
    },
    computed: {
      ...mapState(['username']),
    },

    watch: {
      'form.netClassCategoryId'(val) {
        this.getSubjectList(val)
      },
    },
    created() {
      const { roleType, id } = this.$route.query
      if (!roleType && !id) {
        this.$router.replace('/teacher/teacherInfo')
      }
    },
    mounted() {
      this.getExamTypeOne()	 
      this.getCategory()
      this.getTeacherLevel()  
      this.getSchoolList()
      this.getSchoolType()		 
      this.form.createUser = this.username
      if (this.$route.query.id) {
        this.form.teacherId = this.$route.query.id
        this.getTeacherInfo()
      }
    },

    methods: {
      async getExamTypeOne() {
        try {
          const res = await getExamTypeOne()
          if(res.data){
						this.pkCategoryOptions = res.data
					}
        } catch (err) {
					this.$message.error(err)
        }
      },
      async getSchoolType() {
        try {
          const res = await getSchoolType()
					if(res.data){
						this.schoolOptions = res.data
					}
        } catch (err) {
          this.$message.error(err)
        }
      },
      async getSchoolList() {
        try {
          const res = await getSchoolList()
					if(res.data){
						this.schoolTypeOptions = res.data
					}
        } catch (err) {
          this.$message.error(err)
        }
      },
      async getTeacherLevel() {
        try {
          const res = await getTeacherLevel()
          if(res.data){
						this.teacherLevelOptions = Object.freeze(res.data)
					}
        } catch (err) {
					this.$message.error(err)
        }
      },
      async getSubjectList(val) {
        try {
          const res = await getSubjectList({ net_class_category_id: val })
          if(res.data){
						this.subjectList = Object.freeze(res.data)
					}
        } catch (err) {
          this.$message.error(err)
        }
      },
      async getCategory() {
        try {
          const res = await getCategory()
					if(res.data){
						this.categoryList = Object.freeze(res.data)
					}
        } catch (err) {
          this.$message.error(err)
        }
      },
      async getTeacherInfo() {
        try {
          const res = await getTeacherInfo({
            teacherId: this.$route.query.id,
          })
          this.isFinish = true
          if (res.data.teachSubjects.length === 0) {
            res.data.teachSubjects.push({
              examType: '',
              subjectType: '',
              teacherCourseLevel: '',
            })
          }
          if (res.data.fenXiao === 0) {
            res.data.fenXiao = ''
          }
          if (typeof res.data.teacherYear === 'number') {
            res.data.teacherYear = String(res.data.teacherYear)
          }
          this.telNo = res.data.telNo
          this.form = res.data
          this.form.createUser = this.username
          this.pkGroup.pkExamType = res.data.pkExamType
          this.pkGroup.pkSubjectType = res.data.pkSubjectType
          this.pkGroup.pkGroupType = res.data.pkGroupType
        } catch (err) {
          this.$message.error(err)
        }
      },
      async handleBlur(e) {
        if (this.form.telNo) {
          if (this.form.teacherId && this.telNo === e.target.value) return
          try {
            const res = await getAccountInfo({ phone: this.form.telNo, teacherId: this.form.teacherId })
            if (res.code === 10000) {
              this.form.userId = res.data.UserID
              this.form.teacherName = res.data.UserReName
              this.form.email = res.data.UserEmail
              this.form.userName = res.data.UserName
            } else if (res.code === -13011) {
              const confirm = await this.$confirm(res.msg, '注册确认', {
                confirmButtonText: '注册',
                cancelButtonText: '取消',
                type: 'warning'
              });
              // 手机号不存在时，注册手机号创建教师账号 
              const phoneRegRes = await getTeacherPhoneRegister({phone: this.form.telNo});
              if (phoneRegRes.code === 1000000) {
                this.form.userId = phoneRegRes.data.id;
                this.createdUserIds.push(this.form.userId);
                this.form.userName = phoneRegRes.data.username;
                this.$message.success('手机号注册成功');
              } else {
                this.form.userId = ''
                this.form.userName = ''
              }
              this.form.teacherName = ''
              this.form.email = ''
            } else {
              this.$message.warning(res.msg)
            }
          } catch (err) {
            this.form.userId = ''
            this.form.userName = ''
            console.log(err)
          }
        }
      },
      async setTeacher() {
        try {
          const params = { ...this.form, ...this.pkGroup }
          const { roleType, id } = this.$route.query
          let res
          if (roleType === 1) {
            res = await setTeacher(params)
          } else {
            res = await setFenXiaoTeacher(params)
          }
          if (res.code === 10000) {
            if (this.createdUserIds.includes(this.form.userId)) {
              // 当账号是本次新增时新注册的账号，再同步更新账号信息
              const params = {
                id: this.form.userId,
                username: this.form.userName,
                phone: this.form.telNo,
                name: this.form.teacherName,
                email: this.form.email,
                avatar: this.form.photoUrl,
                userType: this.form.jobType === 2 ? 3 : 2, // 用户类型 2教师 3兼职
                departmentId: this.form.pkSchool === 0 ? 1 : -1, // 部门 1华图在线  -1其他
              }
              await postTeacherPhoneUpdate(params);
            }
            this.$message.success(id ? '修改教师信息成功' : '创建教师信息成功')
            this.$router.go(-1)
          } else {
            this.$message.error(res.msg)
          }
        } catch (err) {
          this.$message.error(err)
        }
      },
      handleSubjectFocus() {
        if (this.form.netClassCategoryId === '') {
          this.$message.warning('请先选择专长考试！')
          return
        }
      },
      removeSubject(i) {
        this.form.teachSubjects.splice(i, 1)
      },
      addSubject() {
        this.form.teachSubjects.push({
          examType: '',
          subjectType: '',
          teacherCourseLevel: '',
        })
      },
      handleCancel() {
        this.$router.go(-1)
      },

      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 只有在全部有值的情况才会放到teachSubjects
            for (let i = 0; i < this.form.teachSubjects.length; i++) {
              const item = this.form.teachSubjects[i]
              if (
                (item.examType !== '' && (item.subjectType === '' || item.teacherCourseLevel === '')) ||
                (item.subjectType !== '' && (item.examType === '' || item.teacherCourseLevel === '')) ||
                (item.teacherCourseLevel !== '' && (item.examType === '' || item.subjectType === ''))
              ) {
                this.$message.warning('讲授科目请填写完整！')
                return false
              }
            }
            this.setTeacher()
          } else {
            if (!this.form.userName) {
              this.$message.warning('请确认该手机号存在关联账号');
            }
            return false
          }
        })
      },
    },
  }
</script>
<style lang='less' scoped>
  .teacher-add {
    .el-form {
      width: 80%;
      .form-title {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-right: 15px;
        margin-bottom: 16px;
      }
    }
    .teacher-subjects-wrapper {
      position: relative;
      i {
        font-size: 20px;
        color: #606266;
        cursor: pointer;
        position: absolute;
      }
      .el-form-item {
        position: relative;
      }
    }
    .el-icon-circle-plus-outline {
      top: 6px;
      right: 40px;
    }
    .el-icon-remove-outline {
      right: 70px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>