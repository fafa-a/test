import { config } from "@/config"
import { useSelector } from "react-redux"

export default function useChartHook() {
  const [dataSets, setDataSets] = useState([])
  const [dates, setDates] = useState([])
  const chart = useSelector(state => state.chart)
  const { chartData, lakeName, observationType } = chart.chart

  useEffect(() => {
    if (chartData.length > 0) {
      for (const item of chartData) {
        setDataLines(item)
        setLabelsDate(item)
      }
    }
  }, [chartData])

  useEffect(() => {
    console.log({ dates })
  }, [dates])

  const handleValue = (value, unit) => {
    if (unit === "hm³") {
      return (1 * value) / 1_000_000
    } else if (unit === "ha") {
      return (1 * value) / 10_000
    } else if (unit === "%") {
      return value
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Time Scale",
        position: "top",
        font: {
          size: 16,
        },
        padding: {
          top: 10,
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const label = context.dataset.label || ""
            const labelStartWith = label
              .slice(0, label.indexOf(" "))
              .toLowerCase()

            const labelWithoutExtension = label
              .split(" ")
              .slice(0, -1)
              .join(" ")

            if (context.parsed.y !== null) {
              if (labelStartWith === "filling")
                return `${labelWithoutExtension} : ${context.parsed.y.toFixed(
                  3
                )} %`
              else if (labelStartWith === "surface")
                return `${labelWithoutExtension} : ${context.parsed.y.toFixed(
                  3
                )} ha`
              else if (labelStartWith === "volume")
                return `${labelWithoutExtension} : ${context.parsed.y.toFixed(
                  3
                )} hm³`
            }
            return labelWithoutExtension
          },
        },
      },
      legend: {
        position: "top",
        labels: { font: { size: 14 } },
      },
      zoom: {
        pan: {
          enabled: true,
          modifierKey: "ctrl",
          // onPanStart: chart => {
          //   chart.event.changedPointers[0].target.style.cursor = "grab"
          // },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
            backgroundColor: "rgba(0,204,255,0.15)",
            borderColor: "rgba(0,204,255,1.00)",
            borderWidth: 1,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
        limits: {
          y: { min: 0, max: "original" },
        },
      },
    },
    scales: {
      y: {
        min: 0,
      },
    },
  }

  const setDataLines = item => {
    if (!item) return

    const value = item[0]
      ?.filter(el => !isNaN(el.value) && el.date !== "" && el.value !== "0")
      .map(el => el.value)

    const {
      label,
      unit,
      borderColor,
      borderWidth,
      backgroundColor,
      pointBackgroundColor,
      tension,
      pointRadius,
    } = config.attributes["fillingRate"]

    const data = {
      label: `${lakeName} ${observationType}`,
      data: value.map(el => handleValue(el, unit)),
      borderColor,
      backgroundColor,
      borderWidth,
      pointBackgroundColor,
      tension,
      pointRadius,
    }
    setDataSets([...dataSets, data])
  }

  const setLabelsDate = item => {
    if (!item) return
    const dateFiltered = item[0]
      ?.filter(el => !isNaN(el.value) && el.date !== "" && el.value !== "0")
      .map(el => el.date)
    // merge dates and datesFiltered
    const uniqueDates = [...new Set([...dates, ...dateFiltered])]
    setDates(uniqueDates)
  }

  const data = {
    labels: dates,
    datasets: dataSets,
  }

  console.log("data ===>", data)
  return {
    data,
    options,
  }
}
