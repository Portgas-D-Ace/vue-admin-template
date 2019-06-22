import defaultSettings from '@/settings'

const title = defaultSettings.title || 'wemew Admin1'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
