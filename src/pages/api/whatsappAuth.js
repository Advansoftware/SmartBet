import { initializeWhatsappBot, getStatus } from '../../bots/whatsappBot';
import { messageHandler } from '../../services/whatsapp/messageHandler';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Alternar o modo de resposta com uma query específica
  if (req.query.toggleResponseMode === 'true') {
    messageHandler.toggleResponseMode();
    return res.status(200).json({
      message: `Modo de resposta alterado para: ${messageHandler.respondOnlyToAuthorizedNumber ? 'Apenas número autorizado' : 'Responder a todos'}`,
    });
  }

  if (req.query.getMessages === 'true') {
    return res.status(200).json({ messages: messageHandler.messageHistory });
  }

  const status = getStatus();
  if (status.isAuthenticated) {
    return res.status(200).json({
      message: 'Bem-vindo! Você já está conectado ao WhatsApp.',
      status: 'authenticated',
      authorizedNumber: status.authorizedNumber,
    });
  }

  try {
    await initializeWhatsappBot((qrCode) => {
      res.status(200).json({ qrCode, status: 'pending' });
    });
  } catch (error) {
    console.error('Erro ao iniciar bot:', error);
    res.status(500).json({ error: 'Erro ao iniciar o bot do WhatsApp.', details: error.message });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
