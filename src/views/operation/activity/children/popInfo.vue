<!-- 活动弹窗配置 -->
<template>
	<div>
		<div align="right">
			<el-col :span="18">
				<el-button type="primary" @click="addPop" v-if="!pop.length">新增弹窗</el-button>
			</el-col>
		</div>
		<el-form class="demo-form" v-for="(item, index) in pop" :model="item" ref="ruleForm" label-width="100px" :key="index">
			<el-form-item label="展示顺序" required>
				<el-col :span="4"><el-input v-model="item.order" placeholder="输入1-100整数" maxlength="3"></el-input></el-col>
				<el-col :span="14" align="right">
					<el-button type="primary" @click="addPop" v-if="index == pop.length-1">新增弹窗</el-button>
					<el-button type="primary" @click="removePop(index)" v-if="pop.length>0">删除</el-button>
				</el-col>
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
		
			<el-form-item label="展示时长" required>
				<el-col :span="3"><el-input v-model="item.times" placeholder="输入展示时长 **s" maxlength="3"></el-input></el-col>
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
			<el-form-item label="上传图片" required>
				<el-col :span="6">
					<el-upload
						ref="upload"
						class="avatar-uploader"
						:auto-upload="false"
						:action="actionUrl"
						:show-file-list="false"
						:on-success="(res, file) => {return handleSuccess(res, file, index);}"
						:on-change="file => {return previewUpload(file, index);}"
						:before-upload="file => {return beforeUpload(file, index);}"
					>
						<img v-if="item.img" :src="item.img" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
		actionUrl:{
			type:String,
			required:true
		},	
		pop: {
			type: Array,
			required: true
		},
		popDefault: {
			type: Object,
			required: true
		}
	},
	methods: {
		//增加pop
		addPop(){
			let obj = Object.assign({},this.popDefault);//复制一个对象
			this.pop.push(obj);
		},
		//删除pop
		removePop(i){
			this.pop.splice(i,1);
		},
		//图片上传成功后执行
		handleSuccess(res, file, i) {
			console.log(i);
			console.log(this.pop[i]);
			console.log(file);
			return;
			this.pop[i].img = URL.createObjectURL(file.raw);
		},
		//图片选择后执行
		previewUpload(file, i) {
			console.log(i);
			console.log(i);
			console.log(i);
			console.log(this.pop[i]);
			console.log(file);
			this.pop[i].img = URL.createObjectURL(file.raw);
		},
		beforeUpload(file, i) {
			console.log(i);
			console.log(this.pop[i]);
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
};
</script>

<style>
	.demo-form{
		border-bottom: 1px dotted #e1e1e1;
		margin-bottom: 40px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 250px;
		height: 350px;
		line-height: 350px;
		text-align: center;
	}
	.avatar {
		width: 250px;
		height: 350px;
		display: block;
	}
</style>
