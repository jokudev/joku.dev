import './style.css';
import { Terminal } from './terminal/Terminal';

const app = document.getElementById('app');
const input = document.getElementById('term-input') as HTMLInputElement | null;

if (!app || !input) {
  throw new Error('Terminal mount points missing.');
}

const terminal = new Terminal(app, input);
void terminal.boot();
