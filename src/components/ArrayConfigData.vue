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

<script>
export default {
  name: 'BeaconsList',

  props: {
    configData: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      rules: {
        minAngle: v => (v >= 0) || 'Min angle is 0°',
        maxAngle: v => (v <= 30) || 'Max angle is 30°',
        startAngle: v => ((v >= 0) && (v <= 360)) || 'Start angle must be between 0° and 360°'
      }
    }
  }
}
</script>

Relative depth [m]:
1980

Distance WH-Transponder [m]:
Beacon's radius [m]:
