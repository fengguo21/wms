<style lang="less" scoped>
.input_wrap {
    position: relative;
    height: 100%;
    width: 100%;
    .inp {
        height: 28px;
        display: inline;
        width: 100%;
        border: 1px solid #D1DBE5;
        background-color: #fff;
        outline-style: none;
        text-indent: 10px;
    }
    .inp:hover {
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
    .btn {
        width: 40px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        float: right;
        background-color: #FFF;
        border-left: 1px solid #fff;
        outline-style: none;
        position: absolute;
        top: 1px;
        right: -1px;
    }
    .btn:hover {
        cursor: pointer;
        background-color: #FAFAFA;
        border-left: 1px solid #D1DBE5;
    }
}
</style>
<template>
    <div class="input_wrap clearfix">
        <input ref="btn" v-on:click="getHttp" class="btn" type="button" value="刷新">
        <input class="inp" ref="input" v-bind:value="value" disabled type="number" placeholder="可用量">
    </div>
</template>
<script>
export default {
    name: 'usableNum',
    props: ['value', 'stockId', 'data'], //双向绑定的值 请求数据的ID 是否渲染时获取数据
    data() {
        return {
            timer: ''
        }
    },
    computed: {
        changNum() {
            return this.$store.state.common.changNum;
        }
    },
    watch: {
        //监听input框输入时
        changNum(newVal, oldVal) {
            //确定组件ID相等 保证列表对应 可用数据同步  
            if (this.stockId == newVal.id) {
                //获取数据 getHttp 间隔300毫秒请求一次数据 并修改绑定的值 
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.getHttp()
                }, 300)
            }
        }
    },
    beforeMount() {
        //传了data 属性 并且 为 true的时候刷新前获取数据 否则为点击获取数据 获取资源列表时 不需要实时获取数据
        if (this.data != undefined || this.data === true) {
            this.$store.dispatch('com_getStockItemById', this.stockId).then((res) => {
                this.$emit('input', res.usableNum);
            })
        }
    },
    methods: {
        getHttp() {
            this.$refs.btn.value = '...';
            this.$store.dispatch('com_getStockItemById', this.stockId).then((res) => {
                this.$emit('input', res.usableNum);
                this.$refs.btn.value = '刷新';
            }, () => {
                this.$refs.btn.value = '刷新';
            })
        }
    }
}
</script>
