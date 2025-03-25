// lib/betUtils.js
export async function generateBetSuggestion(games, probability) {
    // Lógica para gerar sugestões de apostas
    // Aqui você pode usar uma API ou uma lógica customizada para retornar as sugestões
    return {
      betSuggestion: {
        markets: [{ game: "Jogo 1", market: "Vencedor", odd: "1.50" }],
        composedOdd: "2.00",
        finalRecommendation: "Aposte com 80% de chance",
      },
    };
  }
  