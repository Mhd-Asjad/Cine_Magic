import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

function ZoomLocation({location}) {

    const map = useMap();

    useEffect(() => {
        if (location){
            map.setView(location , 14)
        }
    },[location , map])
  return null;
}

export default ZoomLocation
