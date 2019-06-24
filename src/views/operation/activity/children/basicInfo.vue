<!-- 活动基本配置 -->
<template>
	<div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
			
			<el-form-item label="活动名称" required>
				<el-col :span="12">
					<el-input v-model="ruleForm.name"></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="活动时间" required>
				<el-col :span="16">
					<el-form-item prop="date1">
						<el-date-picker :disabled="ruleForm.date2" v-model="ruleForm.date1" type="daterange" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期" style="width: 75%;"></el-date-picker>
						<el-checkbox v-model="ruleForm.date2">永久</el-checkbox>
					</el-form-item>
				</el-col>
			</el-form-item>

			<el-form-item label="筛选用户" prop="type">
				<el-checkbox-group v-model="ruleForm.type">
					<el-checkbox label="酒吧管理员" name="type"></el-checkbox>
					<el-checkbox label="新用户" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item label="剔除酒吧" prop="barTags">
				<el-tag :key="tag" v-for="tag in ruleForm.barTags" closable :disable-transitions="false" @close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-popover placement="bottom-start" width="600" height="400" trigger="click">
					<el-form-item label="">
						<el-input type="textarea" v-model="barId" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
					</el-form-item>
					<el-button  class="button-new-tag" slot="reference" size="small">添加需要剔除的酒吧id</el-button>
				</el-popover>
			</el-form-item>
			
			<el-form-item label="活动说明" prop="desc">
				<el-input type="textarea" v-model="ruleForm.desc"></el-input>
			</el-form-item>

		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'basicInfo',
		props: {
			ruleForm: {
				type: Object,
				required: true
			},
			rules: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				barId:'',
			}
		},
		methods: {
			//删除 添加的酒吧id
			handleClose(tag) {
				this.ruleForm.barTags.splice(this.ruleForm.barTags.indexOf(tag), 1);
			},
			//添加酒吧id
			handleInputConfirm() {
				let idStr =  this.barId.replace(/\s*/g,"");//获取输入的酒吧id字符串--并去除所有空格
				if(!idStr)return;	
				let idList = idStr.split(',');				//分割成数组
				idList = Array.from(new Set(idList));		//数组去重
				for(let i = 0; i< idList.length; i++){
					let inputValue = idList[i];
					if(!inputValue)return
					if (this.ruleForm.barTags.includes(inputValue)) {
						// 酒吧id 已存在 
						// this.$message({
						// 	message: '已添加的酒吧id',
						// 	type: 'error'
						// });
					} else {
						// 添加到酒吧id-tags
						this.ruleForm.barTags.push(inputValue);
					}
				}
				this.barId = '';
			}
		}
	}
</script>

<style>
	.el-tabs__content{
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
