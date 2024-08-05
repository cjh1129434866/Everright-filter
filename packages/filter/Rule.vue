<!--
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-05 16:17:06
 * @FilePath: \Everright-filter\packages\filter\Rule.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
import { computed, ref, reactive, inject, toRefs, nextTick, onBeforeUnmount } from 'vue'
import hooks from '@ER/hooks'
import NAME from '@ER/filter/name.js'
import _ from 'lodash-es'
import PickerComponent from './components/Picker.vue'
import ConstraintComponent from './components/Constraint.vue'
export default {
  name: NAME.FILTERRULE
}
</script>
<script setup>
const ER = inject('Everright')
const props = defineProps(['id', 'parent', 'parentId', 'index'])
const ns = hooks.useNamespace(NAME.FILTERRULE)
const pickerRef = ref()
const constraintRef = ref()
const state = reactive({
  logicalOperator: 'and',
  isShowConstraint: false,
  params: {
    params: {}
  }
})
const {
  getData,
  setData
} = hooks.useCommon(NAME.FILTERRULE, {
  ...toRefs(state),
  ...toRefs(props),
  pickerRef,
  constraintRef
})
defineExpose({
  getData,
  setData
})
const handleListener = ({ type, data }) => {
  if (type === 'change') {
    const isReRender = data.isReRender !== false
    isReRender && (state.isShowConstraint = false)
    state.params = data
    nextTick(() => {
      isReRender && (state.isShowConstraint = _.get(data, 'params.constraint', false))
    })
  }
  if (type === 'clear') {
    state.params = {}
    state.isShowConstraint = false
  }
}
const ERConstraint = inject('EverrightConstraint', '')
const isInConstraint = !!ERConstraint
if (!isInConstraint) {
  if (!ER.state.rulesState[props.parentId]) {
    ER.state.rulesState[props.parentId] = 0
  }
  ER.state.rulesState[props.parentId] += 1
  onBeforeUnmount(() => {
    ER.state.rulesState[props.parentId] -= 1
  })
}
</script>
<template>
  <div :class="[ns.b(), (!isInConstraint && !/^quick-(search|filter)$/.test(ER.props.type)) && ns.e('border')]">
    <div class="rule-index">{{ ++index.split('-')[1] }}</div>
    <PickerComponent
      ref="pickerRef"
      :id="id"
      :parent="parent"
      @listener="handleListener"
      :index="index"
    />
    <ConstraintComponent
      ref="constraintRef"
      v-if="state.isShowConstraint"
      :params="state.params"
      :id="id"
    />
  </div>
</template>
