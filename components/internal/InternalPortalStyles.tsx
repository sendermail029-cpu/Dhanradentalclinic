export default function InternalPortalStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .print-hidden {
              display: none !important;
            }

            .print-surface {
              box-shadow: none !important;
              border-color: #d1d5db !important;
            }

            body {
              background: #ffffff !important;
            }
          }
        `,
      }}
    />
  )
}
