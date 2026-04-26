import { CONTENT } from '../../data/content';
import type { CommandHandler } from './types';

export const whoami: CommandHandler = () => {
  return [
    { text: CONTENT.about.bio },
    { text: '' },
    { text: `Standort: ${CONTENT.user.location}` },
    { text: `Geburtsjahr: ${CONTENT.user.birth}` },
    { html: `GitHub: <a href="${CONTENT.user.github}" target="_blank" rel="noreferrer">${CONTENT.user.github}</a>` },
  ];
};
