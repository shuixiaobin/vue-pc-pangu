<template>
  <div
    class="r-select"
    :class="{active: active}"
    v-bodyclick="close"
  >
    <div class="placeholder-text" @click="handleClick">
      <span>{{placeholderText}}</span>
      <i class="el-icon-arrow-down" />
    </div>
    <div v-show="active" style="text-align: left;">
      <transition name="dropdown-menu">
        <div class="filter-dropdown">
          <input @click.stop ref="input" type="text" v-model="filterInput" autofocus class="filter-search" :placeholder="'筛选 ' + type"/>
          <div class="dropdown-tab" @click.stop><button class="dropdown-tab-tag active">{{type}}</button></div>
          <div ref="menu" class="dropdown-tab-menu">
            <div
              class="dropdown-menu-item"
              @click="handleSelect(item)"
              v-for="item in filterOptions"
              :key="item.value"
            ><i class="el-icon-check" :class="{'dropdown-selected': dropdownSelected(item)}"></i>{{ item.label }}</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: {
    options: {},
    value: {},
    placeholder: {},
    wrapperStyle: {},
    headClick: {},
    type: {},
    multiple: Boolean,
  },
  computed: {
    placeholderText () {
      if (this.multiple) {
        return `${this.placeholder}${this.value.length > 0 ? `(${this.value.length})` : ''}`
      }
      if (this.value == undefined) {
        return this.placeholder
      } else {
        const d =  this.options.find(item => item.value === this.value)
        return d ? d.label : ''
      }
    },
    filterOptions () {
      const v = this.filterInput.trim()
      if (!v) {
        return this.options
      } else {
        return this.options.filter(item => item.label.search(v) !== -1)
      }
    },
  },
  data () {
    return {
      active: false,
      filterInput: '',
    }
  },
  methods: {
    dropdownSelected (item) {
      if (this.multiple) {
        if (!this.value || this.value.length === 0) return false
        return this.value.indexOf(item.value) > -1
      } else {
        return item.value === this.value
      }
    },
    handleClick (e) {
      if (!this.options || this.options.length === 0) {
        this.$message.info(this.type + ' 暂无数据')
        return
      }
      this.ignoreBodyClick = true
      this.active = !this.active
      setTimeout(() => (this.ignoreBodyClick = false))
      if (this.headClick) {
        this.headClick(e)
      }
    },
    handleSelect (data) {
      if (this.multiple) {
        const d = this.value || []
        const idx = d.indexOf(data.value)
        if (idx > -1) {
          this.$emit('input', d.filter(item => item !== data.value))
        } else {
          this.$emit('input', d.concat([data.value]))
        }
      } else {
        if (data.value === this.value) {
          this.$emit('input', null)
        } else {
          this.$emit('input', data.value)
        }
        this.close()
      }
    },
    close () {
      if (this.ignoreBodyClick) return
      this.active = false
    }
  },
  components: {
  }
}
</script>

<style>
.dropdown-menu-enter-active, .dropdown-menu-leave-active {
  transition: opacity .2s;
}
.dropdown-menu-enter, .dropdown-menu-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="less" scoped>
.r-select {
  display: inline-block;
  position: relative;
  height: 100%;
  min-width: 150px;
  padding: 5px 20px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  text-align: center;
  .placeholder-text {
    cursor: pointer;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(102,102,102,1);
  }
  .arrow {
    display: inline-block;
    transition: transform 0.3s;
    transform: rotate(0deg);
  }
  &.active {
    .arrow {
      transform: rotate(180deg);
    }
  }
  .type-wrapper {
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 2;
      min-width: 118px;
      text-align: center;
      background: #fff;
      box-sizing: border-box;
      padding: 0 10px;
      box-shadow: 2px 2px 10px #e8e8e8;
      .type-item {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #f3f3f3;
        white-space:nowrap;
        font-size: 14px;
        color: #999999;
        cursor: pointer;
        &:hover, &.selected {
          color: #ff6666;
        }

      }
    }
}

.filter-dropdown {
  position: absolute;
  top: 50px;
  left: 20px;;
  z-index: 2;
  // min-width: 220px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
  font-size: 14px;
  border-radius: 5px;
  color: rgba(0,0,0,0.65);
  .filter-search {
    line-height: 20px;
    padding: 5px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    outline: none;
    width: 200px;
    &:focus {
      border-color: #66afe9;
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    }
  }
  .dropdown-tab {
    border-bottom: 1px solid #ddd;
    padding-left: 5px;
    .dropdown-tab-tag {
      font: inherit;
      font-size: 12px;
      outline: none;
      padding: 2px 5px;
      border-radius: 5px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      margin-bottom: -1px;
      z-index: 10;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      color: inherit;
      margin-left: 5px;
      &.active {
        border-bottom: 1px solid white;
      }
    }
  }
  .dropdown-tab-menu {
    overflow-y: auto;
    max-height: 400px;
    min-height: 10px;
  }
  .dropdown-menu-item {
    cursor: pointer;
    padding-top: 8px;
    padding-right: 18px;
    padding-bottom: 10px;
    max-width: 236px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre;
    display: block;
    // padding-left: 30px;
    .el-icon-check {
      visibility: hidden;
      font-weight: bold;
      color: green;
      width: 20px;
      text-align: center;
    }
    .el-icon-check.dropdown-selected {
      visibility: visible;
    }
    & ~ .dropdown-menu-item {
      border-top: 1px solid #f5f5f5;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
