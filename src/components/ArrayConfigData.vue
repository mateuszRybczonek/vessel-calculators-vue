<template>
  <v-card elevation="2" class="flex">
    <v-subheader>
      <div class="overline">
        Config
      </div>
    </v-subheader>

    <div class="pa-4">
      <v-text-field
        v-model="configData.startAngle"
        :rules="[rules.startAngle]"
        label="Start angle [°]"
        type="number"
        required
      />

      <v-text-field
        v-model="configData.waterDepth"
        label="Water depth [m]"
        type="number"
        required
      />

      <v-text-field
        v-model="configData.transponderHeight"
        label="Transponder height [m]"
        required
        type="number"
      />

      <v-text-field
        v-model="configData.transducerDepth"
        label="Transducer depth [m]"
        required
        type="number"
      />

      <v-text-field
        v-model="configData.verticalAngle"
        :rules="[rules.minAngle,rules.maxAngle]"
        label="Vertical angle [°]"
        type="number"
        required
      />

      <v-text-field
        v-model="configData.beaconAngleTreshold"
        :rules="[rules.minAngle,rules.maxAngle]"
        label="Beacon Angle Threshold [°]"
        required
        type="number"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { WellheadConfig } from '@/types'

export default defineComponent({
  name: 'BeaconsList',

  props: {
    configData: {
      type: Object as PropType<WellheadConfig>,
      required: true
    }
  },

  setup () {
    const rules: object = {
      minAngle: (value: number): boolean | string => (value >= 0) || 'Min angle is 0°',
      maxAngle: (value: number): boolean | string => (value <= 30) || 'Max angle is 30°',
      startAngle: (value: number): boolean | string =>
        ((value >= 0) && (value <= 360)) || 'Start angle must be between 0° and 360°'
    }

    return { rules }
  }
})
</script>
