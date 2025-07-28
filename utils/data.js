import dayjs from 'dayjs'

export function Dataformat(timeStr){
	return dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss')
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取当前日期的最近一周日期
 * @returns {string} 最近一周的日期，格式为 yyyy-mm-dd
 */
export function getLastWeekDate() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7); // 当前时间减去7天
  return formatDate(currentDate); // 返回格式化后的日期
}

/**
 * 获取当前日期的最近一月日期
 * @returns {string} 最近一月的日期，格式为 yyyy-mm-dd
 */
export function getLastMonthDate() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1); // 当前时间减去1月
  return formatDate(currentDate);
}

/**
 * 获取当前日期的最近一年日期
 * @returns {string} 最近一年的日期，格式为 yyyy-mm-dd
 */
export function getLastYearDate() {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 1); // 当前时间减去1年
  return formatDate(currentDate);
}