import InternalPortalStyles from '@/components/internal/InternalPortalStyles'
import PortalAccessGate from '@/components/internal/PortalAccessGate'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InternalPortalStyles />
      <PortalAccessGate role="doctor">{children}</PortalAccessGate>
    </>
  )
}
