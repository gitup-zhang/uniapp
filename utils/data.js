import dayjs from 'dayjs'

export function Dataformat(timeStr){
	return dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss')
}