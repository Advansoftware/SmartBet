// lib/dateUtils.js
import { parse, nextSaturday, format } from 'date-fns';

export function parseDate(message) {
  const today = new Date();

  if (message.toLowerCase().includes('hoje')) {
    return today;
  }

  if (message.toLowerCase().includes('amanhã')) {
    return new Date(today.setDate(today.getDate() + 1)); // Adiciona 1 dia
  }

  if (message.toLowerCase().includes('sábado')) {
    return nextSaturday(today); // Retorna o próximo sábado
  }

  const dateMatch = message.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
  if (dateMatch) {
    return parse(dateMatch[0], 'dd/MM/yyyy', new Date());
  }

  return null; // Se a data não for reconhecida
}
