import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
const state = {
  token: getToken(),
  name: '',
  avatar: ''
}
let vm = new Vue();

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
		console.log(userInfo)
		// axios.post('http://192.168.5.23:8079/login', qs.stringify(logObj)).then(response => {
		// 	console.log(response);
		// 	if(response.data.code == 200){
		// 		setToken(response.data.data)
		// 		setToken(response.data.data) //就后台返回的token存到cookie
		// 		_this.commit('SET_TOKEN',response.data.data)
		// 		_this.$router.push({ path: _this.redirect || '/' })	
		// 		_this.loading = false
		// 	}
		// })
		// .catch(function (error) {
		// console.log(error);
		// });
		// 
		// axios.post('http://192.168.5.23:8079/login', qs.stringify({ tel: tel.trim(), password: password })).then(response => {
		//   const { data } = response
		// 	console.log(data.data)
		//   setToken(data.data) //就后台返回的token存到cookie
		//   commit('SET_TOKEN', data.data)
		// 	console.log(userInfo)
		// }).catch(error => {
		// 	console.log(error)
		// })
		// return
    return new Promise((resolve, reject) => {
      //login(qs.stringify({ tel: tel.trim(), password: password })).then(response => {
			axios.post(process.env.VUE_APP_BASE_API+'/login', qs.stringify({ tel: username.trim(), password: password })).then(response => {
        const { data } = response
				console.log(data)
				if(data.code == 200){
					setToken(data.data.token) 				//就后台返回的token存到cookie
					commit('SET_TOKEN', data.data.token)
				}
				resolve(data)
      }).catch(error => {
        reject(error)
				console.log(error)
				vm.$alert('网络错误','提示',{
					type:'error',
					center:true
				});
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
		
		// return
    return new Promise((resolve, reject) => {
			axios.post(process.env.VUE_APP_BASE_API+'/admin/user/get',{},{
				 headers: {
           "token":state.token  //token换成从缓存获取
        }
			}).then(response => {
			  const { data } = response
			  console.log(response)
				if (!data) {
					reject('验证失败，请重新登录')
				}
				console.log(data);
				commit('SET_NAME', data.data.barName)
				resolve(data)
			}).catch(error => {
			  reject(error)
				console.log(error)
			})
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
			axios.post(process.env.VUE_APP_BASE_API+'/admin/user/logout',{},{
				 headers: {
			     "token":state.token  //token换成从缓存获取
			  }
			}).then(response => {
				console.log(response);
			  commit('SET_TOKEN', '')
			  removeToken()
			  resetRouter()
			  resolve()
			}).catch(error => {
			  reject(error)
				console.log(error)
			})
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
	
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

