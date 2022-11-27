export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PointGeoJSON = {
    type: 'Point';
    coordinates: [number, number];
};

export type PolygonGeoJSON = {
    type: 'Polygon';
    coordinates: [Array<[number, number]>];
};

export type GeoJSON = PointGeoJSON | PolygonGeoJSON;

export type OSMResultData = {
    osm_id: number;
    type: string;
    boundingbox: [number, number, number, number]; // min lat, max lat, min long, max long
    lat: string;
    lon: string;
    display_name: string;
    geojson: GeoJSON;
    address: {
        town: string;
        municipality: string;
        neighbourhood: string;
        residential: string;
        industrial: string;
        village: string;
        leisure: string;
        city: string; // city (ex: Abidjan/Bouaké)
        state: string; // state (ex: Abidjan)
    };
};
