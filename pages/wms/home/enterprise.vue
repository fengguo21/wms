<style lang="less" scoped>
	/*// 企业管理*/
	
	.enterprise {
		width: 100%;
		/*// 头部表单*/
		.table {
			width: 100%;
		}
		.pages {
			padding: 20px;
			text-align: center;
		}
	}
</style>
<template>
	<div class="enterprise">
		<!-- 头部sort -->
		<searchHearder v-on:search="search"></searchHearder>
		<!-- 表格 -->
		<div class="table">
			<el-table :data="storeList" border stripe :v-loading.body="loading">
				<!--<el-table-column label="操作" width="80">
                    <template scope="scope">
                        <el-dropdown>
                            <el-button type="text">
                                <i class="el-icon-setting"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" menu-align="start">
                                <el-dropdown-item>
                                    <el-button @click="edit(scope.row.id)" size="small" type="text">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="del(scope.row.id)" size="small" type="text">删除</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="onShowImg(scope.row.id)" type="text" icon="picture"></el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>-->
                
				<!--<el-table-column label="操作" width="70" fixed="left">
					<template scope="scope">
						<el-button v-if="scope.row.imageArray" :disabled="scope.row.imageArray.length == 0" @click="onShowImg(scope.row.id)" type="text" icon="picture"></el-button>
					</template>
				</el-table-column>-->

				<el-table-column label="创建日期" width="190">
					<template scope="scope">
						<span>{{ scope.row.ctime | userBirthday}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="货主名称" width="240">
				</el-table-column>
				<!--<el-table-column prop="shortName" label="客户简称" width="120">
                </el-table-column>-->
				<el-table-column prop="type" label="经营类型" width="120">
					<template scope="scope">
						<span>{{scope.row.type | customerType}}</span>
						<!--<span v-if="scope.row.type == 1">企业</span>
						<span v-if="scope.row.type == 0">个人</span>-->
					</template>
				</el-table-column>
				<el-table-column prop="mainContact" label="主要联系人" width="120">
				</el-table-column>
				<el-table-column prop="mainPhone" label="手机号码" width="140">
				</el-table-column>
				<el-table-column prop="tel" label="座机号码" width="140">
				</el-table-column>
				<el-table-column prop="address" label="详细地址">
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div class="pages">
			<el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 模态框 -->
		<el-dialog style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
			<addEnterprise :formData="editFormData" v-if="dialogVisible.dialog" v-on:showChange="showChange"></addEnterprise>
		</el-dialog>
		<!-- 图片展示 -->
		<el-dialog size="tiny" style="text-align:center" title="客户信息图片" v-model="showImg">
			<resImgShow :imageArray="imageArray"></resImgShow>
		</el-dialog>
	</div>
</template>
<script>
	import httpService from '../../../common/httpService.js';
	import searchHearder from '../../../components/enterprise/searchHeader.vue';
	import addEnterprise from '../../../components/enterprise/addEnterprise.vue'
	import resImgShow from '../../../components/resImgShow.vue'
	import filters from '../../../filters/index.js'
	let formData = {
		name: '',
		shortName: '',
		contactName: '',
		contactPhone: '',
		contactTel: '',
		type: '',
		pageSize: 10,
		page: 1,
		address: '',
		country: 7
	};

	function getHttp(store, req) {
		let url = httpService.urlCommon + httpService.apiUrl.most;
		let body = {
			biz_module: 'erpCustomerService ',
			biz_method: 'queryWmsCustomerList ',
			biz_param: formData
		};
		if(!httpService.SID) {
			httpService.getSID(req);
		};
		//加密处理接口
		url = httpService.addSID(url);
		body.version = 1;
		body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
		body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
		let obj = {
			body: body,
			path: url
		};
		return store.dispatch('getEnterpriseList', obj);
	};
	export default {
		name: 'enterprise-view',
		data() {
			return {
				showImg: false,
				imageArray: [],
				loading: false,
				formData: formData,
				dialogVisible: {
					dialog: false,
					title: ''
				},
				editFormData: {
					default: null
				}
			}
		},
		components: {
			searchHearder,
			addEnterprise,
			resImgShow
		},
		computed: {
			storeList() {
				return this.$store.state.enterprise.enterpriseList.list;
			},
			total() {
				return this.$store.state.enterprise.enterpriseList.total;
			},

		},
		mounted() {
			this.getHttp()
		},
		methods: {
			search(params) {
				this.formData = params;
				this.getHttp();
			},
			//展示图片组件
			onShowImg(paramsId) {
				//获取编辑时的信息
				this.getUserInfo(paramsId).then(() => {
					this.imageArray = this.$store.state.enterprise.customerInfo.imageArray;
					this.showImg = true;
				})
			},
			getHttp() {
				this.loading = true;
				let _self = this;
				let url = httpService.urlCommon + httpService.apiUrl.most;
				let body = {
					biz_module: 'erpCustomerService',
					biz_method: 'queryWmsCustomerList',
					biz_param: _self.formData
				}
				//加密处理接口
				url = httpService.addSID(url);
				body.version = 1;
				body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
				body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);

				let obj = {
					body: body,
					path: url
				}
				_self.$store.dispatch('getEnterpriseList', obj).then(() => {
					_self.loading = false;
				}, () => {
					_self.loading = false;
				});
			},
			// 编辑客户
			edit(params) {
				this.getUserInfo(params).then(() => {
					this.dialogVisible.dialog = true;
					this.dialogVisible.title = '编辑企业信息';
				})
			},
			// 删除客户
			del(paramsId) {
				let _self = this;
				this.$confirm('确定删除该货主信息？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 执行删除
					let url = httpService.urlCommon + httpService.apiUrl.most;
					let body = {
						biz_module: 'wmsCustomerService',
						biz_method: 'deleteCustomer',
						biz_param: {
							id: paramsId
						}
					}
					//加密处理接口
					url = httpService.addSID(url);
					body.version = 1;
					body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
					body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);

					let obj = {
						body: body,
						path: url
					}
					_self.$store.dispatch('deleteCustomer', obj).then(() => {
						_self.formData.page = 1;
						_self.getHttp();
						this.$message({
							type: 'success',
							message: '删除成功'
						});
					}, () => {
						_self.loading = false;
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			getUserInfo(paramsId) {
				return new Promise((resolve, reject) => {
					//获取数据、
					let _self = this;
					let param = {
						id: paramsId
					}
					let url = httpService.urlCommon + httpService.apiUrl.most;
					let body = {
						biz_module: 'erpCustomerService',
						biz_method: 'queryWmsCustomerById',
						biz_param: param
					}
					//加密处理接口
					url = httpService.addSID(url);
					body.version = 1;
					body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
					body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);

					let obj = {
						body: body,
						path: url
					}
					this.loading = true;
					_self.$store.dispatch('getCustomerInfo', obj).then(() => {

						let obj = this.$store.state.enterprise.customerInfo;
						let p = obj.province.toString();
						let c = obj.city.toString();
						let d = obj.city.toString();
						obj.PCD = [];
						obj.PCD.unshift(d);
						obj.PCD.unshift(c);
						obj.PCD.unshift(p);
						let arr = obj.address.split('/');
						obj.street = arr[arr.length - 1];
						this.editFormData = obj;
						console.log(this.editFormData);
						_self.loading = false;
						resolve();
					}, () => {
						_self.loading = false;
						reject();
					});
				});
			},
			showChange(params) {
				this.dialogVisible = params.dialog;
				this.formData.page = 1;
				this.getHttp();
			},
			handleCurrentChange(val) {
				formData.page = val;
				this.formData.page = val;
				this.getHttp();
			}
		}
	}
</script>