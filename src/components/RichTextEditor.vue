<template>
  <el-tiptap
    v-model:content="content"
    :extensions="extensions"
    :placeholder="placeholder"
    :height="height"
    spellcheck
    class="border rounded w-full"
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { tiptapExtensions } from '@/utils/tiptapConfig'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  height?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const content = ref(props.modelValue)
watch(content, (v) => emit('update:modelValue', v))
watch(
  () => props.modelValue,
  (v) => {
    if (v !== content.value) content.value = v
  }
)

const extensions = tiptapExtensions
</script>
<style lang="scss">
div[id^='tippy-'] {
  display: none !important;
}
</style>
