import * as DeckTypings from "@danmarshall/deckgl-typings"

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

declare module '*.glsl' {
    const value: string
    export default value
}

declare module "deck.gl" {
    export namespace DeckTypings {
    }
}
