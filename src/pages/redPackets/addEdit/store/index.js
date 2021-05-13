export default {
    state: {
        step: '0',
        first: {
            activityName: '',
            startTime: '',
            endTime: '',
            activityTag: '',
            tagDescribe: ''
        },
        chooseClassId: [],
        third: {
            aloneMoney: '',
            aloneAmout: '',
            aloneLimit: '',
            groupMoney: '',
            groupAmout: '',
            groupLimit: ''
        }
    },
    getters: {
        getStep: state => state.step,
        getFirst: state => state.first,
        getChooseId: state => state.chooseClassId,
        getThird: state => state.third,
    },
    mutations: {
        changeStep(state, obj) {
            state.step = obj;
        },
        saveFirst(state, obj) {
            state.first = obj;
        },
        saveThird(state, obj) {
            state.third = obj;
        },
        saveClassId(state, obj) {
            state.chooseClassId = obj
            // if (obj.type == 2) {
            //     state.chooseClassId = obj
            // } else {
            //     state.chooseClassId = state.chooseClassId.concat(obj.content);
            // }

        },
        editData(state, obj) { //编辑

            var ary = [];
            [].concat(obj.classList).map((item) => {
                ary.push(item.classId)
            })
            state.chooseClassId = ary;
            state.first = {
                activityName: obj.activeName,
                startTime: obj.beginTime,
                endTime: obj.endTime,
                activityTag: obj.activeLabel,
                tagDescribe: obj.lableDesc
            };
            state.third = {
                aloneMoney: obj.aloneByPrice,
                aloneAmout: obj.aloneNum,
                aloneLimit: obj.aloneMiniPrice,
                groupMoney: obj.collageByPrice,
                groupAmout: obj.collageNum,
                groupLimit: obj.collageMiniPrice
            }
        },
        resetData(state, obj) { //新建
            state.step = 0;
            state.chooseClassId = [];
            state.first = {
                activityName: '',
                startTime: '',
                endTime: '',
                activityTag: '',
                tagDescribe: ''
            };
            state.third = {
                aloneMoney: '',
                aloneAmout: '',
                aloneLimit: '',
                groupMoney: '',
                groupAmout: '',
                groupLimit: ''
            }
        },
    },
    actions: {

    }
}