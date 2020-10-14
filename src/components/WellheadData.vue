<template>
  <v-card elevation="2" class="flex">
    <v-subheader>
      <div class="overline">
        Wellhead
      </div>
    </v-subheader>

    <div class="pa-4">
      <v-text-field
        v-model="wellheadData.field"
        label="Field"
        required
      />

      <v-text-field
        v-model="wellheadData.name"
        label="Name"
        required
      />

      <v-text-field
        v-model="wellheadData.northing"
        :rules="[rules.minNorthing,rules.maxNorthing]"
        label="Northing"
        required
        type="number"
      />

      <v-text-field
        v-model="wellheadData.easting"
        :rules="[rules.minEasting,rules.maxEasting]"
        label="Easting"
        required
        type="number"
      />

      <v-text-field
        v-model="wellheadData.date"
        label="Date"
        type="date"
        required
      />

      <v-text-field
        v-model="wellheadData.utmZone"
        label="UTM Zone"
        required
        type="number"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { TableHeaderItem, Wellhead } from '@/types'

export default defineComponent({
  name: 'BeaconsList',

  props: {
    wellheadData: {
      type: Object as PropType<Wellhead>,
      required: true
    }
  },

  setup () {
    const rules: object = {
      minEasting: (value: number): boolean | string => (value >= 166640) || 'Min easting is 166640',
      maxEasting: (value: number): boolean | string => (value <= 833360) || 'Max easting is 833360',
      minNorthing: (value: number): boolean | string => (value >= 1110400) || 'Min norting is 1110400',
      maxNorthing: (value: number): boolean | string => (value <= 9334080) || 'Max norting is 9334080'
    }

    const headers = computed((): TableHeaderItem[] => [
      { text: 'Name', align: 'center', value: 'name' },
      { text: 'Northing [m]', align: 'center', value: 'northing' },
      { text: 'Easting [m]', align: 'center', value: 'easting' },
      { text: 'Field', align: 'center', value: 'field' },
      { text: 'Date', align: 'center', value: 'date' },
      { text: 'UTM Zone', align: 'center', value: 'utmZone' }
    ])

    return { rules, headers }
  }
})
</script>
