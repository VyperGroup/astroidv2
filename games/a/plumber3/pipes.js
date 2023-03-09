var w,h,ratio,i,s,div,game,my={}
var grid={size:0,pipes:[],direction:{DOWN:2,LEFT:3,RIGHT:1,UP:0},reverse_direction:{2:0,3:1,1:3,0:2},init:function(size){if(size%2==false){console.log("Cannot create grid with even number of rows/columns");return;}
this.initPipes(size);this.buildPipes();this.scramblePipes();this.checkPipes();this.draw();},getPipe:function(x,y){if(typeof this.pipes[x]!=="undefined"&&typeof this.pipes[x][y]!=="undefined"){return this.pipes[x][y];}},getPipes:function(){var pipes=[];for(x in this.pipes){for(y in this.pipes[x]){pipes.push(this.getPipe(x,y));}}
return pipes;},initPipes:function(size){this.size=size;this.pipes=[];for(x=1;x<=size;x++){this.pipes[x]=[];for(y=1;y<=size;y++){pipe=new Pipe();pipe.x=x;pipe.y=y;this.pipes[x][y]=pipe;}}},buildPipes:function(){var total_pipes=this.size*this.size;var connected_pipes=[];var x=Math.ceil(this.size/2);var y=Math.ceil(this.size/2);pipe=this.getPipe(x,y);pipe.active=1;connected_pipes.push(pipe);while(connected_pipes.length<total_pipes){var pipe=connected_pipes[Math.floor(Math.random()*connected_pipes.length)];var direction=Math.floor(Math.random()*4);var neighbor=pipe.getNeighbour(direction);var reverse_direction=this.reverse_direction[direction];if(typeof neighbor!="undefined"&&neighbor.connections.indexOf(1)==-1){pipe.connections[direction]=1;neighbor.connections[reverse_direction]=1;connected_pipes.push(neighbor);}}},scramblePipes:function(){for(x=1;x<this.pipes.length;x++){for(y=1;y<this.pipes.length;y++){var pipe=this.getPipe(x,y);var random=Math.floor(Math.random()*4);for(i=0;i<random;i++){pipe.rotate();}}}},deactivatePipes:function(){for(x=1;x<this.pipes.length;x++){for(y=1;y<this.pipes.length;y++){this.getPipe(x,y).setActive(false);}}},checkPipes:function(){connected_pipes=[];pipes_to_check=[];this.deactivatePipes();var center_pipe=this.getPipe(Math.ceil(this.size/2),Math.ceil(this.size/2));center_pipe.setActive(true);connected_pipes.push(center_pipe);pipes_to_check.push(center_pipe);while(pipes_to_check.length>0){var pipe=pipes_to_check.pop();var x=pipe.x;var y=pipe.y
if(pipe.hasConnection(grid.direction.UP)){var pipe_above=this.getPipe(x-1,y);if(typeof pipe_above!=="undefined"&&pipe_above.hasConnection(grid.direction.DOWN)&&!pipe_above.isActive()){pipe_above.setActive(true);connected_pipes.push(pipe_above);pipes_to_check.push(pipe_above);}}
if(pipe.hasConnection(grid.direction.DOWN)){var pipe_below=this.getPipe(x+1,y);if(typeof pipe_below!=="undefined"&&pipe_below.hasConnection(grid.direction.UP)&&!pipe_below.isActive()){pipe_below.setActive(true);connected_pipes.push(pipe_below);pipes_to_check.push(pipe_below);}}
if(pipe.hasConnection(grid.direction.RIGHT)){var pipe_next=this.getPipe(x,y+1);if(typeof pipe_next!=="undefined"&&pipe_next.hasConnection(grid.direction.LEFT)&&!pipe_next.isActive()){pipe_next.setActive(true);connected_pipes.push(pipe_next);pipes_to_check.push(pipe_next);}}
if(pipe.hasConnection(grid.direction.LEFT)){var pipe_previous=this.getPipe(x,y-1);if(typeof pipe_previous!=="undefined"&&pipe_previous.hasConnection(grid.direction.RIGHT)&&!pipe_previous.isActive()){pipe_previous.setActive(true);connected_pipes.push(pipe_previous);pipes_to_check.push(pipe_previous);}}}
if(connected_pipes.length==(this.size*this.size)){console.log("Winner");success()}},save:function(){var data={};data.size=this.size;data.pipes=this.getPipes();save_data=JSON.stringify(data);if(typeof Storage!=="undefined"){localStorage.setItem("saved-game",save_data);}},load:function(){var save_data;if(typeof Storage!=="undefined"){save_data=localStorage.getItem("saved-game");}
if(save_data!==null){data=JSON.parse(save_data);grid.size=data.size;grid.pipes=[];for(p in data.pipes){var pipe=new Pipe();pipe.x=data.pipes[p].x;pipe.y=data.pipes[p].y;pipe.connections=data.pipes[p].connections;pipe.active=data.pipes[p].active;if(typeof grid.pipes[pipe.x]=="undefined"){grid.pipes[pipe.x]=[];}
grid.pipes[pipe.x][pipe.y]=pipe;}
grid.checkPipes();grid.draw();}},draw:function(){var grid_div=document.getElementById("grid");grid_div.innerHTML='';for(x in this.pipes){var row=this.pipes[x];var row_div=document.createElement('div');row_div.className="gridrow";for(y in row){var pipe=row[y];var pipe_div=document.createElement('div');pipe_div.className="pipe";pipe_div.setAttribute('data-x',x);pipe_div.setAttribute('data-y',y);pipe_div.setAttribute('onClick','rotatePipe(this)');if(pipe.connections[0]===1){pipe_div.className+=" u";}
if(pipe.connections[1]===1){pipe_div.className+=" r";}
if(pipe.connections[2]===1){pipe_div.className+=" d";}
if(pipe.connections[3]===1){pipe_div.className+=" l";}
if(pipe.active==1){pipe_div.className+=" a";}
row_div.appendChild(pipe_div);}
grid_div.appendChild(row_div);}}};function pipesMain(){my.version='0.5'
console.log('pipesMain');w=360
h=60
var s=''
s+='<style>'
s+='.clickbtn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.clickbtn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='</style>'
s+='<div id="main" style="position:relative; min-width:'+w+'px; min-height:'+h+'px; background-color: hsl(240,0%,22%); border: 1px outset black; margin:auto; display:block; border-radius: 10px;">'
s+='<div id="grid" style="position:relative; margin: 10px; text-align: center;">'
s+='</div>'
s+='<div id="success" style="position:relative; margin: 10px; text-align: center; font:bold 22px Arial; color: goldenrod;">'
s+='Solved!<br>Well Done!<br>'
s+='</div>'
s+='<div style="font: 15px Arial; text-align: center; margin: 20px auto 5px auto; width:360px; padding:5px; background-color: hsl(240,50%,25%); border-radius:10px; border: 1px inset black; color:hsl(240,100%,80%); ">'
my.hards=[{title:'Small',len:5},{title:'Normal',len:7},{title:'Hard',len:9},{title:'Tough',len:11}];s+=radioHTML('','hard',my.hards,'')
s+='<br>'
s+='<input id="newBtn" type="button" class="clickbtn" style="text-align:left;margin: 4px;" value="New Game" onclick="gameNew()" />';s+='</div>'
s+='<div id="gamecnt" style="position:relative; font:bold 22px Arial; color: goldenrod; text-align:right; padding-right:24px; float:right;">'
s+='</div>'
s+='<div id="copyrt" style="font: 11px Arial; color: #ffcccc; position:relative; text-align:left;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>'
s+='</div>'
document.write(s)
document.getElementById('success').style.display='none'}
function success(){document.getElementById('success').style.display='block'}
function gameNew(){document.getElementById('success').style.display='none'
var len=0
var title=document.querySelector('input[name="hard"]:checked').value
for(var i=0;i<my.hards.length;i++){if(my.hards[i].title==title){len=my.hards[i].len}}
console.log('gameNew',len,title)
grid.init(len);}
function rotatePipe(element){var x=element.dataset.x;var y=element.dataset.y;grid.getPipe(x,y).rotate();grid.checkPipes();grid.draw();}
function Pipe(){this.x=0;this.y=0;this.active=0;this.connections=Array.apply(null,new Array(4)).map(Number.prototype.valueOf,0);this.isActive=function(){return this.active===1;};this.setActive=function(active){this.active=(active?1:0);};this.getNeighbour=function(direction){var dx=0;var dy=0;if(direction==grid.direction.RIGHT){dx=1;}else if(direction==grid.direction.LEFT){dx=-1;}
if(direction==grid.direction.UP){dy=1;}else if(direction==grid.direction.DOWN){dy=-1;}
return grid.getPipe(this.x+dx,this.y+dy);};this.hasConnection=function(direction){return this.connections[direction]===1;};this.rotate=function(){this.connections.splice(0,0,this.connections.splice((this.connections.length-1),1)[0]);}};function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block;">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.title+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.title+' </label>';}
s+='</div>';return s;}