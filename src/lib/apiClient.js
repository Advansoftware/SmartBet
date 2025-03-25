import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = 'https://api.sportmonks.com/v3/football';
const API_TOKEN = 'pV71mgQlSaJ4cNY8R78w7Wga2IemTuAWEBNBWfAHR5LteWKm1uCJFIKbVSLP'; // Substitua pelo seu token de API

export async function getGamesForDate(date) {
  const formattedDate = format(date, 'yyyy-MM-dd');
  try {
    const response = await axios.get(`${API_BASE_URL}/fixtures/date/${formattedDate}`, {
      
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os jogos:', error);
    throw error;
  }
}
