<template>
  <div>
    <v-edit-dialog
      large
      @save="save"
      @cancel="cancel"
    >
      <div>{{ value }}</div>
      <template v-slot:input>
        <v-text-field
          :value="newValue"
          :rules="rules"
          :label="label"
          single-line
          :autofocus="autofocus"
          :required="required"
          :type="type"
          @input="input"
        />
      </template>
    </v-edit-dialog>

    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          @click="snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { Ref } from '@/types'

export default defineComponent({
  name: 'BaseEditDialog',

  props: {
    autofocus: {
      type: Boolean,
      default: false
    },

    label: {
      type: String,
      default: 'Edit'
    },

    value: {
      type: [String, Number],
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    rules: {
      type: Array,
      default: () => []
    },

    type: {
      type: String,
      default: 'text'
    }
  },

  setup ({ value }, { emit }) {
    const snack: Ref<boolean> = ref(false)
    const snackColor: Ref<string> = ref('')
    const snackText: Ref<string> = ref('')
    const newValue: Ref<string | number> = ref(value)
    const initialValue: Ref<string | number> = ref(value)

    const input = (value: string | number): void => {
      newValue.value = value
    }

    const save = (): void => {
      snack.value = true
      snackColor.value = 'success'
      snackText.value = 'Data saved'
      initialValue.value = newValue.value
      emit('input', newValue.value)
    }

    const cancel = (): void => {
      snack.value = true
      snackColor.value = 'error'
      snackText.value = 'Cancelled'
      newValue.value = initialValue.value
    }

    return {
      snack,
      snackColor,
      snackText,
      newValue,
      input,
      save,
      cancel
    }
  }
})
</script>
