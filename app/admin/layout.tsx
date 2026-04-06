import InternalPortalStyles from '@/components/internal/InternalPortalStyles'
import PortalAccessGate from '@/components/internal/PortalAccessGate'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InternalPortalStyles />
      <PortalAccessGate role="admin">{children}</PortalAccessGate>
    </>
  )
}
