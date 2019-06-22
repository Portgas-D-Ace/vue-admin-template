<template>
	<div class="page-container">
		<!-- 页面头部盒子 -->
		<div class="header-box">
			<div class="search-box">
				<el-form class="page-search-box" ref="form" :model="form" label-width="80px">
					<el-form-item label="关键字">
						<el-input 
						v-model="form.searchValue"
						:placeholder="form.placeholder"
						@keyup.enter.native="onSubmit">
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<el-button class="add-btn" type="primary" @click="onSubmit">添加新活动</el-button>
		</div>
		<!-- table 活动列表 -->
		<div class="table-box">
			<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
				<el-table-column align="center" label="ID" width="95">
					<template slot-scope="scope">
						{{ scope.$index }}
					</template>
				</el-table-column>
				<el-table-column label="活动名称">
					<template slot-scope="scope">
						{{ scope.row.title }}
					</template>
				</el-table-column>
				<el-table-column  label="活动时间" width="320" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.start_time }}</span>-
						<span>{{ scope.row.end_time }}</span>
					</template>
				</el-table-column>
				<el-table-column class-name="status-col" label="状态" width="110" align="center">
					<template slot-scope="scope">
						<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="操作" width="200" align="center">
					<template slot-scope="scope">
						<el-button type="success">编辑</el-button>
						<el-button type="danger">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {getList} from '@/api/table'
	export default {
		filters: {
			statusFilter(status) {
				const statusMap = {
					已开启: 'success',
					已关闭: 'gray',
					已下线: 'danger'
				}
				return statusMap[status]
			}
		},
		data() {
			return {
				form: {
					searchValue: '',
					placeholder: '活动ID、活动名称'
				},
				list: null,
				listLoading: true
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				this.listLoading = true
				getList().then(response => {
					this.list = response.data.items
					this.listLoading = false
				})
			},
			onSubmit() {
				this.$message('submit!')
				return;
			},
			onCancel() {
				this.$message({
					message: 'cancel!',
					type: 'warning'
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.page-container {
		min-height: calc(100vh - 130px);
		width: 100%;
		position: relative;
		overflow: hidden;
		padding: 40px;
		border-radius: 20px;
		-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 0, 0, 0.1);
		-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1);
		background-color: white;
	}
	.header-box{
		position:relative;
		margin-bottom:20px;
	}	
	.search-box {
		width: 450px;
		height: 40px;
		margin: 0 auto;
	}
	.add-btn{
		position:absolute;
		right:0;
		top: 0;
		
	}	
</style>
