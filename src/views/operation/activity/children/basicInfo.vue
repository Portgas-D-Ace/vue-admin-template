<!-- 活动基本配置 -->
<template>
	<div>
		<el-form :model="basic" label-width="120px">

			<el-form-item label="活动ID" v-if="basic.id">
				<el-col :span="12">
					<el-input v-model="basic.id" :disabled="true"></el-input>
				</el-col>

			</el-form-item>
			
			<el-form-item label="活动状态" v-if="basic.id">
				<el-col :span="12">
					<el-radio-group v-model="basic.state">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">关闭</el-radio>
					</el-radio-group>
				</el-col>
			</el-form-item>
			
			<el-form-item label="活动名称" required>
				<el-col :span="12">
					<el-input v-model="basic.name"></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="活动时间" required>
				<el-col :span="16">
					<el-form-item>
						<el-date-picker v-model="basic.date1" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" @change="changeTimesFn"
						 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 75%;"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-form-item>
			
			<el-form-item label="筛选酒吧">
				<el-input type="textarea" placeholder="id 请用英文 ; 隔开" autosize v-model="basic.barids"></el-input>
			</el-form-item>
			
			<el-form-item label="筛选用户">
				<el-input type="textarea" placeholder="id 请用英文 ; 隔开" autosize v-model="basic.users"></el-input>
			</el-form-item>
			
			<el-form-item label="活动剔除酒吧">
				<el-input type="textarea" placeholder="id 请用英文 ; 隔开" autosize v-model="basic.nobarids"></el-input>
			</el-form-item>
			
			<el-form-item label="活动剔除用户">
				<el-input type="textarea" placeholder="id 请用英文 ; 隔开" autosize v-model="basic.nousers"></el-input>
			</el-form-item>
			
			<el-form-item label="剔除酒吧管理员">
				<el-radio-group v-model="basic.baradminid">
					<el-radio :label="0">不剔除</el-radio>
					<el-radio :label="1">剔除</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'basicInfo',
		props: {
			basic: {
				type: Object,
				required: true
			}
		},
		methods:{
			//选择活动时间
			changeTimesFn(t){
				console.log(t);
				if(t){
					this.basic.starttime =	t[0];
					this.basic.endtime = 	t[1];
				}else{
					this.basic.starttime =	'';
					this.basic.endtime = 	'';
				}
			},
			//是否剔除活动管理员
			changeCheckBarAdminFn(s){
				console.log(s);
				if(s){
					this.basic.baradminid = 1;
				}else{
					this.basic.baradminid = 0;
				}
			}
		}
	}
</script>

<style>
	.el-tabs__content {
		padding-top: 30px;
	}

	.el-form-item__label {
		padding-right: 15px;
	}

	.el-tag {
		margin-right: 10px;
	}

	.button-new-tag {
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
</style>
