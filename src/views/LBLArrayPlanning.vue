<template>
  <div class="ma-4">
    <div class="d-flex">
      <WellheadData
        :wellhead-data="wellhead"
      />

      <ArrayConfigData
        class="ml-4"
        :config-data="wellheadConfig"
      />
    </div>

    <BasicCalculations  :data="basicCalculations" />

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
      class="mr-4 mt-4"
      @click="addArray"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn
      class="mt-16"
      block
      x-large
      color="info"
      @click="calculate"
    >
      Calculate Arrays
    </v-btn>

    <div class="d-flex mt-6">
      <ThreeDimensionalView
        :key="viewIndex"
        :arrays="arrays"
        :beacons-radius="beaconsRadius"
        :controllable="true"
        :distanceWhTransponder="distanceWHTransponder"
        :relative-depth="relativeDepth"
        :wellhead="wellhead"
        :camera-position="[0, 30, 0]"
        :show-water-surface="false"
        :show-vessel="false"
        pan="horizontal"
      />

      <ThreeDimensionalView
        :key="1000 + viewIndex * 1000"
        :arrays="arrays"
        :beacons-radius="beaconsRadius"
        :allow-vertical-pan="false"
        :controllable="true"
        :distanceWhTransponder="distanceWHTransponder"
        :relative-depth="relativeDepth"
        :wellhead="wellhead"
        :camera-position="[21, 1, 0]"
        :camera-fov="100"
        pan="vertical"
        class="ml-4"
      />
    </div>

    <ThreeDimensionalView
      :key="2000 + viewIndex * 2000"
      :arrays="arrays"
      :beacons-radius="beaconsRadius"
      :controllable="true"
      :distanceWhTransponder="distanceWHTransponder"
      :relative-depth="relativeDepth"
      :wellhead="wellhead"
      :camera-fov="100"
      class="mt-8"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from '@vue/composition-api'

import {
  Wellhead,
  Beacon,
  BeaconsArray,
  BasicCalculationItem,
  WellheadConfig
} from '@/types'

import ArrayData from '@/components/ArrayData.vue'
import ArrayConfigData from '@/components/ArrayConfigData.vue'
import ThreeDimensionalView from '@/components/ThreeDimensionalView.vue'
import WellheadData from '@/components/WellheadData.vue'
import BasicCalculations from '@/components/BasicCalculations.vue'

export default defineComponent({
  name: 'LBLArrayPlanning',

  components: {
    ArrayData,
    ArrayConfigData,
    BasicCalculations,
    ThreeDimensionalView,
    WellheadData
  },

  setup () {
    const viewIndex = ref<number>(0)

    const wellhead = reactive<Wellhead>({
      name: 'MAT-004',
      northing: 2000000,
      easting: 200000,
      field: 'MAT',
      date: '2020-10-06',
      utmZone: 4
    })

    const arrays = reactive<BeaconsArray[]>([
      {
        id: 1,
        name: 'Array 1',
        beacons: [
          {
            id: 1,
            serialNo: 'M01',
            northing: 0,
            easting: 0,
            floatNo: 'F01',
            range: 0,
            bearing: 0
          },
          {
            id: 2,
            serialNo: 'M02',
            northing: 0,
            easting: 0,
            floatNo: 'F02',
            range: 0,
            bearing: 0
          },
          {
            id: 3,
            serialNo: 'M03',
            northing: 0,
            easting: 0,
            floatNo: 'F03',
            range: 0,
            bearing: 0
          },
          {
            id: 4,
            serialNo: 'M04',
            northing: 0,
            easting: 0,
            floatNo: 'F04',
            range: 0,
            bearing: 0
          }
        ]
      }
    ])

    const wellheadConfig = reactive<WellheadConfig>({
      startAngle: 0,
      waterDepth: 2000,
      transponderHeight: 5,
      transducerDepth: 15,
      verticalAngle: 20,
      beaconAngleTreshold: 1
    })

    const relativeDepth = computed((): number => {
      const { waterDepth, transponderHeight, transducerDepth } = wellheadConfig
      return waterDepth - transponderHeight - transducerDepth
    })

    const beaconsRadius = computed((): number => {
      const { verticalAngle, beaconAngleTreshold } = wellheadConfig

      return (
        Math.round(relativeDepth.value * Math.sin((Number(verticalAngle) + Number(beaconAngleTreshold)) / (180 / Math.PI))) -
        Math.round(relativeDepth.value * Math.sin((Number(verticalAngle) - Number(beaconAngleTreshold)) / (180 / Math.PI)))
      ) / 2
    })

    const distanceWHTransponder = computed((): number => {
      return Math.round(relativeDepth.value * Math.sin(wellheadConfig.verticalAngle / (180 / Math.PI)))
    })

    const basicCalculations = computed((): BasicCalculationItem[] => {
      return [
        { title: 'Relative depth', icon: 'mdi-arrow-expand-vertical', value: relativeDepth.value },
        { title: 'Distance WH - Transponder', icon: 'mdi-arrow-expand-horizontal', value: distanceWHTransponder.value },
        { title: "Beacon's Radius", icon: 'mdi-circle-expand', value: beaconsRadius.value }
      ]
    })

    const addArray = (): void => {
      arrays.push({
        id: arrays.length + 1,
        name: `Array ${arrays.length + 1}`,
        beacons: []
      })
    }

    const removeArray = ({ id }: { id: number }): void => {
      const index = arrays.findIndex((array) => array.id === id)
      arrays.splice(index, 1)
    }

    const addBeacon = ({ arrayId }: { arrayId: number }): void => {
      const array = arrays.find((array) => array.id === arrayId)

      if (array) {
        const newBeacon: Beacon = {
          id: array.beacons.length + 1,
          serialNo: '0',
          northing: 0,
          easting: 0,
          floatNo: '0',
          range: 0,
          bearing: 0
        }

        array.beacons.push(newBeacon)
      }
    }

    const removeBeacon = ({ arrayId, beaconId }: { arrayId: number; beaconId: number }): void => {
      const array = arrays.find((array) => array.id === arrayId)

      if (array) {
        const index = array.beacons.findIndex((beacon) => beacon.id === beaconId)
        array.beacons.splice(index, 1)
      }
    }

    const calculate = (): void => {
      const range = distanceWHTransponder.value
      let angleShift = 0

      arrays.forEach((array, index) => {
        if (index) {
          angleShift = 180 / array.beacons.length
        }

        const beaconsCount: number = array.beacons.length

        array.beacons.map((beacon, index) => {
          beacon.range = range

          const bearing: number = Math.round(angleShift + wellheadConfig.startAngle + 360 / beaconsCount * index)
          beacon.bearing = bearing

          const dNorthing: number = Math.round(
            Math.sqrt(+range * Math.cos(bearing / (180 / Math.PI)) * (+range * Math.cos(bearing / (180 / Math.PI))))
          )

          if (bearing < 90 || bearing > 270) {
            beacon.northing = Math.round(wellhead.northing + dNorthing)
          } else {
            beacon.northing = Math.round(wellhead.northing - dNorthing)
          }

          const dEasting = Math.round(+range * Math.sin(bearing / (180 / Math.PI)))
          beacon.easting = Math.round(wellhead.easting + dEasting)
        })
      })

      viewIndex.value++
    }

    return {
      addArray,
      removeArray,
      addBeacon,
      removeBeacon,
      calculate,
      wellhead,
      arrays,
      wellheadConfig,
      basicCalculations,
      relativeDepth,
      distanceWHTransponder,
      viewIndex,
      beaconsRadius
    }
  }
})
</script>
