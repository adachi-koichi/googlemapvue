import {reactive} from "vue";
import {Ref, UnwrapNestedRefs} from "@vue/reactivity";
import LatLng = google.maps.LatLng;
import PolygonOptions = google.maps.PolygonOptions;
import {ObjectSet} from "./useMVCObject";

export const usePolygon = (usemvcObject: {
                               objectSets: ObjectSet;
                               removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                               cls: { new(...args: any): T }) => void
                           },
                           googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject

    const addPolygon = (options?: PolygonOptions,
                        onClickListener?: () => void): google.maps.Polygon => {
        const obj = new google.maps.Polygon({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            ...options
        })
        let mapsEventListener = undefined
        if (!!onClickListener) {
            mapsEventListener = obj.addListener("click", onClickListener);
        }
        objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj
    }

    const removePolygon = (polygon: google.maps.Polygon) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.Polygon);

    }

    return {addPolygon, removePolygon}

}
