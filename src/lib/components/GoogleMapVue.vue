<template>
  <div class="google-map-container" ref="mapContainerParentDiV">
    <div ref="googleMapContainerDivRef" class="google-map"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, PropType, ref} from "vue";
import {Loader, LoaderOptions} from "@googlemaps/js-api-loader";
import {useMarker} from "../map/useMarker";
import {usePolyLine} from "../map/usePolyline";
import {usePolygon} from "../map/usePolygon";
import {useGeoTiffOverlay} from "../map/useGeoTIFFOverlay";
import {useImageOverlay} from "../map/useImageOverlay";
import {ComponentInternalInstance, ComponentPublicInstance, SetupContext} from "@vue/runtime-core";
import {useHeatmap} from "../map/useHeatmap";
import {useCircle} from "../map/useCircle";
import {useHTMLOverlay} from "../map/useHTMLOverlay";
import {Optional, OptionalMap} from "../util/types";
import {useKML} from "../map/useKML";
import {useGeoJson} from "../map/useGeoJson";
import {useMVCObject} from "../map/useMVCObject";

type GoogleMapVue = ComponentPublicInstance | ComponentInternalInstance

export default defineComponent({
  name: 'GoogleMapVue',
  customElement: true,
  props: {
    apiKey: {type: String, required: true},
    mapOptions: {
      type: Object as PropType<google.maps.MapOptions>,
      required: false
    },
    onInit: {
      type: Function as PropType<(googleMapVue: GoogleMapVue) => void>,
      required: false
    }
  },
  isInitializedRef: false,

  setup(props, context: SetupContext) {
    const googleMapContainerDivRef = ref<Optional<HTMLDivElement>>(null)
    const googleMapsMapRef = ref<Optional<google.maps.Map>>(null)
    const internalInstance = getCurrentInstance()

    googleMapsMapRef.value
    onMounted(async () => {
      const internalInstance2 = getCurrentInstance()
      await googleMapsJSAPILoader.load()
      const {Map} = google.maps;

      googleMapsMapRef.value = new Map(googleMapContainerDivRef.value!,
          {
            zoom: 12,
            ...props.mapOptions,
          }
      )
      isInitializedRef.value = true
      if (!!props.onInit) {
        // @ts-ignore
        props.onInit(internalInstance!.proxy as GoogleMapVue)
      }
    })


    const googleMapsJSAPILoader = new Loader({
      apiKey: props.apiKey,
      libraries: ['drawing', 'geometry', 'places', 'visualization'],
      // version: 'beta'
    } as LoaderOptions)

    const isInitializedRef = ref(false)

    const usemvcObject = useMVCObject(googleMapsMapRef)
    context.expose({
      ...usemvcObject,
      ...useMarker(usemvcObject, googleMapsMapRef),
      ...usePolyLine(usemvcObject, googleMapsMapRef),
      ...usePolygon(usemvcObject, googleMapsMapRef),
      ...useCircle(usemvcObject, googleMapsMapRef),
      ...useGeoTiffOverlay(usemvcObject, googleMapsMapRef),
      ...useImageOverlay(usemvcObject, googleMapsMapRef),
      ...useHTMLOverlay(usemvcObject, googleMapsMapRef),
      ...useHeatmap(usemvcObject, googleMapsMapRef),
      ...useKML(usemvcObject, googleMapsMapRef),
      ...useGeoJson(usemvcObject, googleMapsMapRef),
      isInitializedRef,
      googleMapsJSAPILoader,
      googleMapsMapRef,
      googleMapContainerDivRef
    })

    return {
      ...usemvcObject,
      ...useMarker(usemvcObject, googleMapsMapRef),
      ...usePolyLine(usemvcObject, googleMapsMapRef),
      ...usePolygon(usemvcObject, googleMapsMapRef),
      ...useCircle(usemvcObject, googleMapsMapRef),
      ...useGeoTiffOverlay(usemvcObject, googleMapsMapRef),
      ...useImageOverlay(usemvcObject, googleMapsMapRef),
      ...useHTMLOverlay(usemvcObject, googleMapsMapRef),
      ...useHeatmap(usemvcObject, googleMapsMapRef),
      ...useKML(usemvcObject, googleMapsMapRef),
      ...useGeoJson(usemvcObject, googleMapsMapRef),
      isInitializedRef,
      googleMapsJSAPILoader,
      googleMapsMapRef,
      googleMapContainerDivRef
    }
  },
});

</script>

<style lang="css">
.google-map-container {
  width: 100%;
  min-height: 100%;
  position: relative;
}

.google-map {
  width: 100%;
  min-height: 100%;
  position: absolute;
}
</style>
