import type { Location } from "~/types/Location";

export const useHomeFormStore = defineStore("homeForm", () => {
  const homeMapStore = useHomeMapStore();
  const { carpoolLocations, routes } = storeToRefs(homeMapStore);

  const emptyForm = {
    name: undefined,
    carSeats: 4,
  };

  type EmptyForm = typeof emptyForm;

  const formValues = ref<Location | EmptyForm>(emptyForm);
  const isEditing = ref<boolean>(false);

  const onEdit = (location: Location) => {
    isEditing.value = true;
    formValues.value = location;
    const mapInput = document.getElementById(
      "location-input",
    ) as HTMLInputElement;

    // have to redo, geocode from coordinates (or use place name?)
    //const initialAddress = `${location?.address.street ?? ""} ${location?.address.address_number ?? ""} ${location?.address.place ?? ""} ${location?.address.postcode ?? ""} ${location?.address.country ?? ""}`;

    //mapInput.value = initialAddress;

    deleteLocation(location.id);
  };

  const resetForm = () => {
    formValues.value = emptyForm;
    const mapInput = document.getElementById(
      "location-input",
    ) as HTMLInputElement;
    mapInput.value = "";
  };

  const deleteLocation = (locationId: string) => {
    carpoolLocations.value = carpoolLocations.value.filter(
      (loc) => loc.id !== locationId,
    );

    routes.value = routes.value.filter(
      (route: Route) => route.carpoolId !== locationId,
    );
  };

  return {
    formValues,
    isEditing,
    onEdit,
    resetForm,
    deleteLocation,
  };
});
