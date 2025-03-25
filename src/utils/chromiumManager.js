import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function killChromiumProcesses() {
  try {
    await execAsync('pkill -f chromium');
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    // Ignora erro se não houver processos para matar
  }
}

export async function ensureCleanEnvironment() {
  await killChromiumProcesses();
  await new Promise(resolve => setTimeout(resolve, 2000));
}
