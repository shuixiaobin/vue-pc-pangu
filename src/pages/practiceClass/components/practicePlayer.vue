<template>
	<div class="playerBox">
      <div id="main" class="playerBody"></div>
      <div class="addList">
        <el-table ref="multipleTable" :data="addList" tooltip-effect="dark" style="width:100%" height="500" @selection-change="handleSelectionChange" class="nodetable">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <div @click="Relatedlist(scope.row.id,scope.$index)" class="addList-li clearfix">
              	  <span class="fr">{{scope.row.questionCount}}题</span>
	              <i :class="scope.row.questionCount>0?'el-icon-star-on':'el-icon-star-off'"></i>
	              <span class="htred" v-show="scope.row.pointName.length>20">只能录入20个字符以内</span>
	              <span v-if="scope.row.id!=editInputNum">{{sec_to_time(scope.row.position)}} {{scope.row.pointName}}</span>
	              <el-input v-model="scope.row.pointName" @blur="saveEdit(scope.row)" v-show="scope.row.id==editInputNum"></el-input>              	
              </div>	
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="clearfix"></div>
	</div>
</template>
<script>
import "@/assets/player.css";
import "@/assets/jquery.min.js";
import "@/assets/player.js";
export default {
	data() {
		return {
			player: {},
			curTime: "",
			tableData: null, //查询数据
			selectList: [],
			num:-1
		};
	},
	props:{
		addList:Array,
		editInputNum:Number
	},
	watch:{
		addList(){
			if(this.num>-1){
				this.checked(this.num)
			}
		}
	},
    created() {	
    },
	methods:{  
		sec_to_time(s) {
			var t;
			if (s > -1) {
				var hour = Math.floor(s / 3600);
				var min = Math.floor(s / 60) % 60;
				var sec = s % 60;
				if (hour < 10) {
					t = "0" + hour + ":";
				} else {
					t = hour + ":";
				}

				if (min < 10) {
					t += "0";
				}
				t += min + ":";
				if (sec < 10) {
					t += "0";
				}
				t += sec;
			}
			return t;
		},
		checked(i){
			setTimeout(_=>{
				this.$refs.multipleTable.clearSelection();
				this.$refs.multipleTable.toggleRowSelection(this.addList[i],true);
			})
			// this.$refs.multipleTable.clearSelection();
			// this.$refs.multipleTable.toggleRowSelection(this.addList[i],true);			
		},            
		handleSelectionChange(val) {
			this.$emit("multipleSelection",val)
		},  
		saveEdit(row) {
			if(row.pointName.length<20){
               this.$emit('editInputTitle',row)
			}
		}, 
		Relatedlist(courseBreakpointId,index){
			this.num = index;
			this.checked(index)
			this.$emit('courseBreakpointId',courseBreakpointId) 	
			this.$emit('Relatedexercises')	
		}
	}                 	    
}  
</script>  
<style lang='less' scoped>
  .htred{
  	color:#f66;
  	font-size:12px;
  }
  .mrl20 {
    margin: 0 20px;
  }
  .playerBox {
    padding: 20px;
  }
  .playerBody {
    width: 74%;
    height: 500px;
    float: left;
  }
  .addList {
    width: 24%;
    height: 500px;
    float: right;
    border: 1px solid #e2e2e2;
    background: #fff;
    .addList-li{
    	cursor:pointer;
    }
  }  
</style>  