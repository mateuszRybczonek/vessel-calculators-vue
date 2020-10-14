<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="card in cards"
        :key="card.title"
        class="d-flex child-flex"
        cols="4"
      >
        <v-card @click="$router.push(card.href)">
          <v-img
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)"
            height="400px"
          >
            <v-card-title v-text="card.title"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

type Card = {
  title: string;
  href: string;
}

export default defineComponent({
  name: 'Home',

  setup () {
    const cards = computed((): Card[] => {
      return [
        { title: 'LBL Array Planning', href: '/lbl-array-planning' },
        { title: 'TAT Calculation', href: '/' }
      ]
    })

    return { cards }
  }
})
</script>
