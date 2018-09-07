<!-- 药材品种组件 -->
<style lang="less" scoped>
</style>
<template>
    <el-autocomplete style="width: 100%;" v-bind:value="value" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect">
    </el-autocomplete>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'breed',
    props: ['value'],
    data() {
        return {}
    },
    methods: {
        handleSelect(val) {
            this.$emit('getBreedId', val);
        },
        querySearchAsync(queryString, cb) {
            if (!queryString) {
                cb([{
                    value: '请输入关键字',
                    keyWord: ''
                }]);
                this.$emit('getBreedId', {
                    breedId: '',
                    breedName: ''
                });
                return;
            };
            this.$emit('getBreedId', {
                breedId: '',
                breedName: ''
            });
            let _self = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'searchKeywordService',
                    biz_method: 'querySearchKeywordBreed',
                    biz_param: {
                        keyWord: queryString,
                        pn: 1,
                        pSize: 20
                    }
                }
                let obj = {
                    body: body,
                    path: url
                }

                _self.$store.dispatch('getBreedList', obj).then(() => {
                    cb(_self.$store.state.search.breedList.list);
                }, () => {
                    cb([]);
                });
            }, 300);
        },

    }
}
</script>
