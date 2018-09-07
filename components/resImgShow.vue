<style scoped lang="less">
.item_wrap {
    .item {
        position: relative;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 0 5px #000;
        width: 100%;
        height: auto;
        box-sizing: border-box;
        .model {
            position: absolute;
            display: none;
            background-color: #000;
            width: 100%;
            opacity: 0;
            left: 0;
            top: 0;
            height: 100%;
            .link_wrap {
                padding: 10px 0;
                width: 100%;
                height: 100%;
                display: table;
                a {
                    vertical-align: middle;
                    display: table-cell;
                    color: #fff;
                }
            }
        }
        img {
            width: 100%;
        }
    }
}

.item:hover {
    .model {
        display: block;
        opacity: 0.7;
        transition: 'opacity' 1s;
    }
}
</style>
<template>
    <div class="item_wrap">
        <ul class="items">
            <li class="item" v-for="(item, index) in imageArray">
                <div class="model">
                    <div class="link_wrap">
                        <a class="el-icon-view" :href="item" target="_blank">查看大图</a>
                    </div>
                </div>
                <img v-bind:src="item" class="image_show">
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'resImgShow',
    props: {
        imageArray: {
            default: null
        }
    },
    data() {
        return {

        }
    },

}
</script>
