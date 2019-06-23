<template>
	<div class="page-container">
		<el-tabs v-model="activeName">
			<el-tab-pane label="活动基本配置" name="first">
				<basicinfo :ruleForm="basic.ruleForm" :rules="basic.rules"></basicinfo>
			</el-tab-pane>
			<el-tab-pane label="其他配置" name="second">

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
	export default {
		data() {
			return {
				activeName: 'first',
				basic: {
					ruleForm: {
						name: '',
						date1: '',
						date2: false,
						type: [],
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
				}
			}
		},
		components: {
			Basicinfo
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
	.btn-box {
		position: absolute;
		bottom: 40px;
		width: 100%;
		height: 40px;
		text-align: center;
	}
</style>
