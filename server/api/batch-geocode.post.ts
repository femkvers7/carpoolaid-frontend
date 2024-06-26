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

const MAPBOX_API_KEY = useRuntimeConfig().public.MAPBOX_ACCESS_TOKEN;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
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
        place: locationFeatures.properties.context.place?.name,
        fullAddress: locationFeatures.properties.full_address,
        carSeats: 4,
      };
    });

    return formattedResult;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to geocode locations",
    });
  }
});
