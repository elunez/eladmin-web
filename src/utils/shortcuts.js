import Date from './datetime.js'

export const calendarBaseShortcuts = [{
  text: '今天',
  onClick(picker) {
    const startTime = new Date(new Date().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '昨天',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(1).setHours(0, 0, 0))
    const endTime = new Date(new Date().daysAgo(1).setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '最近一周',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(7).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '最近30天',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(30).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '这个月',
  onClick(picker) {
    const startTime = new Date(new Date().monthBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '本季度',
  onClick(picker) {
    const startTime = new Date(new Date().quarterBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}]

export const calendarMoveShortcuts = [{
  text: '‹ 往前一天 ',
  onClick(picker) {
    let startTime = new Date(new Date().daysAgo(1).setHours(0, 0, 0))
    let endTime = new Date(new Date().daysAgo(1).setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime, endTime]
    }
    startTime = picker.value[0].daysAgo(1)
    endTime = picker.value[1].daysAgo(1)
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: ' 往后一天 ›',
  onClick(picker) {
    let startTime = new Date(new Date().setHours(0, 0, 0))
    let endTime = new Date(new Date().setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime, endTime]
    }
    startTime = picker.value[0].daysAgo(-1)
    endTime = picker.value[1].daysAgo(-1)
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '« 往前一周 ',
  onClick(picker) {
    let startTime = new Date(new Date().setHours(0, 0, 0))
    let endTime = new Date(new Date().setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime.daysAgo(new Date().getDay()),
        endTime.daysAgo(new Date().getDay() + 1)]
    } else {
      picker.value = [picker.value[0].daysAgo(picker.value[0].getDay()),
        picker.value[1].daysAgo(picker.value[1].getDay() + 1)]
    }
    startTime = picker.value[0].daysAgo(7)
    endTime = picker.value[1]
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: ' 往后一周 »',
  onClick(picker) {
    let startTime = new Date(new Date().setHours(0, 0, 0))
    let endTime = new Date(new Date().setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime.daysAgo(new Date().getDay() - 7),
        endTime.daysAgo(new Date().getDay() - 6)]
    } else {
      picker.value = [picker.value[0].daysAgo(picker.value[0].getDay() - 7),
        picker.value[1].daysAgo(picker.value[1].getDay() - 6)]
    }
    startTime = picker.value[0]
    endTime = picker.value[1].daysAgo(-7)
    picker.$emit('pick', [startTime, endTime])
  }
}]

export const calendarShortcuts = [
  ...calendarBaseShortcuts,
  ...calendarMoveShortcuts
]
