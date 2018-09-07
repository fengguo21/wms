import address from '../common/region.json';
import config from '../common/common.config.json';
let units = config.unit;
let validate = config.validate;

export function host(url) {
	const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
	const parts = host.split('.').slice(-3)
	if(parts[0] === 'www') parts.shift()
	return parts.join('.')
}

export function timeAgo(time) {
	const between = Date.now() / 1000 - Number(time)
	if(between < 3600) {
		return pluralize(~~(between / 60), ' minute')
	} else if(between < 86400) {
		return pluralize(~~(between / 3600), ' hour')
	} else {
		return pluralize(~~(between / 86400), ' day')
	}
}
// 新增 过滤用户生日
export function userBirthday(time) {
	if(!time || time === '' || time == 0) {
		return '';
	} else {
		let date = new Date(time);
		let y = date.getFullYear();
		let M = date.getMonth() + 1;
		let d = date.getDate();
		let h = date.getHours();
		let m = date.getMinutes();
		let s = date.getSeconds();
		M = M < 10 ? '0' + M : M;
		d = d < 10 ? '0' + d : d;
		h = h < 10 ? '0' + h : h;
		m = m < 10 ? '0' + m : m;
		s = s < 10 ? '0' + s : s;
		return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
	}
}
//过滤时间只获取年月日
export function filterTime(time) {
	if(!time || time === '' || time == 0) {
		return '';
	} else {
		let date = new Date(time);
		let y = date.getFullYear();
		let M = date.getMonth() + 1;
		let d = date.getDate();
		let h = date.getHours();
		let m = date.getMinutes();
		let s = date.getSeconds();
		M = M < 10 ? '0' + M : M;
		d = d < 10 ? '0' + d : d;
		return y + '-' + M + '-' + d;
	}
}
// 过滤单位
export function filterUnit(paramsId) {
	for(var i = 0; i < units.length; i++) {
		let obj = units[i];
		if(obj.id == paramsId) {
			return obj.name;
		}
	}
	return '';
}
// 过滤审核状态
export function filterValidate(params, verifierName) {
	let str = '';
	if(!verifierName) {
		str = '系统管理员';
	} else {
		str = verifierName;
	}
	let validate = '';
	switch(params) {
		case 0:
			validate = '待申请';
			break;
		case 1:
			validate = '等待' + str + '审核';
			break;
		case 2:
			validate = '审核通过';
			break;
		case -2:
			validate = '不通过';
			break;
		default:
			validate = '未知';
			break;
	}
	return validate;
}

function pluralize(time, label) {
	if(time === 1) {
		return time + label
	}
	return time + label + 's'
}

export function formatTime(time) {
	return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

export function formatClientType(type) {
	let client = '';
	switch(type) {
		case 0:
			client = 'ios';
			break;
		case 1:
			client = 'android';
			break;
		default:
			client = '未知';
			break;
	}
	return client;
}

export function formatOpenType(type) {
	let client = '';
	switch(type) {
		case 0:
			client = '未开启';
			break;
		case 1:
			client = '已开启';
			break;
		default:
			client = '未知';
			break;
	}
	return client;
}

export function formatMediaType(type) {
	let client = '';
	switch(type) {
		case 0:
			client = '无效';
			break;
		case 1:
			client = '有效';
			break;
		default:
			client = '未知';
			break;
	}
	return client;
}

// 省市县三级联动处理 符合UI框架
export function addressLinkage() {
	let arr = [];
	let p = address.p["000000"];
	let c = address.c;
	let d = address.d;
	//先遍历每个省 填入数组中
	// debugger;
	for(let pp in p) {
		let objP = {
			value: '',
			label: ''
		}
		objP.value = pp; //赋值键
		objP.label = p[pp]; //赋值值
		if(c[pp]) {
			objP.children = [];
		}
		//遍历省对应 的所有市
		for(let cc in c[pp]) {
			let objC = {
				value: '',
				label: ''
			}
			if(d[cc]) {
				objC.children = [];
			}
			objC.value = cc;
			objC.label = c[pp][cc];
			objP.children.push(objC);
			//遍历所有的县
			for(let dd in d[cc]) {
				let objD = {
					value: '',
					label: '',
				}
				objD.value = dd;
				objD.label = d[cc][dd];
				objC.children.push(objD);
			}

		}
		arr.push(objP);
	}
	return arr;
}

export function customerType(type) {
	let client = '';
	switch(type) {
		case  0: client = '其他';
		break;
		case  1: client = '合作社';
		break;
		case  2: client = '药商';
		break;
		case  3: client = '药厂';
		break;
		case  4: client = '个体户';
		break;
		case  5: client = '药店';
		break;
		case  6: client = '医院';
		break;
		case  7: client = '贸易公司';
		break;
		case  8: client = '零售商行';
		break;
		case  9: client = '药农';
		break;
		case  10: client = '介绍人';
		break;
		case  11: client = '药贩子';
		break;
		case  12: client = '产地药商';
		break;
		case  13: client = '销地药商';
		break;
		case  14: client = '药农';
		break;
		case  15: client = '药农';
		break;
		case  16: client = '诊所';
		break;
		case  17: client = '化工厂';
		break;
		case  18: client = '化妆品厂';
		break;
		case  19: client = '提取物厂';
		break;

		case  20: client = '食品厂';
		break;
		case  21: client = '实验室';
		break;
		case  22: client = '网上电商';
		break;
		case  23: client = '中成药生产商';
		break;
		case  24: client = '西药生产商';
		break;
		case  25: client = '饮片厂';
		break;
		case  26: client = '花茶厂';
		break;
		case  27: client = '种植基地';
		break;
	}
	return client;
}
// 过滤省市县
export function getPCD() {
	// 通过数组获得省市县的文字 并返回
	// debugger;
	let ls = arguments.length;
	let arr = arguments;
	let p = address.p["000000"];
	let c = address.c;
	let d = address.d;
	let str = ''
	if(Number(arr[0]) > 0 && ls >= 1) {
		str = p[arr[0]]

		if(Number(arr[1]) > 0 && ls >= 2) {

			str += '/' + c[arr[0]][arr[1]];

			if(Number(arr[2]) > 0 && ls >= 3) {

				str += '/' + d[arr[1]][arr[2]];

			}
		}

	}
	return str;
}

//过滤 权限数组
export function filterMenus(res) {
	//置空父级的url
	let arr = []
	for(var i = 0; i < res.length; i++) {
		let obj = {};
		obj.name = res[i].cname;
		obj.index = i + '';
		//权限使用
		obj.subMenus = res[i].subMenus;
		//导航使用
		obj.children = [];
		arr.push(obj);
		//遍历路由级权限
		if(obj.subMenus.length > 0) {
			for(var j = 0; j < obj.subMenus.length; j++) {
				let sonObj = {};
				sonObj.path = obj.subMenus[j].url;
				sonObj.title = obj.subMenus[j].cname;
				sonObj.index = i + '-' + j;
				sonObj.subMenus = obj.subMenus[j].subMenus;
				sonObj.validate = {};
				//遍历按钮级的权限                    
				if(sonObj.subMenus.length > 0) {
					for(var k = 0; k < sonObj.subMenus.length; k++) {
						sonObj.validate[sonObj.subMenus[k].cname] = sonObj.subMenus[k].safecode;
					}
				}
				obj.children.push(sonObj);
			}
		}
	}
	return arr;
}

export function filterLocation(params) {
	if(params != '') {
		return params
	} else {
		return '不限'
	}
}

export function filterStockState(state) {
	switch(state){
		case 0:
			return '未入库';
			break;
		case 1:
			return '入库未完成';
			break;
		case 2:
			return '入库已完成';
			break;
	}

}