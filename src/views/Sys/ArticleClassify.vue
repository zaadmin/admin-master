<template>
  <div class="page-container">
    <!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="文章名"></el-input>
			</el-form-item>
			<el-form-item>
                <!--  @click="findPage(null)" -->
				<kt-button icon="fa fa-search" label="查询" perms="sys:manage:view" type="primary"/>
			</el-form-item>
			<el-form-item>
                <!--@click="handleAdd"   -->
				<kt-button icon="fa fa-plus" label="新增" perms="sys:manage:add" type="primary" />
			</el-form-item>
		</el-form>
	</div>
    <!--表格内容栏-->
	<kt-table :height="220" permsEdit="sys:manage:edit" permsDelete="sys:manage:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="columns" :showBatchDelete="false" @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
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
            {prop:"id", label:"ID", minWidth:50},
			{prop:"name", label:"分类名称", minWidth:120},
            {prop:"sn", label:"序号", minWidth:120},
            {prop:"status", label:"状态", minWidth:120,formatter:this.statusFormat},
			{prop:"createBy", label:"创建人", minWidth:120},
			{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
			// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
			// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ],
        pageRequest: { pageNum: 1, pageSize: 10 },
		pageResult: {},
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
		this.$api.articleClassify.findPage(this.pageRequest).then((res) => {
			this.pageResult = res.data
			this.findTreeData()
		}).then(data!=null?data.callback:'')
	},
	// 批量删除
	handleDelete: function (data) {
		this.$api.articleClassify.batchDelete(data.params).then(data.callback)
    },
    // 显示新增界面
	handleAdd: function () {
		this.dialogVisible = true
		this.operation = true
		this.dataForm = {
			id: 0,
			name: '',
			remark: ''
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
    handleEdit:function () {
    },
    handleRoleSelectChange: function() {

	},
	// 状态格式化
	statusFormat(row, column, cellValue, index) {
		return row.status == 1 ? '可用' : '禁用';
	}
  }
}

</script>
<style lang='scss' scoped>
</style>