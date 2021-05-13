<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="500px"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #default>
      <div class="binder-label">在线课程id：</div>
      <ul class="binder-class-list">
        <li
          v-for="(classId, index) in idsArr"
          :key="index"
          class="binder-class-item"
        >
          <el-input
            v-input-filter:number
            :value="classId"
            size="small"
            placeholder="请输入课程id"
            class="binder-class-item__input"
            :class="{ 'is-error': validMsg[index] }"
            @input="onIdInput($event, index)"
            @blur="onIdBlur(index)"
          />
          <div v-show="validMsg[index]" class="binder-class-item__error">
            {{ validMsg[index] }}
          </div>
          <el-button
            v-if="idsArr.length > 1"
            type="danger"
            size="small"
            icon="el-icon-delete"
            circle
            plain
            @click="onIdDelete(index)"
          />
          <el-button
            v-if="index === idsArr.length - 1"
            type="success"
            size="small"
            icon="el-icon-plus"
            circle
            plain
            @click="onIdAdd"
          />
        </li>
      </ul>
    </template>
    <template #footer>
      <div>
        <el-button size="small" type="primary" @click="onBindClass">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { getXiaoetongBindClass } from '@/api/other.js';
const REQUIRED_MSG = '请输入课程id';
const DUPLICATE_MSG = '课程id重复';
export default {
  props: {
    visible: {
      default: false,
      type: Boolean,
    },
    title: {
      default: '绑定课程',
      type: String,
    },
    rid: {
      // 小鹅通课程rid
      default: '',
      type: [String, Number],
    },
    classIds: {
      // 小鹅通当前课程已绑定的classId
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      idsArr: [''],
      validMsg: [null],
    };
  },
  watch: {
    visible(value) {
      if (value) {
        this.idsArr = this.classIds.length ? [].concat(this.classIds) : [''];
        this.validMsg = new Array(this.idsArr.length).fill(null);
      }
    },
  },
  methods: {
    validateId(index) {
      // 校验 课程id 是否重复或 为空, 正确返回null 错误则返回错误信息 
      return this.idsArr[index]
        ? this.idsArr.find(
            (id, idIndex) => id == this.idsArr[index] && index !== idIndex
          ) && DUPLICATE_MSG
        : REQUIRED_MSG;
    },
    onIdInput(value, index) {
      const prevValue = this.idsArr.value;
      this.idsArr.splice(index, 1, value);
      this.validMsg.splice(index, 1, this.validateId(index));
    },
    onIdBlur(index) {
      this.validMsg.splice(index, 1, this.validateId(index));
      // 校验重复的id 是否仍然重复
      this.validMsg = this.validMsg.map((msg, idIndex) => msg === DUPLICATE_MSG ? this.validateId(idIndex) : msg);
    },
    onIdDelete(index) {
      this.idsArr.splice(index, 1);
      this.validMsg.splice(index, 1);
    },
    onIdAdd() {
      this.idsArr.push('');
      this.validMsg.push(null);
    },
    onBindClass() {
      // 校验id数据
      this.validMsg = this.idsArr.map((id,index) => this.validateId(index));
      if (this.validMsg.find(msg => msg)) {
        return false;
      }
      const params = {
        rid: this.rid,
        net_classes_rid: this.idsArr.join(','),
      };
      getXiaoetongBindClass(params)
        .then(res => {
          if (res.code === 10000) {
            this.$message.success('课程绑定成功');
            this.$emit('binded');
            this.$emit('update:visible', false);
          } else {
            if (res.data && res.data.length) {
              this.validMsg = this.idsArr.map(item =>
                res.data.includes(item)
                  ? res.msg == '格式错误'
                    ? '格式错误'
                    : '课程id不存在'
                  : null
              );
            }
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.binder-label {
  float: left;
  width: 120px;
  line-height: 32px;
  text-align: center;
}
.binder-class-list {
  width: 320px;
  margin: 0;
  max-height: 700px;
  overflow: auto;
  .binder-class-item {
    position: relative;
    margin-bottom: 16px;
    .binder-class-item__input {
      width: 200px;
      margin-right: 16px;
      &.is-error /deep/ .el-input__inner {
        border-color: #f01416;
      }
    }
    .binder-class-item__error {
      color: #f01416;
      font-size: 12px;
      line-height: 1;
      padding-top: 2px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
}
</style>