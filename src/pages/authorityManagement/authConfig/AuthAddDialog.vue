<template>
  <el-dialog
    :visible="visible"
    @update:visible="updateVisible"
    :title="title"
    width="700px"
  >
    <template #default>
      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        size="small"
        label-position="right"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="按钮名称" prop="menuName">
          <el-input
            v-model="form.menuName"
            placeholder="请输入按钮名称"
            class="auth-form-input"
          />
        </el-form-item>
        <el-form-item label="前端ID" prop="frontToolName">
          <el-input
            v-model="form.frontToolName"
            placeholder="请输入前端ID"
            class="auth-form-input"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入描述"
            class="auth-form-input"
          />
        </el-form-item>
        <el-form-item label="类型" prop="menuType">
          <el-select v-model="form.menuType" class="auth-form-input">
            <el-option :value="1" label="菜单" />
            <el-option :value="2" label="按钮" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model.number="form.sort"
            v-input-filter:number
            placeholder="请输入排序"
            class="auth-form-input"
          />
        </el-form-item>
        <div v-if="!form.panGuAuthDtos.length" class="form-add-dtos">
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            round
            @click="onDtosAdd"
          >
            添加链接
          </el-button>
        </div>
        <el-form-item
          v-for="(dtos, index) in form.panGuAuthDtos"
          :label="`链接${index + 1}`"
          :key="index"
          :prop="'panGuAuthDtos.' + index + '.requestUrl'"
          :rules="makeLinkValidator(index)"
        >
          <el-input
            v-model="dtos.requestUrl"
            placeholder="请输入链接地址"
            class="dto-url"
          />
          <el-input
            v-model="dtos.name"
            placeholder="链接名称"
            class="dto-name"
          />
          <el-select v-model="dtos.requestMethod" class="dto-method">
            <el-option value="GET"></el-option>
            <el-option value="PUT"></el-option>
            <el-option value="POST"></el-option>
            <el-option value="DELETE"></el-option>
          </el-select>
          <el-button
            v-if="index === form.panGuAuthDtos.length - 1"
            type="success"
            size="small"
            icon="el-icon-plus"
            circle
            plain
            @click="onDtosAdd"
          />
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            circle
            plain
            @click="onDtosDelete(index)"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div>
        <el-button type="primary" size="small" @click="onSubmit">
          确定
        </el-button>
        <el-button size="small" @click="updateVisible(false)"> 取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script>
import { saveAuth, getAuthDetail } from '@/api/authority';
function PanGuAuthDto(dto) {
  return Object.assign(
    this,
    dto || {
      id: null, // 权限连接ID,新增时为null,编辑时，需要传递值
      name: '', // 权限连接名称
      requestMethod: 'GET', // 请求方式
      requestUrl: '', // 接口url连接
    }
  );
}
function AuthObject(authObj, sort) {
  if (typeof authObj === 'object') {
    Object.assign(this, authObj);
    if (!this.panGuAuthDtos) {
      this.panGuAuthDtos = [];
    } else {
      this.panGuAuthDtos = this.panGuAuthDtos.map(
        item => new PanGuAuthDto(item)
      );
    }
    return this;
  } else {
    const parentId = authObj;
    return Object.assign(this, {
      menuId: null,
      menuName: '', // 按钮名称
      frontToolName: '', // 前端id
      description: '', // 描述
      parentId: parentId || -1, // 父节点ID，若是一级，父节点传-1
      menuType: 1, // 类型 1菜单 2 按钮
      sort: sort || '', // 排序
      panGuAuthDtos: [], // 对应的权限连接集合
    });
    k;
  }
}
export default {
  props: {
    visible: Boolean,
    menuId: Number,
    parent: Object,
  },
  data() {
    return {
      loading: false,
      form: new AuthObject(),
      rules: {
        menuName: [
          { required: true, message: '请输入按钮名称', trigger: 'blur' },
        ], // 按钮名称
        // frontToolName: [
        //   { required: true, message: '请输入前端id', trigger: 'blur' },
        // ],
        // description: [
        //   { required: true, message: '请输入描述', trigger: 'blur' },
        // ], 
        menuType: [{ required: true, message: '请选择类型', trigger: 'blur' }], // 类型 1菜单 2 按钮
        sort: [{ required: true, message: '请输入按钮排序', trigger: 'blur' }],
      },
    };
  },
  computed: {
    title() {
      return `${this.menuId ? '编辑' : '新建'}按钮权限`;
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      this.$refs.form && this.$refs.form.clearValidate();
      if (this.parent) {
        // 创建新权限表单对象，传入父级权限id 和 父级权限子级数量+1(用于sort默认值)
        this.form = new AuthObject(
          this.parent.id,
          this.parent.children ? this.parent.children.length + 1 : undefined
        );
      } else {
        this.form = new AuthObject();
      }
      if (this.menuId) {
        this.loading = true;
        getAuthDetail(this.menuId)
          .then(res => {
            if (res.code === 1000000) {
              this.form = new AuthObject(res.data);
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.message);
              this.updateVisible(false);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    makeLinkValidator(index) {
      const validator = (rule, value, callback) => {
        const dtos = this.form.panGuAuthDtos[index];
        if (!dtos) {
          callback();
        }
        if (!dtos.requestUrl) {
          callback(new Error('请输入链接地址'));
        } else if (!dtos.name) {
          callback(new Error('请输入链接名称'));
        } else if (!dtos.requestMethod) {
          callback(new Error('请选择请求方式'));
        } else {
          callback();
        }
      };
      return { required: true, validator, trigger: 'blur' };
    },
    onDtosAdd() {
      this.form.panGuAuthDtos.push(new PanGuAuthDto());
    },
    onDtosDelete(index) {
      this.form.panGuAuthDtos.splice(index, 1);
    },
    onSubmit() {
      this.$refs.form
        .validate()
        .then(result => {
          if (result) {
            saveAuth(this.form).then(res => {
              if (res.code === 1000000) {
                this.$message.success(`${this.menuId ? '编辑' : '添加'}权限成功`);
                this.$emit('saveAuth', res.data);
                this.updateVisible(false);
              }
            });
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
.form-add-dtos {
  margin-left: 30px;
  margin-bottom: 22px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 22px;
}
.auth-form-input {
  width: 300px;
}
.dto-url {
  width: 240px;
}
.dto-name {
  width: 100px;
}
.dto-method {
  width: 100px;
}
</style>