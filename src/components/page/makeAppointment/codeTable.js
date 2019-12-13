const period = [ // 年级
    {
    flex: 1,
    values: ['请选择学段', '小学', '初中', '高中'],
    className: 'slot1',
    textAlign: 'center'
    },
]
const subjectHigh = [
    {
    flex: 1,
    values: ['请选择学科', '语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'],
    className: 'slot1',
    textAlign: 'center'
    },
]

const subjectJunior = [
    {
    flex: 1,
    values: ['请选择学科', '语文', '数学', '英语', '物理'],
    className: 'slot1',
    textAlign: 'center'
    },
]

const subjectPrimary = [
    {
    flex: 1,
    values: ['请选择学科', '语文', '数学', '英语'],
    className: 'slot1',
    textAlign: 'center'
    },
]

var time = [
    {
      flex: 1,
      values: [],
      className: 'slot1',
      textAlign: 'right'
    }, {
      divider: true,
      content: '-',
      className: 'slot2'
    }, {
      flex: 1,
      values: [],
      className: 'slot3',
      textAlign: 'left'
    }
  ]

export {
    period,
    subjectHigh,
    subjectJunior,
    subjectPrimary,
    time,
}