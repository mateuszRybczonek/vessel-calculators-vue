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

<script>
export default {
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

  data () {
    return {
      snack: false,
      snackColor: '',
      snackText: '',
      newValue: this.value,
      initialValue: this.value
    }
  },

  methods: {
    input (value) {
      this.newValue = value
    },

    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
      this.initialValue = this.newValue
      this.$emit('input', this.newValue)
    },

    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
      this.newValue = this.initialValue
    }
  }
}
</script>
