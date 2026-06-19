

export function generateClinicSlug(clinicName, location) {
  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const locationParts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  // Use the last meaningful part of the address
  const cityPart =
    locationParts.length >= 2
      ? locationParts[locationParts.length - 2]
      : location;

  return `${normalize(clinicName)}-${normalize(cityPart)}`;
}

console.log(
  generateClinicSlug("Neighborhood Care Clinic","Praça da Sé ,lado ímpar Sé São Paulo-SP,01001-000")
);

// neighborhood-care-clinic-sao-paulo-sp