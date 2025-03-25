import fs from 'fs';
import { whatsappConfig } from '../../config/whatsapp';
import { cleanDirectoryAsync } from '../../utils/fileSystem';

class SessionManager {
  constructor() {
    this.sessionFile = whatsappConfig.folderConfig.sessionFile;
  }

  saveSession(data) {
    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }

  loadSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        return JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    }
    return null;
  }

  clearSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        fs.unlinkSync(this.sessionFile);
        console.log('Arquivo de sessão removido com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao remover arquivo de sessão:', error);
    }
  }

  // ...outros métodos de gerenciamento de sessão...
}

export const sessionManager = new SessionManager();
