<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      class="app-bar"
    >
      <div class="d-flex app-title" @click="$router.push('/')">
        <v-icon>mdi-ferry</v-icon>
        <v-toolbar-title class="ml-10">
          Vessel Calculators
        </v-toolbar-title>
      </div>

      <v-icon
        v-show="$router.currentRoute.meta.title"
        class="ml-4"
      >
        mdi-chevron-double-right
      </v-icon>

      <div v-show="$router.currentRoute.meta.title">
        <span class="ml-4">{{ $router.currentRoute.meta.title }}</span>
        <v-icon class="ml-2">mdi-blur-radial</v-icon>
      </div>

      <v-spacer></v-spacer>
      <v-switch
        v-model="$vuetify.theme.dark"
        inset
        label="Dark Mode"
        class="mt-6"
      ></v-switch>
    </v-app-bar>

    <v-navigation-drawer
      mini-variant
      absolute
      permanent
    >
      <v-list class="mt-12">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.href"
          active-class="highlighted"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="ml-16">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',

  data () {
    return {
      items: [
        { title: 'LBL Array Planning', icon: 'mdi-blur-radial', href: '/lbl-array-planning' },
        { title: 'TAT Calculator', icon: 'mdi-arrow-expand-vertical', href: '/tat-calculator' }
      ]
    }
  }
})
</script>

<style scoped>
.app-bar {
  user-select: none;
}

.app-title {
  cursor: pointer;
}

.highlighted {
  background-color: #BDBDBD;
}
</style>
