import {reactive, ref} from "vue";
import {Ref} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export const useImageOverlay = (usemvcObject: {
                                    objectSets: ObjectSet;
                                    removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                                    cls: { new(...args: any): T }) => void
                                },
                                googleMapsMapRef: Ref<google.maps.Map | null>) => {

    const {objectSets, removeObject} = usemvcObject
    const addImageOverlay = (latLngBounds: google.maps.LatLngBounds,
                             urlString: string,
                             onClickListener?: () => void): google.maps.GroundOverlay => {
        const obj = new google.maps.GroundOverlay(
            urlString,
            latLngBounds
        )
        obj.setMap(googleMapsMapRef.value);
        let mapsEventListener = undefined
        if (!!onClickListener) {
            mapsEventListener = obj.addListener("click", onClickListener);
        }
        objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj
    }

    const removeImageOverlay = (groundOverlay: google.maps.GroundOverlay) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.GroundOverlay);
    }

    return {
        addImageOverlay,
        removeImageOverlay
    }

}
