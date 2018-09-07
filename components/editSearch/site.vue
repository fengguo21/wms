<!-- 仓库点ID -->
<style lang="less" scoped>
</style>
<template>
    <el-autocomplete :disabled="isDisabled" style="width: 100%;" v-bind:value="value" :fetch-suggestions="handleSelectDepotAsync" placeholder="请选择库位点" @select="handleSelectDepot">
    </el-autocomplete>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'site',
    props: ['value'],
    data() {
        return {}
    },
    computed:{
        isDisabled(){
            if(this.$store.state.search.depotList.length === 0){
                return true;
            }else {
                return false;
            }
        }
    },
    methods: {
        handleSelectDepotAsync(queryString, cb) {
            let arr = this.$store.state.search.siteList;
            if (!queryString) {
                cb(arr);
                this.$emit('getSite', {
                    id: '',
                    name: '',
                });
                return;
            };
            this.$emit('getSite', {
                id: '',
                name: '',
            });
            let newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].value.indexOf(queryString) > -1) {
                    newArr.push(arr[i]);
                }
            }
            cb(newArr);
        },
        handleSelectDepot(val) {
            this.$emit('getSite', val);
        }
    }
}
</script>
