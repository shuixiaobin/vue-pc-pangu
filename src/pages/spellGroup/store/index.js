export default {
    state:{
        chooseRid:[],
        findData:[],
    },
    getters:{
        getChooseRid:state=>state.chooseRid,
        getInfoList:state=>state.findData
    },
    mutations:{
        saveRid(state,obj){
            state.chooseRid = obj
        },
        saveData(state,obj){
            state.findData.push(obj)
        },
        clearData(state,obj){
            console.log(state.findData)
            state.findData.map((item,index)=>{
                if(state.findData[index].rid == obj){
                    state.findData.splice(index,1);
                    return
                }
            })
            console.log(state.findData)
        }
    }
}