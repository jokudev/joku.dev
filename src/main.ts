import './style.css';
import { initAnalytics } from './analytics';
import { Terminal } from './terminal/Terminal';

initAnalytics();

const app = document.getElementById('app');
const input = document.getElementById('term-input') as HTMLInputElement | null;

if (!app || !input) {
  throw new Error('Terminal mount points missing.');
}

const terminal = new Terminal(app, input);
void terminal.boot();
