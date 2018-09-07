<style lang="less" scoped>
.my_content {
    background-color: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: 100px;
    /*导航*/
    .side_left {
        width: 220px;
        background-color: #fff;
    }
    /*内容主体*/
    .home_content {
        margin-left: 220px;
        background-color: #fff;
        padding: 10px 50px;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
    }
    .header {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
}

</style>
<template>
    <div class="my_content">
        <!--头部-->
        <div class="header">
            <main-header></main-header>
        </div>
        <!--导航-->
        <div class="side_left fl">
            <side-nav :navData="navData"></side-nav>
        </div>
        <!--内容主题-->
        <div class="home_content">
            <router-view></router-view>
        </div>
    </div>
    </div>
</template>
<script>
import MainHeader from '../../components/header.vue';
import sideNav from '../../components/side-nav.vue';
import httpService from '../../common/httpService';
import {
    filterMenus
} from "../../filters/index.js"
export default {
    data() {
            return {
                navData: [],
            }
        },
        components: {
            MainHeader,
            sideNav
        },
        beforeMount() {
            if (!window.localStorage.menus) {
                this.$router.push('/login');
            } else {
                httpService.menus = filterMenus(JSON.parse(window.localStorage.menus));
                this.navData = httpService.menus;
            }
        },
        mounted() {
            let _self = this;
            if (!window.localStorage.KEY) {
                this.$router.push('/login');
            } else {
                this.$store.dispatch('initMenus', httpService.menus);
                if (!window.localStorage.menus) {
                    this.$router.push('/login');
                }
                //获取用户信息
                httpService.KEY = window.localStorage.KEY;
                httpService.SID = window.localStorage.SID;
                httpService.getDate(
                    function() {
                        let url = httpService.urlCommon + httpService.apiUrl.most
                        let body = {
                            biz_module: 'userService',
                            biz_method: 'getCmsUserInfo'
                        }
                        url = httpService.addSID(url);
                        body.version = 1;
                        body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                        body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                        _self.$store.dispatch('getUserInformation', {
                            body: body,
                            path: url
                        }).then(() => {
                            console.log(_self.$store.state.user.user)
                        }, () => {});
                    }
                );
            }
        },

}
</script>
