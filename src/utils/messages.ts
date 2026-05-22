import { MOTIVATIONAL_MESSAGES } from '../constants/messages';

export function pickMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
