export const haversine_distance_km = (point1: google.maps.LatLng, point2: google.maps.LatLng) => {
    const R = 6371.0710;
    const rlat1 = point1.lat() * (Math.PI / 180);
    const rlat2 = point2.lat() * (Math.PI / 180);
    const difflat = rlat2 - rlat1;
    const difflon = (point2.lng() - point1!.lng()) * (Math.PI / 180);

    const distancekm = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return distancekm;
}

export const approximateAddDistanceToLatLng = (point: google.maps.LatLng,
                                               distanceKMForLat: number,
                                               distanceKMForLng: number): google.maps.LatLng => {
    const newLat = point.lat() - distanceKMForLat / 110.574
    const latLngAfterAddition = new google.maps.LatLng(
        newLat,
        point.lng() + distanceKMForLng / 111.320 * Math.cos(point.lat()))
    return latLngAfterAddition
}
