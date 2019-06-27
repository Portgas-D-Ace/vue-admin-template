<template>
	<div class="page-container">
		<!-- 页面头部盒子 -->
		<div class="header-box">
			<div class="search-box">
				<el-form class="page-search-box" ref="form" :model="form" label-width="70px">
					<el-form-item label="关键字">
						<el-input v-model="form.searchValue" :placeholder="form.placeholder" @keyup.enter.native="searchList">
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
				<el-table-column align="center" label="ID" width="300">
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
						<span>{{ scope.row.starttime }}</span>-
						<span>{{ scope.row.endtime }}</span>
					</template>
				</el-table-column>
				<el-table-column class-name="status-col" label="状态" width="110" align="center">
					<template slot-scope="scope">
						<el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | statusValFilter }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="操作" width="200" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'activityEdit', query: {id:scope.row.id}}">
							<el-button type="success" size="small">编辑</el-button>
						</router-link>
						<el-button type="danger" size="small" @click="delActivityDialogFn(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination v-if="val" class="pagination-box" align="center"  background @current-change="handleCurrentChange"
			 :current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" :total="count">
			</el-pagination>
			<el-dialog
			  title="提示"
			  :close-on-click-modal="false"
			  :before-close="cancelDelActivityFn"
			  :visible.sync="centerDialogVisible"
			  width="30%"
			  center>
			  <span>确定要删除此活动吗？</span>
			  <span slot="footer" class="dialog-footer">
				<el-button @click="cancelDelActivityFn">取 消</el-button>
				<el-button type="danger" @click="delActivityFn">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {getList} from '@/api/activity'
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
	export default {
		filters: {
			statusFilter(status) {
				const statusMap = {
					2: 'success',
					1: 'gray',
					0: 'danger'
				}
				return statusMap[status]
			},
			statusValFilter(status) {
				const statusMap = {
					0: '已下线',
					1: '已上线',
					2: '已过期'
				}
				return statusMap[status]
			},
			
		},
		data() {
			return {
				//搜索框数据
				form: {
					searchValue: '',
					placeholder: '活动名称'
				},
				//数据列表数据
				list: [],
				allList:[],
				listLoading: true,
				currentPage: 1, //初始页
				pagesize: 10,
				count:0,
				val: false,
				//弹窗状态
				centerDialogVisible:false,
				deleteId:'',
			}
		},
		created() {
			this.fetchData();
			console.log('mock:',process.env.VUE_APP_BASE_API);
		},
		methods: {
			//搜索列表数据
			searchList(){
				let val = this.form.searchValue;
				this.list= this.allList.filter( item => item.name && item.name.includes(val));
				this.count = this.list.length;
				this.val = (this.count / this.pagesize) > 1 ? true : false
			},
			//请求列表数据
			fetchData() {
				this.listLoading = true
				let page = this.currentPage;
				let size = this.pagesize;
				let name = this.form.searchValue;
				return new Promise((resolve, reject) => {
					axios.post(process.env.VUE_APP_BASE_API+'/admin/activity/list',{},{
						headers: {
							"token":getToken()  //token换成从缓存获取
						}
					}).then(response => {
						let res = response.data;
						console.log(res)
						if(res.code == 200){
							this.list = res.data.list;
							this.allList = res.data.list;
							this.allList.forEach(function(v,k){
								if(v.name == null){
									v.name ='';
								}
							})
							console.log(this.allList);
							this.count = this.list.length;
							this.val = (this.count / this.pagesize) > 1 ? true : false
						}
						this.listLoading = false
					}).catch(error => {
						reject(error)
						console.log(error)
					})
				})
			},
			//提交请求
			onSubmit() {
				console.log(this.form.searchValue)
				return;
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
			//点击删除此活动弹窗
			delActivityDialogFn(id){
				this.centerDialogVisible =true
				this.deleteId = id;
			},
			//点击删除活动弹窗确认
			delActivityFn(){
				return new Promise((resolve, reject) => {
					axios.post(process.env.VUE_APP_BASE_API+'/admin/activity/del',{id:this.deleteId},{
						headers: {
							"token":getToken()  //token换成从缓存获取
						}
					}).then(response => {
						console.log(response)
						if(response.data.code == 200){
							this.list = this.list.filter(todo => todo.id !== this.deleteId)
							this.centerDialogVisible = false
							this.deleteId = '';
							this.$message('删除成功');
						}else{
							this.$message(response.data.msg);
						}
						
					}).catch(error => {
						reject(error)
						console.log(error)
					})
				})
				return
				
			},
			//取消删除事件
			cancelDelActivityFn(){
				this.centerDialogVisible = false
				this.deleteId = '';
			}
		}
	}
</script>

<style>
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
