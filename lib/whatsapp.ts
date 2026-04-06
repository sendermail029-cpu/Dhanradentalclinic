export const APPOINTMENT_WHATSAPP_NUMBER = '918121288804'

export function buildWhatsAppUrl(lines: Array<string | undefined | null>) {
  const text = lines.filter((line) => line && line.trim().length > 0).join('\n')
  return `https://wa.me/${APPOINTMENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
