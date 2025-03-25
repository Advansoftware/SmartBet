import fs from 'fs';
import path from 'path';

export const cleanDirectoryAsync = async (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) return;

    const removeRecursive = (dir) => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          const curPath = path.join(dir, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            removeRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(dir);
      }
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    removeRecursive(dirPath);
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (error) {
    console.error('Erro na limpeza:', error);
  }
};

// ...outras funções de utilidade para arquivos...
