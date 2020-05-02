<template>
  <div class="page-container">
    <!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="导航栏名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" label="查询" perms="sys:manage:view" type="primary"  @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" label="新增" perms="sys:manage:add" type="primary" @click="handleAdd"  />
			</el-form-item>
		</el-form>
	</div>
    <!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:manage:edit" permsDelete="sys:manage:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="columns" @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
    <!-- 新增页面 -->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible"  :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" autocomplete="off" type="hidden"></el-input>
			</el-form-item>
			<el-form-item label="序号" prop="sn">
				<el-input v-model="dataForm.sn" autocomplete="off" type="number"></el-input>
			</el-form-item>
			<el-form-item label="导航名称" prop="name">
				<el-input v-model="dataForm.name" autocomplete="off"></el-input>
			</el-form-item>
            <el-form-item label="路由" prop="routing">
				<el-input v-model="dataForm.routing" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="dataForm.status" autocomplete="off" style="float: left;"></el-switch>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
		</div>
	</el-dialog>

  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton";
export default {
  data () {
    return {
        size: 'small',
        loading: false,
		filters: {
			name: ''
        },
        columns: [
			// {prop:"id", label:"ID", minWidth:50},
			{prop:"sn", label:"序号", minWidth:120},
            {prop:"name", label:"导航栏名称", minWidth:120},
            {prop:"routing",label:"路由",minWidth:120},
            {prop:"status", label:"状态", minWidth:120,formatter:this.statusFormat},
			{prop:"createBy", label:"创建人", minWidth:120},
			{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
			// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
			// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        
        operation: false, // true:新增, false:编辑
		dialogVisible: false,//新增编辑页面是否显示
        editLoading: false,
        dataFormRules: {
			sn: [
				{ required: true, message: '请输入序号'},
				// { message: '序号必须为数字'}
			],
			name: [
				{ required: true, message: '请输入分类名称', trigger: 'blur' },
				{ max: 12, message: '长度不能超过12个字符', trigger: 'blur' }
			]
		},
		// 新增编辑界面数据
		dataForm: {
			sn: '',
			name: '',
            status: true,
            routing: ''
		},
    };
  },

  components: {
    KtTable,
    KtButton
  },

  computed: {},

  mounted(){},

  methods: {
    // 获取分页数据
	findPage: function (data) {
		if(data !== null) {
			this.pageRequest = data.pageRequest
		}
		this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
		this.$api.navigationBar.findPage(this.pageRequest).then((res) => {
			this.pageResult = res.data
			this.findTreeData()
		}).then(data!=null?data.callback:'')
    },
    // 批量删除
	handleDelete: function (data) {
        this.$api.navigationBar.batchDelete(data.params).then(data.callback)
    },
    // 显示新增界面
	handleAdd: function () {
        this.dialogVisible = true
		this.operation = true
		this.dataForm = {
			sn: '',
			name: '',
            status: true,
            routing: ''
		}
    },
    // 获取数据
	findTreeData: function () {
		this.menuLoading = true
		this.$api.menu.findMenuTree({'name':''}).then((res) => {
			this.menuData = res.data
			this.menuLoading = false
		})
    },
    handleRoleSelectChange: function() {

    },
    handleEdit:function (params) {
		this.dialogVisible = true
		this.operation = false
		
		this.dataForm = Object.assign({}, params.row)
        this.dataForm.status = true
		
    },
    // 状态格式化
	statusFormat(row, column, cellValue, index) {
		return row.status == 1 ? '可用' : '禁用';
	},
    // 编辑
	submitForm: function () {
		this.$refs.dataForm.validate((valid) => {
			if (valid) {
				
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true
					console.log(this.dataForm)
                    this.dataForm.status = this.dataForm.status ? 1 : 0
					let params = Object.assign({}, this.dataForm)
					console.log(params)
					this.$api.navigationBar.save(params).then((res) => {
						this.editLoading = false
						if(res.code == 200) {
							this.$message({ message: '操作成功', type: 'success' })
							this.dialogVisible = false
							this.$refs['dataForm'].resetFields()
						} else {
                            this.dataForm.status = true;
							this.$message({message: '操作失败, ' + res.msg, type: 'error'})
						}
						this.findPage(null)
					})
				})
			}
		})
	},
  }
}

</script>
<style lang='scss' scoped>
</style>