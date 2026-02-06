
const HUMAN = { ego:55, emotion:60, energy:70, focus:45, positivity:40, creativity:50, patience:50, courage:50 };
let visitedCards = [];
let board = [];
let cycle = 0;

function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function updateProgress(){
  let sum = HUMAN.focus+HUMAN.positivity+HUMAN.creativity+HUMAN.patience+HUMAN.courage+(100-HUMAN.ego)+(100-HUMAN.emotion)+HUMAN.energy;
  let progress=Math.floor(sum/8);
  document.querySelector('.progress-fill').style.width = progress + '%';
  if(progress>=100){ alert("🎉 Meta-transformation achieved!"); }
}

class Card{
  constructor(id,text,x,y,previous=null,previousChoice=null){
    this.id=id; this.text=text; this.x=x; this.y=y; this.previous=previous; this.previousChoice=previousChoice;
    this.isSecret=(previousChoice=="A" && Math.random()<0.3);
    this.module=Object.keys(HUMAN)[randomInt(0,7)];
    this.options={"A":{label:"Усърдно",value:randomInt(5,10)},"B":{label:"Малка стъпка",value:randomInt(2,6)},"C":{label:"Пропускам",value:randomInt(-5,0)}};
    if(this.isSecret) this.options["S"]={label:"Тайна стъпка",value:randomInt(8,12)};
    this.createElement();
  }
  createElement(){
    const container=document.getElementById('game-container');
    this.elem=document.createElement('div');
    this.elem.className='card'+(this.isSecret?' secret':'');
    this.elem.style.left=this.x+'px';
    this.elem.style.top=this.y+'px';
    this.elem.innerHTML=`<div class="card-text">${this.text}</div>`;
    for(let key in this.options){
      let btn=document.createElement('button');
      btn.className='button';
      btn.innerText=key;
      btn.onclick=()=>{this.selectOption(key);};
      this.elem.appendChild(btn);
    }
    container.appendChild(this.elem);
  }
  selectOption(key){
    HUMAN[this.module]=Math.min(100,Math.max(0,HUMAN[this.module]+this.options[key].value));
    visitedCards.push(this);
    generateBoard(this);
    updateProgress();
    updateMiniMap();
  }
}

function generateBoard(previousCard=null){
  const container=document.getElementById('game-container');
  container.querySelectorAll('.card').forEach(c=>{ if(!visitedCards.includes(c.cardRef)) c.remove(); });
  board=[];
  for(let i=0;i<4;i++){
    let x=randomInt(50,window.innerWidth-200);
    let y=randomInt(50,window.innerHeight-200);
    let questionText=i===0&&cycle===0?"Какво би направил при предизвикателство?":"Демо въпрос "+(i+1);
    let c=new Card(cycle*10+i,questionText,x,y,previousCard,previousCard?"A":null);
    c.elem.cardRef=c;
    board.push(c);
  }
}

function updateMiniMap(){
  const map=document.getElementById('mini-map'); map.innerHTML='';
  visitedCards.forEach(c=>{
    let dot=document.createElement('div');
    dot.style.position='absolute';
    dot.style.width='5px'; dot.style.height='5px';
    dot.style.background=c.isSecret?'orange':'blue';
    dot.style.left=(c.x*0.1)+'px';
    dot.style.top=(c.y*0.1)+'px';
    map.appendChild(dot);
  });
}

generateBoard();
updateProgress();
updateMiniMap();
