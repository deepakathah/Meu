import { useEffect, useRef } from "react";

export const useHotspotMap = (places) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!places.length || !mapRef.current) return;

    setTimeout(() => {
      mapRef.current.fitToCoordinates(
        places.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
        { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }, animated: true }
      );
    }, 250);
  }, [places]);

  return { mapRef, places };
};
