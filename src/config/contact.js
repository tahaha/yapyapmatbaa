export const whatsappNumber = '905431109543';

export const generalWhatsAppMessage = 'Merhaba, YapyapMatbaa web sitenizden ulaşıyorum. Baskı hizmetleriniz hakkında bilgi almak istiyorum.';

export function createWhatsAppUrl(message = generalWhatsAppMessage) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

