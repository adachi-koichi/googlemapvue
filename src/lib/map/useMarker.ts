import {Ref} from "@vue/reactivity";
import {reactive} from "vue";
import Marker = google.maps.Marker;
import Data = google.maps.Data;
import {ObjectSet, useMVCObject} from "./useMVCObject";


export const useMarker = (usemvcObject: {
                              objectSets: ObjectSet;
                              removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                              cls: { new(...args: any): T }) => void
                          },
                          googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject
    const addMarker = (markerOptions: google.maps.MarkerOptions,
                       onClickListener?: () => void): google.maps.Marker => {
        const obj = new google.maps.Marker({
            anchorPoint: null,
            clickable: true,
            ...markerOptions
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

    const removeMarker = () => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.Marker);
    }
    return {addMarker, removeMarker}
}
