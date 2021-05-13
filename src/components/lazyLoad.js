export default {
  abstract: true,
  name: 'lazy-load-component',
  props: ['show'],
  created () {
    this.cacheChild = null
  },
  render (h) {
    if (!this.cacheChild && (!this.show || !this.$slots.default)) return h('div')
    const vnode = this.$slots.default[0]
    if (this.cacheChild) {
      vnode.componentInstance = this.cacheChild.componentInstance
    } else {
      this.cacheChild = vnode
    }

    return vnode
  }
}
