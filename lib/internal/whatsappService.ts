import { notificationTemplates } from '@/lib/internal/notificationTemplates'

type SendResult = {
  success: boolean
  channel: 'whatsapp'
  messageId: string
  preview: string
}

export const whatsappService = {
  async sendAppointmentReminder(patientName: string, mobileNumber: string, date: string, time: string): Promise<SendResult> {
    return {
      success: true,
      channel: 'whatsapp',
      messageId: `wa-${mobileNumber.slice(-4)}-1`,
      preview: notificationTemplates.appointmentReminder(patientName, date, time),
    }
  },

  async sendFollowUpReminder(patientName: string, mobileNumber: string, date: string): Promise<SendResult> {
    return {
      success: true,
      channel: 'whatsapp',
      messageId: `wa-${mobileNumber.slice(-4)}-2`,
      preview: notificationTemplates.followUpReminder(patientName, date),
    }
  },

  async sendPaymentReminder(patientName: string, mobileNumber: string, amount: number): Promise<SendResult> {
    return {
      success: true,
      channel: 'whatsapp',
      messageId: `wa-${mobileNumber.slice(-4)}-3`,
      preview: notificationTemplates.paymentReminder(patientName, amount),
    }
  },
}
