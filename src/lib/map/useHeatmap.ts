import {reactive} from "vue";
import {Ref} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export type HeatmapData = { location: { lat: number, lng: number }, weight: number }

export const useHeatmap = (usemvcObject: {
                               objectSets: ObjectSet;
                               removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                               cls: { new(...args: any): T }) => void
                           },
                           googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject

    const addHeatmap = (heatmapDatas: HeatmapData[],
                        onClickListener?: () => void): google.maps.visualization.HeatmapLayer => {

        const data = heatmapDatas.map((heatmapData) => {
            return {
                location: new google.maps.LatLng(heatmapData.location.lat, heatmapData.location.lng),
                weight: heatmapData.weight
            }
        })
        const obj = new google.maps.visualization.HeatmapLayer({
            data: data
        });
        let mapsEventListener = undefined
        if (!!onClickListener) {
            mapsEventListener = obj.addListener("click", onClickListener);
        }
        objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj
    }

    const removeAllHeatMap = (polyline: google.maps.visualization.HeatmapLayer) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.visualization.HeatmapLayer);
    }


    return {
        addHeatmap,
        removeAllHeatMap
    }

}
