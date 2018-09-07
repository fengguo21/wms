<style lang="less" scoped>
.search {
    position: relative;
    width: 100%;
    height: 100%;
    input {
        height: 36px;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
        outline-style: none;
        text-indent: 10px;
        box-sizing: border-box;
        color: #1f2d3d;
    }
    input:hover {
        cursor: text;
    }
    .items_wrap {
    	position: absolute;
    	background-color: #fff;
    	z-index: 2;
    	top: 40px;
    	left: 0px;
    	width: 100%;    	
        list-style: none;
        padding: 6px 0;
        margin: 0;
        box-sizing: border-box;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
    }
    .item {
        font-size: 14px;
        padding: 8px 10px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48576a;
        height: 36px;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
    }
    .item:hover {
        background-color: #e4e8f1;
    }
}
</style>
<template>
    <div class="search">
        <input v-bind="value" type="text">
        <ul class="items_wrap" v-if="">
        	
        </ul>
        <ul class="items_wrap">
            <li class="item">一些信息</li>
            <li class="item">一些信息</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'mySearch',
    props: ['value'],
    data() {
        return {

        }
    }
}
</script>
