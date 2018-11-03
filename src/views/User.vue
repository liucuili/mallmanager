<template>
<!-- 面包屑 -->
<el-card class="box-card">
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-row class="serchArea">
    <el-col :span="24">
      <el-input placeholder="请输入内容" class="serchInput" v-model="searchValue">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
      </el-input>
      <el-button type="success" @click="addUserDialogFormVisible=true">添加用户</el-button>
    </el-col>
    <!-- 显示添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
  <!-- 表格 -->
  <el-table style="width: 100%" :data="list" v-loading="loading"  >
    <el-table-column type="index" label="#" width="50">
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="100">
    </el-table-column>
    <el-table-column prop="email" label="邮箱">
    </el-table-column>
    <el-table-column prop="mobile" label="电话">
    </el-table-column>
    <el-table-column prop="create_time" label="创建日期">
      <template slot-scope="scope">
        {{scope.row.create_time|fmtDate('YYYY-MM-DD')}}
      </template>
    </el-table-column>
    <el-table-column label="用户状态">
      <template slot-scope="scope">
        <el-switch
        @change="handleSwitchChange(scope.row)"
         v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-row>
          <el-button plain size="small" type="primary" icon="el-icon-edit" circle @click="showEditBox(scope.row.id)"></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check" circle @click="showRoleBox(scope.row)"></el-button>
          <el-button plain size="small" type="danger" icon="el-icon-delete" circle @click="showDeleteBox(scope.row.id)"></el-button>
        </el-row>
        <!-- 编辑盒子显示 -->
        <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
          <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser(scope.row.id)">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 角色盒子显示 -->
        <el-dialog title="分配角色" :visible.sync="roleFormVisible">
          <el-form label-width="100px">
            <el-form-item label="用户名" prop="username" >
              {{currentUsername}}
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="currentRoleId">
                  <el-option disabled label="请选择" :value="-1">
                  </el-option>
                  <!-- 遍历数组 -->
                  <el-option v-for="(item,index) in roles" :key="index" :value="index" :label="item.roleName">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="roleFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      //默认为false，当加载完成后，再开启
      loading: false,
      currentPage: 1,
      total: 0,
      pagesize:2,
      pagenum: 1,
      // 搜索查询的关键字
      searchValue:'',
      //添加用户的对话框，默认不显示
      addUserDialogFormVisible: false,
      formData: {
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      formLabelWidth: '120px',
      //编辑用户的对话框，默认不显示
      editUserDialogFormVisible: false,
      // 角色盒子默认隐藏
      roleFormVisible: false,
      currentUsername: '',
      currentRoleId: -1,
      roles: [],
      currentUserId : -1
    }
    
  },
  created() {
    this.loadTableData()
  },
  methods: {
    // 10.分配权限
    async setRole() {
      // 发送请求  
      // 获取用户id currentRoleId
      const res = await this.$http.put(`users/${this.currentUserId}/role`,{
        rid:this.currentRoleId
      })
      const {meta: {status, msg}} = res.data
      //提示框
      this.$message.success(msg)
      this.roleFormVisible = false
      console.log(this.currentRoleId)
      //重置
      this.currentRoleId = -1
    },
    // 9.显示角色盒子
    async showRoleBox(user) {
      // 获取当前用户的id,为了在分配权限使用
      this.currentUserId = user.id
      this.roleFormVisible = true
      this.currentUsername = user.username
      const res = await this.$http.get('roles')
      this.roles = res.data.data
      const res2 = await this.$http.get(`users/${user.id}`)
      console.log(res2)
      this.currentRoleId = res2.data.data.rid
    },
    // 8.编辑用户信息
    async editUser(userID) {
      this.loading = false
      const res = await this.$http.put(`users/${userID}`,{
        mobile: this.formData.mobile,
        email: this.formData.email
      })
      const {meta:{msg, status}} = res.data
      if(status === 200) {
        this.$message.success(msg)
        this.editUserDialogFormVisible = false
        this.loadTableData()
        this.loading = false
        this.formData = {}
      }
    },
    // 7.显示编辑对话框
    async showEditBox(userID){
      this.editUserDialogFormVisible = true
      //根据id查询用户信息显示在编辑对话框
      const res = await this.$http.get(`users/${userID}`)
      const {data:{username, mobile,email}} = res.data
      this.formData.username = username
      this.formData.email = email
      this.formData.mobile = mobile
    },
    // 6. 添加用户信息
    async addUser() {
      const res = await this.$http.post('users',this.formData)
      this.loadTableData()
      this.addUserDialogFormVisible = false
      this.formData = {}
    },
    // 5.点击删除按钮显示删除提示框
    showDeleteBox(userID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //如果来到这一步说明，点击了确定按钮，要发送删除请求 users/:id
        const res = await this.$http.delete(`users/${userID}`)
        // console.log(res)
        const {meta: {status, msg}} = res.data
        if( status === 200) {
          //删除成功，重新渲染表格
          this.$message.success(msg)
          this.loadTableData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 4.查询用户
    async handleSearch() {
      //根据输入框的内容来搜索，响应后重新加载页面,携带参数查询
      this.loadTableData()
    },
    // 3. 处理分页
    handleSizeChange(val) {
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadTableData()
      
    },
    // 2. 处理开关状态
    async handleSwitchChange(user) {
      //改变状态前要看当前用户有没权限，有没有token
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      // users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res)
      const data = res.data
      const { meta: {status, msg}} = data
      if (status === 200) {
        this.$message.success(msg)
        
        this.loadTableData()
      } else {
        this.$message.error(msg)
        // 对查询后的结果后，重置页数为第一页，从第一页开始显示查询的结果
      }
    },
    // 1.渲染表格
    async loadTableData() {
      this.loading = true
      //给header添加token
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`)
      // console.log(res)   返回的响应里有total   res.data.data.total就是总共数据库的条数
      this.total = res.data.data.total
      const {
        meta: {
          msg,
          status
        },
        data: {
          users
        }
      } = res.data
      if (status === 200) {
        //将响应过来的数据赋值给list
        this.list = users
        // console.log(this.list)
        this.pagenum = 1
        // 渲染完后关闭
        this.loading = false
        this.searchValue=''
      }
    }
  }

}
</script>

<style>
.box-card {
  height: 100%;
}

.serchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.serchArea .serchInput {
  width: 350px;
}
</style>
