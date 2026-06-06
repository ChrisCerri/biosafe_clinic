import { useMemo, useState } from "react"
import OpenDetailHint from "@/components/reparti/OpenDetailHint"
import DepartmentCard from "@/components/reparti/DepartmentCard"
import DeviceDetailModal from "@/components/reparti/DeviceDetailModal"
import { useMonitoring } from "@/context/MonitoringContext"
import { DATA_SOURCE_LABEL, getDatasetMeta } from "@/lib/clinicData"

export default function Reparti() {
  const { departmentsData } = useMonitoring()
  const meta = getDatasetMeta()

  const [selectedDeviceId, setSelectedDeviceId] = useState(null)

  const selectedDevice = useMemo(() => {
    if (!selectedDeviceId) return null

    for (const department of departmentsData) {
      const device = department.devices.find((item) => item.id === selectedDeviceId)
      if (device) return device
    }

    return null
  }, [selectedDeviceId, departmentsData])

  return (
    <div className="pb-6">
      <header className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Reparti</h1>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {meta.devices} dispositivi monitorati da {DATA_SOURCE_LABEL.toLowerCase()}.
        </p>
      </header>

      <OpenDetailHint />

      <div className="grid gap-4 md:grid-cols-2">
        {departmentsData.map((department) => (
          <DepartmentCard
            key={department.name}
            department={department}
            onDeviceClick={(device) => setSelectedDeviceId(device.id)}
          />
        ))}
      </div>

      <DeviceDetailModal
        open={Boolean(selectedDevice)}
        device={selectedDevice}
        onClose={() => setSelectedDeviceId(null)}
      />
    </div>
  )
}
