import {Ref} from "@vue/reactivity";
import {reactive, ref} from "vue";
import {ObjectSet} from "./useMVCObject";

type CircleObj = {
    circle: google.maps.Circle,
    mapsEventListener: (google.maps.MapsEventListener | null)
}


export const useCircle = (usemvcObject: {
                              objectSets: ObjectSet;
                              removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                              cls: { new(...args: any): T }) => void
                          },
                          googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject
    const addCircle = (circleOptions: google.maps.CircleOptions, onClickListener?: () => void): google.maps.Circle | null => {
        const map = googleMapsMapRef.value
        if (circleOptions.center === null
            || circleOptions.radius === null
            || map === null) {
            return null
        }
        const obj = new google.maps.Circle({
            ...circleOptions
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

    const removeCircle = (circle: google.maps.Circle) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.Circle);
    }

    return {addCircle, removeCircle}

}

