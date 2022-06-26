import {reactive} from "vue";
import {Ref} from "@vue/reactivity";
import {Optional} from "../util/types";
import {ObjectSet} from "./useMVCObject";

export const useKML = (usemvcObject: {
                           objectSets: ObjectSet;
                           removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                           cls: { new(...args: any): T }) => void
                       },
                       googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject

    /**
     *
     * @param url - not supported localhost and private access URL
     * @param onClickListener
     */
    const addKMLLayer = (url: string, onClickListener?: () => void): google.maps.KmlLayer | null => {
        const googleMapsMap = googleMapsMapRef.value
        if (!googleMapsMap) {
            return null
        }
        const obj = new google.maps.KmlLayer({url})
        let mapsEventListener = undefined
        if (!!onClickListener) {
            // mapsEventListener = obj.addListener("click", onClickListener);
        }
        // objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj

    }
    const removeKMLLayer = (kmlLayer: google.maps.KmlLayer) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.KmlLayer);
    }

    return {
        addKMLLayer,
        removeKMLLayer
    }
}
