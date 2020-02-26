/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}
/*年月日*/
export function parseTimeYMD(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    // 拼接
    return year + '-' + month + '-' + day;
  } else {
    return ''
  }
}
/*年月日*/
export function parseTimeymd(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    // 拼接
    return year +''+ month+'' + day;
  } else {
    return ''
  }
}
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
   const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


export  function deepClone(item){
  const target = item.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
  for(let keys in item){ // 遍历目标
    if(item.hasOwnProperty(keys)){
      if(item[keys] && typeof item[keys] === 'object'){ // 如果值是对象，就递归一下
        target[keys] = item[keys].constructor === Array ? [] : {};
        target[keys] = deepClone(item[keys]);
      }else{ // 如果不是，就直接赋值
        target[keys] = item[keys];
      }
    }
  }
  return target;
}
export  function arrToString(arr){
  if(arr.length){
    var data =arr[0];
    for(var i = 1;i<arr.length;i++){
      data = data+','+arr[i];
    }
    return data;
  }
  return '';
}
export  function getDictCaption(value,dict){
  var dictlabel = value;
  if(!value ||  !dict){
    return dictlabel;
  }else {
    if(value.indexOf(',') === -1){
      dictlabel = dictValueFindLabel(value,dict);
    }else {
      var dataArr = value.split(',');
      dictlabel =  dictValueFindLabel(dataArr[0],dict)
      for(var i = 1; i<dataArr.length;i++){
        dictlabel = dictlabel+','+dictValueFindLabel(dataArr[i],dict);
      }
    }
  }
  return  dictlabel;
}
export  function getDictValue(label,dict){
  var dictVaule = label;
  if(!label ||  !dict){
    return dictVaule;
  }else {
    for(var i=0;i<dict.length;i++){
       if(dict[i].label === label){
         dictVaule = dict[i].value;
         break;
       }
    }
  }
  return  dictVaule;
}
function dictValueFindLabel(value,dict) {
  if(dict){
    var label = '';
    for(var i=0;i<dict.length;i++){
      if(dict[i].value === value){
        label = dict[i].label;
      }
    }
    return label;
  }
}
export const formatDate = (date, fmt = 'yyyy/MM/dd') => {
  if (!date) date = new Date()
  if (typeof date === 'string') {
    date = new Date(date.replace(/(\d{4})[^\d]?(\d{2})[^\d]?(\d{2})[^\d]?/, '$1-$2-$3'))
  }
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
};

export const yearMonthDate = (date, fmt = 'yyyy/MM/dd') => {
  if (!date) date = new Date();
  if (typeof date === 'string') {
    date = new Date(date.replace(/(\d{4})[^\d]?(\d{2})[^\d]?(\d{2})[^\d]?/, '$1-$2-$3'))
  }
  var  month = date.getMonth() + 1;
  var year=date.getFullYear();
  month =(month<10 ? "0"+month:month);
  var mydate = (year.toString()+"-"+month.toString());
  return mydate
};


export function findArrayAttr(arr,attr,value){
    var index = -1;
    if(arr){
      for(var i = 0;i < arr.length;i++){
         if(arr[i][attr]===value){
           index = i;
           break;
         }
      }
    }
    return index;
}

export function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function ltrim(str){ //删除左边的空格
  return str.replace(/(^\s*)/g,"");
}

export function rtrim(str){ //删除右边的空格
  return str.replace(/(\s*$)/g,"");
}

export function strDate(str){
  var date = str;
  if(date&&date.length ===8){
    date = str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6,8)
  }
  return date;
}

export   function find(str,cha,num){
  var x=-1;
  if(str){
    x= str.indexOf(cha);
    for(var i=1;i<num;i++){
      x=str.indexOf(cha,x+1);
    }
  }
  return x;
}

export function coutChar(str,cha) {
  var num = 0;
  if(str){
    num = (str.split(cha)).length-1;
  }
  return num;
}


export function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


export function replaceFrontNZero(str) {
  var data = str
   if(data){
      return  data.replace(/\b(0+)/gi,"");
   }
   return data;
}
