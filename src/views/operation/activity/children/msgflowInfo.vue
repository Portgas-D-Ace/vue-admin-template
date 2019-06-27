<!-- 活动-信息流配置 -->
<template>
	<div>
		<el-col :span="18" align="right">
			<el-button type="primary" @click="addMsgFlowFn" v-if="!msgFlow.length">新增信息流</el-button>
		</el-col>
		<el-form class="demo-form" v-for="(item, index) in msgFlow" :model="item" label-width="120px" :key="index">
			<el-form-item label="信息流文案" required>
				<el-col :span="10"><el-input v-model="item.text" placeholder="请输入信息流文案" type="textarea" autosize maxlength="70"></el-input></el-col>
				<el-col :span="8" align="right">
					<el-button type="primary" @click="submitMsgFlowFn(index)" v-if="msgFlow.length>0">提交</el-button>
					<el-button type="danger" @click="removeMsgFlowFn(index)" v-if="msgFlow.length>0">删除</el-button>
					<el-button type="primary" @click="addMsgFlowFn" v-if="index == msgFlow.length-1 && msgFlow.length<2">新增信息流</el-button>
				</el-col>
				<el-col :span="24">
					<span class="tips" >*说明：文案和图片至少存在一个</span>
				</el-col>
			</el-form-item>
			<el-form-item label="上传图片">
				<el-col :span="8">
					<el-upload
						class="msgflow-uploader"
						:auto-upload="false"
						:action="''"
						:show-file-list="false"
						:on-change="file => {return previewMsgFlowUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="msgflow" />
						<i v-else class="el-icon-plus msgflow-uploader-icon"></i>
					</el-upload>
				</el-col>
			</el-form-item>
			
			<el-form-item label="展示顺序" required>
				<el-col :span="5"><el-input v-model="item.sort" @input="checkSortValue(index)" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
			</el-form-item>
			
			<el-form-item label="跳转连接" required>
				<el-col :span="12"><el-input v-model="item.url"></el-input></el-col>
			</el-form-item>
			
			<el-form-item label="弹窗逻辑">
				<el-radio-group v-model="item.logic">
					<el-radio :label="1">每天首次登录展示</el-radio>
					<el-radio :label="2">登录即展示</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="定点推送">
				<el-radio-group v-model="item.pushType">
					<el-radio :label="0">关闭</el-radio>
					<el-radio :label="2">开启</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="需推送时间点" v-if="item.pushType">
				<el-tag :key="tag" v-for="tag in item.pushList" closable :disable-transitions="false"
				 @close="handleClose(tag,index)">
					{{tag}}
				</el-tag>
				<el-popover placement="bottom-start" width="600" height="400" trigger="click">
					<el-form-item label="">
						<el-input type="textarea" v-model="pushTime" 
						placeholder="请用英文状态' , '分隔时间点"
						@keyup.enter.native="handleInputConfirm(index)" 
						@blur="handleInputConfirm(index)">
						</el-input>
					</el-form-item>
					<el-button  class="button-new-tag" slot="reference" size="small">添加需推送时间点</el-button>
				</el-popover>
			</el-form-item>
			
			<el-form-item label="推送信息上大屏" v-if="item.pushType && item.pushList.length>0">
				<el-radio-group v-model="item.bigscreen">
					<el-radio :label="0">关闭</el-radio>
					<el-radio :label="1">开启</el-radio>
				</el-radio-group>
			</el-form-item>
			
		</el-form>	
	</div>
</template>

<script>
export default {
	name:'msgflowInfo',
	props:{
		msgFlow:{
			type:Array,
			required:true
		},
		msgFlowDefault:{
			type:Object,
			required:true
		},
		basic:{
			type:Object,
			required:true
		},
		requestFn:{
			type:Function,
		}
	},
	data(){
		return{
			pushTime:'',
			uploadState:true,
		}
	},
	methods:{
		//增加信息流
		addMsgFlowFn(){
			if(!this.basic.id){
				//未提交基本配置
				this.$message({
				  message: '请先完善并提交基本配置',
				  type: 'warning',
				});
				return
			}else{
				//已有2 -msgFlow
				if(this.msgFlow.length>2) {
					this.$message({
					  message: '信息流配置最多可以添加2条',
					  type: 'warning',
					});
					return
				}
				//添加一个新的msgFlow对象
				let obj = Object.assign({},this.msgFlowDefault);//复制一个对象
				this.msgFlow.push(obj);
			}	
		},
		//提交信息流配置
		submitMsgFlowFn(i){
			if(!this.uploadState){
				this.$message({
				  message: '信息流-图片正在上传-请稍后提交',
				  type: 'error',
				});
				return
			}
			let info = Boolean(this.msgFlow[i].text || this.msgFlow[i].img);
			
			if(!this.msgFlow[i].sort || !this.msgFlow[i].url || !info){
				this.$message({
				  message: '请先完善需提交的信息流配置信息',
				  type: 'error',
				});
				return
			}
			//获取提交 信息流配置信息
			let msgFlowid = this.msgFlow[i].id;
			let obj = Object.assign({type:3,aid:this.basic.id},this.msgFlow[i]);
			obj.logic = obj.logic + obj.pushType;
			if(obj.pushType==2 && obj.pushList.length>0){
				obj.times = obj.pushList.join(',');
			}
			console.log(obj);
			//设置提交url
			let $url = '/admin/activityitem/add';
			if(msgFlowid){
				$url = '/admin/activityitem/update';
			}
			//提交信息流配置信息
			this.requestFn($url,obj,response =>{
				console.log(response)
				let res = response.data;
				if(res.code == 200){
					if(!msgFlowid){
						this.msgFlow[i].id = res.data;
					}
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
		//删除信息流
		removeMsgFlowFn(i){
			//获取msgFlowid 是否存在
			let msgFlowid = this.msgFlow[i].id;
			if(msgFlowid){
				//发起删除请求
				this.requestFn('/admin/activityitem/del',{id:msgFlowid},response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 200){
						//删除本地 信息流配置信息
						this.msgFlow.splice(i,1);
						this.$message({
						  message: "已删除",
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
			}else{
				//删除本地 ba信息流nner配置信息
				this.msgFlow.splice(i,1);
			}	
		},
		
		//图片选择后执行
		previewMsgFlowUpload(file, i) {
			this.uploadState = false;
			const isImage = file.raw.type.includes('image');
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isImage) {
				this.$message.error('上传图片格式错误!');
			}
			if (!isLt5M) {
				this.$message.error('上传文件大小不能超过 5MB!');
			}
			if(!isImage || !isLt5M)return;
			this.msgFlow[i].img = URL.createObjectURL(file.raw);
			//发起上传请求
			let formData=new FormData();
			formData.append('file',file.raw);
			let files = formData;
			this.requestFn('/upload/uploadPhoneImg',files,response =>{
				console.log(response)
				let res = response.data;
				if(res.code == 200){
					this.msgFlow[i].img = res.data;
				}else{
					
				}
				this.uploadState = true
				this.listLoading = false
			},error =>{
				this.uploadState = true
				this.listLoading = false
				console.log(error)
			});
		},
		
		//删除 添加的推送时间点
		handleClose(tag,i) {
			this.msgFlow[i].pushList.splice(this.msgFlow[i].pushList.indexOf(tag), 1);
		},
		//添加推送时间点
		handleInputConfirm(i) {
			let reg = /^(([0-1]?\d)|(2[0-4])):[0-5]?\d$/;
			let idStr =  this.pushTime.replace(/\s*/g,"");//获取输入的时间点id字符串--并去除所有空格
			if(!idStr)return;	
			let idList = idStr.split(',');				//分割成数组
			idList = Array.from(new Set(idList));		//数组去重
			for(let k = 0; k< idList.length; k++){
				let inputValue = idList[k];
				if(!inputValue)return
				if (this.msgFlow[i].pushList.includes(inputValue)) {
					// 时间点 已存在 
				} else {
					// 添加到 时间点-tags
					if(reg.test(inputValue)){
						this.msgFlow[i].pushList.push(inputValue);
					}
				}
			}
			this.pushTime = '';
		},
		//检测输入展示位置的 value
		checkSortValue(i){
			this.msgFlow[i].sort = this.msgFlow[i].sort.replace(/\D/g,'');
			if(this.msgFlow[i].sort >100)this.msgFlow[i].sort=100
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
		width: 250px;
		height: 188px;
		line-height: 188px;
		text-align: center;
	}
	.msgflow {
		width: 250px;
		height: 188px;
		display: block;
	}
	.tips{
		color: #909399;
	}
		
</style>
