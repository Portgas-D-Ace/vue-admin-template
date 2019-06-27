<!-- 活动弹窗配置 -->
<template>
	<div>
		<div align="right">
			<el-col :span="18">
				<el-button type="primary" @click="addPopFn" v-if="!pop.length">新增弹窗</el-button>
			</el-col>
		</div>
		<el-form class="demo-form" v-for="(item, index) in pop" :model="item" ref="ruleForm" label-width="100px" :key="index">
			<el-form-item label="展示顺序" required>
				<el-col :span="4"><el-input v-model="item.sort"  @input="checkSortValue(index)" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
				<el-col :span="14" align="right">
					<el-button type="primary" @click="submitPopFn(index)" v-if="pop.length>0">提交</el-button>
					<el-button type="danger" @click="removePopFn(index)" v-if="pop.length>0">删除</el-button>
					<el-button type="primary" @click="addPopFn" v-if="index == pop.length-1 && pop.length<2">新增弹窗</el-button>
				</el-col>
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
		
			<el-form-item label="展示时长" required>
				<el-col :span="3"><el-input v-model="item.nums" @input="checkNumsValue(index)" placeholder="输入展示时长 **s" maxlength="3"></el-input></el-col>
				<el-col :span="1" align="left"><span style="padding-left: 8px;">秒</span></el-col>
			</el-form-item>
			<el-form-item label="上传图片" required>
				<el-col :span="6">
					<el-upload
						class="pop-uploader"
						:auto-upload="false"
						:action="''"
						:show-file-list="false"
						:on-change="file => {return previewUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="pop" />
						<i v-else class="el-icon-plus pop-uploader-icon"></i>
					</el-upload>
				</el-col>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'popInfo',
	props: {
		pop: {
			type: Array,
			required: true
		},
		popDefault: {
			type: Object,
			required: true
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
			uploadState:true,
		}
	},
	methods: {
		//增加pop
		addPopFn(){
			if(!this.basic.id){
				//未提交基本配置
				this.$message({
				  message: '请先完善并提交基本配置',
				  type: 'warning',
				});
				return
			}else{
				//已有2 -pop
				if(this.pop.length>2) {
					this.$message({
					  message: '弹窗配置最多可以添加2条',
					  type: 'warning',
					});
					return
				}
				//添加一个新的pop对象
				let obj = Object.assign({},this.popDefault);//复制一个对象
				this.pop.push(obj);
			}	
		},
		submitPopFn(i){
			if(!this.uploadState){
				this.$message({
				  message: '弹窗-图片正在上传-请稍后提交',
				  type: 'error',
				});
				return
			}
			if(!this.pop[i].sort || !this.pop[i].url || !this.pop[i].nums || !this.pop[i].img){
				this.$message({
				  message: '请先完善需提交的弹窗配置信息',
				  type: 'error',
				});
				return
			}
			//获取提交 pop配置信息
			let popid = this.pop[i].id;
			let obj = Object.assign({type:1,aid:this.basic.id},this.pop[i]);
			console.log(obj);
			//设置提交url
			let $url = '/admin/activityitem/add';
			if(popid){
				$url = '/admin/activityitem/update';
			}
			//提交pop配置信息
			this.requestFn($url,obj,response =>{
				console.log(response)
				let res = response.data;
				if(res.code == 200){
					if(!popid){
						this.pop[i].id = res.data;
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
		//删除pop
		removePopFn(i){
			//获取popid 是否存在
			let popid = this.pop[i].id;
			if(popid){
				//发起删除请求
				this.requestFn('/admin/activityitem/del',{id:popid},response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 200){
						//删除本地 pop配置信息
						this.pop.splice(i,1);
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
				//删除本地 pop配置信息
				this.pop.splice(i,1);
			}	
		},
		//图片选择后执行
		previewUpload(file, i) {
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
			this.pop[i].img = URL.createObjectURL(file.raw);
			//发起上传请求
			let formData=new FormData();
			formData.append('file',file.raw);
			let files = formData;
			this.requestFn('/upload/uploadPhoneImg',files,response =>{
				console.log(response)
				let res = response.data;
				if(res.code == 200){
					this.pop[i].img = res.data;
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
		//检测输入展示位置的 value
		checkSortValue(i){
			this.pop[i].sort = this.pop[i].sort.replace(/\D/g,'');
			if(this.pop[i].sort >100)this.pop[i].sort=100
		},
		//检测输入展示位置的 value
		checkNumsValue(i){
			this.pop[i].nums = this.pop[i].nums.replace(/\D/g,'');
			if(this.pop[i].nums >100)this.pop[i].nums=100
		}
	}
};
</script>

<style>
	.demo-form{
		border-bottom: 1px dotted #e1e1e1;
		margin-bottom: 40px;
	}
	.pop-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.pop-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.pop-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 250px;
		height: 350px;
		line-height: 350px;
		text-align: center;
	}
	.pop {
		width: 250px;
		height: 350px;
		display: block;
	}
</style>
