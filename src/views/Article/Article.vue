<template>
  <div class="page-container">
    <!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="文章标题"></el-input>
			</el-form-item>
			<el-form-item>
				<!--   @click="findPage(null)"-->
				<kt-button icon="fa fa-search" label="查询" perms="sys:manage:view" type="primary" />
			</el-form-item>
			<el-form-item>
			 <kt-button icon="fa fa-plus" label="新增" perms="sys:manage:add" type="primary"  @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:manage:edit" permsDelete="sys:manage:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="columns" @findPage="findPage" @handleDelete="handleDelete"  @handleEdit="handleEdit" 
		>
		
	</kt-table>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import KtTable from "@/views/Core/KtTable"
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
			{prop:"sn", label:"序号", minWidth:80},
			{prop:"name", label:"文章标题", minWidth:120},
			{prop:"title", label:"分类名称", minWidth:120},
			{prop:"type", label:"类型", minWidth:120},
            {prop:"status", label:"状态", minWidth:120,formatter:this.statusFormat},
			{prop:"createBy", label:"创建人", minWidth:120},
			{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
			// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
			// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
		],
		pageRequest: { pageNum: 1, pageSize: 10 },
		pageResult: {},
		operation: false, // true:新增, false:编辑
    };
  },

  components: {
	KtButton,
	KtTable
  },

  computed: {},

  mounted(){
  },

  methods: {
	// 获取分页数据
	findPage: function (data) {
		if(data !== null) {
			this.pageRequest = data.pageRequest
		}
		this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
		this.$api.article.findPage(this.pageRequest).then((res) => {
			this.pageResult = res.data
			this.findTreeData()
		}).then(data!=null?data.callback:'')
	},
	// 获取数据
	findTreeData: function () {
		this.menuLoading = true
		this.$api.menu.findMenuTree({'name':''}).then((res) => {
			this.menuData = res.data
			this.menuLoading = false
		})
	},
	// 批量删除
	handleDelete: function (data) {
		this.$api.article.batchDelete(data.params).then(data.callback)
	},
	// 显示新增界面
	handleAdd: function () {
		this.operation = true
		this.$router.push({path:'/Article/CreativeCentre',query: {operation: this.operation}}) 
	},
	handleEdit: function (params) {
		this.operation = false
		this.$router.push({path:'/Article/CreativeCentre',query: {operation: this.operation,id: params.row.id}}) 
	}
  }
}

</script>
<style lang='scss' scoped>
</style>