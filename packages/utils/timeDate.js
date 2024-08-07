/*
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-08-07 18:50:58
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-07 19:33:59
 * @FilePath: \Everright-filter\packages\utils\timeDate.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import moment from 'moment'

// 最近多少天
function getRecentDateRange (days, hasToday = false) {
  if (typeof days === 'string') days *= 1
  const now = new Date()
  const endDate = hasToday ? now : new Date(now - (hasToday ? 0 : 1) * 24 * 60 * 60 * 1000)
  const startDate = new Date(now - days * 24 * 60 * 60 * 1000)

  return {
    start: moment(startDate).format('YYYY-MM-DD'),
    end: moment(endDate).format('YYYY-MM-DD')
  }
}

// 最近几个月
function getRecentMonthRange (numMonths, hasToday = false) {
  if (typeof numMonths === 'string') numMonths *= 1
  // 获取今天的日期
  const today = moment()
  // 获取 numMonths 个月前的日期
  const startDate = today.clone().subtract(numMonths, 'months').startOf('month')
  // 获取昨天的日期
  const endDate = today.clone().subtract(1, 'days')

  return {
    start: startDate.format('YYYY-MM-DD'),
    end: hasToday ? today.format('YYYY-MM-DD') : endDate.format('YYYY-MM-DD')
  }
}

// 最近几年
function getRecentYearRange (numYears, hasToday = false) {
  // 获取今天的日期
  const today = moment()
  // 获取 numYears 年前的日期
  const startDate = today.clone().subtract(numYears, 'years').startOf('year')
  // 获取昨天的日期
  const endDate = today.clone().subtract(1, 'days')

  return {
    start: startDate.format('YYYY-MM-DD'),
    end: hasToday ? today.format('YYYY-MM-DD') : endDate.format('YYYY-MM-DD')
  }
}

export {
  getRecentDateRange,
  getRecentMonthRange,
  getRecentYearRange
}
