// Chess — 8x8 board, standard rules. You play white; AI plays black.
// All special moves: castling, en passant, pawn promotion (auto-queen).
// AI uses minimax with alpha-beta (depth 1) + material/positional eval.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = size + 60;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Unicode chess symbols
  const GLYPHS = {
    'w': { 'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙' },
    'b': { 'K':'♚','Q':'♛','R':'♜','B':'♝','N':'♞','P':'♟' },
  };

  let board, turn, winner, selected, legalMoves, castlingRights, epSquare;
  let moveLog;

  function initBoard() {
    const b = Array.from({length:8}, () => Array(8).fill(null));
    const back = ['R','N','B','Q','K','B','N','R'];
    for (let c=0;c<8;c++){ b[0][c]={type:back[c],color:'b'}; b[1][c]={type:'P',color:'b'}; }
    for (let c=0;c<8;c++){ b[6][c]={type:'P',color:'w'}; b[7][c]={type:back[c],color:'w'}; }
    return b;
  }
  function newGame(){
    board=initBoard(); turn='w'; winner=null; selected=null; legalMoves=[]; moveLog=[];
    castlingRights={'w':{K:true,Q:true},'b':{K:true,Q:true}}; epSquare=null;
  }
  newGame();

  function cloneBoard(b){ return b.map(r=>r.map(p=>p?{...p}:null)); }
  function inBounds(r,c){ return r>=0&&r<8&&c>=0&&c<8; }

  function findKing(b,color){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]&&b[r][c].type==='K'&&b[r][c].color===color) return{r,c};
    return null;
  }

  function isAttacked(b,row,col,byColor){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(!p||p.color!==byColor) continue;
      const attacks=pseudoMoves(b,r,c);
      for(const m of attacks) if(m.tr===row&&m.tc===col) return true;
    }
    return false;
  }
  function inCheck(b,color){
    const k=findKing(b,color); return k&&isAttacked(b,k.r,k.c,color==='w'?'b':'w');
  }

  function pseudoMoves(b,r,c){
    const p=b[r][c]; if(!p) return [];
    const {type,color}=p; const enemy=color==='w'?'b':'w';
    const moves=[];

    const add=(tr,tc,flags={})=>{
      if(!inBounds(tr,tc)) return false;
      const t=b[tr][tc];
      if(t&&t.color===color) return false;
      moves.push({fr:r,fc:c,tr,tc,capture:!!t,...flags});
      return !t;
    };

    if(type==='P'){
      const dir=color==='w'?-1:1; const sr=color==='w'?6:1;
      if(inBounds(r+dir,c)&&!b[r+dir][c]){
        moves.push({fr:r,fc:c,tr:r+dir,tc:c});
        if(r===sr&&!b[r+2*dir][c]) moves.push({fr:r,fc:c,tr:r+2*dir,tc:c,epFlag:true});
      }
      for(const dc of[-1,1]){
        const tr=r+dir,tc=c+dc;
        if(!inBounds(tr,tc)) continue;
        if(b[tr][tc]&&b[tr][tc].color===enemy) moves.push({fr:r,fc:c,tr,tc,capture:true});
        if(epSquare&&epSquare.r===tr&&epSquare.c===tc) moves.push({fr:r,fc:c,tr,tc,epCap:true});
      }
    } else if(type==='N'){
      for(const[dr,dc] of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc);
    } else if(type==='B'){
      for(const[dr,dc] of[[-1,-1],[-1,1],[1,-1],[1,1]]) for(let i=1;i<8;i++) if(!add(r+i*dr,c+i*dc)) break;
    } else if(type==='R'){
      for(const[dr,dc] of[[-1,0],[1,0],[0,-1],[0,1]]) for(let i=1;i<8;i++) if(!add(r+i*dr,c+i*dc)) break;
    } else if(type==='Q'){
      for(const[dr,dc] of[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]])
        for(let i=1;i<8;i++) if(!add(r+i*dr,c+i*dc)) break;
    } else if(type==='K'){
      for(const[dr,dc] of[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) add(r+dr,c+dc);
    }
    return moves;
  }

  function castlingMoves(b,r,c,color){
    const moves=[]; const kr=color==='w'?7:0;
    if(r!==kr||c!==4) return moves;
    const enemy=color==='w'?'b':'w';
    const rights=castlingRights[color];
    if(!rights.K&&!rights.Q) return moves;
    if(inCheck(b,color)) return moves;
    if(rights.K){
      const rook=b[kr][7];
      if(rook&&rook.type==='R'&&rook.color===color&&!b[kr][5]&&!b[kr][6]){
        if(!isAttacked(b,kr,5,enemy)&&!isAttacked(b,kr,6,enemy))
          moves.push({fr:kr,fc:4,tr:kr,tc:6,castle:'K'});
      }
    }
    if(rights.Q){
      const rook=b[kr][0];
      if(rook&&rook.type==='R'&&rook.color===color&&!b[kr][1]&&!b[kr][2]&&!b[kr][3]){
        if(!isAttacked(b,kr,3,enemy)&&!isAttacked(b,kr,2,enemy))
          moves.push({fr:kr,fc:4,tr:kr,tc:2,castle:'Q'});
      }
    }
    return moves;
  }

  function applyMove(b,m){
    const p=b[m.fr][m.fc];
    b[m.tr][m.tc]=p; b[m.fr][m.fc]=null;
    if(m.epCap) b[m.fr][m.tc]=null;
    if(m.castle==='K'){ b[m.tr][5]=b[m.tr][7]; b[m.tr][7]=null; }
    else if(m.castle==='Q'){ b[m.tr][3]=b[m.tr][0]; b[m.tr][0]=null; }
    if(p.type==='P'&&(m.tr===0||m.tr===7)) b[m.tr][m.tc]={type:'Q',color:p.color};
  }

  function legalMovesFor(b,r,c){
    const p=b[r][c]; if(!p) return [];
    let moves=pseudoMoves(b,r,c);
    if(p.type==='K') moves=moves.concat(castlingMoves(b,r,c,p.color));
    return moves.filter(m=>{
      const nb=cloneBoard(b); applyMove(nb,m); return !inCheck(nb,p.color);
    });
  }

  function allLegalMoves(b,color){
    const all=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
      if(b[r][c]&&b[r][c].color===color) all.push(...legalMovesFor(b,r,c));
    return all;
  }

  // --- AI evaluation and search ---
  const PV = { 'P':100,'N':320,'B':330,'R':500,'Q':900,'K':20000 };

  // Piece-square tables (white perspective, from row 7 to 0)
  const PST = {
    'P':[ [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
          [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0] ],
    'N':[ [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],
          [-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
          [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50] ],
    'B':[ [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],
          [-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,10,5,10,10,5,10,-10],
          [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20] ],
    'R':[ [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
          [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0] ],
    'Q':[ [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],
          [-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
          [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20] ],
    'K':[ [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
          [-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
          [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20] ],
  };

  function evalBoard(b){
    let score=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(!p) continue;
      const v=PV[p.type]+(PST[p.type]?PST[p.type][r][c]:0);
      score+=p.color==='w'?v:-v;
    }
    return score;
  }

  function orderMoves(moves,b){
    return moves.sort((a,m2)=>{
      let scoreA=0, scoreB=0;
      const capA=a.capture?PV[b[a.tr][a.tc]?.type||0]:0;
      const capB=m2.capture?PV[b[m2.tr][m2.tc]?.type||0]:0;
      return capB-capA;
    });
  }

  function minimax(b,depth,alpha,beta,isMax){
    if(depth===0) return evalBoard(b);
    const color=isMax?'w':'b';
    const moves=orderMoves(allLegalMoves(b,color),b);
    if(!moves.length){
      if(inCheck(b,color)) return isMax?-99999+depth:99999-depth; // checkmate
      return 0; // stalemate
    }
    if(isMax){
      let best=-Infinity;
      for(const m of moves){
        const nb=cloneBoard(b); applyMove(nb,m); const val=minimax(nb,depth-1,alpha,beta,false);
        best=Math.max(best,val); alpha=Math.max(alpha,val); if(beta<=alpha) break;
      }
      return best;
    } else {
      let best=Infinity;
      for(const m of moves){
        const nb=cloneBoard(b); applyMove(nb,m); const val=minimax(nb,depth-1,alpha,beta,true);
        best=Math.min(best,val); beta=Math.min(beta,val); if(beta<=alpha) break;
      }
      return best;
    }
  }

  function aiSearch(){
    const moves=allLegalMoves(board,'b');
    if(!moves.length) return null;
    let bestMove=moves[0], bestVal=Infinity;
    for(const m of moves){
      const nb=cloneBoard(board); applyMove(nb,m);
      const val=minimax(nb,1,-Infinity,Infinity,true);
      if(val<bestVal){ bestVal=val; bestMove=m; }
    }
    return bestMove;
  }

  function aiMove(){
    if(winner) return;
    const m=aiSearch();
    if(!m){ winner='you'; draw(); return; }
    applyMove(board,m); const lastMove={fr:m.fr,fc:m.fc,tr:m.tr,tc:m.tc};
    moveLog.push(lastMove);
    updateStateAfterMove('b',lastMove);
    draw();
    if(!winner) turn='w';
  }

  function updateStateAfterMove(color, lastMove){
    const enemy=color==='w'?'b':'w';
    // Update en passant square
    epSquare=null;
    if(lastMove){
      const {fr,tr,fc}=lastMove;
      const p=board[tr][fc];
      if(p&&p.type==='P'&&Math.abs(tr-fr)===2) epSquare={r:(fr+tr)/2,c:fc};
    }
    // Update castling rights
    castlingRights['w'].K=castlingRights['w'].K&&board[7][4]?.type==='K'&&board[7][4]?.color==='w';
    castlingRights['w'].Q=castlingRights['w'].Q&&board[7][4]?.type==='K'&&board[7][4]?.color==='w';
    castlingRights['b'].K=castlingRights['b'].K&&board[0][4]?.type==='K'&&board[0][4]?.color==='b';
    castlingRights['b'].Q=castlingRights['b'].Q&&board[0][4]?.type==='K'&&board[0][4]?.color==='b';
    // Rook moved
    if(color==='w'){ castlingRights['w'].K=castlingRights['w'].K&&board[7][7]?.type==='R'; castlingRights['w'].Q=castlingRights['w'].Q&&board[7][0]?.type==='R'; }
    else{ castlingRights['b'].K=castlingRights['b'].K&&board[0][7]?.type==='R'; castlingRights['b'].Q=castlingRights['b'].Q&&board[0][0]?.type==='R'; }

    const enemyMoves=allLegalMoves(board,enemy);
    if(inCheck(board,color)){
      if(!enemyMoves.length){ winner=color==='w'?'you':'ai'; return; }
    } else if(!enemyMoves.length){ winner='draw'; return; }
    // Insufficient material
    const pieces=[]; for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]) pieces.push(board[r][c]);
    if(pieces.length===2){ winner='draw'; return; } // K vs K
    if(pieces.length===3&&pieces.some(p=>p.type==='B'||p.type==='N')){ winner='draw'; return; } // K+B vs K or K+N vs K
    // K+B+B vs K with same-color bishops is draw, but skip that edge case
  }

  // --- Rendering ---
  function cellRect(r,c){
    const m=12; const cs=(size-2*m)/8;
    return {x:m+c*cs,y:40+r*cs,w:cs,h:cs};
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText("Chess — you are white; AI is black", size/2, 20);

    const cs=(size-24)/8;
    const lastM=moveLog.length?moveLog[moveLog.length-1]:null;

    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const rc={x:12+c*cs,y:40+r*cs,w:cs,h:cs};
      const light=(r+c)%2===0;
      ctx.fillStyle=light?"#f0d9b5":"#b58863";
      ctx.fillRect(rc.x,rc.y,rc.w,rc.h);
      // Last move highlight
      if(lastM){
        if((r===lastM.fr&&c===lastM.fc)||(r===lastM.tr&&c===lastM.tc)){
          ctx.fillStyle="rgba(255,255,0,0.25)"; ctx.fillRect(rc.x,rc.y,rc.w,rc.h);
        }
      }
      // Selected highlight
      if(selected&&selected.r===r&&selected.c===c){
        ctx.fillStyle="rgba(255,255,0,0.4)"; ctx.fillRect(rc.x,rc.y,rc.w,rc.h);
      }
      // Legal move dots
      if(legalMoves.some(m=>m.tr===r&&m.tc===c)){
        const isCap=board[r][c]!==null;
        if(isCap){
          ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=3;
          ctx.strokeRect(rc.x+3,rc.y+3,rc.w-6,rc.h-6);
        } else {
          ctx.beginPath(); ctx.arc(rc.x+rc.w/2,rc.y+rc.h/2,5,0,Math.PI*2);
          ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fill();
        }
      }
      // Piece
      const p=board[r][c];
      if(p){
        ctx.fillStyle="#1a1a1a"; ctx.font=`${Math.floor(cs*0.75)}px "Segoe UI Symbol","Apple Symbols",sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(GLYPHS[p.color][p.type],rc.x+rc.w/2,rc.y+rc.h/2+2);
        ctx.textBaseline="alphabetic";
      }
    }

    // File labels
    ctx.fillStyle="#666"; ctx.font="11px sans-serif"; ctx.textAlign="center";
    for(let c=0;c<8;c++) ctx.fillText("abcdefgh"[c],12+c*cs+cs/2,38);
    // Rank labels
    ctx.textAlign="right";
    for(let r=0;r<8;r++) ctx.fillText(String(8-r),8,40+r*cs+cs/2+4);

    if(winner==='draw') statusEl.textContent="draw";
    else if(winner==='you') statusEl.textContent="you win!";
    else if(winner==='ai') statusEl.textContent="AI wins!";
    else if(turn==='b') statusEl.textContent="AI thinking…";
    else if(selected) statusEl.textContent="click a green dot to move, or click another white piece";
    else statusEl.textContent="select a white piece to see moves";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function cellAt(x,y){
    const cs=(size-24)/8;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const rc={x:12+c*cs,y:40+r*cs,w:cs,h:cs};
      if(x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return{r,c};
    }
    return null;
  }

  function onClick(e){
    if(winner||turn!=='w') return;
    const {x,y}=clickPos(e); const cell=cellAt(x,y);
    if(!cell) return;
    const p=board[cell.r][cell.c];
    // Click on own piece -> select
    if(p&&p.color==='w'){ selected=cell; legalMoves=legalMovesFor(board,cell.r,cell.c); draw(); return; }
    // Click on legal move -> make it
    const m=legalMoves.find(mv=>mv.tr===cell.r&&mv.tc===cell.c);
    if(m){
      applyMove(board,m); const lastMove={fr:m.fr,fc:m.fc,tr:m.tr,tc:m.tc};
      moveLog.push(lastMove);
      selected=null; legalMoves=[];
      updateStateAfterMove('w',lastMove);
      draw();
      if(!winner){ turn='b'; setTimeout(aiMove,400); }
    } else { selected=null; legalMoves=[]; draw(); }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); },
    restart(){ newGame(); draw(); },
    solve(){
      if(winner||turn!=='w') return;
      // Heuristic: capture highest-value piece if possible, else random.
      // Find all legal moves for the user (solve ignores current selection)
      const allMoves=allLegalMoves(board,'w');
      if(!allMoves.length) return;
      // Greedy: capture highest-value piece if possible, else random
      let m=allMoves[0];
      const captures=allMoves.filter(mv=>mv.capture);
      if(captures.length) captures.sort((a,b)=>(PV[board[b.tr][b.tc]?.type]||0)-(PV[board[a.tr][a.tc]?.type]||0));
      m=captures.length?captures[0]:allMoves[Math.floor(Math.random()*allMoves.length)];
      applyMove(board,m); const lastMove={fr:m.fr,fc:m.fc,tr:m.tr,tc:m.tc};
      moveLog.push(lastMove);
      selected=null; legalMoves=[];
      updateStateAfterMove('w',lastMove);
      draw();
      if(!winner){ turn='b'; setTimeout(aiMove,400); }
    },
  };
}
