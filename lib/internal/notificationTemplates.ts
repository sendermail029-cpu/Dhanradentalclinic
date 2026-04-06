export const notificationTemplates = {
  appointmentReminder: (patientName: string, date: string, time: string) =>
    `Hello ${patientName}, this is a reminder for your appointment on ${date} at ${time}.`,
  followUpReminder: (patientName: string, date: string) =>
    `Hello ${patientName}, this is a reminder for your follow-up visit on ${date}.`,
  paymentReminder: (patientName: string, amount: number) =>
    `Hello ${patientName}, your pending payment is Rs. ${amount}. Please contact the clinic for support.`,
}
