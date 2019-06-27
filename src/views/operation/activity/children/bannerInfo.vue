<!-- 活动banner配置 -->
<template>
	<div>
		<div align="right">
			<el-col :span="18">
				<el-button type="primary" @click="addBannerFn" v-if="!banner.length">新增Banner</el-button>
			</el-col>
		</div>
		<el-form class="demo-form" v-for="(item, index) in banner" :model="item" label-width="100px" :key="index">
			<el-form-item label="上传图片" required>
				<el-col :span="10">
					<el-upload
						class="banner-uploader"
						:auto-upload="false"
						:action="''"
						:show-file-list="false"
						:on-change="file => {return previewBannerUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="banner" />
						<i v-else class="el-icon-plus banner-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col :span="8" align="right">
					<el-button type="primary" @click="submitBannerFn(index)" v-if="banner.length>0">提交</el-button>
					<el-button type="danger" @click="removeBannerFn(index)" v-if="banner.length>0">删除</el-button>
					<el-button type="primary" @click="addBannerFn" v-if="index == banner.length-1 && banner.length<2">新增Banner</el-button>
				</el-col>
			</el-form-item>
			
			<el-form-item label="展示顺序" required>
				<el-col :span="4"><el-input v-model="item.sort" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
			</el-form-item>
			
			<el-form-item label="跳转连接" required>
				<el-col :span="12"><el-input v-model="item.url"></el-input></el-col>
			</el-form-item>
			
		</el-form>
	</div>
</template>

<script>
	export default {
		name:'bannerInfo',
		props:{
			banner:{
				type:Array,
				required:true,
			},
			bannerDefault:{
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
				uploadState:true
			}
		},
		methods:{
			//增加banner
			addBannerFn(){
				if(!this.basic.id){
					//未提交基本配置
					this.$message({
					  message: '请先完善并提交基本配置',
					  type: 'warning',
					});
					return
				}else{
					//已有2张banner
					if(this.banner.length>2) {
						this.$message({
						  message: 'banner配置最多可以添加2条',
						  type: 'warning',
						});
						return
					}
					//添加一个新的banner对象
					let obj = Object.assign({},this.bannerDefault);//复制一个对象
					this.banner.push(obj);
				}	
			},
			//提交banner
			submitBannerFn(i){
				if(!this.uploadState){
					this.$message({
					  message: 'banner-图片正在上传',
					  type: 'error',
					});
					return
				}
				if(!this.banner[i].url || !this.banner[i].sort || !this.banner[i].img){
					
					this.$message({
					  message: '请先完善需提交的banner配置信息',
					  type: 'error',
					});
					return
				}
				//获取提交 banner配置信息
				let bannerid = this.banner[i].id;
				let obj = Object.assign({type:2,aid:this.basic.id},this.banner[i]);
				console.log(obj);
				//设置提交url
				let $url = '/admin/activityitem/add';
				if(bannerid){
					$url = '/admin/activityitem/update';
				}
				//提交此条banner配置信息
				this.requestFn($url,obj,response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 500){
						if(!bannerid){
							this.banner[i].id = res.data;
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
			//删除banner
			removeBannerFn(i){
				//获取bannerid 是否存在
				let bannerid = this.banner[i].id;
				if(bannerid){
					//发起删除请求
					this.requestFn('/admin/activityitem/del',{id:bannerid},response =>{
						console.log(response)
						let res = response.data;
						if(res.code == 500){
							//删除本地 banner配置信息
							this.banner.splice(i,1);
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
					//删除本地 banner配置信息
					this.banner.splice(i,1);
				}	
			},
			//图片选择后执行
			previewBannerUpload(file, i) {
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
				this.banner[i].img = URL.createObjectURL(file.raw);
				//发起上传请求
				let formData=new FormData();
                formData.append('file',file.raw);
                let files = formData;
				this.requestFn('/upload/uploadPhoneImg',files,response =>{
					console.log(response)
					let res = response.data;
					if(res.code == 500){
						this.banner[i].img = res.data;
						this.$message({
						  message: '图片已上传完成',
						  type: 'success',
						});
					}else{
						this.$message({
						  message: res.msg,
						  type: 'error',
						});
					}
					this.uploadState = true
					this.listLoading = false
				},error =>{
					this.uploadState = true
					this.listLoading = false
					console.log(error)
				});
			},
		}
	}
</script>

<style>
	.banner-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.banner-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.banner-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 375px;
		height: 45px;
		line-height: 45px;
		text-align: center;
	}
	.banner {
		width: 375px;
		height: 45px;
		display: block;
	}
</style>
