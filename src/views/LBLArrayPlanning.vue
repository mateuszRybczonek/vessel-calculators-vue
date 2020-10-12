<template>
  <div class="ma-4">
    <div class="d-flex">
      <WellheadData
        :welhead-data="wellhead"
      />

      <ArrayConfigData
        class="ml-4"
        :config-data="config"
      />
    </div>

    <v-card
      class="mt-4"
    >
      <v-subheader>
        <div class="overline">
          Basic calculation
        </div>
      </v-subheader>
      <v-list>
        <v-list-item
          v-for="item in basicCalculations"
          :key="item.day"
        >
          <v-list-item-title>
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item-title>

          <v-list-item-subtitle class="text-right">
            {{ item.value }} m
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <v-btn
      class="mt-6"
      block
      x-large
      color="info"
      @click="calculate"
    >
      Calculate Arrays
    </v-btn>

    <ArrayData
      v-for="array in arrays"
      :key="array.id"
      :array="array"
      class="mt-6"
      @addBeacon="addBeacon"
      @removeBeacon="removeBeacon"
      @removeArray="removeArray"
    />

    <v-btn
      color="info"
      :disabled="arrays.length > 1"
      fab
      absolute
      right
      x-small
      class="mr-4 mt-6"
      @click="addArray"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import ArrayData from '../components/ArrayData'
import ArrayConfigData from '../components/ArrayConfigData'
import WellheadData from '../components/WellheadData'

export default {
  components: {
    ArrayData,
    ArrayConfigData,
    WellheadData
  },

  data () {
    return {
      wellhead: {
        name: 'MAT-004',
        northing: 2000000,
        easting: 200000,
        field: 'MAT',
        date: '06/10/2020',
        utmZone: 4
      },

      arrays: [
        {
          id: 1,
          name: 'Array 1',
          beacons: [
            {
              id: 1,
              serialNo: 1,
              northing: '',
              easting: '',
              floatNo: 1,
              range: '',
              bearing: ''
            },
            {
              id: 2,
              serialNo: 2,
              northing: '',
              easting: '',
              floatNo: 2,
              range: '',
              bearing: ''
            },
            {
              id: 3,
              serialNo: 3,
              northing: '',
              easting: '',
              floatNo: 3,
              range: '',
              bearing: ''
            },
            {
              id: 4,
              serialNo: 4,
              northing: '',
              easting: '',
              floatNo: 4,
              range: '',
              bearing: ''
            }
          ]
        }
      ],

      config: {
        startAngle: 0,
        waterDepth: 2000,
        transponderHeight: 5,
        transducerDepth: 15,
        verticalAngle: 10,
        beaconAngleTreshold: 1
      }
    }
  },

  computed: {
    basicCalculations () {
      return [
        { title: 'Relative depth', icon: 'mdi-arrow-expand-vertical', value: this.relativeDepth },
        { title: 'Distance WH - Transponder', icon: 'mdi-arrow-expand-horizontal', value: this.distanceWHTransponder },
        { title: "Beacon's Radius", icon: 'mdi-circle-expand', value: this.beaconsRadius }
      ]
    },

    relativeDepth () {
      const { waterDepth, transponderHeight, transducerDepth } = this.config
      return waterDepth - transponderHeight - transducerDepth
    },

    distanceWHTransponder () {
      return Math.round(this.relativeDepth * Math.sin(this.config.verticalAngle / (180 / Math.PI)))
    },

    beaconsRadius () {
      const relativeDepth = this.relativeDepth
      const { verticalAngle, beaconAngleTreshold } = this.config

      return (
        Math.round(relativeDepth * Math.sin((Number(verticalAngle) + Number(beaconAngleTreshold)) / (180 / Math.PI))) -
        Math.round(relativeDepth * Math.sin((Number(verticalAngle) - Number(beaconAngleTreshold)) / (180 / Math.PI)))
      ) / 2
    }
  },

  methods: {
    addArray () {
      this.arrays.push({
        id: this.arrays.length + 1,
        name: `Array ${this.arrays.length + 1}`,
        beacons: []
      })
    },

    removeArray ({ arrayId }) {
      const index = this.arrays.findIndex((array) => array.id === arrayId)

      this.arrays.splice(index, 1)
    },

    addBeacon ({ arrayId }) {
      const array = this.arrays.find((array) => array.id === arrayId)

      array.beacons.push({
        id: array.beacons.length + 1,
        serialNo: 0,
        northing: 0,
        easting: 0,
        floatNo: 0,
        range: '',
        bearing: ''
      })
    },

    removeBeacon ({ arrayId, beaconId }) {
      const array = this.arrays.find((array) => array.id === arrayId)
      const index = array.beacons.findIndex((beacon) => beacon.id === beaconId)

      array.beacons.splice(index, 1)
    },

    calculate () {
      const range = this.distanceWHTransponder
      let angleShift = 0

      this.arrays.forEach((array, index) => {
        if (index) {
          angleShift = 180 / array.beacons.length
        }

        const beaconsCount = array.beacons.length

        array.beacons.map((beacon, index) => {
          beacon.range = range

          const bearing = Math.round(angleShift + this.config.startAngle + 360 / beaconsCount * index)
          beacon.bearing = bearing

          const dNorthing = Math.round(
            Math.sqrt(range * Math.cos(bearing / (180 / Math.PI)) * (range * Math.cos(bearing / (180 / Math.PI))))
          )

          if (bearing < 90 || bearing > 270) {
            beacon.northing = Math.round(this.wellhead.northing + dNorthing)
          } else {
            beacon.northing = Math.round(this.wellhead.northing - dNorthing)
          }

          const dEasting = Math.round(range * Math.sin(bearing / (180 / Math.PI)))
          beacon.easting = Math.round(this.wellhead.easting + dEasting)
        })
      })
    }
  }
}
</script>
