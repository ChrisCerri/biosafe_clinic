import { useState } from "react"
import OpenDetailHint from "@/components/reparti/OpenDetailHint"
import DepartmentCard from "@/components/reparti/DepartmentCard"
import DeviceDetailModal from "@/components/reparti/DeviceDetailModal"
import TicketModals from "@/components/dashboard/TicketModals"
import { useMonitoring } from "@/context/MonitoringContext"
import { TICKET_STATUS } from "@/lib/ticketStatus"

export default function Reparti() {
  const {
    departmentsData,
    ticketStates,
    setOpenConfirmTicketId,
    setCloseTicketId,
  } = useMonitoring()

  const [selectedDevice, setSelectedDevice] = useState(null)

  const handleCloseDetail = () => setSelectedDevice(null)

  return (
    <div className="pb-6">
      <TicketModals />

      <header className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Reparti</h1>
      </header>

      <OpenDetailHint />

      <div className="grid gap-4 md:grid-cols-2">
        {departmentsData.map((department) => (
          <DepartmentCard
            key={department.name}
            department={department}
            onDeviceClick={setSelectedDevice}
          />
        ))}
      </div>

      <DeviceDetailModal
        open={Boolean(selectedDevice)}
        device={selectedDevice}
        ticketStatus={
          selectedDevice ? ticketStates[selectedDevice.id] ?? TICKET_STATUS.OPEN : null
        }
        onClose={handleCloseDetail}
        onTakeCharge={() => {
          if (selectedDevice) setOpenConfirmTicketId(selectedDevice.id)
        }}
        onCloseTicket={() => {
          if (selectedDevice) setCloseTicketId(selectedDevice.id)
        }}
      />
    </div>
  )
}
