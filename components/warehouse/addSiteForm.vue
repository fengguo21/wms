<style lang="less" scoped>
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-form ref="formData" :rules="rules" :model="formData" class="demo-form-inline" label-width="80px" label-position="right">
                <el-form-item label="库位名称" prop="name">
                    <el-input placeholder="库位名称" v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="库位行" prop="siteX">
                    <el-input placeholder="库位行" v-model="formData.siteX"></el-input>
                </el-form-item>
                <el-form-item label="库位列" prop="siteY">
                    <el-input placeholder="库位列" v-model="formData.siteY"></el-input>
                </el-form-item>
                <el-form-item label="库位层" prop="siteZ">
                    <el-input placeholder="库位层" v-model="formData.siteZ"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input placeholder="备注" v-model="formData.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="add('formData')" type="primary" icon="check">确认添加</el-button>
                    <el-button @click="close('formData')" icon="close">取消添加</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'addSiteForm',
    data() {
        return {
            rules: {
                name: [{
                    required: true,
                    message: '请填写仓库名称',
                    trigger: 'blur'
                }],
                siteX: [{
                    required: true,
                    message: '请填写仓库行',
                    trigger: 'blur'
                }],
                siteY: [{
                    required: true,
                    message: '请填写仓库列',
                    trigger: 'blur'
                }],
                siteZ: [{
                    required: true,
                    message: '请填写仓库层',
                    trigger: 'blur'
                }],
            },
            formData: {
                name: '',
                siteX: '',
                siteY: '',
                siteZ: '',
                description: ''
            }
        }
    },
    methods: {
        add(formName) {
            //将库位信息 名称行 列 层 添加到vuex中
            // 验证表单 
            let _self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 验证通过
                    let _self = this;
                    _self.$store.dispatch('addNewSiteFormList', this.formData).then(() => {
                        //改变表单的显隐 并清空表单
                        let obj = {};
                        obj.dialog = {
                            title: '',
                            dialog: true,
                            showNewStorage: true,
                            showAddSiteForm: false
                        }
                        this.$emit('showChange', obj);
                        this.$message({
                            message: '列表添加成功',
                            type: 'success'
                        });
                    });

                } else {
                    return false;
                }
            });
        },
        close() {
            let obj = {}
            obj.dialog = {
                title: '',
                dialog: true,
                showNewStorage: true,
                showAddSiteForm: false
            }
            this.$emit('showChange', obj);
            this.$message({
                message: '已取消',
                type: 'info'
            });
        }
    }
}
</script>
