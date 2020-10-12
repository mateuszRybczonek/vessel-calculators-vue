<template>
  <v-card elevation="2" class="flex">
    <v-subheader>
      <div class="overline">
        Wellhead
      </div>
    </v-subheader>

    <div class="pa-4">
      <v-text-field
        v-model="welheadData.field"
        label="Field"
        required
      />

      <v-text-field
        v-model="welheadData.name"
        label="Name"
        required
      />

      <v-text-field
        v-model="welheadData.northing"
        :rules="[rules.minNorthing,rules.maxNorthing]"
        label="Northing"
        required
        type="number"
      />

      <v-text-field
        v-model="welheadData.easting"
        :rules="[rules.minEasting,rules.maxEasting]"
        label="Easting"
        required
        type="number"
      />

      <v-text-field
        v-model="welheadData.date"
        label="Date"
        type="date"
        required
      />

      <v-text-field
        v-model="welheadData.utmZone"
        label="UTM Zone"
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
    welheadData: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      rules: {
        minEasting: v => (v >= 166640) || 'Min easting is 166640',
        maxEasting: v => (v <= 833360) || 'Max easting is 833360',
        minNorthing: v => (v >= 1110400) || 'Min norting is 1110400',
        maxNorthing: v => (v <= 9334080) || 'Max norting is 9334080'
      }
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Name', align: 'center', value: 'name' },
        { text: 'Northing [m]', align: 'center', value: 'northing' },
        { text: 'Easting [m]', align: 'center', value: 'easting' },
        { text: 'Field', align: 'center', value: 'field' },
        { text: 'Date', align: 'center', value: 'date' },
        { text: 'UTM Zone', align: 'center', value: 'utmZone' }
      ]
    }
  }
}
</script>
