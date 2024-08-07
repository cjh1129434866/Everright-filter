<script>
import { ref, computed, nextTick, reactive, inject, defineExpose, defineComponent, unref, watch, toRefs, onMounted } from 'vue'
import _ from 'lodash-es'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import DayHourComponent from './DayHour.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import NAME from '@ER/filter/name.js'
import hooks from '@ER/hooks'
import utils from '@ER/utils'
export default {
  name: NAME.DATECOMPONENT
}
</script>
<script setup>
const isTest = import.meta.env.MODE === 'test'
const props = defineProps(['isRange', 'params', 'isShowSwitchButton', 'defaultValue', 'id', 'isConstraint'])
const ER = inject('Everright')
const ns = hooks.useNamespace(NAME.DATECOMPONENT)
const staticDateRef = ref()
const {
  t,
  lang
} = hooks.useI18n()
const state = reactive({
  hasToday: 1,
  isShowIncludeToday: false,
  absolute: false,
  staticDate: '',
  dynamicDate: {
    shortcut: '',
    intervalBefore: '',
    afterBefore: '',
    erenowBefore: '',
    intervalBetween: ''
  }
})
const shortcutRangeDate = ref(['--', '--'])
const buttonRef = ref()
const popoverRef = ref()
const activeTab = ref('dynamic_date')
const rangeTab = ref(false)
watch(() => props.isRange, (newVal) => {
  if (!props.isShowSwitchButton) {
    state.absolute = newVal
  }
}, {
  immediate: true
})
const shortcutsData = computed(() => {
  return [
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.today_today`),
    //   active: false,
    //   value: '- 0 days/- 0 days',
    //   key: 'today_today'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.today_thisWeek`),
    //   active: false,
    //   value: '- 0 weeks/- 0 weeks',
    //   key: 'today_thisWeek'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.yesterday_onlineToday`),
    //   active: false,
    //   value: 'release_time/- 0 days',
    //   key: 'yesterday_onlineToday'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.yesterday_yesterday`),
    //   active: false,
    //   value: '- 1 days/- 1 days',
    //   key: 'yesterday_yesterday'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.yesterday_lastWeek`),
    //   active: false,
    //   value: '- 1 weeks/- 1 weeks',
    //   key: 'yesterday_lastWeek'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.yesterday_lastMonth`),
    //   active: false,
    //   value: '- 1 months/- 1 months',
    //   key: 'yesterday_lastMonth'
    // },
    // {
    //   label: t(`er.${NAME.DATECOMPONENT}.yesterday_lastYear`),
    //   active: false,
    //   value: '- 1 years/- 1 years',
    //   key: 'yesterday_lastYear'
    // },
    // 以下 是 cms 画像平台 个性化修改
    // 最近一天
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_1_day`),
      active: false,
      value: '- 1 days/- 1 days',
      key: 'recent_1_day'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_3_day`),
      active: false,
      value: '- 3 days/- 3 days',
      key: 'recent_3_day'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_7_day`),
      active: false,
      value: '- 7 days/- 7 days',
      key: 'recent_7_day'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_14_day`),
      active: false,
      value: '- 14 days/- 14 days',
      key: 'recent_14_day'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_30_day`),
      active: false,
      value: '- 30 days/- 30 days',
      key: 'recent_30_day'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.today_thisMonth`),
      active: false,
      value: '- 0 months/- 0 months',
      key: 'today_thisMonth'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_2_month`),
      active: false,
      value: '- 2 months/- 2 months',
      key: 'recent_2_month'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_3_month`),
      active: false,
      value: '- 3 months/- 3 months',
      key: 'recent_3_month'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_6_month`),
      active: false,
      value: '- 6 months/- 6 months',
      key: 'recent_6_month'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.recent_1_year`),
      active: false,
      value: '- 1 year/- 6 year',
      key: 'recent_1_year'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.today_thisYear`),
      active: false,
      value: '- 0 years/- 0 years',
      key: 'today_thisYear'
    },
    {
      label: t(`er.${NAME.DATECOMPONENT}.custom`),
      active: false,
      value: 'custom',
      key: 'custom'
    }
  ]
})
const manualsData = ['intervalBefore', 'afterBefore', 'erenowBefore', 'intervalBetween']
const shortcuts = computed(() => {
  const excludeShortcuts = _.get(unref(props.params), 'datePanel.excludeShortcuts', [])
  return excludeShortcuts === -1
    ? []
    : shortcutsData.value.map((e) => {
      e.active = state.dynamicDate.shortcut === e.value
      return e
    }).filter((e) => excludeShortcuts.indexOf(e.key) === -1)
})
const manuals = computed(() => {
  const excludeManuals = _.get(unref(props.params), 'datePanel.excludeManuals', [])
  return excludeManuals === -1 ? [] : manualsData.filter((e) => excludeManuals.indexOf(e) === -1)
})
console.log('manuals===', manuals)
if (!manuals.value.length && !shortcuts.value.length) {
  state.absolute = true
}
const manualType = computed(() => {
  return _.get(unref(props.params), 'datePanel.manualType', 3)
})
const dynamicDateSuffix = (type) => {
  return (type === 1 ? t('er.public.days') : t('er.public.hours'))
}
const buttonText = computed(() => {
  let result = t('er.public.select')
  if (state.absolute && activeTab.value === 'range_date') {
    result = t(`er.${NAME.DATECOMPONENT}.intervalDate`)
  } else if (state.absolute && activeTab.value === 'absolute_date') {
    result = t(`er.${NAME.DATECOMPONENT}.singleDate`)
  } else {
    const dynamicDate = state.dynamicDate
    for (const key in dynamicDate) {
      if (key === 'shortcut') {
        if (dynamicDate[key]) {
          result = _.find(unref(shortcuts), { value: dynamicDate.shortcut }).label
        }
      } else {
        if (dynamicDate[key].value) {
          switch (key) {
            case 'intervalBefore':
              result = `${t(`er.${NAME.DATECOMPONENT}.last`)} ${dynamicDate[key].value} ${dynamicDateSuffix(dynamicDate[key].type)}`
              break
            case 'afterBefore':
              result = `${t(`er.${NAME.DATECOMPONENT}.next`)} ${dynamicDate[key].value} ${dynamicDateSuffix(dynamicDate[key].type)}`
              break
            case 'erenowBefore':
              result = `${dynamicDate[key].value} ${dynamicDateSuffix(dynamicDate[key].type)} ${t(`er.${NAME.DATECOMPONENT}.ago`)}`
              break
            case 'intervalBetween':
              if (dynamicDate[key].value.every(e => e !== null)) {
                result = `${t(`er.${NAME.DATECOMPONENT}.last`)} ${dynamicDate[key].value[0]} - ${dynamicDate[key].value[1]} ${dynamicDateSuffix(dynamicDate[key].type)}`
              }
              break
          }
        }
      }
    }
  }
  return result
})

const handleEvent = (type, item, isAuto = true) => {
  console.log('走 handleEvent 了 start --------------------')
  console.log(type, '-----------', item)
  console.log('走 handleEvent 了 end --------------------')
  if (type === 'shortcuts') {
    state.dynamicDate.shortcut = item.value
    if (item.key !== 'custom') { // 不是 【自定义】
      // utils.getRecentDateRange()
      const key = item.key
      let keyWords = []
      if (key.startsWith('recent')) {
        keyWords = key.split('_')
        console.log('keyWords===', keyWords)
      }
      let rangeDate = {}
      switch (keyWords[0]) {
        case 'recent':
          const lastWord = keyWords[keyWords.length - 1]
          switch (lastWord) {
            case 'day':
              rangeDate = utils.getRecentDateRange(keyWords[1])
              shortcutRangeDate.value = [rangeDate.start, rangeDate.end]
              break
            case 'month':
              rangeDate = utils.getRecentMonthRange(keyWords[1])
              shortcutRangeDate.value = [rangeDate.start, rangeDate.end]
              break
            case 'year':
              rangeDate = utils.getRecentYearRange(keyWords[1])
              shortcutRangeDate.value = [rangeDate.start, rangeDate.end]
              break
            default:
              break
          }
          break
        default:
          break
      }
    }

    // unref(popoverRef) && unref(popoverRef).hide()
    reset('shortcut')
  } else if (type === 'staticDate') {
    state.absolute = true
    unref(popoverRef).hide()
    if (isAuto) {
      nextTick(() => {
        unref(staticDateRef).focus()
      })
    }
    reset('staticDate')
  } else {
    reset(type)
  }
  if (/^(intervalBefore|afterBefore|shortcuts)$/.test(type)) {
    if (type === 'shortcuts') {
      state.isShowIncludeToday = state.dynamicDate.shortcut === 'custom'
    } else {
      state.isShowIncludeToday = state.dynamicDate[type].type === 1
    }
    state.hasToday = 1
  } else {
    state.isShowIncludeToday = false
  }
}
const reset = (excludeKey) => {
  // if (/^(view)$/.test(excludeKey)) {}
  for (const key in state.dynamicDate) {
    if (key !== excludeKey) {
      state.dynamicDate[key] = ''
    }
  }
  if (excludeKey !== 'staticDate') {
    state.absolute = false
    state.staticDate = ''
  }
}
const {
  getData,
  setData,
  clearData,
  v$
} = hooks.useCommon(NAME.DATECOMPONENT, {
  ...toRefs(state),
  ...toRefs(props),
  buttonText,
  shortcuts,
  handleEvent
})
defineExpose({
  getData,
  setData,
  clearData
})
if (_.isEmpty(ER.state.remoteData)) {
  onMounted(() => {
    if (props.defaultValue) {
      state.dynamicDate.intervalBefore.value = 90
    }
  })
}
const datePickerType = computed(() => {
  return props.isRange || rangeTab.value ? 'daterange' : _.get(unref(props.params), 'datePanel.pickerType', 'date')
})
if (isTest) {
  onMounted(() => {
    switch (datePickerType.value) {
      case 'dates':
        state.staticDate = ['1689852743']
        break
      case 'daterange':
        state.staticDate = ['1689852743', '1689902350']
        break
      case 'datetime':
        state.staticDate = '1690556400'
        break
    }
  })
}
/** tab change */
const handleTabChange = (name) => {
  rangeTab.value = false
  switch (name) {
    case 'range_date':
      rangeTab.value = true
      if (typeof state.staticDate === 'string') {
        state.staticDate = [state.staticDate, state.staticDate]
      }
      handleEvent('staticDate')
      break
    case 'absolute_date':
      if (Array.isArray(state.staticDate)) {
        state.staticDate = state.staticDate[0]
      }
      handleEvent('staticDate')
      break
    default:
      state.absolute = false
      break
  }
}
</script>
<template>
  <el-popover
    placement="bottom"
    width="auto"
    ref="popoverRef"
    :popperClass="utils.addTestId(`${NAME.DATECOMPONENT}-popperClass`, 'id')"
    trigger="click"
    :virtual-ref="buttonRef"
    virtual-triggering
    size="small"
  >
    <el-tabs tab-position="left" v-model="activeTab" class="demo-tabs" @tab-change="handleTabChange">
      <el-tab-pane :label="t(`er.${NAME.DATECOMPONENT}.timeFrame`)" disabled name="time_range"></el-tab-pane>
      <el-tab-pane :label="t(`er.${NAME.DATECOMPONENT}.dynamicDate`)" name="dynamic_date">
        <div :class="[ns.e('dynamic_date_info')]">
          <div :class="[ns.e('tip')]">{{ t(`er.${NAME.DATECOMPONENT}.shortcut`) }}</div>
          <div :class="[ns.e('line-between')]"></div>
          <div :class="[ns.e('date')]">
            <span :class="[ns.e('name')]">{{ t(`er.${NAME.DATECOMPONENT}.dateSelect`) }}：</span>
            <span :class="ns.e('date_from')">{{ shortcutRangeDate[0] }}</span>
            <span :class="ns.e('wavy')">~</span>
            <span :class="ns.e('date_to')">{{ shortcutRangeDate[1] }}</span>
          </div>
        </div>
        <div :class="[ns.e('shortcuts')]">
          <el-button
            @click="() => handleEvent('shortcuts', item)"
            :class="[!!item.active && ns.is('active')]"
            v-for="(item, index) in shortcuts"
            :key="index"
            v-show="!item.isShow"
            v-bind="utils.addAttrs({
              value: item.value
            })"
            size="small"
          >
            {{item.label}}
          </el-button>
        </div>
        <div :class="[ns.e('custom')]" v-if="state.dynamicDate.shortcut === 'custom' || state.dynamicDate.intervalBefore.type === 1">
          <div :class="[ns.e('manuals')]">
          <template v-for="item in manuals" :key="item">
            <DayHourComponent
              v-if="item === 'intervalBefore'"
              v-model="state.dynamicDate.intervalBefore"
              @change="() => handleEvent('intervalBefore')"
              a="20"
              :prependLabel="t(`er.${NAME.DATECOMPONENT}.recent`)"
              v-bind="utils.addAttrs({
                value: item
              })"
              :type="manualType"/>
            <!-- <DayHourComponent
              v-if="item === 'afterBefore'"
              v-model="state.dynamicDate.afterBefore"
              @change="() => handleEvent('afterBefore')"
              :prependLabel="t(`er.${NAME.DATECOMPONENT}.next`)"
              v-bind="utils.addAttrs({
                value: item
              })"
              :type="manualType"/> -->
            <!-- <DayHourComponent
              v-if="item === 'erenowBefore'"
              :appendLabel="t(`er.${NAME.DATECOMPONENT}.ago`)"
              v-model="state.dynamicDate.erenowBefore"
              @change="() => handleEvent('erenowBefore')"
              v-bind="utils.addAttrs({
                value: item
              })"
              :type="manualType"/> -->
            <!-- <DayHourComponent
              v-if="item === 'intervalBetween'"
              :prependLabel="t(`er.${NAME.DATECOMPONENT}.last`)"
              :isRange="true"
              v-model="state.dynamicDate.intervalBetween"
              @change="() => handleEvent('intervalBetween')"
              v-bind="utils.addAttrs({
                value: item
              })"
              :type="manualType"/> -->
          </template>
          <div
            :class="[ns.e('includeToday')]"
            v-show="state.isShowIncludeToday">
            <!-- :true-label="1" :false-label="0" -->
            <el-checkbox
              v-model="state.hasToday" :label="t(`er.${NAME.DATECOMPONENT}.today`)"  size="small" />
          </div>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="t(`er.${NAME.DATECOMPONENT}.intervalDate`)" name="range_date">
      </el-tab-pane>
      <el-tab-pane :label="t(`er.${NAME.DATECOMPONENT}.singleDate`)" name="absolute_date">
        <!-- <div :class="[ns.e('absolute')]">
          <el-button
            link
            text
            @click="() => handleEvent('staticDate')"
            size="small"
          >
            {{t(`er.${NAME.DATECOMPONENT}.absolute`)}}<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64H128zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0v32zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64z"></path></svg></el-icon>
          </el-button>
        </div> -->
      </el-tab-pane>
    </el-tabs>
  </el-popover>
  <el-button
    v-if="!manuals.length && !shortcuts.length ? false : (isShowSwitchButton || !isRange)"
    :class="[ns.e('button'), v$.dynamicDate.$error && ER.props.isShowValidateState && 'ERFILTER-ERROR' ]"
    ref="buttonRef" size="small">
    {{buttonText}}<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64H128zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0v32zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64zm0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64z"></path></svg></el-icon>
  </el-button>
  <el-date-picker
    v-if="state.absolute"
    :class="[ns.e('width'), v$.staticDate.$error && ER.props.isShowValidateState && 'ERFILTER-ERROR', utils.addTestId(`${NAME.DATECOMPONENT}-picker`, 'id') ]"
    ref="staticDateRef"
    :type="datePickerType"
    clearable
    valueFormat="X"
    v-model="state.staticDate"
    size="small"
  />
</template>
