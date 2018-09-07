<style lang="less" scoped>
.img_upload {
    margin-top: 4px;
    .btn {
        position: relative;
        color: #fff;
        background-color: #20A0FF;
        border-radius: 4px;
        border: 0 none;
        outline-style: none;
        height: 28px;
        line-height: 28px;
        width: 120px;
        text-align: center;
    }
    .btn:hover {
        background-color: #4DB3FF;
    }
    .btn input {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
    }
    .btn input:hover {
        cursor: pointer;
    }
    .item_wrap {
        .items {
            margin-top: 10px;
            overflow: hidden;
        }
        .item {
            position: relative;
            box-shadow: 0 0 5px #000;
            margin: 10px;
            padding: 10px;
            width: 400px;
            height: 200px;
            overflow: hidden;
            box-sizing: border-box;
            float: left;
            .model {
                position: absolute;
                display: none;
                background-color: #000;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
                .item_btn_wrap {
                    margin-top: 100px;
                    transform: translate(0, -50%);
                    width: 100%;
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    .item_btn {
                        width: 50%;
                        text-align: center;
                        a {
                            color: #fff;
                        }
                    }
                    .item_btn:hover {
                        cursor: pointer;
                    }
                    .item_btn:active {
                        color: #4DB3FF;
                    }
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .item:hover {
            .model {
                display: block;
                opacity: .7;
                transition: 'opacity' 1s;
            }
        }
    }
    .progress {
        margin-top: 5px;
        position: relative;
        span {
            position: absolute;
            left: 200px;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
        }
    }
    .txt,
    .prg {
        width: 400px;
        height: 25px;
        background-color: #ccc;
        line-height: 25px;
    }
    .prg {
        position: absolute;
        left: 0;
        top: 0;
        width: 0px;
        overflow: hidden;
        background-color: #13CE66;
    }
}
</style>
<template>
    <div class="img_upload" :v-loading.body="loading">
        <div class="btn" v-if="param.keyName">
            {{title}}
            <input type="file" ref="input" v-on:click="clearInputCont" @change="previewImg" class="input_image" name="photo" accept="image/png,image/jpeg,image/jpg,image/bmp">
        </div>
        <div class="progress" v-if="showPrg">
            <div class="txt">
            </div>
            <div ref="prg" class="prg">
            </div>
            <span>{{prgText}}%</span>
        </div>
        <div class="item_wrap">
            <ul class="items">
                <li class="item" v-for="(item, index) in imageArray">
                    <div class="model">
                        <div class="item_btn_wrap clearfix">
                            <div class="item_btn fl">
                                <span class="el-icon-delete2" v-on:click="deleteImg(index)">删除图片</span>
                            </div>
                            <div class="item_btn fr">
                                <a class="el-icon-view" :href="item" target="_blank">查看大图</a>
                            </div>
                        </div>
                    </div>
                    <img v-bind:src="item" class="image_show">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import common from '../common/httpService.js'

export default {
    data() {
        return {
            size: 0,
            key: '',
            loading: false,
            prgText: '',
            showPrg: false,
            timer: '',
            timerTimOut: '',
        }
    },
    props: {
        param: {
            default: null
        },
        imageArray: {
            default: null
        },
        title: {
            default: "点击上传"
        }
    },
    methods: {
        clearInputCont() {
            console.log('adsfasd');
        },
        previewImg: function(e) {
            let _self = this;
            let input = e.target;
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                _self.size = input.files[0].size;
                let img = new Image();
                reader.onload = function(e) {
                    if (input.files[0].size > 204800) { //图片大于200kb则压缩
                        img.src = e.target.result;
                        img.onload = function() {
                            _self.image = _self.compress(img);
                            _self.upload(_self.image);
                            _self.param.url = _self.image;
                        }
                    } else {
                        img.src = e.target.result;
                        img.onload = function() {
                            _self.image = e.target.result;
                            _self.param.url = _self.image;
                            _self.upload(_self.image);
                        }
                    }
                };
                reader.readAsDataURL(input.files[0]);
                // return 1;
            }
        },
        compress: function(img) {
            let _self = this;
            let initSize = img.src.length;
            let width = img.width;
            let height = img.height;
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            let ratio;
            if ((ratio = width * height / 300000) > 1) {
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
            let ndata = canvas.toDataURL(img.src.split(';')[0].split(':')[1], 1);
            if (ndata.length > 2500000) {
                ndata = canvas.toDataURL(img.src.split(';')[0].split(':')[1], 2500000 / ndata.length);
            }

            function newBlob(data, datatype) {
                var out
                try {
                    out = new Blob([data], {
                        type: datatype
                    })
                } catch (e) {
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder
                    if (e.name == 'TypeError' && window.BlobBuilder) {
                        var bb = new BlobBuilder()
                        bb.append(data)
                        out = bb.getBlob(datatype)
                    } else if (e.name == 'InvalidStateError') {
                        out = new Blob([data], {
                            type: datatype
                        })
                    } else {
                        throw new Error('Your browser does not support Blob & BlobBuilder!')
                    }
                }
                return out
            }

            function dataURL2Blob(dataURI) {
                var byteStr
                var intArray
                var ab
                var i
                var mimetype
                var parts
                parts = dataURI.split(',')
                parts[1] = parts[1].replace(/\s/g, '')
                if (~parts[0].indexOf('base64')) {
                    byteStr = atob(parts[1])
                } else {
                    byteStr = decodeURIComponent(parts[1])
                }
                ab = new ArrayBuffer(byteStr.length)
                intArray = new Uint8Array(ab)
                for (i = 0; i < byteStr.length; i++) {
                    intArray[i] = byteStr.charCodeAt(i)
                }
                mimetype = parts[0].split(':')[1].split(';')[0]
                return new newBlob(ab, mimetype)
            }
            var compressedImageBlob = dataURL2Blob(ndata)
            _self.size = compressedImageBlob.size; // 压缩图像文件的大小  
            canvas.width = canvas.height = 0;
            return ndata;
        },
        upload: function(file) {
            this.showPrg = true;
            file = file.split(',')[1];
            let _self = this;
            _self.loading = true;
            let url = common.addSID(common.urlCommon + common.apiUrl.most);
            let body = {
                biz_module: 'filesService',
                biz_method: 'getQiNiuToken',
                version: 1,
                time: 0,
                sign: '',
                biz_param: {
                    bucketName: _self.param.keyName
                }
            };
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            common.commonPost(url, body)
                .then(function(res) {
                    if (res.code == '1c01') {
                        var timestamp = new Date().getTime();
                        var pic = file;
                        var url = 'http://upload.qiniu.com' + '/putb64/' + _self.size;
                        var xhr = new XMLHttpRequest();
                        var prg = _self.$refs.prg;
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4) {
                                let response = JSON.parse(xhr.response);
                                if (response.key) {
                                    _self.key = response.key;
                                    _self.$emit("postUrl", res.biz_result.url + '/' + _self.key);
                                    clearInterval(_self.timer);
                                    _self.$refs.input.value = '';
                                    clearTimeout(_self.timerTimOut);
                                    _self.timerTimOut = setTimeout(() => {
                                        _self.showPrg = false;
                                    }, 500);

                                } else {
                                    clearInterval(_self.timer);
                                    _self.$refs.input.value = '';
                                    clearTimeout(_self.timerTimOut);
                                    _self.timerTimOut = setTimeout(() => {
                                        _self.showPrg = false;
                                    }, 500);
                                }
                            }
                        };
                        console.log(res.biz_result.token);
                        xhr.open("POST", url, true);
                        xhr.setRequestHeader("Content-Type", "application/octet-stream");
                        xhr.setRequestHeader("Authorization", "UpToken " + res.biz_result.token);
                        xhr.upload.onprogress = function(ev) {
                            clearInterval(_self.timer);
                            var precent = parseInt(10000 * ev.loaded / ev.total) / 100;
                            prg.style.width = (400 * ev.loaded / ev.total) + 'px';
                            _self.prgText = precent;

                            _self.timer = setInterval(function() {
                                if (ev.lengthComputable) {
                                    var precent = parseInt(10000 * ev.loaded / ev.total) / 100;
                                    prg.style.width = (400 * ev.loaded / ev.total) + 'px';
                                    _self.prgText = precent;
                                }
                            }, 100);
                        };
                        xhr.send(pic);
                    } else {
                        _self.showPrg = false;
                        _self.$message({
                            type: 'info',
                            message: '图片上传失败'
                        });

                    }
                })
                .catch(function(err) {
                    _self.showPrg = false;
                    _self.$message({
                        type: 'info',
                        message: '图片上传失败'
                    });
                    console.log(err);
                });
        },
        deleteImg(index) {
            this.imageArray.splice(index, 1)
        }
    }
}
</script>