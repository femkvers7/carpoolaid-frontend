/**
 * method: POST
 * body: all of the routes + destination
 *
 * return: a matrix of the amount of overlap per route
 *
 * To consider: can we exclude some routes or locations from the overlap calculation? If they have no chance of ever overlapping..
 */
import { Location } from "~/types/Location";
import type { Overlaps } from "~/types/Overlaps";
import { Route } from "~/types/Route";
import { Suggestion } from "~/types/Suggestion";

const MAPBOX_API_KEY = useRuntimeConfig().public.mapboxAccessToken;

const calculateFirstCommonCoord = (
  geometry1: number[][],
  geometry2: number[][],
) => {
  const firstCommonCoord = geometry1.find((coord1) =>
    geometry2.some(
      (coord2) => coord1[0] === coord2[0] && coord1[1] === coord2[1],
    ),
  );

  return firstCommonCoord;
};

const calculateOverlap = async (
  geometry1: number[][],
  geometry2: number[][],
  destination: number[],
) => {
  const firstCommonCoord = calculateFirstCommonCoord(geometry1, geometry2);

  if (!firstCommonCoord) {
    return Number.MAX_VALUE;
  }
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${firstCommonCoord[0]},${firstCommonCoord[1]};${destination[0]},${destination[1]}?overview=false&access_token=${MAPBOX_API_KEY}`;
  const query = await fetch(url, {
    method: "GET",
  });
  const result = await query.json();

  return result.routes[0].distance;
};

const calculateOverlapMatrix = async (
  routes: Route[],
  destination: Location,
) => {
  const overlaps: Overlaps = {};

  for (const route1 of routes) {
    for (const route2 of routes) {
      if (route1.id !== route2.id) {
        const overlap = await calculateOverlap(
          route1.geometry,
          route2.geometry,
          destination.coordinates,
        );
        if (overlap > 20000) {
          overlaps[route1.id] = overlaps[route1.id] || {};
          overlaps[route1.id][route2.id] = overlap;
        }
      }
    }
  }

  return overlaps;
};

const calculateMaxOverlap = (overlaps: Overlaps) => {
  let max = {
    value: Number.MIN_VALUE,
    routeId1: "",
    routeId2: "",
  };

  for (const routeId1 in overlaps) {
    for (const routeId2 in overlaps[routeId1]) {
      if (overlaps[routeId1][routeId2] > max.value) {
        max = {
          value: overlaps[routeId1][routeId2],
          routeId1,
          routeId2,
        };
      }
    }
  }

  return max;
};

const calculateGroups = (overlaps: Overlaps) => {
  const groups: Suggestion[] = [];

  while (overlaps && Object.keys(overlaps).length > 0) {
    const maxOverlap = calculateMaxOverlap(overlaps);

    if (maxOverlap.value > 20000) {
      const groupAlreadyExists = groups.find((group) => {
        if (group.includes(maxOverlap.routeId2)) {
          group.push(maxOverlap.routeId1);

          if (group.length >= 4) {
            // delete it as an option from all overlaps
            for (const route in overlaps) {
              for (const assignedRoute of group) {
                delete overlaps[route][assignedRoute];
              }
            }
          }
          return true;
        }
        return false;
      });

      if (!groupAlreadyExists) {
        groups.push([maxOverlap.routeId1]);
      }

      delete overlaps[maxOverlap.routeId1];
    }
  }

  return groups;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const destination = body.destination;
  const routes = body.routes;

  const overlaps = await calculateOverlapMatrix(routes, destination);

  const groups = calculateGroups(overlaps);

  return groups;
});