import './style.css'
import ECS, { System } from './ecs';

const msgList = document.getElementById("msgs")
const logger = new System({ msg: null }, (ts, entity) => {
  if (entity.msg) {
    const msg = document.createElement('li');
    msg.append(`${ts}: ${entity.msg}`);
    msgList.append(msg);
    entity.msg = null;
  }
})

ECS.systems.push(logger);

const entity = { msg: null };
ECS.entities.push(entity);

ECS.start();

setTimeout(() => {
  entity.msg = 'one fish';
}, 0);

setTimeout(() => {
  entity.msg = 'two fish';
}, 100);

setTimeout(() => {
  entity.msg = 'red fish';
}, 200);

setTimeout(() => {
  entity.msg = 'blue fish';
}, 300);

const btn = document.getElementById('doit');
btn.addEventListener('click',()=>{
  entity.msg = "The Do It! button was clicked!";
})