<template>
  <div class="page-container">
    <el-alert title="发挥你的小脑袋，开始自己的表演吧！！！" type="error" :closable="false" class="info"> </el-alert>
    <!--工具栏-->
    <el-form ref="dataForm" :model="dataForm" label-width="80px" :rules="dataFormRules"  :size="size"
			label-position="left" >
      <el-form-item prop="title" label="文章标题">
        <el-input type="text" placeholder="请输入文章标题" v-model="dataForm.title" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="introduction" label="文章简介">
        <el-input type="text" placeholder="请输入简介" v-model="dataForm.introduction" maxlength="100" show-word-limit></el-input>
      </el-form-item>
       <el-form-item prop="sn" label="文章序号">
        <el-input type="number"  v-model="dataForm.sn" maxlength="100" placeholder="请输入编号"/>
      </el-form-item>
      <el-form-item prop="radioType" label="编辑方式">
        <el-radio-group v-model="dataForm.radioType" size="medium" >
          <el-radio label="0" border>富文本编辑器</el-radio>
          <el-radio label="1" border>Markdown编辑器</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="content" label="文章内容">
        <div class="editor-content" v-if="dataForm.radioType=='0'">
          <tinymce v-model="dataForm.content" :height="350" />
        </div>
        <div class="editor-content" v-else>
          <markdown-editor v-model="dataForm.content" height="350px" />
        </div>
      </el-form-item>
      <el-form-item prop="classifyId" label="文章类型">
        <el-select v-model="dataForm.classifyId" placeholder="请选择文章类型" >
          <el-option v-for="(item,index) in validData.classify" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dynamicTags" label="文章标签">
        <el-row v-model="dataForm.tagsId">
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)" >{{tag}}</el-tag>
          <el-popover placement="bottom" width="400" trigger="click"  >
            <div v-if="inputVisible">
              <span v-if="tagsNumber !==0">还可以添加{{tagsNumber}}标签</span>
              <span v-else class="warningColor">最多只能添加3个标签!</span>
              <el-divider class="divider"></el-divider>
              <el-select  @change="handleInputConfirm" v-model="tagsName" filterable remote placeholder="请输入文字搜索" class="input-new-tag" :remote-method="remoteMethod">
                <el-option v-for="item in validDataList" :key="item.id" :label="item.name" :value="item.name" ></el-option>
              </el-select>
              <el-row class="tags-recommend">
                <el-button type="primary" plain size="mini">推荐</el-button> 
                <el-button plain size="mini" v-for="item in validData.label" :key="item.id" @click="handleInputConfirm(item.name,item.id)" :disabled="dataForm.tagsId.indexOf(item.id)!=-1">{{item.name}}</el-button>
              </el-row>
            </div>
            <el-button slot="reference" class="button-new-tag" :size="size" @click="showInput" v-show="tagsNumber !==0" >+ 新建标签</el-button>
          </el-popover>
        </el-row>
        </el-form-item>  
        <el-form-item prop="origin" label="文章来源">
          <el-radio-group v-model="dataForm.origin" :size="size" >
            <el-radio label="0" border>原创</el-radio>
            <el-radio label="1" border>转载</el-radio>
            <el-radio label="2" border>翻译</el-radio>
          </el-radio-group>
        </el-form-item> 
        <el-form-item prop="status" label="文章状态">
          <el-radio-group v-model="dataForm.status" :size="size">
            <el-radio label="0" border>未发布</el-radio>
            <el-radio label="1" border>发布</el-radio>
          </el-radio-group>
        </el-form-item> 
      </el-form>
      <el-button :size="size" type="primary" @click.native="save" :loading="editLoading" >保存</el-button>
    
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MarkdownEditor from '@/components/MarkdownEditor'
export default {
  data () {
    return {
      disabled: false,
      size: 'small',
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      filters: {
        name: ''
      },
      dataFormRules: {

      },
      // 关于文章的所有内容
      dataForm: {
        title: '',
        introduction: '',
        sn:'',
        radioType: '0',
        content: '',
        type:'0',
        classifyId: '',
        tagsId: [],
        origin: '0',
        status: '0'
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      editLoading: false,
      validData: {},
      tagsName: '',
      timeout:  null,
      validDataList: [],
      tagsNumber: '3',
     
    };
  },

  components: {
    Tinymce,
    MarkdownEditor
  },

  computed: {},

  mounted(){
    this.operation = this.$route.query.operation
    this.findOneByID(this.$route.query.id)
    this.getValidData()
  },

  methods: {
    // 获取当前需要编辑的数据
    findOneByID: function (data) {
      // this.pageRequest.id = {name: {name:'name', value:this.filters.name}}
      this.$api.article.findOneByID({id:data}).then((res) => {
        let pageResult = res.data
        if(data) {
          this.dataForm = {
            title: pageResult.title,
            introduction: pageResult.introduction,
            sn:pageResult.sn,
            radioType: pageResult.title,
            content: pageResult.content,
            type:pageResult.type,
            classifyId: pageResult.classifyId,
            tagsId: [],
            origin: '0',
            status: pageResult.status
          }
        }
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
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.dataForm.tagsId.splice(this.dataForm.tagsId.indexOf(tag), 1);
      this.tagsNumber++;
    },
    showInput() {
      this.inputVisible = true;
    },
    handleInputConfirm(value,id) {
      // console.log(value)
      // console.log(this.validData.label)
      // console.log(id)
      // 1.判断当前数据是否显示,若没有显示，则添加到数组dynamicTags中，否则，移除弹出提示已添加，并且数组的数据不变
      
      let obj = {};
      let tempID = ''
      if(id){
        tempID = id
      }else {
        obj = this.validDataList.find((item)=>{ //这里的validDataList就是上面遍历的数据源
          return item.name === value //筛选出匹配数据
        });
        tempID = obj.id
      }
      // console.log('tempID', tempID)
    if(this.dynamicTags.length < 3) {
      if(this.dynamicTags.indexOf(value) < 0) {
        this.dynamicTags.push(value)
        this.tagsNumber--;
      }else {
        this.$message({
          message: '此项数据已经添加了哦！！！',
          type: 'warning'
        });
        this.dynamicTags =[...new Set(this.dynamicTags)]
      }
      this.tagsName = '';
      this.validDataList = '';
      this.dataForm.tagsId.push(tempID)
      // console.log('this.tagsId', this.tagsId)
    }else {
      this.$message({
        message: '不能再添加标签了！！！',
        type: 'warning'
      });
    }
      
    },
    save(){
      this.$refs.dataForm.validate((valid) => {
			  if (valid) {

          this.$confirm('确认提交吗？', '提示', {}).then(() => {

            let params = Object.assign({}, this.dataForm)

            this.$api.article.save(params).then((res) => {

              if(res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' })
                // this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                // this.dataForm.status = true;
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
            })
          })
        }
      })
    },
    getValidData(){
      this.$api.article.getValidData().then((res) => {
        if(res.code == 200) {
          this.validData = res.data
          // this.classifys = res.data.classify
          // this.label = res.data.label
          // console.log(this.dataForm.classify)
        }
      })
    },
    remoteMethod(query) {
    
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$api.articleLabel.getValidDataBydiv({'name':query}).then((res) => {
            if(res.code =='200') {
              this.validDataList = res.data;
            }
          })
        }, 200);
      } else {
        this.validDataList = [];
      }
    },
    selectedTag() {

    }
  },
  watch: {
  }
}

</script>
<style lang='scss' scoped>
.info {
  margin: 10px 0 20px 0;
}
.el-form-item {
  text-align: left;
}
.input-new-tag {
  width: 100%;
  vertical-align: bottom;
}
.divider {
  margin: 10px auto;
}
.warningColor {
  color: red;
}

.tags-recommend {
  margin-top: 10px;

}
.el-button+.el-button {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>