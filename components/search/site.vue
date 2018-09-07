<!-- 仓库点ID -->
<style lang="less" scoped>
</style>
<template>
    <el-select :disabled="selectData.length == 0" clearable v-model="siteId" @change="changeSite" filterable v-on:filter-method="remoteMethod" placeholder="请选择">
        <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'site',
    data() {
        return {
            loading: false,
            siteId: '',
            timeout: ''
        }
    },
    watch: {
        selectData(newVal, oldVal) {
            if (newVal.length == 0) {
                //清空输入框
                this.siteId = '';
            }
        }
    },
    computed: {
        selectData() {
            return this.$store.state.search.siteList;
        }
    },
    methods: {
        remoteMethod(query) {
            this.loading = true;
            let _self = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if (!query) {
                    _self.selectData = _self.selectData.filter(item => {
                        return true;
                    });
                    _self.loading = false;
                } else {
                    _self.selectData = _self.selectData.filter(item => {
                        return item.name.indexOf(query) > -1;
                    });
                    _self.loading = false;
                }
            }, 300)
        },
        changeSite(paramsId) {
            let src = this.selectData;
            for (var i = 0; i < src.length; i++) {
                if (src[i].id === paramsId) {
                    this.$emit('getSite', src[i]);
                    return;
                }
            };
            this.$emit('getSite', {
                id: '',
                name: ''
            });
        }
    }
}
</script>
