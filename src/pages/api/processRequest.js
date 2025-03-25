// pages/api/processRequest.js
import { parseDate } from '../../lib/dateUtils';
import { generateBetSuggestion } from '../../lib/betUtils';
import { getGamesForDate } from '../../lib/apiClient';

export default async function handler(req, res) {
  const { message, probability } = req.body;

  try {
    // Interpretando a data solicitada
    const parsedDate = parseDate(message);
    if (!parsedDate) {
      return res.status(400).json({ message: 'Data inválida! Tente usar "hoje", "amanhã", "sábado", etc.' });
    }

    // Consulta os jogos da data interpretada
    const games = await getGamesForDate(parsedDate);
    if (games.length === 0) {
      return res.status(404).json({ message: 'Nenhum jogo encontrado para a data solicitada.' });
    }

    // Usando a probabilidade (default: 80%)
    const finalProbability = probability || 80;

    // Gera sugestão de apostas
    const betSuggestion = await generateBetSuggestion(games, finalProbability);
    res.status(200).json(betSuggestion);
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    res.status(500).json({ error: 'Erro interno ao processar o pedido.' });
  }
}
