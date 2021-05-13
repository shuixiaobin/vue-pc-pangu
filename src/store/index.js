import Vue from 'vue'
import Vuex from 'vuex';

// ------------------------------
import createLogger from 'vuex/dist/logger'
import addRed from '@/pages/redPackets/addEdit/store/index';
import activity from '@/pages/activityManagement/store/index';
import spellId from '@/pages/spellGroup/store/index';
import auth from './auth'
import Util from '@/common/util'

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    strict: debug,
    plugins: debug ? [createLogger()] : [],
    state: {
        token:localStorage.getItem('pg_token') || '',
        username: localStorage.getItem('userName') || '',
        userid: localStorage.getItem('userId') || '',
        oaUserId: localStorage.getItem('oaUserId') || null,
        starMapNum: localStorage.getItem('starMapNum') || null,
				staffNo: localStorage.getItem('staffNo') || null,
				phone: localStorage.getItem('phone') || '',
        roleType: 1,
    },
    mutations: {
        setUserInfo(state, data) {
            localStorage.setItem('pg_token', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('userName', data.username)
            localStorage.setItem('userImg', encodeURIComponent(data.avatar))
            localStorage.setItem('oaUserId', data.ehrUserId)
            localStorage.setItem('starMapNum', data.starAccount)
						localStorage.setItem('staffNo', data.staffNo)
			
            localStorage.setItem('departmentName', data.departmentName)
            localStorage.setItem('name', data.name)
            localStorage.setItem('roleNames', data.roleNames)
						localStorage.setItem('phone', data.phone)

            state.username = data.username
            state.userId = data.userId
            state.token = data.token
						state.phone = data.phone
            state.oaUserId = data.ehrUserId //oa账号id
            state.starMapNum = data.starAccount //星图账号
						state.staffNo = data.staffNo  // OA图钉工号
        },  
        logout(state) {
            localStorage.setItem('pg_token', '')
            localStorage.setItem('userId', '')
            localStorage.setItem('userName','')
						localStorage.setItem('userImg', '')
            localStorage.setItem('oaUserId', '')
            localStorage.setItem('starMapNum', '')
						localStorage.setItem('staffNo', '')
						localStorage.setItem('departmentName', '')
						localStorage.setItem('name', '')
						localStorage.setItem('roleNames', '')
						localStorage.setItem('phone', '')
            Util.setCookie("token",'');
            state.username = ''
            state.userId = ''
            state.token = ''
            state.auth.hasAuth =false;
            state.oaUserId = ''
            state.starMapNum = ''
						state.staffNo = ''
						state.phone = ''
        }
    },
    actions: {},
    modules: {
        addRed: addRed,
        spellId:spellId,
        auth,
        activity
    },
});
