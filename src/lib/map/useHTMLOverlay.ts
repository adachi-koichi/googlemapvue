import {Ref} from "@vue/reactivity";
import {ObjectSet} from "./useMVCObject";

export const useHTMLOverlay = (usemvcObject: {
                                   objectSets: ObjectSet;
                                   removeObject: <T extends google.maps.MVCObject>(callback: (mvcObject: google.maps.MVCObject) => boolean,
                                                                                   cls: { new(...args: any): T }) => void
                               },
                               googleMapsMapRef: Ref<google.maps.Map | null>) => {

    const {objectSets, removeObject} = usemvcObject

    const addHTML = async (htmlString: string, latLngBounds: google.maps.LatLngBounds,
                           onClickListener?: () => void): Promise<google.maps.OverlayView | null> => {

        if (googleMapsMapRef.value === null) {
            return null
        }

        const obj = await drawHTML(htmlString, latLngBounds, googleMapsMapRef.value)
        let mapsEventListener = undefined
        if (!!onClickListener) {
            mapsEventListener = obj.addListener("click", onClickListener);
        }
        objectSets.data.push({mvcObject: obj, mapsEventListener})
        obj.setMap(googleMapsMapRef.value)
        objectSets.lastUpdateTime = Date.now()
        return obj
    }

    const removeHTML = () => {
        removeObject((mvcObject) => {
                return true
            },
            google.maps.OverlayView);
    }
    return {
        addHTML, removeHTML
    }

}


const drawHTML = async (htmlString: string,
                        latLngBounds: google.maps.LatLngBounds,
                        googleMapsMap: google.maps.Map): Promise<google.maps.OverlayView> => {

    class HTMLOverlayView extends google.maps.OverlayView {
        private bounds: google.maps.LatLngBounds;
        private htmlString: string;
        private div?: HTMLElement;

        constructor(bounds: google.maps.LatLngBounds, htmlString: string) {
            super();

            this.bounds = bounds;
            this.htmlString = htmlString;
        }

        onAdd() {
            this.div = document.createElement("div");
            this.div.style.borderStyle = "none";
            this.div.style.borderWidth = "0px";
            this.div.style.position = "absolute";
            this.div.innerHTML = this.htmlString
            const panes = this.getPanes()!;
            panes.overlayMouseTarget.appendChild(this.div);
        }

        draw() {
            const overlayProjection = this.getProjection();
            const sw = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getSouthWest()
            )!;
            const ne = overlayProjection.fromLatLngToDivPixel(
                this.bounds.getNorthEast()
            )!;

            if (this.div) {
                this.div.style.left = sw.x + "px";
                this.div.style.top = ne.y + "px";
                this.div.style.width = ne.x - sw.x + "px";
                this.div.style.height = sw.y - ne.y + "px";
            }
        }

        onRemove() {
            if (this.div) {
                (this.div.parentNode as HTMLElement).removeChild(this.div);
                delete this.div;
            }
        }

        hide() {
            if (this.div) {
                this.div.style.visibility = "hidden";
            }
        }

        show() {
            if (this.div) {
                this.div.style.visibility = "visible";
            }
        }

        toggle() {
            if (this.div) {
                if (this.div.style.visibility === "hidden") {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }

        toggleDOM(map: google.maps.Map) {
            if (this.getMap()) {
                this.setMap(null);
            } else {
                this.setMap(map);
            }
        }
    }

    const overlay = new HTMLOverlayView(latLngBounds, htmlString);
    // overlay.setMap(googleMapsMap);
    return overlay

}
