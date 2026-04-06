import InternalPortalStyles from '@/components/internal/InternalPortalStyles'
import PortalAccessGate from '@/components/internal/PortalAccessGate'

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InternalPortalStyles />
      <PortalAccessGate role="receptionist">{children}</PortalAccessGate>
    </>
  )
}
