<!--
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-05-09 15:48:36
 * @FilePath: \Everright-filter\packages\filter\components\LogicalOperator.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
import hooks from '@ER/hooks'
import { ref, computed, nextTick, reactive, inject } from 'vue'
import _ from 'lodash-es'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import NAME from '@ER/filter/name.js'
import utils from '@ER/utils'
export default {
  name: NAME.LOGICALOPERATORCOMPONENT
}
</script>
<script setup>
const {
  t,
  lang
} = hooks.useI18n()
const props = defineProps(['modelValue', 'height'])
const emit = defineEmits(['update:modelValue'])
const ns = hooks.useNamespace('LogicalOperatorComponent')
const value = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
<template>
  <div :class="[ns.b(), value === 'and' ? 'and' : 'or']" :style="{ height: height + 'px'}">
    <el-switch
      v-bind="utils.addTestId(NAME.LOGICALOPERATORCOMPONENT)"
      v-model="value"
      inline-prompt
      style="--el-switch-on-color: #75A0F5; --el-switch-off-color: #6BC8A6"
      :active-text="t('er.public.and')"
      active-value="and"
      :inactive-text="t('er.public.or')"
      inactive-value="or"
    />
  </div>
</template>
