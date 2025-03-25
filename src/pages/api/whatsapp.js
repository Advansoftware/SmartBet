import { initializeWhatsappBot } from '../../bots/whatsappBot';

export default async function handler(req, res) {
  try {
    await initializeWhatsappBot();
    res.status(200).json({ message: 'WhatsApp Bot iniciado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao iniciar o bot do WhatsApp.' });
  }
}