import {HeatmapData} from "../../src/lib/map/useHeatmap";
import {LineInfo} from "../../src/lib/map/usePolyline";
import MarkerOptions = google.maps.MarkerOptions;

export const mockHTML = "<a href='https://github.com' target=\"_blank\"><img style='aspect-ratio:1; width: 100%; position: absolute;' src=\"3_kantou5__chiba.png\"></a>"

export const mock_markers: MarkerOptions[] = [
    {
        position: {lat: 35.6584638, lng: 139.7017149},
        title: "スクランブルスクエア"
    },
    {
        position: {lat: 35.6586032, lng: 139.7452103},
        title: "東京タワー"
    },
    {
        position: {lat: 35.6896342, lng: 139.689912},
        title: "東京都庁"
    }
]
export const mock_lines: LineInfo[] = [
    {
        id: "1",
        path: [mock_markers[0].position as { lat: number, lng: number }, mock_markers[2].position as { lat: number, lng: number }]
    },
    {
        id: "2",
        path: [{lat: 5, lng: 99}, {lat: 6, lng: 97}]
    }
];

export const mock_locations = {
    IT: {
        Rome:
            {lat: 41.89025413699305, lng: 12.720038232067836}
    },
    US: {
        NewYork: {lat: 40.74, lng: -74.18},
        SanFrancisco: {lat: 37.782, lng: -122.447},
        LosAngeles: {lat: 34.05345648830255, lng: -118.2315954237448}
    },
    JP: {
        Muroran: {lat: 42.299262505, lng: 140.908246719},
        TokyoTower: {lat: 35.6586032, lng: 139.7452103},
        YokohamaStation: {lat: 35.46622153667692, lng: 139.6222330791369},
        TokyoBay: {lat: 35.53660987047071, lng: 139.90115888352994},
        Chiba: {lat: 36, lng:140.9375},
    }
}
export const mock_circles: google.maps.CircleOptions[] = [
    {center: mock_locations.JP.YokohamaStation, radius: 10 * 1000},
    {center: mock_locations.JP.TokyoTower, radius: 20 * 1000},
]

// export const test_data_circle: { lat: number, lng: number }[] = [{lat: 7.18019914627087, lng: -73.07779694}]

export const test_data_polygon: { lat: number, lng: number }[] = [
    {lat: 7.18019914627087, lng: -73.07779694},
    {lat: 7.17500114440924, lng: -73.07659912},
    {lat: 7.16109991073608, lng: -73.08059692},
    {lat: 7.14789915084839, lng: -73.08119965},
    {lat: 7.13860082626343, lng: -73.07489777},
    {lat: 7.13280010223394, lng: -73.06559753},
    {lat: 7.12929916381836, lng: -73.06269836},
    {lat: 7.1263999938966, lng: -73.06739807},
    {lat: 7.10970115661621, lng: -73.0759964},
    {lat: 7.10449981689459, lng: -73.08409882},
    {lat: 7.09769916534424, lng: -73.0943985},
    {lat: 7.08269977569586, lng: -73.1088028},
    {lat: 7.07289981842052, lng: -73.11569977},
    {lat: 7.07060003280645, lng: -73.12319946},
    {lat: 7.05680179595953, lng: -73.13009644},
    {lat: 7.05340003967291, lng: -73.13939667},
    {lat: 7.05050086975098, lng: -73.1473999},
    {lat: 7.05919981002808, lng: -73.15209961},
    {lat: 7.06330013275158, lng: -73.16010284},
    {lat: 7.06389999389648, lng: -73.16880035},
    {lat: 7.06629991531383, lng: -73.18029785},
    {lat: 7.07320117950451, lng: -73.18430328},
    {lat: 7.08760023117071, lng: -73.18609619},
    {lat: 7.1096010208131, lng: -73.18840027},
    {lat: 7.12750101089489, lng: -73.1815033},
    {lat: 7.15230083465588, lng: -73.1780014},
    {lat: 7.17660093307501, lng: -73.17810059},
    {lat: 7.18930006027233, lng: -73.17630005},
    {lat: 7.19456291198725, lng: -73.17707825},
    {lat: 7.19389915466314, lng: -73.16829681},
    {lat: 7.1995987892152, lng: -73.16369629},
    {lat: 7.20250082016003, lng: -73.15910339},
    {lat: 7.211100101471, lng: -73.14520264},
    {lat: 7.21739912033081, lng: -73.13600159},
    {lat: 7.22079992294312, lng: -73.12619781},
    {lat: 7.22370100021362, lng: -73.11990356},
    {lat: 7.2241997718811, lng: -73.11180115},
    {lat: 7.22540187835699, lng: -73.10780334},
    {lat: 7.22540187835699, lng: -73.10549927},
    {lat: 7.22129917144787, lng: -73.10549927},
    {lat: 7.21269989013683, lng: -73.10489655},
    {lat: 7.20340108871466, lng: -73.10489655},
    {lat: 7.19760084152222, lng: -73.10310364},
    {lat: 7.1911988258363, lng: -73.09739685},
    {lat: 7.18540000915522, lng: -73.09159851},
    {lat: 7.18370008468634, lng: -73.08640289},
    {lat: 7.180199146, lng: -73.07779694}
]


export const mock_heatmap: HeatmapData[] = [
    {location: {lat: 35.5089, lng: 139.7159}, weight: 0.5},
    {location: {lat: 35.5319, lng: 139.6992}, weight: 1},
    {location: {lat: 35.5664, lng: 139.6068}, weight: 2},
    {location: {lat: 35.5476, lng: 139.7326}, weight: 3},
    {location: {lat: 35.5047, lng: 139.5412}, weight: 0.2},
    {location: {lat: 35.5078, lng: 139.6209}, weight: 1.5},
    {location: {lat: 35.5580, lng: 139.5387}, weight: 4},
]
