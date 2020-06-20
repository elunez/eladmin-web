<script>
import { DatePicker, DatePickerOptions } from 'element-ui'
import { calendarShortcuts } from '@/utils/shortcuts'

export default {
  name: 'DateRangePicker',
  mixins: [DatePicker],
  props: {
    type: {
      type: String,
      default: 'daterange'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    defaultTime: {
      type: Array,
      default: _ => ['00:00:00', '23:59:59']
    },
    pickerOptions: {
      type: DatePickerOptions,
      default: _ => {
        return { shortcuts: calendarShortcuts }
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    rangeSeparator: {
      type: String,
      default: ':'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }
  }
}
</script>
