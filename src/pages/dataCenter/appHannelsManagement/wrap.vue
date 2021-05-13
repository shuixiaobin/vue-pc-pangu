<template>
  <el-card style="height: inherit;">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="showApp" label="APP推广渠道管理" name="first">
        <AppHandlers />
      </el-tab-pane>
      <el-tab-pane v-if="showXiaodian" label="华图小店" name="second">
        <Xiaodian />
      </el-tab-pane>
      <el-tab-pane v-if="showZhiTiku" label="华图智题库" name="third">
        <Zhitiku />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import AppHandlers from './index'
import Xiaodian from './Xiaodian'
import Zhitiku from './Zhitiku'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      buttonsList: 'auth/buttonsList'
    }),
    showApp () {
      return this.buttonsList.includes('APP_AD_MANAGE')
    },
    showXiaodian () {
      return this.buttonsList.includes('HT_SMALL_SHOP')
    },
    showZhiTiku () {
      return this.buttonsList.includes('HT_SMALT_TIKU')
    },
  },
  data () {
    return {
      activeName: ''
    }
  },
  created () {
    this.activeName = this.showApp ? 'first'
      : this.showXiaodian ? 'second'
      : this.showZhiTiku ? 'third'
      : ''
  },
  methods: {
    showComponent (auth) {
      return this.buttonsList.includes(auth)
    }
  },
  components: {
    AppHandlers,
    Xiaodian,
    Zhitiku,
  }
}
</script>

<style scoped>

</style>
