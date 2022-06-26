declare module '*.vue' {
    import {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'geotiff/src/geotiff' {
    export function fromArrayBuffer(arrayBuffer: ArrayBuffer)

    export interface GeoTIFFImage {
        getWidth(): number;

        getHeight(): number;

        getBoundingBox(): Array;

        readRGB(param: { enableAlpha: boolean }): Promise<Array>;
    }
}
