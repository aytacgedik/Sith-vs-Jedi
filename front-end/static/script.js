const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width=800;
canvas.height=500;

let health, score, pid;

class Player {
    constructor(id,x,y,frameX,frameY,speed,moving=false,isAlive=0){
        this.keys = {};
        this.id = id;
        this.x = x;
        this.y = y;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
        this.moving = moving;
        this.width = 32.45;
        this.height = 48.675;
        this.fired={38:false,37:false,39:false,40:false};
        this.then = Date.now();
        this.fireballCooldown=5;
        this.isAlive=isAlive;
		this.health = 100;
    }
    makeMain(){
        let self=this;
		pid = this.id;
        this.isAlive=1;
        window.addEventListener("keydown",function(e){
            if(e.keyCode==69){
                let powersupIdd=-1;
                for(let i=0;i<powersup.length;i++){
                    if(self.x<powersup[i].x+20 & self.x>powersup[i].x-20 & self.y<powersup[i].y+20 & self.x>powersup[i].y-20){
                        powersupIdd=powersup[i].powersupId;
                        break;
                    }
                }
                if(powersupIdd!=-1){
                    fetch("/pickpowerup/"+self.id+"/"+powersupIdd, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({})
                    })
                        .then(response => response.json())
                        .then(data =>{}
                        )
                        .catch(error => console.error('Unable to add item.', error));
                }
                return;

            }
            if(e.keyCode<37 & e.keyCode>40 & !self.isAlive) return;
            if(!self.fired[e.keyCode]){
                self.fired[e.keyCode]=true;
                fetch("/keydown/"+self.id+"/"+e.keyCode, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                    .then(response => response.json())
                    .then(data =>{}
                    )
                    .catch(error => console.error('Unable to add item.', error));
        }});
        window.addEventListener("keyup",function(e){
            if(e.keyCode<37 & e.keyCode>40 & !self.isAlive) return;
            if(self.fired[e.keyCode]){
                self.fired[e.keyCode]=false;
                fetch("/keyup/"+self.id+"/"+e.keyCode, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                    .then(response => response.json())
                    .then(data =>{}
                    )
                    .catch(error => console.error('Unable to add item.', error));
        }});
        var bound = canvas.getBoundingClientRect();
        canvas.addEventListener("click",function(e){
            if(!self.isAlive) return;
            now = Date.now();
            elapsed = now - self.then;
			var x = e.clientX - (canvas.offsetLeft - window.pageXOffset);
			var y = e.clientY - (canvas.offsetTop - window.pageYOffset);
            if(elapsed>self.fireballCooldown){
                self.then=self.fireballCooldown;
                fetch("/fireball/"+self.id+"/"+x+"/"+y, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                    .then(response => response.json())
                    .then(data =>{}
                    )
                    .catch(error => console.error('Unable to add item.', error));
            }
        });
    }
    updatePlayer(keys,x, y, frameX, frameY, speed, moving,isAlive,health){
        this.keys=keys;
        this.x=x;
        this.y=y;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
        this.moving = moving;
        this.isAlive=isAlive;
		this.health = health;
    }
    
}


//const player = new Player(6969,150,250,0,0,6,false);
var players=[new Player(0,150,250,0,0,1),new Player(1,700,250,0,0,1)];
var fireballs=[];
var powersup=[];
//buraya if id exist condition'ı eklicez // aytac
fetch("/newplayer").then(response => response.json())
.then(Mplayer => players[parseInt(Mplayer['id'])].makeMain())
.catch(error => console.error('Unable to get items.', error));


const playerSprite = new Image();
playerSprite.src = "static/img/darthvader.png";
const playerSprite2 = new Image();
playerSprite2.src = "static/img/jedi.png";
const playerSprites=[playerSprite,playerSprite2];
const background = new Image();
background.src = "static/img/tmpBackground.jpg";
const fireballSprite = new Image();
fireballSprite.src = "static/img/fireball.png";
const potionSprite = new Image();
potionSprite.src = "static/img/health_potion.png";
const swordSprite = new Image();
swordSprite.src = "static/img/sword.png";

function drawHealthbar(x, y, per, width, thickness){
      ctx.beginPath();
      ctx.rect(x-width/2, y, width*(per/100), thickness);
      if(per > 63){
          ctx.fillStyle="green"
      }else if(per > 37){
          ctx.fillStyle="gold"
      }else if(per > 13){
        ctx.fillStyle="orange";
      }else{
        ctx.fillStyle="red";
      }
      ctx.closePath();
      ctx.fill();
    }
	
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
	//drawSprite(playerSprites[player.id],  player.width*player.frameX,player.height*player.frameY, player.width, player.height,
    //   player.x, player.y, player.width, player.height);}});
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawSpriteFireball(img, sX, sY, sAngle){
    ctx.translate(sX, sY);
    ctx.rotate(Math.PI / 180 * (sAngle + 90));
    ctx.translate(-sX, -sY);
   // ctx.drawImage(img, sX, sY,sAngle);
   ctx.drawImage(img, sX,sY, 20, 20);
   ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function drawStatus(health, score){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 275, 50);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("Health: "+health+" \nScore: "+score, 10, 30);
}
function drawSpritePotion(sX, sY){
   ctx.drawImage(potionSprite, sX,sY, 40, 40);
}
function drawSpriteSword(sX, sY){
    ctx.drawImage(swordSprite, sX,sY, 40, 40);
 }
 
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps){
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate()
}

//if player alive condtion eklenecek // aytac
function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        fetch("/player")
                .then(response => response.json())
                .then(data => {
                    data["players"].forEach(d=>{//fireballarda bu 'then'in icine eklenecek //aytac
                    players[parseInt(d.id)].updatePlayer(parseInt(d.keys),
                    parseInt(d.x),parseInt(d.y),parseInt(d.frameX),
                    parseInt(d.frameY), parseInt(d.speed),parseInt(d.moving),parseInt(d.isAlive),parseInt(d.health))
					if(parseInt(d.id) == pid){health = d.health;score=d.score;}
                });
                data["fireballs"].forEach(d=>{//fireballarda bu 'then'in icine eklenecek //aytac
                fireballs.push({"x":parseFloat(d.x),"y":parseFloat(d.y),"angle":parseFloat(d.angle)})
            });
            let pU=[];
            data["powerup"].forEach(d=>{//fireballarda bu 'then'in icine eklenecek //aytac
                pU.push({"x":parseFloat(d.x),"y":parseFloat(d.y),"powersupId":parseInt(d.powerupId),"type":d.type})
            });
            powersup=pU;
            })
                .then(()=>{   
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
						drawStatus(health, score);
                        //burada update edilcek bütün objectler // aytac
                        powersup.forEach(power=>{
                        if(power["type"]=="potion")
                            drawSpritePotion(power.x,power.y);
                        else
                            drawSpriteSword(power.x,power.y);} );
                        players.forEach(player=>{
                        if(player.isAlive){
							drawHealthbar(player.x+15, player.y-20, player.health, player.width, 10);
							drawSprite(playerSprites[player.id],  player.width*player.frameX,player.height*player.frameY, player.width, player.height,
								player.x, player.y, player.width, player.height);}});
                        fireballs.forEach(fireball=>
                            drawSpriteFireball(fireballSprite,fireball.x,fireball.y,fireball.angle));
                        fireballs=[];
						requestAnimationFrame(animate);
                        
                })
                .catch(error => {
					console.error('Unable to get items.5', error);
					window.stop();
					requestAnimationFrame(animate);
				});
    }
}

startAnimating(8);