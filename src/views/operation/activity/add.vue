<template>
	<div class="page-container" v-loading="loading">
		<el-tabs v-model="activeName">
			<el-tab-pane label="活动基本配置" name="first">
					<basicinfo :basic="basic"></basicinfo>
			</el-tab-pane>
			
			<el-tab-pane label="banner配置" name="second">
					<bannerinfo :banner="banner" :bannerDefault="bannerDefault" :basic="basic" :requestFn="requestFn"></bannerinfo>
			</el-tab-pane>
			
			<el-tab-pane label="弹窗配置" name="third">
					<popinfo :pop="pop" :popDefault="popDefault" :basic="basic" :requestFn="requestFn"></popinfo>
			</el-tab-pane>
			
			<el-tab-pane label="信息流配置" name="fourth">
					<msgflowinfo :msgFlow="msgFlow" :msgFlowDefault="msgFlowDefault" :basic="basic" :requestFn="requestFn"></msgflowinfo>
			</el-tab-pane>
			
			<el-tab-pane label="大屏动画配置" name="fifth">
					<bigscreeninfo :bigScreen="bigScreen" :bigScreenDefault="bigScreenDefault" :basic="basic" :requestFn="requestFn"></bigscreeninfo>
			</el-tab-pane>
			
		</el-tabs>
		<div class="btn-box" v-if="activeName== 'first'">
			<el-button type="primary" @click="submitForm">立即创建</el-button>
			<el-button @click="backGo">返回</el-button>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
	import Basicinfo from './children/basicInfo'
	import Popinfo from './children/popInfo'
	import Bannerinfo from './children/bannerInfo'
	import Msgflowinfo from './children/msgflowInfo'
	import Bigscreeninfo from './children/bigscreenInfo'
	
	export default {
		components: {
			Basicinfo,Popinfo,Bannerinfo,Msgflowinfo,Bigscreeninfo
		},
		data() {
			return {
				actionUrl: process.env.VUE_APP_BASE_API+'/upload/uploadPhoneImg',
				activeName: 'first',
				loading:false,
				//基本数据
				basic:{
					id:'',			//活动id
					state:1,		//活动状态	0：下线；1：上线
					isdel:0,		//0未删除 	1删除
					name: '',		//活动名称
					starttime:'',	//活动开始时间
					endtime:'',		//活动结束时间
					barids:'',		//筛选酒吧id列表		string 用英文 ; 隔开
					users:'',		//筛选用户id列表		string 用英文 ; 隔开
					nobarids:'',	//剔除酒吧id列表		string 用英文 ; 隔开
					nousers:'',		//剔除用户id列表		string 用英文 ; 隔开
					baradminid:0,	//是否剔除酒吧管理员	0未剔除 	1剔除
					date1: [],		//活动时间 array[0] 开始时间 array[1] 结束时间
				},
				//banner默认数据
				bannerDefault:{
					id:'',
					sort:'',//banner顺序
					url:'',	//跳转地址
					img:'',	//弹窗图片链接
				},
				//banner数据
				banner:[],
				//弹窗默认数据
				popDefault:{
					id:'',
					sort:'',//弹窗展示顺序
					url:'',	//跳转地址
					img:'',	//弹窗图片链接
					logic:0,	//每天首次登录展示：0  登录即展示：1
					nums:10,//展示时长
				},
				//弹窗数据
				pop:[],
				//信息流默认数据
				msgFlowDefault:{
					id:'',
					sort: '', //信息流展示顺序
					url: '', //跳转地址
					text: '', //信息流文案
					img: '', //信息流展示图片链接 --可不传
					logic: 1, //每天首次登录展示：1  登录即展示：2  每天首次登录展示and定点：3  登录即展示and定点： 4
					pushType: 0, // 是否开启定点推送
					pushList: [], //推送的时间点
					bigscreen:0,//是否开启大屏推送 0 不开启 	1开启
					barPushType: false, //是否开启大屏推送
				},
				//信息流数据
				msgFlow:[],
				//大屏官方动画默认数据
				bigScreenDefault:{
					id:'',
					urltype: 0, //0 :img 1:video
					img: '', //图片或者视频链img
					nums: 10, //默认的展示时长
					logic: 1, //关闭开屏展示：1  开启开屏展示：2  关闭开屏展示and定点：3  开启开屏展示and定点： 4
					pushType: 0, // 是否开启定点推送
					pushList: [], //推送的时间点
				},
				//大屏动画数据
				bigScreen:[]
			}
		},
		methods: {
			//提交活动基本配置
			submitForm() {
				//获取提交配置信息
				let obj = Object.assign({},this.basic);
				if(!obj.name || !obj.starttime || !obj.endtime){
					this.$message({
					  message: '请先完善基本配置',
					  type: 'error',
					});
					return;
				}
				//提交地址
				let $url = '/admin/activity/add';
				if(this.basic.id){
					$url = '/admin/activity/update';
				}
				this.listLoading = true;
				this.requestFn($url,obj,response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 200){
						if(!this.basic.id){
							this.basic.id = res.data;
						}
						console.log(this.basic.id)
						this.$message({
						  message: res.msg,
						  type: 'success',
						});
					}else{
						this.$message({
						  message: res.msg,
						  type: 'error',
						});
					}
					this.listLoading = false
				},error =>{
					this.listLoading = false
					console.log(error)
				});
			},
			//返回
			backGo() {
				this.$router.go(-1);
			},
			//请求数据
			requestFn(url,obj,success,err){
				return new Promise((resolve, reject) => {
					axios.post(process.env.VUE_APP_BASE_API+url,obj,{
						headers: {
							"token":getToken()  //token换成从缓存获取
						}
					}).then(response => {
						console.log(response)
						success(response);
					}).catch(error => {
						reject(error)
						
						console.log(error)
					})
				})
			},
		}
	};
</script>

<style scoped="scoped">
	.page-container{
		padding-bottom: 60px;
	}
	.btn-box {
		position: absolute;
		bottom: 40px;
		width: 100%;
		height: 40px;
		text-align: center;
	}
</style>
