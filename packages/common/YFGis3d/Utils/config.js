/*eslint no-undef:  */
import { formatDate } from '.'

export function StaticParam(YFGis) {
  YFGis.VERSION = 'Dev ' + ATV
  YFGis.TIME = formatDate(RELEASETIME)
}
