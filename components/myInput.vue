<style lang="less" scoped>
.input_wrap {
    z-index: 9999999;
    width: 100%;
    height: 100%;
    input {
        height: 28px;
        border: 1px solid #D1DBE5;
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
        outline-style: none;
        text-indent: 10px;
    }
    input:hover {
        cursor: text;
    }
    .not-allowed {
        background-color: #FAFAFA;
    }
    .not-allowed:hover {
        cursor: pointer;
    }
    .disabled:hover {
        cursor: not-allowed;
    }
}
</style>
<template>
    <div class="input_wrap" v-on:click="editNum($event)">
        <!-- :disabled="unDisabled" -->
        <input ref="input" v-on:keyup="changeNum($event.target.value)" v-on:blur="changeBlur($event.target.value)" v-bind:value="value" :class="{'not-allowed': unDisabled , 'disabled': disabled}" :disabled="disabled" type="number" placeholder="资源数量">
    </div>
</template>
<script>
export default {
    name: 'myInput',
    props: ['value', 'maxNum', 'disabled', 'stockId'], //双向绑定的值 限制最大输入值 是否禁用属性 该组件只支持非负数
    data() {
        return {
            unDisabled: true,
            valStr: ''
        }
    },
    methods: {
        editNum(e) {
            console.log(e);
            // if (this.disabled != undefined && this.disabled == true) {
            //     return
            // }
            this.unDisabled = false;
        },
        changeNum(params) {
            //得到输入框的字符串     
            let srcStr = params;
            let srcArr = srcStr.split('');
            //第一位为零
            if (srcArr.length >= 2) {
                if (srcArr[0] === '0') {
                    //第二位必须为点
                    if (srcArr[1] != '.') {
                        srcArr[1] = '.'
                        event.target.value = srcArr.join('');
                    } else {
                        //第二位为点的情况 限制在两位数以内
                        if (srcArr.length >= 4) {
                            this.$refs.input.value = srcArr.splice(0, 4).join('');
                        }
                    }
                } else {
                    //为大于1的浮点数
                    let idx = srcStr.indexOf('.');
                    if (idx > -1) {
                        this.$refs.input.value = srcArr.splice(0, idx + 3).join('');
                    }
                }
            }
            //统一处理多个点或者首位为点
            let idx = srcStr.indexOf('.');
            if (idx === 0 && srcArr.length > 0) {
                //首位为点时
                this.$refs.input.value = '';
            }
            if (params == '') {
                this.$refs.input.value = '';
            }
            //限制最大值
            if (this.maxNum != undefined) {
                if (parseFloat(this.$refs.input.value) > this.maxNum) {
                    this.$refs.input.value = this.maxNum;
                }
            }
            this.$emit('input', this.$refs.input.value);
            //写入vuex
            this.$store.dispatch('com_changNum', {
                id: this.stockId,
                num: Number(this.$refs.input.value)
            });
        },
        changeBlur(params) {
            this.unDisabled = true;
            if (params == '') {
                this.$refs.input.value = '0';
            };
            if (Number(this.$refs.input.value) <= 0) {
                this.$refs.input.value = '0';
            };
            if(Number(this.$refs.input.value) > this.maxNum){
                 this.$refs.input.value = this.maxNum;
            }
            this.$emit('input', this.$refs.input.value);
        },

    }
}
</script>
