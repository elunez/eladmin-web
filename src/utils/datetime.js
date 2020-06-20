/* eslint-disable */

/**
 * Date对象的补充函数，包括类似Python中的strftime()
 * 阿债 https://gitee.com/azhai/datetime.js
 */

Date.prototype.toMidnight = function() {
  this.setHours(0)
  this.setMinutes(0)
  this.setSeconds(0)
  this.setMilliseconds(0)
  return this
}

Date.prototype.daysAgo = function(days, midnight) {
  days = days ? days - 0 : 0
  const date = new Date(this.getTime() - days * 8.64E7)
  return midnight ? date.toMidnight() : date
}

Date.prototype.monthBegin = function(offset) {
  offset = offset ? offset - 0 : 0
  const days = this.getDate() - 1 - offset
  return this.daysAgo(days, true)
}

Date.prototype.quarterBegin = function() {
  const month = this.getMonth() - this.getMonth() % 3
  return new Date(this.getFullYear(), month, 1).toMidnight()
}

Date.prototype.yearBegin = function() {
  return new Date(this.getFullYear(), 0, 1).toMidnight()
}

Date.prototype.strftime = function(format, local) {
  if (!format) {
    const str = new Date(this.getTime() + 2.88E7).toISOString()
    return str.substr(0, 16).replace('T', ' ')
  }
  local = local && local.startsWith('zh') ? 'zh' : 'en'
  const padZero = function(str, len) {
    const pads = len - str.toString().length
    return (pads && pads > 0 ? '0'.repeat(pads) : '') + str
  }
  format = format.replace('%F', '%Y-%m-%d')
  format = format.replace(/%D|%x/, '%m/%d/%y')
  format = format.replace(/%T|%X/, '%H:%M:%S')
  format = format.replace('%R', '%H:%M')
  format = format.replace('%r', '%H:%M:%S %p')
  format = format.replace('%c', '%a %b %e %H:%M:%S %Y')
  const _this = this
  return format.replace(/%[A-Za-z%]/g, function(f) {
    let ans = f
    switch (f) {
      case '%%':
        ans = '%'
        break

      case '%Y':
      case '%G':
        ans = _this.getFullYear()
        break

      case '%y':
        ans = _this.getFullYear() % 100
        break

      case '%C':
        ans = _this.getFullYear() / 100
        break

      case '%m':
      case '%n':
        ans = _this.getMonth() + 1
        break

      case '%B':
        local = local.startsWith('en') ? 'english' : local

      case '%b':
        const m = _this.getMonth()
        ans = local_labels.monthes[local][m]
        break

      case '%d':
      case '%e':
        ans = _this.getDate()
        break

      case '%j':
        ans = _this.getDaysOfYear()
        break

      case '%U':
      case '%W':
        const ws = _this.getWeeksOfYear(f === '%W')
        ans = padZero(ws, 2)
        break

      case '%w':
        ans = _this.getDay()

      case '%u':
        ans = ans === 0 ? 7 : ans
        break

      case '%A':
        local = local.startsWith('en') ? 'english' : local

      case '%a':
        const d = _this.getDay()
        ans = local_labels.weekdays[local][d]
        break

      case '%H':
      case '%k':
        ans = _this.getHours()
        break

      case '%I':
      case '%l':
        ans = _this.getHours()
        ans = ans % 12
        break

      case '%M':
        ans = _this.getMinutes()
        break

      case '%S':
        ans = _this.getSeconds()
        break

      case '%s':
        ans = parseInt(_this.getTime() / 1E3)
        break

      case '%f':
        const ms = _this.getMilliseconds()
        ans = padZero(ms * 1E3, 6)
        break

      case '%P':
        local = local.startsWith('en') ? 'english' : local

      case '%p':
        const h = _this.getHours()
        ans = local_labels.meridians[local][h < 12 ? 0 : 1]
        break

      case '%z':
        let tzo = _this.getTimezoneOffset()
        const sign = tzo < 0 ? '-' : '+'
        tzo = Math.abs(tzo)
        const ho = padZero(tzo / 60, 2)
        const mo = padZero(tzo % 60, 2)
        ans = sign + ho + mo
        break

      default:
        break
    }
    if (f === '%C' || f === '%y' || f === '%m' || f === '%d' || f === '%H' || f === '%M' || f === '%S') {
      ans = padZero(ans, 2)
    }
    return ans.toString()
  })
}

Date.prototype.humanize = function(local) {
  local = local && local.startsWith('zh') ? 'zh' : 'en'
  const result = this.strftime('', local)
  const days = (Date.today() - this.toMidnight().getTime()) / 8.64E7
  if (days <= -10 || days >= 10) {
    return result
  }
  const labels = local_labels.dayagos[local]
  let lbl = ''
  if (days === 0 || days === 1) {
    lbl = labels[days]
  } else if (days === -1) {
    lbl = labels[2]
  } else if (days >= 2) {
    lbl = days + labels[3]
  } else {
    lbl = days + labels[4]
  }
  return lbl + result.substr(10, 6)
}

const local_labels = {
  monthes: {
    english: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  weekdays: {
    english: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    zh: ['日', '一', '二', '三', '四', '五', '六']
  },
  meridians: {
    english: ['a.m.', 'p.m.'],
    en: ['AM', 'PM'],
    zh: ['上午', '下午']
  },
  dayagos: {
    english: ['Today', 'Yesterday', 'Tomorrow', ' days ago', ' days late'],
    en: ['Today', 'Yesterday', 'Tomorrow', ' days ago', ' days late'],
    zh: ['今天', '昨天', '明天', '天前', '天后']
  }
}

export default Date
