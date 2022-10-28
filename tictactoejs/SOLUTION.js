
/**
 * SOLUTION
 * SCROLL FOR SPOILERS
 */


const canv = document.getElementById("screen");
const ctx = canv.getContext("2d");

const announcer = document.getElementById("announce");



//game constants
const board_size = 3;
const win_size = 3;
const playerone = 1;
const playertwo = 2;
let current = 1;
let isWon = false;
const maxDepth = 10
//the algorithm is exas | player 2

//fill the board with state zero
const state = [];
for(let i = 0; i <board_size * board_size;i++){
    state.push(0);
}

//screen pixel density
const ratio = window.devicePixelRatio;
//adjust size when size changed
const observer = new ResizeObserver(redraw);
observer.observe(canv);
//listens to the mouse over the object
canv.addEventListener("mousedown",goplay);
//key listener to restart the game
window.addEventListener("keydown",keylistener);
//redraws when screen size changs
function redraw(){
    canv.height = ratio * window.innerWidth * .99;
    canv.width = ratio * window.innerWidth * .99;
    drawBoard();

}
//draw the current state of the game
function drawBoard(){
    const bRatio = canv.width / board_size;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    for(let i = 1; i < board_size;i++){
        ctx.moveTo(bRatio * i,canv.height);
        ctx.lineTo(bRatio * i,0);
        ctx.moveTo(canv.width,bRatio * i);
        ctx.lineTo(0,bRatio * i);
    }
    ctx.stroke();
    ctx.restore();

    //draw pieces
    state.map((d,i)=>{
        const midx = (i % 3) * bRatio + bRatio / 2
        const midy = Math.floor(i / 3) * bRatio + bRatio / 2
        if(d == 1){
            ctx.save();
            ctx.beginPath();
            ctx.arc(
                midx,
                midy,
                (bRatio / 2) * .9,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.restore();
        }
        if(d == 2){
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 4
            const dec = 4
            ctx.moveTo(
                midx - .4 * bRatio * Math.cos(Math.PI / dec),
                midy - .4 * bRatio * Math.sin(Math.PI / dec)
            );
            ctx.lineTo(
                midx + .4 * bRatio * Math.cos(Math.PI / dec),
                midy + .4 * bRatio * Math.sin(Math.PI / dec)
            );
            ctx.moveTo(
                midx + .4 * bRatio * Math.cos(Math.PI / dec),
                midy - .4 * bRatio * Math.sin(Math.PI / dec)
            );
            ctx.lineTo(
                midx - .4 * bRatio * Math.cos(Math.PI / dec),
                midy + .4 * bRatio * Math.sin(Math.PI / dec)
            );
            ctx.stroke();
            ctx.restore();
        }
    })
    //anounce who won if any
    const aname = current == playerone ? "Exas" : "Circle"
    const turn = current == playerone ? "Circle" : "Exas"
    if(isWon){
        announcer.textContent = `player ${aname} has won`;
    }else if(isFull(state)){
        announcer.textContent = "No one has won, Tie"
    }else {
        announcer.textContent = `player ${turn} Turn`;
    }
}
//gets mouse position
function getMousePos(acanv, evt) {
    const rect = canv.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * acanv.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * acanv.height,
    };
};
//when we click on the screen
function goplay(e){
    if(isWon || isFull(state)) return;
    const bRatio = canv.width / board_size;
    const {x,y} = getMousePos(canv,e);
    const posx = Math.floor(x / bRatio);
    const posy = Math.floor(y / bRatio);
    //make sure clicked space is empty
    if(state[posy * board_size + posx] == 0 ){
        state[posy * board_size + posx] = current;
        isWon = calcwin(state,current);
        current = current == playerone ? playertwo : playerone;
    }
    
    
    drawBoard();
    if(!isWon && !isFull(state)){
        //aiTurn()
        //time out if algorithm is too fast and you want to see it think
        setTimeout(()=>{aiTurn()},0);
    }
}
//the ai turn
function aiTurn(){
    const bestmove = findMove(state,playertwo,playerone,playertwo,maxDepth);
    console.log(bestmove);
    state[bestmove] = playertwo;
    isWon = calcwin(state,current);
    current = current == playerone ? playertwo : playerone;
    drawBoard();
}

/*                           Fill This Function In                   */
/*
const board_size = 3;
const win_size = 3;
const playerone = 1;
const playertwo = 2;
let current = 1;
let isWon = false;
const maxDepth = 10
*/

/**
 * This should return the location from 0-board_size ^ 2 - 1
 * Some constraints
 * This function will always have atleast one spot open to be used
 * to calculate current board state use calcwin
 * it will always start with it being the robot turn
 * 
 * You will need to use CalcWin function which takes in an 1 dimension array
 * of the current state of the board and a player
 * 
 * You will need to use the isFull function which takes in a 1 dimensional
 * array(the board state)
 * 
 * Press R to restart
 * 
 * @param aState -> a 1 dimensional array of the current board
 * @param robot -> a numeric value depicting the a.i. board number
 * @param enemy -> the players value depicting the a.i. board number
 * @param aturn -> the current persons turn
 * @param depth -> the tree depth limit
 * 
 * @returns -> A valid index in which the ai can play
 * 
 * @constraint -> There will always be atleast 1 spot the player can use
 */
function findMove(aState,robot,enemy,aturn,depth){
    const vals = [];

    //fill in the board
    for(let i = 0; i < board_size * board_size; i++){
        //duplicate the board
        const newBoard = [...aState];
        //there is no piece here
        if(newBoard[i] == 0){
            newBoard[i] = aturn;
            const eval = calcwin(newBoard,aturn);
            const tie = isFull(newBoard);
            if(eval && aturn == robot){
                vals.push(-1);
            }else if(eval && aturn == enemy){
                vals.push(1);
            }else if(tie){
                vals.push("full");
            }else {
                const swtiched = aturn == robot ? enemy : robot;
                if(depth == 0){
                    vals.push(0);
                }else{
                    vals.push(findMove(newBoard,robot,enemy,swtiched,depth - 1));
        
                }
            }
        }else{
            //there is a piece here
            vals.push("full");
        }

        const filtered = vals.filter(word => typeof(word) == 'number');

        //evaluate the board
        if(depth != maxDepth && i == board_size * board_size - 1){
            //return some value
            //run at the end of the for.
            //return the value of this spot
            if(aturn == robot){
                return Math.min(...filtered);
            }
            if(aturn == enemy){
                return Math.max(...filtered);
            }
            return 0;
        }
    }
    //depts is zero !
    const filtered = vals.filter(word => typeof(word) == 'number');
    return vals.indexOf(Math.min(...filtered));

}

//reset the game state
function keylistener(e){
    if(e.keyCode == 82){
        for(let i = 0; i < board_size * board_size;i++){
            state[i] = 0;
            current = playerone;
        };
        ctx.clearRect(0,0,canv.width,canv.height);
        isWon = false;
        drawBoard();
    }
}

//calculate all possibly ways to win
function calcwin(astate,player){
    const c1 = calcVertical(astate,player);
    const c2 = calcHorizontal(astate,player);
    const c3 = calcDiag(astate,player);
    const c4 = calcOtherDiag(astate,player);
    return c1 || c2 || c3 || c4;
}
function isFull(astate){
    const c5 = astate.indexOf(0) == -1;
    return c5;
}

//horizontal but sideways
function calcVertical(astate,player){
    for(let i = 0; i < board_size;i++){
        let count = 0;
        for(let j = 0; j < board_size;j++){
            if(astate[board_size * j + i] == player){
                count += 1;
            }else{
                count = 0;
            }
            if(count >= win_size){
                return true;
            }
        }
    }
    return false;
}

//horizontal win
function calcHorizontal(astate,player){
    for(let i = 0; i < board_size;i++){
        let count = 0;
        for(let j = 0; j < board_size;j++){
            if(astate[board_size * i + j] == player){
                count += 1;
            }else{
                count = 0;
            }
            if(count >= win_size){
                return true;
            }
        }
    }
    return false;
}

//diaganol win
function calcDiag(astate,player){
    //top row
    for(let i = 0; i < board_size;i++){
        let count = 0;
        for(let j = 0; j < board_size - i; j++){
            if(board_size - i < win_size) continue;
            
            const idx = i + (board_size + 1) * j;
            if(astate[idx] == player) count += 1;

            if(count >= win_size)return true;
        }
    }
    //down row
    for(let i = 0; i < board_size - 1;i++){
        let count = 0;
        for(let j = 0; j < board_size - i; j++){
            if(board_size - i < win_size) continue;
            
            const idx = i * board_size + (board_size + 1) * j;
            if(astate[idx] == player) count += 1;

            if(count >= win_size)return true;
        }
    }

    return false;

}

//flip the diaganal along
function calcOtherDiag(astate,player){
    //flip on the y axis
    const new_state = [];
    for(let i = 0; i < board_size * board_size;i++){
        let idx = parseInt(i / board_size) * board_size;
        idx += ((board_size - 1) - (i % board_size));
        new_state.push(astate[idx]);
    }
    return calcDiag(new_state,player);
}

drawBoard();