import {reactive} from "vue";
import {Ref} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export const useGeoJson = (usemvcObject: {
                               objectSets: ObjectSet;
                               removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                               cls: { new(...args: any): T }) => void
                           },
                           googleMapsMapRef: Ref<google.maps.Map | null>) => {
    const {objectSets, removeObject} = usemvcObject

    const featuresArray = reactive<{ array: Array<google.maps.Data.Feature[]> }>({array: []})

    const addGeoJson = async (url: string): Promise<google.maps.Data.Feature[]> => {
        const response = await fetch(url)
        const geoJson = await response.json()
        const features = googleMapsMapRef.value!.data.addGeoJson(geoJson);
        featuresArray.array.push(features)
        return features
    }

    const removeGeoJSON = (feature: google.maps.Data.Feature) => {
        googleMapsMapRef.value!.data.remove(feature)
    }

    const removeAllGeoJSON = () => {
        featuresArray.array.forEach((features) => {
            features.forEach((feature) => removeGeoJSON(feature))
        })
    }

    return {
        addGeoJson,
        removeGeoJSON,
        removeAllGeoJSON
    }

}
