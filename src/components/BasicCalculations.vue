<template>
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
        v-for="item in data"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { BasicCalculationItem } from '@/types'

export default defineComponent({
  name: 'BasicCalculations',

  props: {
    data: {
      type: Array as PropType<BasicCalculationItem[]>,
      required: true
    }
  }
})
</script>
