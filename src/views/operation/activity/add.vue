<template>
	<div class="page-container">
		<el-tabs v-model="activeName">
			<el-tab-pane label="活动基本配置" name="first">
					<basicinfo :ruleForm="basic.ruleForm" :rules="basic.rules"></basicinfo>
			</el-tab-pane>
			
			<el-tab-pane label="banner配置" name="second">
					<bannerinfo :banner="banner" :bannerDefault="bannerDefault" :actionUrl="actionUrl"></bannerinfo>
			</el-tab-pane>
			
			<el-tab-pane label="弹窗配置" name="third">
					<popinfo :pop="pop" :popDefault="popDefault" :actionUrl="actionUrl"></popinfo>
			</el-tab-pane>
			
			<el-tab-pane label="信息流配置" name="fourth">
					<msgflowinfo :msgFlow="msgFlow" :msgFlowDefault="msgFlowDefault" :actionUrl="actionUrl"></msgflowinfo>
			</el-tab-pane>
			
			<el-tab-pane label="大屏动画配置" name="fifth">
					<bigscreeninfo :bigScreen="bigScreen" :bigScreenDefault="bigScreenDefault" :actionUrl="actionUrl"></bigscreeninfo>
			</el-tab-pane>
			
		</el-tabs>
		<div class="btn-box">
			<el-button type="primary" @click="submitForm">立即创建</el-button>
			<el-button @click="resetForm">重置</el-button>
		</div>
	</div>
</template>
<script>
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
				actionUrl:'https://jsonplaceholder.typicode.com/posts/',
				activeName: 'first',
				//基本数据
				basic: {
					ruleForm: {
						name: '',//活动名称
						date1: '',//活动时间 array[0] 开始时间 array[1] 结束时间
						type: [],//
						barTags: [],
						desc: '',
					},
					rules: {
						name: [{
								required: true,
								message: '请输入活动名称',
								trigger: 'blur'
							},
							{
								min: 3,
								max: 10,
								message: '长度在 3 到 10 个字符',
								trigger: 'blur'
							}
						],
						// date1: [{
						// 	type: 'date',
						// 	required: true,
						// 	message: '请选择日期',
						// 	trigger: 'change'
						// }],
						date2: [{
							type: 'date',
							required: true,
							message: '请选择时间',
							trigger: 'change'
						}],
					}
				},
				//弹窗默认数据
				popDefault:{
					order:'',
					url:'',
					img:'',
					type:1,
					times:10,
				},
				//弹窗数据
				pop:[
					// {
					// 	order:'',//弹窗展示顺序
					// 	url:'',	//跳转地址
					// 	img:'',	//弹窗图片链接
					// 	type:1,	//每天首次登录展示：1  登录即展示：2
					// 	times:10,//展示时长
					// },
				],
				//banner默认数据
				bannerDefault:{
						order:'',//banner顺序
						url:'',	//跳转地址
						img:'',	//弹窗图片链接
				},
				//banner数据
				banner:[
					// {
					// 	order:'',//banner展示顺序
					// 	url:'',	//跳转地址
					// 	img:'',	//弹窗图片链接
					// }
				],
				//信息流默认数据
				msgFlowDefault:{
					order:'',//信息流展示顺序
					url:'',//跳转地址
					info:'',//信息流文案
					img:'',//信息流展示图片链接 --可不传
					type:1,//每天首次登录展示：1  登录即展示：2
					pushType:false,	// 是否开启定点推送
					pushList:[],//推送的时间点
					barPushType:false,//是否开启大屏推送
				},
				//信息流数据
				msgFlow:[
					// {
					// 	order:'',//信息流展示顺序
					// 	url:'',//跳转地址
					// 	info:'',//信息流文案
					// 	img:'',//信息流展示图片链接 --可不传
					// 	type:1,//每天首次登录展示：1  登录即展示：2
					// 	pushType:false,	// 是否开启定点推送
					// 	pushList:[],//推送的时间点
					// 	barPushType:false,//是否开启大屏推送
					// }
				],
				//大屏官方动画默认数据
				bigScreenDefault:{
						urlType:1,//1 :img 2:video
						url:'',//图片或者视频链接
						times:'',//默认的展示时长
						type:false,//是否开屏就展示
						pushType:false,	// 是否开启定点推送
						pushList:[],//推送的时间点
				},
				//大屏动画数据
				bigScreen:[
					// {
					// 	urlType:1,//1 :img 2:video
					// 	url:'',//图片或者视频链接
					// 	times:'',//默认的展示时长
					// 	type:false,//是否开屏就展示
					// 	pushType:false,	// 是否开启定点推送
					// 	pushList:[],//推送的时间点
					// }
				]
			}
		},
		methods: {
			submitForm() {
				console.log(this.basic.ruleForm)
			},
			resetForm() {
				console.log(this.basic.ruleForm)
				//this.$refs[formName].resetFields();
			}
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
