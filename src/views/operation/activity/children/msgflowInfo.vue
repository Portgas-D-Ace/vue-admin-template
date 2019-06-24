<!-- 活动-信息流配置 -->
<template>
	<div>
		<el-col :span="18" align="right">
			<el-button type="primary" @click="addMsgFlow" v-if="!msgFlow.length">新增信息流</el-button>
		</el-col>
		<el-form class="demo-form" v-for="(item, index) in msgFlow" :model="item" label-width="120px" :key="index">
			<el-form-item label="信息流文案" required>
				<el-col :span="12"><el-input v-model="item.info" placeholder="" maxlength="70"></el-input></el-col>
				<el-col :span="4" align="right">
					<el-button type="primary" @click="addMsgFlow" v-if="index == msgFlow.length-1">新增信息流</el-button>
					<el-button type="primary" @click="removeMsgFlow(index)" v-if="msgFlow.length>0">删除</el-button>
				</el-col>
			</el-form-item>
			
			<el-form-item label="上传图片">
				<el-col :span="8">
					<el-upload
						class="msgflow-uploader"
						:auto-upload="false"
						:action="actionUrl"
						:show-file-list="false"
						:on-success="(res, file) => {return handleMsgFlowSuccess(res, file, index);}"
						:on-change="file => {return previewMsgFlowUpload(file, index);}"
						:before-upload="file => {return beforeMsgFlowUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="msgflow" />
						<i v-else class="el-icon-plus msgflow-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col :span="4"><span>*说明：文案和图片至少存在一个</span></el-col>
			</el-form-item>
			
			<el-form-item label="展示顺序" required>
				<el-col :span="4"><el-input v-model="item.order" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
			</el-form-item>
			
			<el-form-item label="跳转连接" required>
				<el-col :span="12"><el-input v-model="item.url"></el-input></el-col>
			</el-form-item>
			
			<el-form-item label="弹窗逻辑">
				<el-radio-group v-model="item.type">
					<el-radio :label="1">每天首次登录展示</el-radio>
					<el-radio :label="2">登录即展示</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="定点推送">
				<el-checkbox-group v-model="item.pushType">
					<el-checkbox :label="item.pushType" name="type">是否开启定点推送</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			
			<el-form-item label="需推送时间点" v-if="item.pushType">
				<el-tag :key="tag" v-for="tag in item.pushList" closable :disable-transitions="false"
				 @close="handleClose(tag,index)">
					{{tag}}
				</el-tag>
				<el-popover placement="bottom-start" width="600" height="400" trigger="click">
					<el-form-item label="">
						<el-input type="textarea" v-model="pushTime" 
						@keyup.enter.native="handleInputConfirm(index)" 
						@blur="handleInputConfirm(index)">
						</el-input>
					</el-form-item>
					<el-button  class="button-new-tag" slot="reference" size="small">添加需推送时间点</el-button>
				</el-popover>
			</el-form-item>
			
			<el-form-item label="推送信息上大屏" v-if="item.pushType && item.pushList.length>0">
				<el-checkbox-group v-model="item.barPushType">
					<el-checkbox :label="item.barPushType" name="type">是否推送信息上大屏</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			
		</el-form>	
	</div>
</template>

<script>
export default {
	name:'msgflowInfo',
	props:{
		actionUrl:{
			type:String,
			required:true
		},	
		msgFlow:{
			type:Array,
			required:true
		},
		msgFlowDefault:{
			type:Object,
			required:true
		}
	},
	data(){
		return{
			pushTime:'',
		}
	},
	methods:{
		//增加信息流
		addMsgFlow(){
			this.msgFlow.push(this.msgFlowDefault);
		},
		//删除信息流
		removeMsgFlow(i){
			console.log(i);
			this.msgFlow.splice(i,1);
		},
		//图片上传成功后执行
		handleMsgFlowSuccess(res, file, i) {
			console.log(i);
			console.log(this.msgFlow[i]);
			console.log(file);
			return;
			this.msgFlow[i].img = URL.createObjectURL(file.raw);
		},
		//图片选择后执行
		previewMsgFlowUpload(file, i) {
			console.log(i);
			console.log(this.msgFlow[i]);
			console.log(file);
			this.msgFlow[i].img = URL.createObjectURL(file.raw);
		},
		beforeMsgFlowUpload(file, i) {
			console.log(i);
			console.log(msgFlow[i]);
			console.log(file);
			//console.log(URL.createObjectURL(file));
			//this.item.img = URL.createObjectURL(file.raw);
			return;

			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		//删除 添加的推送时间点
		handleClose(tag,i) {
			this.msgFlow[i].pushList.splice(this.msgFlow[i].pushList.indexOf(tag), 1);
		},
		//添加推送时间点
		handleInputConfirm(i) {
			let idStr =  this.pushTime.replace(/\s*/g,"");//获取输入的时间点id字符串--并去除所有空格
			if(!idStr)return;	
			let idList = idStr.split(',');				//分割成数组
			idList = Array.from(new Set(idList));		//数组去重
			for(let k = 0; k< idList.length; k++){
				let inputValue = idList[k];
				if(!inputValue)return
				if (this.msgFlow[i].pushList.includes(inputValue)) {
					// 酒吧id 已存在 
					// this.$message({
					// 	message: '已添加的酒吧id',
					// 	type: 'error'
					// });
				} else {
					// 添加到酒吧id-tags
					this.msgFlow[i].pushList.push(inputValue);
				}
			}
			this.pushTime = '';
		}
	}
}
</script>

<style>
	.msgflow-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.msgflow-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.msgflow-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 375px;
		height: 280px;
		line-height: 280px;
		text-align: center;
	}
	.msgflow {
		width: 375px;
		height: 280px;
		display: block;
	}
</style>
