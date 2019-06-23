<template>
	<div class="page-container">
		<!-- 页面头部盒子 -->
		<div class="header-box">
			<div class="search-box">
				<el-form class="page-search-box" ref="form" :model="form" label-width="80px">
					<el-form-item label="关键字">
						<el-input v-model="form.searchValue" :placeholder="form.placeholder" @keyup.enter.native="onSubmit">
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<router-link :to="{name:'activityAdd'}">
				<el-button class="add-btn" size="medium" type="primary">添加新活动</el-button>
			</router-link>
		</div>
		<!-- table 活动列表 -->
		<div class="table-box">
			<el-table v-loading="listLoading" 
			:data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
			element-loading-text="Loading" 
			:header-cell-style="{'background-color':'rgba(238,241,246,0.5)',color:'#606266','text-align':'center',padding:'10px 0'}"
			border fit highlight-current-row
			>
				<el-table-column align="center" label="ID" width="195">
					<template slot-scope="scope">
						{{ scope.row.id }}
					</template>
				</el-table-column>
				<el-table-column label="活动名称">
					<template slot-scope="scope">
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="活动时间" width="320" align="center">
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
						<router-link :to="{name:'activityEdit', query: {id:scope.row.id}}">
							<el-button type="success" size="small">编辑</el-button>
						</router-link>
						<el-button type="danger" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination v-if="!val" class="pagination-box" align="center"  background @current-change="handleCurrentChange"
			 :current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" :total="list.length">
			</el-pagination>
			
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
				list: [],
				listLoading: true,
				currentPage: 1, //初始页
				pagesize: 10,
				val: false,
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
					this.val = (this.list.length / this.pagesize) < 1 ? true : false
					console.log(this.val)
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
			},
			// 初始页currentPage、初始每页数据数pagesize和数据data
			handleSizeChange: function(size) {
				this.pagesize = size;
				console.log(this.pagesize) //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage) //点击第几页
			},
		}
	}
</script>

<style>
	/* .el-table td{
		padding: 4px 0;
	} */
	
	.header-box {
		position: relative;
		margin-bottom: 20px;
	}
	.search-box {
		width: 450px;
		height: 45px;
		margin: 0 auto;
	}
	.add-btn {
		position: absolute;
		right: 0;
		top: 0;
	}
	.pagination-box{
		margin-top: 20px;
		/* text-align: center; */
	}
</style>
