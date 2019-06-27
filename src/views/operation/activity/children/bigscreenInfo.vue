<!-- 活动-大屏官方动画配置 -->
<template>
	<div>
		<el-col :span="18" align="right">
			<el-button type="primary" @click="addBigScreenFn" v-if="!bigScreen.length">新增大屏动画</el-button>
		</el-col>
		<el-form class="demo-form" v-for="(item, index) in bigScreen" :model="item" label-width="120px" :key="index">
			<el-form-item label="上传图片/视频" required>
				<el-col :span="10">
					<el-upload
						class="bigscreen-uploader"
						:auto-upload="false"
						:action="''"
						:show-file-list="false"
						:on-change="file => {return previewBigScreenUpload(file, index);}"
					>
						<div v-if="item.img">
							<img v-if="item.urltype == 0" :src="item.img" class="bigscreen" />
							<video controls="controls" v-else :src="item.img" class="bigscreen" ></video>
						</div>
						<i v-else class="el-icon-plus bigscreen-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col :span="8" align="right">
					<el-button type="primary" @click="submitBigScreenFn(index)" v-if="bigScreen.length>0">提交</el-button>
					<el-button type="danger" @click="removeBigScreenFn(index)" v-if="bigScreen.length>0">删除</el-button>
					<el-button type="primary" @click="addBigScreenFn" v-if="index == bigScreen.length-1 && bigScreen.length<2">新增大屏动画</el-button>
				</el-col>
			</el-form-item>
			
			
			<el-form-item label="展示时长" required>
				<el-col :span="5"><el-input v-model="item.nums" @input="checkNumsValue(index)" placeholder="输入展示时长 **s" maxlength="3"></el-input></el-col>
				<el-col :span="1" align="left"><span style="padding-left: 8px;">秒</span></el-col>
			</el-form-item>
			
			<el-form-item label="开屏展示">
				<el-radio-group v-model="item.logic">
					<el-radio :label="1">关闭</el-radio>
					<el-radio :label="2">开启</el-radio>
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
		</el-form>
	</div>
</template>

<script>
	export default {
		name:'bigscreenInfo',
		props:{
			bigScreen:{
				type:Array,
				required:true
			},
			bigScreenDefault:{
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
			return {
				pushTime:'',
				uploadState:true,
			}
		},
		methods:{
			//增加大屏动画配置
			addBigScreenFn(){
				if(!this.basic.id){
					//未提交基本配置
					this.$message({
					  message: '请先完善并提交基本配置',
					  type: 'warning',
					});
					return
				}else{
					//已有2 -bigScreen
					if(this.bigScreen.length>2) {
						this.$message({
						  message: '大屏动画配置最多可以添加2条',
						  type: 'warning',
						});
						return
					}
					//添加一个新的msgFlow对象
					let obj = Object.assign({},this.bigScreenDefault);//复制一个对象
					this.bigScreen.push(obj);
				}	
			},
			//提交大屏动画配置
			submitBigScreenFn(i){
				if(!this.uploadState){
					this.$message({
					  message: '大屏动画-文件正在上传-请稍后提交',
					  type: 'error',
					});
					return
				}
				if(!this.bigScreen[i].img || !this.bigScreen[i].nums){
					this.$message({
					  message: '请先完善需提交的大屏动画配置信息',
					  type: 'error',
					});
					return
				}
				//获取提交 信息流配置信息
				let bigScreenId = this.bigScreen[i].id;
				let obj = Object.assign({type:4,aid:this.basic.id},this.bigScreen[i]);
				obj.logic = obj.logic + obj.pushType;
				if(obj.pushType==2 && obj.pushList.length>0){
					obj.times = obj.pushList.join(',');
				}
				console.log(obj);
				//设置提交url
				let $url = '/admin/activityitem/add';
				if(bigScreenId){
					$url = '/admin/activityitem/update';
				}
				//提交 大屏动画配置信息
				this.requestFn($url,obj,response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 200){
						if(!bigScreenId){
							this.bigScreen[i].id = res.data;
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
			//删除大屏动画配置
			removeBigScreenFn(i){
				//获取bigScreenid 是否存在
				let bigScreenid = this.bigScreen[i].id;
				if(bigScreenid){
					//发起删除请求
					this.requestFn('/admin/activityitem/del',{id:bigScreenid},response =>{
						console.log(response)
						let res = response.data;
						if(res.code == 200){
							//删除本地 信息流配置信息
							this.bigScreen.splice(i,1);
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
					this.bigScreen.splice(i,1);
				}	
			},
			
			//图片选择后执行
			previewBigScreenUpload(file, i) {
				this.uploadState = false;
				const isImage = file.raw.type.includes('image');
				const isVideo = file.raw.type.includes('video');
				const isLt5M = file.size / 1024 / 1024 < 5;
				
				if(isImage){
					this.bigScreen[i].urltype = 0;
				}
				if(isVideo){
					this.bigScreen[i].urltype = 1;
				}
				if (!isLt5M) {
					this.$message.error('上传文件大小不能超过 5MB!');
				}
				if (!(isImage || isVideo)) {
					this.$message.error('上传文件格式错误!');
				}else{
					
				}
				if(!(isImage || isVideo) || !isLt5M)return;
				this.bigScreen[i].img = URL.createObjectURL(file.raw);
				//发起上传请求
				let formData=new FormData();
				formData.append('file',file.raw);
				let files = formData;
				this.requestFn('/upload/uploadPhoneImg',files,response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 200){
						this.bigScreen[i].img = res.data;
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
				this.bigScreen[i].pushList.splice(this.bigScreen[i].pushList.indexOf(tag), 1);
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
					if (this.bigScreen[i].pushList.includes(inputValue)) {
						// 时间点 已存在 
					} else {
						// 添加到 时间点-tags
						if(reg.test(inputValue)){
							this.bigScreen[i].pushList.push(inputValue);
						}
					}
				}
				this.pushTime = '';
			},
			//检测输入展示位置的 value
			checkNumsValue(i){
				this.bigScreen[i].nums = this.bigScreen[i].nums.replace(/\D/g,'');
				if(this.bigScreen[i].nums >100)this.bigScreen[i].nums=100
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
