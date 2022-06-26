import {reactive} from "vue";
import * as GeoTIFF from "geotiff/src/geotiff";
import {Ref} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export const useGeoTiffOverlay = (usemvcObject: {
                                      objectSets: ObjectSet;
                                      removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                                      cls: { new(...args: any): T }) => void
                                  },
                                  googleMapsMapRef: Ref<google.maps.Map | null>) => {

    const {objectSets, removeObject} = usemvcObject

    const addGeoTiff = async (urlString: string,
                              onClickListener?: () => void): Promise<google.maps.OverlayView | null> => {

        if (googleMapsMapRef.value === null) {
            return null
        }

        const div = document.createElement("div");
        div.style.borderStyle = "none";
        div.style.borderWidth = "0px";
        div.style.position = "absolute";

        let obj = await drawGeoTiff(urlString, div, googleMapsMapRef.value);

        let mapsEventListener = undefined
        if (!!onClickListener) {
            mapsEventListener = obj.addListener("click", onClickListener);
        }
        objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj
    }

    const removeGeoTiff = (overlayView: google.maps.OverlayView) => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.OverlayView);
    }

    return {
        addGeoTiff,
        removeGeoTiff
    }

}


const drawGeoTiff = async (urlString: string,
                           overlayDiv: HTMLDivElement,
                           googleMapsMap: google.maps.Map): Promise<google.maps.OverlayView> => {

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const response = await fetch(urlString)
    const blob = await response.blob()
    const array = await blob.arrayBuffer()

    const geotiff = await GeoTIFF.fromArrayBuffer(array)
    const image = await geotiff.getImage() as GeoTIFF.GeoTIFFImage
    const canvasWidth = image.getWidth()
    const canvasHeight = image.getHeight()
    const bbox = image.getBoundingBox()
    const latLngBounds = new google.maps.LatLngBounds(
        new window.google.maps.LatLng(bbox[1], bbox[0]),
        new window.google.maps.LatLng(bbox[3], bbox[2])
    );
    const raster = await image.readRGB({enableAlpha: true})

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    const data = imageData.data;
    let o = 0;
    for (let i = 0; i < raster.length; i += 4) {
        data[o] = raster[i]
        data[o + 1] = raster[i + 1]
        data[o + 2] = raster[i + 2]
        data[o + 3] = raster[i + 3]
        o += 4
    }
    ctx.putImageData(imageData, 0, 0)

    const overlayView = new google.maps.OverlayView()

    function onAdd() {
        let panes1 = overlayView.getPanes();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        overlayDiv.appendChild(canvas)
        panes1?.overlayLayer.appendChild(overlayDiv)
    }

    function onDraw() {
        const bounds = latLngBounds
        let mapCanvasProjection = overlayView.getProjection();

        const ne = mapCanvasProjection.fromLatLngToDivPixel(bounds.getNorthEast())!;
        const sw = mapCanvasProjection.fromLatLngToDivPixel(bounds.getSouthWest())!;

        if (overlayDiv) {
            overlayDiv.style.left = sw.x + "px";
            overlayDiv.style.top = ne.y + "px";
            overlayDiv.style.width = ne.x - sw.x + "px";
            overlayDiv.style.height = sw.y - ne.y + "px";
        }
    }

    function onRemove() {
        const context = canvas.getContext('2d')
        context!.clearRect(0, 0, canvasWidth, canvasHeight)
    }

    overlayView.onAdd = onAdd
    overlayView.draw = onDraw
    overlayView.onRemove = onRemove

    overlayView.setMap(googleMapsMap)

    return overlayView

}
