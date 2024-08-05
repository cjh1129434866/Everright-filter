<!--
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-05 17:07:13
 * @FilePath: \Everright-filter\examples\views\demo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { ref } from 'vue'
import { EverrightFilter } from '/packages/filter'
const ERfilterRef = ref(null)
const lang = ref('en')
const handleListener = ({ type, data }) => {
  console.log('type===', type)
  console.log('data===', data)
}
const getOptions = async () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        options: [
          {
            label: '客户名称',
            en_label: 'Customer name',
            value: 'input_NYF_NaWIL1ezQeje19fO5',
            operatorKey: 'input',
            renderType: 'TEXT',
            includeOperator: {
              operator: [
                'contains'
              ]
            }
          },
          {
            label: '客户编号',
            en_label: 'Customer ID',
            value: 'input_4FbXNPc1ValSmbVZ4X03i',
            operatorKey: 'input',
            renderType: 'TEXT',
            includeOperator: {
              operator: [
                'contains'
              ]
            }
          },
          {
            label: '富文本编辑器',
            en_label: 'rich text editor',
            value: 'html_doavWMEKsA04CBVc2qkvB',
            operatorKey: 'input',
            renderType: 'TEXT',
            includeOperator: {
              operator: [
                'contains'
              ]
            }
          }
        ],
        operators: {
          input: [
            {
              value: 'contains',
              style: 'noop'
            }
          ]
        }
      }
    })
  })
}
</script>
<template>
  <div>
    <EverrightFilter
      :lang="lang"
      :getOptions="getOptions"
      type="quick-filter"
      @listener="handleListener"
      ref="ERfilterRef"/>
  </div>
</template>
