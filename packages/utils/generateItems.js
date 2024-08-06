/*
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-06 15:04:04
 * @FilePath: \Everright-filter\packages\utils\generateItems.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import _ from 'lodash-es'
const generateItems = (len = 1) => {
  const result = []
  while (len--) {
    result.push(_.uniqueId())
  }
  console.log('result====', result)
  return result
}
export {
  generateItems
}
