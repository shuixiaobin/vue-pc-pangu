/*
     <um type="editStem" :setValue="getStem" @change="getContent"   ref="stem"></um>
 */


<template style="width:577px;height:378px">
    <div style="height:378px">
        <iframe :id="editorId" class="zhlEditor" src="static\umeditor-1.2.3\indexUm.html" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>

<script>
    // <img src="http://latex.codecogs.com/gif.latex?\sqrt{a^2+b^2}">
    import { mapGetters, mapActions } from "vuex";
    export default {
      data() {
        return {
          editorId: new Date().getTime()+'',
          editor: ""
        };
      },
      created() {
        sessionStorage.setItem("WEBPACK_AJAX_BASE_URL", encodeURI(BASEURL));
      },
      props: {
        setValue: {
          type: String,
          default: ""
        },
      },
      mounted() {
        var that = this;
        document
          .getElementById(this.editorId)
          .setAttribute("style", "overflow-y: scroll;");

        var iframe = document.getElementById(this.editorId);
        iframe.onload = function() {
          that.initUmeditor();
        };
      },
      watch: {
        setValue(val) {
          if (val == "") this.editor.setContent(val);
        }
      },
      methods: {
        initUmeditor() {
          this.editor = document.getElementById(this.editorId).contentWindow.um;
          this.editor.setContent(this.setValue);
          this.editor.addListener(
            "contentChange keyup keydown",
            function() {
              // const subStr = new RegExp("&#39;", "g");
              const wordCount = this.editor.getContentLength(true);
              // 获取标签内容
              const content = this.editor.getContent()
              // .replace(subStr, "");
              // 获取文本内容
              const plainTxt = this.editor.getPlainTxt()
              // .replace(subStr, "");
              this.$nextTick(() => {
                this.$emit('change', content)
              });
            }.bind(this)
          );

          // this.editor.addListener("blur", () => {
          //   console.log(this.num + "失去焦点");
          //   //vex里数据同步，根据id隐藏相应的编辑器
          //   this.$store.dispatch("setEditHidden", this.num);
          // });
        },
        getEditorContent() {
          return this.editor.getContent();
        },
        getEditorTxt() {
          return this.editor.getPlainTxt();
        },
        setDisabled() {
          //  不可编辑
          this.editor.setDisabled();
        },
        setEnabled() {
          //  可编辑
          this.editor.setEnabled();
        },
        setUmContent (val = '') {
          if (this.editor) {
            this.editor.setContent(val)
          }
        },
        setVal() {
          this.editor.setContent(this.setValue);
        },
        setLatexVal(a) {
          this.editor.setContent(a);
        },
        insertLatex (str) {
          this.editor.execCommand('inserthtml', str, true)
        }
      }
    };
</script>

<style scoped>
</style>
