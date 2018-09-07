<style lang="less" scoped>
.nav_side {
    background-color: #eef1f6;
    color: #fff;
    height: 100%;
}
</style>
<template>
    <div class="nav_side">
        <el-menu :unique-opened="true" :default-active="getDefaultIndex" class="el-menu-vertical-demo">
            <template v-for="item in navData" >
                <el-submenu v-bind:index="item.index" v-if="item.children">
                    <template slot="title">
                        <i class="el-icon-message"></i>{{item.name}}
                    </template>
                    <router-link :to="subItem.path" v-for="(subItem,subIndex) in item.children" >
                        <el-menu-item v-bind:index="subItem.index">{{subItem.title}}</el-menu-item>
                    </router-link>
                </el-submenu>
                <router-link v-else :to="item.path">
                    <el-menu-item v-bind:index="item.index"><i class="el-icon-menu"></i>{{item.name}}</el-menu-item>
                </router-link>
            </template>
        </el-menu>
    </div>
</template>
<script>
import httpService from '../common/httpService.js'
export default {
    data() {
        return {
            wrapperHeight: '',
            deIndex: '0'
        }
    },
    computed: {
        navData(){
            return httpService.menus;
        },
        getDefaultIndex() {
            let flag = false;
            for(var i = 0; i < this.navData.length; i++){
                let obj =this.navData[i];
                if(obj.children){
                    for(var j = 0; j < obj.children.length; j++){
                        if(obj.children[j].path === this.$route.path){
                            this.deIndex = obj.children[j].index;
                            flag = true;
                            break;
                        }
                    }
                }
                if(flag){
                    break;
                }
            } 
            return this.deIndex;
        }

    },
}
</script>
