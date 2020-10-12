<template>
  <v-card elevation="2" class="flex">
    <v-subheader>
      <div class="overline">
        {{array.name}}
      </div>
      <v-dialog
        v-model="dialog"
        max-width="320"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="red"
            fab
            absolute
            right
            x-small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="white">mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Delete Array
          </v-card-title>
          <v-card-text>
            {{ `Are you sure you want to delete ${array.name}?` }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              No
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="$emit('removeArray', { arrayId: array.id })"
            >
              Yes, delete it
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-subheader>

    <v-data-table
      :headers="headers"
      :items="array.beacons"
      hide-default-footer
      disable-sort
    >
      <template v-slot:item.serialNo="props">
        <BaseEditableTableItem
          :rules="[max6digits]"
          v-model="props.item.serialNo"
        />
      </template>

      <template v-slot:item.northing="props">
        {{ props.item. northing }}
      </template>

      <template v-slot:item.easting="props">
        {{ props.item. easting }}

      </template>

      <template v-slot:item.floatNo="props">
        <BaseEditableTableItem
          :rules="[max6digits]"
          v-model="props.item.floatNo"
        />
      </template>

      <template v-slot:item.actions="props">
        <v-icon
          color="red"
          @click="$emit('removeBeacon', { arrayId: array.id, beaconId: props.item.id })"
        >
          mdi-minus
        </v-icon>
      </template>

      <template
        v-slot:body.append
      >
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="d-flex justify-center">
            <v-icon
              color="info"
              @click="$emit('addBeacon', { arrayId: array.id })"
            >
              mdi-plus
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import BaseEditableTableItem from './BaseEditableTableItem'

export default {
  name: 'BeaconsList',

  components: { BaseEditableTableItem },

  props: {
    array: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dialog: false,
      max6digits: v => v.length <= 6 || 'Max 6 digits!',
      pagination: {},
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },

  computed: {
    headers () {
      return [
        { text: 'Id', align: 'center', value: 'id' },
        { text: 'Serial no.', align: 'center', value: 'serialNo' },
        { text: 'Northing [m]', align: 'center', value: 'northing' },
        { text: 'Easting [m]', align: 'center', value: 'easting' },
        { text: 'Range from WH [m]', align: 'center', value: 'range' },
        { text: 'Bearing from WH [°]', align: 'center', value: 'bearing' },
        { text: 'Float no.', align: 'center', value: 'floatNo' },
        { text: '', align: 'center', value: 'actions' }
      ]
    }
  }
}
</script>
