import ConfirmModal from "@/components/dashboard/ConfirmModal"
import CloseTicketModal from "@/components/dashboard/CloseTicketModal"
import { useMonitoring } from "@/context/MonitoringContext"

export default function TicketModals() {
  const {
    openConfirmTicketId,
    closeTicketId,
    setOpenConfirmTicketId,
    setCloseTicketId,
    takeCharge,
    closeTicket,
  } = useMonitoring()

  return (
    <>
      <ConfirmModal
        open={Boolean(openConfirmTicketId)}
        title="Presa in carico"
        message="Sei sicuro di voler aprire il ticket?"
        confirmLabel="Apri ticket"
        onConfirm={() => {
          if (openConfirmTicketId) takeCharge(openConfirmTicketId)
          setOpenConfirmTicketId(null)
        }}
        onCancel={() => setOpenConfirmTicketId(null)}
      />
      <CloseTicketModal
        open={Boolean(closeTicketId)}
        ticketId={closeTicketId}
        onSubmit={(closure) => {
          if (closeTicketId) closeTicket(closeTicketId, closure)
          setCloseTicketId(null)
        }}
        onCancel={() => setCloseTicketId(null)}
      />
    </>
  )
}
