<!-- 活动-大屏官方动画配置 -->
<template>
	<div>
		<el-col :span="18" align="right">
			<el-button type="primary" @click="addBigScreen" v-if="!bigScreen.length">新增大屏动画</el-button>
		</el-col>
		<el-form class="demo-form" v-for="(item, index) in bigScreen" :model="item" label-width="120px" :key="index">
			<el-form-item label="上传图片/视频" required>
				<el-col :span="10">
					<el-upload
						class="bigscreen-uploader"
						:auto-upload="false"
						:action="actionUrl"
						:show-file-list="false"
						:on-success="(res, file) => {return handleBigScreenSuccess(res, file, index);}"
						:on-change="file => {return previewBigScreenUpload(file, index);}"
						:before-upload="file => {return beforeBigScreenUpload(file, index);}"
					>
						<div v-if="item.url">
							<img v-if="item.urlType == 1" :src="item.url" class="bigscreen" />
							<video controls="controls" v-else :src="item.url" class="bigscreen" ></video>
						</div>
						<i v-else class="el-icon-plus bigscreen-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col :span="8" align="right">
					<el-button type="primary" @click="addBigScreen" v-if="index == bigScreen.length-1">新增大屏动画</el-button>
					<el-button type="primary" @click="removeBigScreen(index)" v-if="bigScreen.length>0">删除</el-button>
				</el-col>
			</el-form-item>
			
			
			<el-form-item label="展示时长" required>
				<el-col :span="5"><el-input v-model="item.times" placeholder="输入展示时长 **s" maxlength="3"></el-input></el-col>
				<el-col :span="1" align="left"><span style="padding-left: 8px;">秒</span></el-col>
				<!-- <el-radio-group v-model="item.times">
					<el-radio :label="10">10s</el-radio>
					<el-radio :label="15">15s</el-radio>
					<el-radio :label="20">20s</el-radio>
					<el-radio :label="25">25s</el-radio>
					<el-radio :label="30">30s</el-radio>
					<el-radio :label="35">35s</el-radio>
					<el-radio :label="40">40s</el-radio>
				</el-radio-group> -->
			</el-form-item>
			
			<el-form-item label="展示逻辑">
				<el-checkbox-group v-model="item.type">
					<el-checkbox :label="item.type" name="type">是否开屏即展示</el-checkbox>
				</el-checkbox-group>
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
		</el-form>
	</div>
</template>

<script>
	export default {
		name:'bigscreenInfo',
		props:{
			actionUrl:{
				type:String,
				required:true
			},	
			bigScreen:{
				type:Array,
				required:true
			},
			bigScreenDefault:{
				type:Object,
				required:true
			}
		},
		data(){
			return {
				pushTime:'',
			}
		},
		methods:{
			//增加信息流
			addBigScreen(){
				let obj = Object.assign({},this.bigScreenDefault);//复制一个对象
				this.bigScreen.push(obj);
			},
			//删除信息流
			removeBigScreen(i){
				console.log(i);
				this.bigScreen.splice(i,1);
			},
			//图片上传成功后执行
			handleBigScreenSuccess(res, file, i) {
				console.log(i);
				console.log(this.bigScreen[i]);
				console.log(file);
				return;
				this.bigScreen[i].url = URL.createObjectURL(file.raw);
			},
			//图片选择后执行
			previewBigScreenUpload(file, i) {
				console.log(i);
				console.log(this.bigScreen[i]);
				console.log(file.raw.type);
				var type = file.raw.type.slice(0,5);
				console.log(type);
				if(type == 'video'){
					console.log(1234)
					this.bigScreen[i].urlType = 2;
				}else if(type == 'image'){
					this.bigScreen[i].urlType = 1;
				}else{
					
				}
				this.bigScreen[i].url = URL.createObjectURL(file.raw);
			},
			beforeBigScreenUpload(file, i) {
				console.log(i);
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
	.bigscreen-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.bigscreen-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.bigscreen-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 240px;
		height: 135px;
		line-height: 135px;
		text-align: center;
	}
	.bigscreen {
		width: 240px;
		height: 135px;
		display: block;
	}
</style>
