<!--
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-05 18:01:52
 * @FilePath: \Everright-filter\packages\filter\components\Trigger.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
import { ref, computed, nextTick, reactive, inject, defineExpose } from 'vue'
import _ from 'lodash-es'
import NAME from '@ER/filter/name.js'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
export default {
  name: NAME.TRIGGERCOMPONENT
}
</script>
<script setup>
const props = defineProps(['options', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const ER = inject('Everright')
const element = ref()
const ns = hooks.useNamespace(NAME.TRIGGERCOMPONENT)
const {
  t,
  lang
} = hooks.useI18n()
// const {
//   getData,
//   setData
// } = hooks.useCommon(NAME.TRIGGERCOMPONENT, {})
const newOptions = computed(() => {
  return utils.convertDataByLang(props.options, lang.value)
})
const handleChange = (val) => {
  emit('update:modelValue', val)
}
defineExpose({
  ref: element
})
const filterMethod = (node, keyword) => {
  return node.text.toLowerCase().includes(keyword.toLowerCase())
}
</script>
<script>
/**
  <el-cascader
    :class="[ns.b(), utils.addTestId(NAME.TRIGGERCOMPONENT, 'id')]"
    ref="element"
    :checkStrictly="true"
    :model-value="modelValue"
    filterable
    :filter-method="filterMethod"
    :popperClass="utils.addTestId(`${NAME.TRIGGERCOMPONENT}-popperClass`, 'id')"
    @change="handleChange"
    :props="{
        emitPath: false
      }"
    :options="newOptions"
    size="small"/>
 */
</script>
<template>
  <el-select
    ref="element"
    v-model="modelValue"
    :class="[ns.b(), utils.addTestId(NAME.TRIGGERCOMPONENT, 'id')]"
    :popperClass="utils.addTestId(`${NAME.TRIGGERCOMPONENT}-popperClass`, 'id')"
    filterable
    size="small">
    <el-option
      v-for="item in newOptions"
      :key="item.value"
      :label="utils.getLableByLang(item, lang)"
      :value="item.value"
    />
  </el-select>
</template>
