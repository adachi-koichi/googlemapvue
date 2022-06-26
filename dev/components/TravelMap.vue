<template>
  <div>
    <div>
      <GoogleMapVue
          ref="googleMapVueRef"
          :map-options="mapOptions"
          :on-init="onInit"
          :api-key="api_key"
          class="google_map_vue"
      />
    </div>
    <p>set center locations</p>
    <ul v-for="(country, index) in mock_locations" :key="index">
      {{ index }}
      <li v-for="(spot, key) in country" :key="key">
        <button @click="moveMapCenterTo(spot)">{{ key }}: {{ spot }}</button>
      </li>
    </ul>
    <!--  <button @click="moveMapCenterTo(mock_locations.US.SanFrancisco)">US SanFrancisco</button>-->
    <!--  <button @click="moveMapCenterTo(mock_locations.JP.TokyoTower)">JP TokyoTower</button>-->

    <div>
      <p>debug</p>
      <button @click="debug()">debug</button>
    </div>
    <div>
      <p>map functions</p>
      <button @click="drawOrEraseMarkers()">marker</button>
      <button @click="drawPolygons('polygons.json')">polygons</button>
      <button @click="drawOrErasePolylines()">polylines</button>
      <button @click="drawOrEraseCircles()">Circle</button>
      <button @click="drawOrEraseGeoTiff()">GeoTiff</button>
      <button @click="drawOrEraseHeatmap()">Heatmap</button>
      <button @click="drawOrEraseKML()">KML have to replace res</button>
      <button @click="drawGeoJsonExample()">GeoJSON</button>
      <button @click="drawOrEraseHTML">HTML</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defaultMapOptions} from "../constants/defaultMapOptions";

import {mock_lines, mock_locations,} from "./TravelMapMock";
import {defineComponent, ref, watchPostEffect} from "vue";
import {SetupContext} from "@vue/runtime-core";
import {Optional} from "../../src/lib/util/types";
import GoogleMapVue from "../../src/lib/components/GoogleMapVue.vue";
import {useExamples} from "./useExamples";


export default defineComponent({
  name: 'TravelMap',
  components: {
    GoogleMapVue,
  },
  setup: function (props, {attrs, slots, emit, expose}: SetupContext) {
    const googleMapVueRef = ref<Optional<InstanceType<typeof GoogleMapVue>>>(null)
    const onInit = async (googleMapVue: InstanceType<typeof GoogleMapVue>) => {
      console.log("initialized at onInit")
      await drawOrEraseMarkers()
    }

    watchPostEffect(async () => {
          const googleMapVue = googleMapVueRef.value
          if (!!googleMapVue && googleMapVue.isInitializedRef) {
            console.log("initialized at watchPostEffect")
          }
        }
    )

    const mapOptions = {
      ...defaultMapOptions,
      center: mock_locations.JP.TokyoBay
    }

    const {
      moveMapCenterTo,
      drawOrEraseMarkers,
      drawPolygons,
      drawOrErasePolylines,
      drawOrEraseCircles,
      drawOrEraseHeatmap,
      drawOrEraseKML,
      drawGeoJsonExample,
      drawOrEraseHTML,
      drawOrEraseGeoTiff
    } = useExamples(googleMapVueRef)

    const debug = () => {
      moveMapCenterTo(mock_locations.JP.TokyoBay)
    }

    const api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    return {
      drawOrEraseMarkers,
      drawPolygons,
      drawOrErasePolylines,
      drawOrEraseCircles,
      drawOrEraseGeoTiff,
      drawOrEraseHeatmap,
      drawOrEraseKML,
      drawGeoJsonExample,
      drawOrEraseHTML,
      onInit,
      debug,
      mock_locations,
      moveMapCenterTo,
      googleMapVueRef,
      mapOptions,
      lines: mock_lines,
      api_key
    }
  }
})
</script>

<style lang="scss" scoped>
.google_map_vue {
  aspect-ratio: 1.777;
}
</style>
