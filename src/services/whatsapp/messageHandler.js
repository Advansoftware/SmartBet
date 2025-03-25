import { openai, openaiConfig } from '../../config/openai';

class MessageHandler {
  constructor() {
    this.messageHistory = [];
    this.respondOnlyToAuthorizedNumber = true; // Padrão: responde só ao número autorizado
  }

  toggleResponseMode() {
    // Alterna entre responder apenas ao número autorizado ou a todos
    this.respondOnlyToAuthorizedNumber = !this.respondOnlyToAuthorizedNumber;
    console.log(`Modo de resposta alterado: ${this.respondOnlyToAuthorizedNumber ? 'Apenas número autorizado' : 'Responder a todos'}`);
  }

  async handleMessage(client, message, authorizedNumber) {
    if (this.respondOnlyToAuthorizedNumber && !this.isAuthorizedNumber(message.from, authorizedNumber)) {
      await client.sendText(message.from, 'Desculpe, este bot está configurado para responder apenas ao número autorizado.');
      return;
    }

    if (typeof message.body !== 'string' || message.body.trim() === '') {
      await client.sendText(message.from, 'Desculpe, a mensagem enviada está vazia ou é inválida.');
      return;
    }

    try {
      const response = await this.generateAIResponse(message.body.trim());
      this.addMessageToHistory(message.body, response);
      await client.sendText(message.from, response);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      await client.sendText(message.from, 'Desculpe, houve um erro ao processar sua mensagem.');
    }
  }

  isAuthorizedNumber(from, authorizedNumber) {
    return authorizedNumber === null || from === authorizedNumber;
  }

  async generateAIResponse(userMessage) {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um assistente prestativo e amigável, uma mulher do job e trabalha na boate e as pessoas que falarem com voce são seus clientes. Responda de forma direta como se fosse uma prostituta e usando girias brasileiras, se for um conteudo que voce não entender bem, puxe um assunto." },
        { role: "user", content: userMessage },
      ],
      ...openaiConfig,
    });

    return completion.choices[0].message.content.trim();
  }

  addMessageToHistory(message, response) {
    this.messageHistory.push({ message, response, timestamp: new Date().toISOString() });
    if (this.messageHistory.length > 10) {
      this.messageHistory = this.messageHistory.slice(-10);
    }
  }
}

export const messageHandler = new MessageHandler();
