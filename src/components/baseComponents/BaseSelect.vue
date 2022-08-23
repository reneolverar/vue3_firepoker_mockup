<template>
    <label
      :for="uuid"
      v-if="label"
      :class="{noLabel: noLabel}"
    >
      {{ label }}
    </label>
    <select
        class="field"
        :value="modelValue"
        v-bind="{
            ...$attrs,
            onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
        }"
        :id="uuid"
        :aria-describedby="error ? `${uuid}-error` : null"
        :aria-invalid="error ? true : null"
    >
        <option
          v-for="option in options"
          :value="option"
          :key="option"
          :selected="option === modelValue"
        >{{ option }}</option>
    </select>
    <p
      v-if="error"
      class="errorMessage"
      :id="`${uuid}-error`"
      aria-live="assertive"
    >
      {{ error }}
  </p>
</template>

<script>
import UniqueID from '@/features/UniqueID'
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    error: {
      type: String,
      default: ''
    },
    noLabel: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const uuid = UniqueID().getID()
    return {
      uuid
    }
  }
}
</script>

<style scoped>
    .noLabel {
        display: none;
    }
</style>