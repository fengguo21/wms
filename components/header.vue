<style scoped lang="less">
.header {
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    /*logo部分*/
    .logo_img {
        width: 80px;
        margin-top: 20px;
        margin-left: 50px;
        float: left;
    }
    /*标题部分*/
    h1 {
        font-size: 20px;
        margin-top: 60px;
        white-space: nowrap;
    }
    /*用户信息部分*/
    .userFunc {
        .userInfo {
            margin-top: 60px;
            margin-right: 20px;
        }
        .btn_wrap {
            margin-top: 55px;
            margin-right: 20px;
        }
    }
}
</style>
<template>
    <div class="header clearfix">
        <!--logo部分-->
        <div class="logo fl">
            <img class="logo_img" src="../assets/images/logo1.png">
            <h1>药材买卖网仓储管理系统V1.0</h1>
        </div>
        <!--用户功能部分-->
        <div class="userFunc fr clearfix">
            <div class="userInfo fl">
                <span class="iconfont icon-ux13996221517411354"></span> 你好,
                <span>{{ userName }}</span>
            </div>
            <div class="btn_wrap fr">
                <el-button @click="signOut" size="small">安全退出</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "header-view",
    data() {
        return {

        }
    },
    computed: {
        userName() {
            return this.$store.state.user.user.name;
        },
    },
    methods: {
        signOut() {
            this.$confirm('是否确定退出登录？', '信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                // 执行退出
                // 清除cookie
                document.cookie = name + "=" + '' + ";expires=" + '';
                window.localStorage.KEY = '';
                window.localStorage.SID = '';
                this.$router.push('/login');
            }).catch(() => {
                // 取消不管 
                this.$message({
                    type: 'info',
                    message: '已取消'
                });

            });
        }
    }
}
</script>
