import {approximateAddDistanceToLatLng, haversine_distance_km} from "./map/util"
import {App} from "vue";
import CustomMap from "./components/GoogleMapVue.vue";

export {
    approximateAddDistanceToLatLng,
    haversine_distance_km
}

CustomMap.install = function (Vue: App) {
    Vue.component(CustomMap.name, CustomMap);
};
export default CustomMap

export * from './components'
