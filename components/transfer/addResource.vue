<style lang="less" scoped>
.addResource {
    .btn_wrap {
        padding: 5px 10px;
        text-align: left;
    }
}
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-table align="center" v-on:selection-change="addSelect" max-height="400" :data="resourceList" border stripe style="width: 902px; margin: auto">
                <el-table-column type="selection" fixed="left" width="50">
                </el-table-column>
                <el-table-column prop="breedName" label="品名" width="140">
                </el-table-column>
                <el-table-column prop="total" label="总数量" width="100">
                </el-table-column>
                <el-table-column prop="usableNum" label="可用数量" width="100">
                </el-table-column>
                <el-table-column prop="unitId" label="单位" width="80">
                    <template scope='scope'>
                        <span>{{scope.row.unitId | filterUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="产地" width="160">
                    <template scope="scope">
                        <span>{{scope.row.locationName | filterLocation}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注">
                </el-table-column>
            </el-table>
        </div>
        <div class="btn_wrap">
            <el-button @click="add" size="small" type="primary">确认添加</el-button>
        </div>
    </div>
</template>
<script>
import breed from '../../components/search/breed.vue'
import httpService from '../../common/httpService.js'
import site from '../../components/search/site.vue'
import config from '../../common/common.config.json'

export default {
    name: 'addResource',
    data() {
        return {
            sendList: []
        }
    },
    computed: {
        resourceList() {
            return this.$store.state.preTransfer.precustomerOriginRes.list;
        }
    },
    components: {
        breed,
        site
    },
    methods: {
        add() {
            if (this.sendList.length == 0) {
                this.$message({
                    type: 'info',
                    message: '未选取预过户资源'
                });
                return;
            }
            this.$message({
                type: 'info',
                message: '添加成功'
            });
            let obj = {
                dialog: false
            }
            this.$emit('showChange', obj);
            this.$emit('addList', this.sendList);
        },
        addSelect(paramsArr) {
            this.sendList = paramsArr;
        },
        getBreedId(params) {
            this.formData.breedId = params.breedId;
            this.formData.breedName = params.breedName;
        },
        getSite(params) {
            this.formData.siteId = params.id;
            this.formData.siteName = params.name;
        }
    }
}
</script>
