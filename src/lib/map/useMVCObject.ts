import {Ref} from "@vue/reactivity";
import MVCObject = google.maps.MVCObject;

export type ObjectSet = {
    lastUpdateTime: number,
    data: Array<{
        mvcObject: google.maps.Circle
            | google.maps.Marker
            | google.maps.Polyline
            | google.maps.OverlayView
            | google.maps.GroundOverlay
            | google.maps.visualization.HeatmapLayer
            | google.maps.KmlLayer
            | null
        mapsEventListener?: (google.maps.MapsEventListener)
    }>
}
let objectSets = {lastUpdateTime: Date.now(), data: []} as ObjectSet
export const useMVCObject = (googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const removeObject = <T extends MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                               cls: new (...args: any) => T) => {
        objectSets.data
            .flatMap((objectSet, index) => {

                if (!(objectSet.mvcObject instanceof cls) || !callback(objectSet.mvcObject)) {
                    return []
                }
                objectSet.mvcObject.setMap(null)
                if (!!objectSet.mapsEventListener) {
                    google.maps.event.removeListener(objectSet.mapsEventListener)
                }
                return index
            })
            .reverse().forEach(index => {
                let splice = objectSets.data.splice(index, 1);
                splice[0].mvcObject = null
                splice[0].mapsEventListener = undefined
            }
        )
        objectSets.lastUpdateTime = Date.now()
    }

    return {removeObject, objectSets}
}
