import {Ref} from "@vue/reactivity";
import {
    mock_circles,
    mock_markers,
    mock_locations, mockHTML, mock_heatmap
} from "./TravelMapMock";
import {ref} from "vue";
import {Optional} from "../../src/lib/util/types";
import GoogleMapVue from "../../src/lib/components/GoogleMapVue.vue";
import {approximateAddDistanceToLatLng} from "../../src/lib";

export const useExamples = (googleMapVueRef: Ref<Optional<InstanceType<typeof GoogleMapVue>>>) => {

    const moveMapCenterTo = (location: google.maps.LatLng | google.maps.LatLngLiteral | null) => {
        if (!location) {
            return
        }
        console.log(location)
        const googleMapVue = googleMapVueRef.value
        if (!googleMapVue || !googleMapVue.googleMapsMapRef) {
            return
        }
        googleMapVue.googleMapsMapRef.setCenter(location)
    }
    const eraseMarkers = () => googleMapVueRef.value?.removeMarker()

    const drawOrEraseMarkers = () => {
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }

        if (googleMapVue.objectSets.data.filter((obj) => {
            return obj.mvcObject instanceof google.maps.Marker
        }).length > 0) {
            eraseMarkers()
            return
        }

        mock_markers.forEach((markerOptions) => {
            googleMapVue.addMarker(markerOptions)
        })
        googleMapVue.googleMapsMapRef?.setCenter(mock_locations.JP.TokyoTower)
    }

    let polygons: Array<google.maps.Polygon> = []
    const drawPolygons = async (filename: string = "polygons.json") => {
        if (polygons.length > 0) {
            polygons.reverse().forEach((polygon, index, array) => {
                polygon.setMap(null)
            })
            polygons = []
            return
        }
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }
        type PolygonsJSON = Array<{
            polygon: Array<Array<number>>
            area_code: string
        }>

        const response = await fetch(`http://localhost:3000/${filename}`)
        const polygonsJSON = await response.json() as PolygonsJSON

        const mappedPolygons = polygonsJSON.map(value => {
            return {
                area_code: value.area_code,
                polygon: value.polygon.map(aaa => {
                    return new google.maps.LatLng(aaa[0], aaa[1])
                })
            }
        })

        mappedPolygons.forEach(mappedPolygon => {
            polygons.push(googleMapVue.addPolygon({paths: mappedPolygon.polygon}));

        })
        googleMapVue.googleMapsMapRef?.setCenter(mappedPolygons[0].polygon[0])

    }

    let polylines = ref<Array<google.maps.Polyline>>([])
    const drawOrErasePolylines = () => {
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }
        moveMapCenterTo(mock_locations.JP.TokyoBay)
        if (polylines.value.length > 0) {
            polylines.value.forEach(polyline => {
                polyline.setMap(null)
            })
            polylines.value = []
            return
        }

        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        polylines.value.push(googleMapVue.addPolyline([
                mock_locations.JP.TokyoTower,
                mock_locations.JP.TokyoBay,
                mock_locations.JP.YokohamaStation,
                mock_locations.JP.TokyoTower,
            ],
            {
                strokeColor: randomColor,
            },
            () => {
                console.log("erase")
            }))

    }

    let heatmaps = ref<Array<google.maps.visualization.HeatmapLayer>>([])
    const drawOrEraseHeatmap = () => {
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }
        moveMapCenterTo(mock_locations.JP.TokyoBay)
        if (heatmaps.value.length > 0) {
            heatmaps.value.forEach(heatmap => {
                heatmap.setMap(null)
            })
            heatmaps.value = []
            return
        }
        heatmaps.value.push(googleMapVue.addHeatmap(mock_heatmap))
        googleMapVue.googleMapsMapRef?.setZoom(10)
    }

    let circles: Array<google.maps.Circle> = []
    const drawOrEraseCircles = () => {
        const googleMapVue = googleMapVueRef.value
        if (!googleMapVue) {
            return
        }
        moveMapCenterTo(mock_circles[0].center)
        if (circles.length > 0) {
            console.log("erase circle")
            circles.forEach(circle => {
                googleMapVue.removeCircle(circle)
            })
            circles = []
            return
        }

        console.log("draw circle")
        for (const circleOptions of mock_circles) {
            const circle = googleMapVue.addCircle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                clickable: true,
                ...circleOptions
            }, () => {
                console.log("circle is clicked")
            });
            circle ? circles.push(circle) : null
        }
    }

    let kmlLayer: google.maps.KmlLayer | null = null
    const drawOrEraseKML = () => {
        console.log("drawOrEraseKML!!!!!!!!!!!!")
        const googleMapVue = googleMapVueRef.value
        if (!googleMapVue) {
            return
        }

        if (!!kmlLayer) {
            console.log("erase KML")
            kmlLayer.setOptions(null)
            kmlLayer.setMap(null)
            // googleMapVue.removeKMLLayer(kmlLayer)
            kmlLayer = null
            return
        }
        console.log("draw KML")

        const url = "https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml"
        kmlLayer = googleMapVue.addKMLLayer(url);
    }

    let features: google.maps.Data.Feature[] | null = null
    const drawGeoJsonExample = async () => {
        console.log("drawGeoJsonExample!!!!!!!!!!!!")
        const googlemapVue = googleMapVueRef.value
        if (!googlemapVue) {
            return
        }
        if (!!features) {
            features.forEach((feature) => {
                googlemapVue.removeGeoJSON(feature)
            })
            features = null
            return
        }

        const url = "http://localhost:3000/mock.geojson"
        features = await googlemapVue.addGeoJson(url);
        moveMapCenterTo(mock_locations.JP.TokyoTower)
        googlemapVue.googleMapsMapRef?.setZoom(9)

    }

    let overlayView: google.maps.OverlayView | null = null
    const drawOrEraseGeoTiff = async () => {
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }
        if (overlayView !== null) {
            overlayView.setMap(null)
            overlayView = null
            return
        }
        switch (googleMapVueRef.value) {

        }
        overlayView = await googleMapVue.addGeoTiff("http://localhost:3000/3_kantou5__chiba_modified.tif");
        moveMapCenterTo(mock_locations.JP.YokohamaStation)
    }
    let htmlOverlayViewRef = ref<Optional<google.maps.OverlayView>>(null)
    const drawOrEraseHTML = async () => {
        const googleMapVue = googleMapVueRef.value
        if (googleMapVue === null) {
            return
        }
        moveMapCenterTo(mock_locations.JP.TokyoBay)
        if (htmlOverlayViewRef.value !== null) {
            console.log("erase HTML!!!!!!!!!!!!!")
            htmlOverlayViewRef.value?.setMap(null)
            htmlOverlayViewRef.value = null
            googleMapVue.removeHTML()
            return
        }
        console.log("draw HTML!!!!!!!!!!!!!")
        const latLngBounds = new google.maps.LatLngBounds(
            approximateAddDistanceToLatLng(new google.maps.LatLng(mock_locations.JP.Chiba), 1000, 1000),
            mock_locations.JP.Chiba
        );
        htmlOverlayViewRef.value = await googleMapVue.addHTML(mockHTML, latLngBounds)
    }
    return {
        moveMapCenterTo,
        drawOrEraseMarkers,
        eraseMarkers,
        drawPolygons,
        drawOrErasePolylines,
        drawOrEraseCircles,
        drawOrEraseHeatmap,
        drawOrEraseKML,
        drawGeoJsonExample,
        drawOrEraseGeoTiff,
        drawOrEraseHTML
    }
}
