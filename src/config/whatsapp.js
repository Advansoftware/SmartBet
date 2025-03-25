import path from 'path';

export const whatsappConfig = {
  sessionName: 'whatsapp_bot_session',
  folderConfig: {
    sessionFile: path.join(process.cwd(), 'tokens', 'session.json'),
    tokensPath: path.join(process.cwd(), 'tokens'),
  },
  venomOptions: {
    createPathFileToken: true,
    disableWelcome: true,
    headless: 'new',
    useChrome: false,
    debug: true,
    logQR: true,
    disableSpins: true,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ],
    puppeteerOptions: {
      userDataDir: path.join(process.cwd(), 'tokens', 'whatsapp_bot_session'),
      headless: 'new',
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--single-process'
      ]
    }
  }
};
