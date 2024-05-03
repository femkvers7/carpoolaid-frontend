/**
 * Expected request body = array of objects with location data:
 * {
    place: string
    postcode?: string,
    street?: string,
    address_number?: string,
    country: string,
    limit: number,
  }[]
 * 
 */

import { v4 as uuidv4 } from "uuid";

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body, "body");

  const url = `https://api.mapbox.com/search/geocode/v6/batch?access_token=${MAPBOX_API_KEY}`;
  const query = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await query.json();

  const formattedResult = result.batch.map((res: any) => {
    const locationFeatures = res.features[0];
    return {
      id: uuidv4(),
      coordinates: locationFeatures.geometry.coordinates as number[],
      label: locationFeatures.properties.context.place?.name ?? "Carpool",
      address: {
        country: locationFeatures.properties.context.country?.name ?? "",
        place: locationFeatures.properties.context.place?.name ?? "",
        street: locationFeatures.properties.context.street?.name ?? "",
        address_number:
          locationFeatures.properties.context.address?.address_number ?? "",
      },
    };
  });

  return formattedResult;
});