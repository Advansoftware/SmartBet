import venom from 'venom-bot';
import { whatsappConfig } from '../config/whatsapp';
import { sessionManager } from '../services/whatsapp/sessionManager';
import { messageHandler } from '../services/whatsapp/messageHandler';
import path from 'path';
import { cleanDirectoryAsync } from '../utils/fileSystem';
import { ensureCleanEnvironment } from '../utils/chromiumManager';

let client = null;
let isAuthenticated = false;
let authorizedNumber = null;
let initializationInProgress = false;

export async function initializeWhatsappBot(onQRCode) {
  try {
    if (initializationInProgress) {
      console.log('Inicialização já em andamento...');
      return;
    }

    initializationInProgress = true;
    await ensureCleanEnvironment();

    if (client) {
      try {
        await client.close();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log('Erro ao fechar sessão anterior:', error);
      }
      client = null;
    }

    // Limpar diretório de tokens
    const tokensPath = path.join(process.cwd(), 'tokens', whatsappConfig.sessionName);
    await cleanDirectoryAsync(tokensPath);

    client = await venom.create({
      session: whatsappConfig.sessionName,
      catchQR: (base64Qr) => {
        console.log('QR Code gerado');
        onQRCode(base64Qr);
      },
      statusFind: (statusSession) => {
        console.log('Status da Sessão:', statusSession);
      },
      ...whatsappConfig.venomOptions
    });

    client.onStateChange((state) => {
      console.log('Estado atual:', state);
      if (state === 'CONNECTED') {
        client.getHostDevice().then((device) => {
          authorizedNumber = device.wid;
          isAuthenticated = true;
          sessionManager.saveSession({ isAuthenticated, authorizedNumber });
        });
      }
    });

    client.onMessage(async (message) => {
      await messageHandler.handleMessage(client, message, authorizedNumber);
    });

    return {
      isAuthenticated,
      authorizedNumber,
      client
    };
  } catch (error) {
    console.error('Erro ao inicializar bot:', error);
    throw error;
  } finally {
    initializationInProgress = false;
  }
}

export function getStatus() {
  return {
    isAuthenticated,
    authorizedNumber,
    isActive: !!client
  };
}
