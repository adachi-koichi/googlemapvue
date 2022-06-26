# GoogleMapVue is to invoke Google Map Component on Vue3
```vue

<template>
  <GoogleMapVue
      ref="googleMapVueRef"
      :map-options="mapOptions"
      :on-init="onInit"
      :api-key="api_key"
      class="google_map_vue"
  />
</template>
<script lang="ts">
export default defineComponent({
  name: 'TravelMap',
  components: {
    GoogleMapVue,
  },
  setup: function (props, {attrs, slots, emit, expose}: SetupContext) {
    const onInit = async (googleMapVue: InstanceType<typeof GoogleMapVue>) => {
      console.log("initialized at onInit")
    }
  }
})
</script>
```

```typescript
googleMapVue.addMarker(markerOptions)
googleMapVue.addPolygon(polygonOptions)
googleMapVue.addPolyline(polylineOptions)
googleMapVue.addCircle(circleOptions)
googleMapVue.addGeoJson(url)
googleMapVue.addGeoTiff(url)
googleMapVue.addHeatmap(heatmapData)
```

# install
```shell
yarn add @adachi-koichi/googlemapvue
```
```shell
npm i @adachi-koichi/googlemapvue
```
