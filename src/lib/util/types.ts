export type Optional<T> =  T | null
export type OptionalMap = Optional<google.maps.Map>
export type NonNullable<T> = T extends null | undefined ? never : T
export type GMVLatLng = { lat: number, lng: number }
