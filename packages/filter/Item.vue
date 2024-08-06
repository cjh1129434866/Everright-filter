<!--
 * @Author: panghu chenjh@datamargin.com
 * @Date: 2024-05-09 11:26:29
 * @LastEditors: panghu chenjh@datamargin.com
 * @LastEditTime: 2024-08-06 16:39:03
 * @FilePath: \Everright-filter\packages\filter\Item.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script>
import { computed, ref, reactive, provide, inject, toRefs, onMounted, watch, onBeforeUnmount } from 'vue'
import NAME from '@ER/filter/name.js'
import _ from 'lodash-es'
import hooks from '@ER/hooks'
import Rule from './Rule.vue'
import LogicalOperatorComponent from './components/LogicalOperator.vue'
import utils from '@ER/utils'
import { ElMessage } from 'element-plus'
export default {
  name: NAME.FILTERITEM
}

</script>
<script setup>
const ER = inject('Everright')
const {
  t,
  lang
} = hooks.useI18n()
const ERConstraint = inject('EverrightConstraint', '')
const topGetData = inject('topGetData', () => ({}))
const topSetData = inject('topSetData', () => ({}))
const emit = defineEmits(['del'])
const props = defineProps({
  id: {
    type: String
  },
  index: {
    type: Number
  },
  parent: {
    type: Array
  }
})
const ns = hooks.useNamespace(NAME.FILTERITEM)
const ruleRef = ref()
const optionContentRef = ref()
const state = reactive({
  logicalOperator: 'and',
  // rules: ER.props.type === 'quick-filter' ? [] : utils.generateItems(1)
  rules: /^(quick-search|quick-filter)$/.test(ER.props.type) ? [] : utils.generateItems(1)
})
const isShowOperator = computed(() => {
  return ER.props.type !== 'quick-filter' && state.rules.length > 1
})
const isInConstraint = !!ERConstraint
const {
  getData,
  setData
} = hooks.useCommon(NAME.FILTERITEM, {
  ...toRefs(state),
  ...toRefs(props),
  ruleRef
})
const addRule = (index, which = 'tag') => {
  if (which === 'seg') {
    const data = topGetData()
    console.log('data===', data)
    if (data.filters === undefined) {
      ElMessage.warning('有表单尚未输入值')
      return
    }
    data.filters[index].conditions.push({
      operator: 'belong',
      property: 'seg',
      value: 'any'
    })
    console.log(data)
    topSetData(data)
  } else {
    if (ER.props.canAddRule() !== false) {
      state.rules.push(...utils.generateItems(1))
    }
  }
}
defineExpose({
  getData,
  setData,
  addRule () {
    state.rules.push(...utils.generateItems(1))
  },
  state
})
const operatorHeight = ref('auto')
const callback = (mutationsList) => {
  let curHeight = 0
  const nodes = optionContentRef.value.querySelectorAll(`.${ns.e('rule')}`)
  for (let i = 0; i < nodes.length - 1; i++) {
    const cur = nodes[i]
    curHeight += cur.offsetHeight
  }
  if (nodes.length > 1) {
    curHeight += 52
  }
  operatorHeight.value = curHeight === 0 ? 'auto' : curHeight
}
let observer = ''
if (!isInConstraint) {
  onMounted(() => {
    const config = { attributes: false, childList: true, subtree: true }
    observer = new MutationObserver(callback)
    observer.observe(optionContentRef.value, config)
  })
  onBeforeUnmount(() => {
    observer.disconnect()
    observer = null
  })
}
watch(state.rules, (newVal) => {
  if (!newVal.length) {
    emit('del')
  }
}, { deep: true })
const itemLabel = computed(() => {
  return lang.value === 'zh-cn' ? utils.digitalToChinese(props.parent.indexOf(props.id) + 1) : utils.digitalToEnglish(props.parent.indexOf(props.id) + 1)
})

const isAddConditionBtn = ref(true)
</script>
<template>
  <div :class="[ns.b()]">
    <h2 v-if="!isInConstraint && ER.props.type === 'matrix'">{{ t(`er.${NAME.FILTERITEM}.itemLabel`) }} {{ itemLabel }}</h2>
    <div :class="['EverrightFilterOption']">
      <LogicalOperatorComponent
        v-if="!isInConstraint && isShowOperator"
        :height="operatorHeight"
        v-model="state.logicalOperator"/>
      <div
        ref="optionContentRef"
        :class="[ns.e('optionContent'), 'EverrightFilterOptionContent']">
        <TransitionGroup name="el-fade-in">
          <!-- 每一个rule代表一个条件 -->
          <Rule
            ref="ruleRef"
            :class="!isInConstraint && ns.e('rule')"
            v-for="(item, i) in state.rules"
            :key="item"
            :id="item"
            :parentId="id"
            :parent="state.rules"
            :index="index + '-' + i"
          />
        </TransitionGroup>
        <div :class="[ns.e('operate')]" @mouseenter="isAddConditionBtn = false" @mouseleave="isAddConditionBtn = true">
          <el-button
            v-if="isInConstraint ? true : ER.isShowAdd.value"
            v-show="isAddConditionBtn"
            :class="[ns.e('add')]"
            v-bind="utils.addTestId('addCondition')"
            @click="addRule"
            link
            size="small"
            :icon="Delete"
          ><el-icon><Plus /></el-icon>{{isInConstraint ? t(`er.${NAME.FILTERITEM}.addProp`) : t(`er.${NAME.FILTERITEM}.addCondition`)}}</el-button>
          <div v-show="!isAddConditionBtn" :class="[ns.e('add-items')]">
            <el-button type="primary" v-if="isInConstraint ? true : ER.isShowAdd.value" link  v-bind="utils.addTestId('addCondition')"
            @click="addRule(index, 'tag')">+ 标签</el-button>
            <el-button type="primary" v-if="isInConstraint ? true : ER.isShowAdd.value" link  v-bind="utils.addTestId('addCondition')"
            @click="addRule(index, 'seg')">+ 客群</el-button>
            <span :class="[ns.e('font-size-12')]">+ 明细数据</span>
            <span :class="[ns.e('font-size-12')]">+ 客户数据</span>
            <span :class="[ns.e('font-size-12')]">+ 行为数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
