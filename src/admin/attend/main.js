import { AttendList } from './components';
import './styles/style.css';

const app = () => {
  init();
  route();
}

const init = async () => {
  const section = document.querySelector(`.main-content`);

  section.innerHTML = await AttendList();

  window.addEventListener('popstate', route);
}

const route = () => {
  const content = document.querySelector('#content');

}

document.addEventListener('DOMContentLoaded', app); 