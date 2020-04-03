import defaultSettings from '@/settings'

const title = defaultSettings.title || '衢州移动网络运维可视化平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
