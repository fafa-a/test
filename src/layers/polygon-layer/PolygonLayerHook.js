import { useMap } from "react-leaflet"
import { useSelector } from "react-redux"

export default function usePolygonLayerHook({ handleChange }) {
  const map = useMap()
  const { coordinatesLakeToCenter } = useSelector(state => state.lakes)

  useEffect(() => {
    if (coordinatesLakeToCenter.length > 0) {
      map.flyTo(coordinatesLakeToCenter, 12)
    }
  }, [coordinatesLakeToCenter])

  const centerPolygon = useCallback((...coord) => {
    map.setView(coord[0], coord[1])
  })

  const getLakeIdName = useCallback(
    (id, name, coord) => {
      const obj = {
        id,
        name,
        coord,
      }
      handleChange(obj)
    },
    [handleChange]
  )

  return {
    map,
    centerPolygon,
    getLakeIdName,
  }
}
