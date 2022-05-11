import dayjs from 'dayjs';
import { Color, MeshPhysicalMaterial, TextureLoader } from 'three';
export const AutoSaveTime = 5 * 60 * 1000;
// 项目截图路径
export const ProjectScreenshot = 'project/screenshot/';
// 用户头像路径
export const UserAvatar = 'user/avatar/';

export const MaterialScreenshot = 'material/screenshot/';

export const Enterprise = 'enterprise/';

// 时间格式化
export const formatToLocalDate = (time: string) => {
  const targetDate = parseInt(time);
  const now = Date.now();
  const reduce = now - targetDate;
  if (reduce < 60 * 1000) {
    return '刚刚';
  } else if (reduce >= 60 * 1000 && reduce < 30 * 60 * 1000) {
    return parseInt((reduce / (60 * 1000)).toString()) + '分钟前';
  } else if (reduce >= 30 * 60 * 1000 && reduce < 60 * 60 * 1000) {
    return '半小时前';
  } else if (reduce >= 60 * 60 * 1000 && reduce < 24 * 60 * 60 * 1000) {
    return parseInt((reduce / (60 * 60 * 1000)).toString()) + '小时前';
  } else if (reduce >= 24 * 60 * 60 * 1000 && reduce < 7 * 24 * 60 * 60 * 1000) {
    return parseInt((reduce / (24 * 60 * 60 * 1000)).toString()) + '天前';
  } else if (reduce >= 7 * 24 * 60 * 60 * 1000 && reduce < 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (7 * 24 * 60 * 60 * 1000)).toString()) + '周前';
  } else if (reduce >= 30 * 24 * 60 * 60 * 1000 && reduce < 6 * 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '个月前';
  } else if (reduce >= 6 * 30 * 24 * 60 * 60 * 1000 && reduce < 7 * 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '半年前';
  } else {
    return dayjs(time).format('YYYY/MM/DD HH:mm');
  }
};

// 'distance' | 'weight' | 'time' | 'festival'
export const ruleTypes = [
  { label: '距离', value: 'distance', color: 'orange' },
  { label: '重量', value: 'weight', color: 'blue' },
  { label: '时间段', value: 'time', color: 'pink' },
  { label: '节日', value: 'festival', color: 'green' }
];
