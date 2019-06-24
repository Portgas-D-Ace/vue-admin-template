<!-- 活动banner配置 -->
<template>
	<div>
		<div align="right">
			<el-col :span="18">
				<el-button type="primary" @click="addBanner" v-if="!banner.length">新增Banner</el-button>
			</el-col>
		</div>
		<el-form class="demo-form" v-for="(item, index) in banner" :model="item" label-width="100px" :key="index">
			<el-form-item label="上传图片" required>
				<el-col :span="10">
					<el-upload
						class="banner-uploader"
						:auto-upload="false"
						:action="actionUrl"
						:show-file-list="false"
						:on-success="(res, file) => {return handleBannerSuccess(res, file, index);}"
						:on-change="file => {return previewBannerUpload(file, index);}"
						:before-upload="file => {return beforeBannerUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="banner" />
						<i v-else class="el-icon-plus banner-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col :span="8" align="right">
					<el-button type="primary" @click="addBanner" v-if="index == banner.length-1">新增Banner</el-button>
					<el-button type="primary" @click="removeBanner(index)" v-if="banner.length>0">删除</el-button>
				</el-col>
			</el-form-item>
			
			<el-form-item label="展示顺序" required>
				<el-col :span="4"><el-input v-model="item.order" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
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
			actionUrl:{
				type:String,
				required:true
			},	
			banner:{
				type:Array,
				required:true,
			},
			bannerDefault:{
				type:Object,
				required:true
			}
		},
		methods:{
			//增加banner
			addBanner(){
				let obj = Object.assign({},this.bannerDefault);//复制一个对象
				this.banner.push(obj);
			},
			//删除banner
			removeBanner(i){
				this.banner.splice(i,1);
			},
			//图片上传成功后执行
			handleBannerSuccess(res, file, i) {
				console.log(i);
				console.log(this.banner[i]);
				console.log(file);
				return;
				this.banner[i].img = URL.createObjectURL(file.raw);
			},
			//图片选择后执行
			previewBannerUpload(file, i) {
				console.log(i);
				console.log(this.banner[i]);
				console.log(file);
				this.banner[i].img = URL.createObjectURL(file.raw);
			},
			beforeBannerUpload(file, i) {
				console.log(i);
				console.log(thisbanner[i]);
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
			}
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
