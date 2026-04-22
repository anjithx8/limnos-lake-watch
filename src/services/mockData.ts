import type { FeatureCollection } from "geojson";

// Approximate polygons for 5 well-known Bangalore lakes.
// Coordinates are illustrative and roughly trace each lake's footprint.
export const BANGALORE_LAKES: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        lake_id: "BLR-001",
        name: "Bellandur Lake",
        area_sqm: 3640000,
        centroid_lon: 77.6695,
        centroid_lat: 12.9352,
        water_type: "urban_lake",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.6555, 12.9398],
            [77.6612, 12.9425],
            [77.6705, 12.9418],
            [77.6798, 12.9388],
            [77.6845, 12.9352],
            [77.6822, 12.9305],
            [77.6738, 12.9282],
            [77.6635, 12.9295],
            [77.6572, 12.9332],
            [77.6555, 12.9398],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        lake_id: "BLR-002",
        name: "Ulsoor Lake",
        area_sqm: 503000,
        centroid_lon: 77.6201,
        centroid_lat: 12.9822,
        water_type: "urban_lake",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.6168, 12.9852],
            [77.6195, 12.9858],
            [77.6228, 12.9842],
            [77.6238, 12.9818],
            [77.6225, 12.9795],
            [77.6195, 12.9788],
            [77.6168, 12.9802],
            [77.6160, 12.9828],
            [77.6168, 12.9852],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        lake_id: "BLR-003",
        name: "Agara Lake",
        area_sqm: 980000,
        centroid_lon: 77.6452,
        centroid_lat: 12.9241,
        water_type: "urban_lake",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.6402, 12.9268],
            [77.6438, 12.9282],
            [77.6485, 12.9275],
            [77.6512, 12.9248],
            [77.6505, 12.9215],
            [77.6468, 12.9198],
            [77.6422, 12.9205],
            [77.6395, 12.9232],
            [77.6402, 12.9268],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        lake_id: "BLR-004",
        name: "Hebbal Lake",
        area_sqm: 1430000,
        centroid_lon: 77.5905,
        centroid_lat: 13.0452,
        water_type: "urban_lake",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.5848, 13.0488],
            [77.5895, 13.0498],
            [77.5948, 13.0482],
            [77.5972, 13.0455],
            [77.5965, 13.0422],
            [77.5925, 13.0405],
            [77.5872, 13.0412],
            [77.5838, 13.0438],
            [77.5848, 13.0488],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        lake_id: "BLR-005",
        name: "Sankey Tank",
        area_sqm: 152000,
        centroid_lon: 77.5715,
        centroid_lat: 13.0072,
        water_type: "urban_lake",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.5695, 13.0095],
            [77.5715, 13.0102],
            [77.5735, 13.0088],
            [77.5738, 13.0068],
            [77.5722, 13.0052],
            [77.5702, 13.0055],
            [77.5688, 13.0072],
            [77.5695, 13.0095],
          ],
        ],
      },
    },
  ],
};
