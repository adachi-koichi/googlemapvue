import {reactive} from "vue";
import {Ref, UnwrapNestedRefs} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export interface LineInfo {
    id: string
    path: Array<{ lat: number; lng: number }>
}

export const usePolyLine = (
    usemvcObject: {
        objectSets: ObjectSet;
        removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                        cls: { new(...args: any): T }) => void
    },
    googleMapsMapRef: Ref<google.maps.Map | null>) => {

    const {objectSets, removeObject} = usemvcObject

    const addPolyline = (path: Array<google.maps.LatLng | google.maps.LatLngLiteral>,
                         options?: google.maps.PolylineOptions,
                         onClickListener?: () => void): google.maps.Polyline => {
        const polyline = new google.maps.Polyline({
            clickable: !!onClickListener,
            path,
            ...options,
        })
        if (!!onClickListener) {
            polyline.addListener('click', onClickListener)
        }
        polyline.setMap(googleMapsMapRef.value)
        objectSets.data.push({mvcObject: polyline})

        return polyline
    }

    const removePolyline = (polyline: google.maps.Polyline) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.Polyline)
    }

    return {addPolyline, removePolyline}

}
