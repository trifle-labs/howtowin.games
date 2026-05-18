// Hive — simplified hex-tile game. Pieces: Q(ueen), S(pider), B(eetle),
// G(rasshopper), A(nt). Win by surrounding the opponent's queen.
// Each type moves differently. AI uses distance-to-queen heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const D6 = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
  const HS = 28, LAB = { Q:"Q",S:"S",B:"B",G:"G",A:"A" };
  const ORD = ["G","G","A","S","B","Q"];

  function pk(q,r) { return q+","+r; }
  function hc(q,r) { return { x:W/2+HS*Math.sqrt(3)*(q+r/2), y:(H+20)/2+HS*1.5*r }; }
  function ot(s) { return s==="W"?"B":"W"; }
  function hd(q1,r1,q2,r2) { return (Math.abs(q1-q2)+Math.abs(q1+r1-q2-r2)+Math.abs(r1-r2))/2; }

  // ── state ─────────────────────────────────────────────────────────────────
  let pieces, rsv, qpd, turn, tn, win, sel, mvs, hov;
  function ng() {
    pieces=new Map(); rsv={W:[...ORD],B:[...ORD]}; qpd={W:false,B:false};
    turn="W"; tn=1; win=null; sel=null; mvs=[]; hov=null;
  }
  ng();

  function all() { return Array.from(pieces.values()); }
  function occ(q,r) { return pieces.has(pk(q,r)); }
  function own(q,r,o) { const p=pieces.get(pk(q,r)); return p&&p.owner===o; }
  function fq(o) { for(const p of all()) if(p.type==="Q"&&p.owner===o) return p; return null; }
  function peri(q,r) { for(const [a,b] of D6) if(occ(q+a,r+b)) return true; return false; }
  function adjOwn(q,r,o) { for(const [a,b] of D6) if(own(q+a,r+b,o)) return true; return false; }

  function hiveOk() {
    const a=all(); if(a.length<=1) return true;
    const s=new Set(), st=[pk(a[0].q,a[0].r)]; s.add(st[0]);
    while(st.length) { const [q,r]=st.pop().split(",").map(Number); for(const [a,b] of D6){const k=pk(q+a,r+b); if(pieces.has(k)&&!s.has(k)){s.add(k);st.push(k);}}}
    return s.size===a.length;
  }

  // ── placement ─────────────────────────────────────────────────────────────
  function vpl(o) {
    if(rsv[o].length===0) return [];
    const a=all();
    if(a.length===0) return [[0,0]];
    const c=new Map();
    for(const p of a) for(const [dq,dr] of D6) {
      const nq=p.q+dq,nr=p.r+dr,k=pk(nq,nr);
      if(!pieces.has(k)&&!c.has(k)&&adjOwn(nq,nr,o)) c.set(k,true);
    }
    return [...c.keys()].map(k=>k.split(",").map(Number));
  }

  // ── movement (type-specific) ──────────────────────────────────────────────
  function bf(q,r,ms) {
    const sk=pk(q,r), p=pieces.get(sk);
    if(!p) return [];
    const d=new Map(); d.set(sk,0); const qu=[[q,r]], out=[];
    while(qu.length) {
      const [cq,cr]=qu.shift(); const cd=d.get(pk(cq,cr));
      if(cd>0) out.push([cq,cr,cd]); if(ms>0&&cd>=ms) continue;
      for(const [dq,dr] of D6) {
        const nq=cq+dq,nr=cr+dr,nk=pk(nq,nr);
        if(d.has(nk)||pieces.has(nk)) continue;
        let on=false; for(const [a,b] of D6){const ak=pk(nq+a,nr+b);if(pieces.has(ak)&&ak!==sk){on=true;break;}}
        if(!on) continue; d.set(nk,cd+1); qu.push([nq,nr]);
      }
    }
    return out.filter(([tq,tr,s])=>{
      if(ms>0&&s!==ms) return false;
      const tk=pk(tq,tr); pieces.delete(sk); pieces.set(tk,{...p,q:tq,r:tr});
      const ok=hiveOk(); pieces.delete(tk); pieces.set(sk,p);
      return ok;
    }).map(([tq,tr])=>[tq,tr]);
  }
  function qm(p) { return bf(p.q,p.r,1); }
  function sm(p) { return bf(p.q,p.r,3); }
  function am(p) { return bf(p.q,p.r,-1); }
  function bm(p) {
    const out=[],sk=pk(p.q,p.r);
    for(const [dq,dr] of D6){
      const nq=p.q+dq,nr=p.r+dr,nk=pk(nq,nr);
      if(pieces.has(nk)) continue;
      if(!peri(nq,nr)) continue;
      pieces.delete(sk); pieces.set(nk,{...p,q:nq,r:nr});
      const ok=hiveOk(); pieces.delete(nk); pieces.set(sk,p);
      if(ok) out.push([nq,nr]);
    }
    return out;
  }
  function gm(p) {
    const out=[];
    for(const [dq,dr] of D6){
      let s=1,f=false;
      while(true){
        const nq=p.q+dq*s,nr=p.r+dr*s;
        if(pieces.has(pk(nq,nr))){f=true;s++;continue;}
        if(f) out.push([nq,nr]); break;
      }
    }
    return out;
  }

  function vm(q,r) {
    const p=pieces.get(pk(q,r));
    if(!p||p.owner!==turn) return [];
    if(p.type==="Q") return qm(p); if(p.type==="S") return sm(p);
    if(p.type==="B") return bm(p); if(p.type==="G") return gm(p);
    if(p.type==="A") return am(p); return [];
  }

  // ── win check ─────────────────────────────────────────────────────────────
  function chk() {
    for(const o of["W","B"]){const q=fq(o); if(!q) continue;
      let s=true; for(const [a,b] of D6) if(!pieces.has(pk(q.q+a,q.r+b))){s=false;break;}
      if(s) return o;
    } return null;
  }

  // ── AI ────────────────────────────────────────────────────────────────────
  function ai() {
    if(win) return; const o="B";
    let bs=-Infinity, ba=null;
    const pl=vpl(o);
    for(const [pq,pr] of pl){
      const t=rsv[o][rsv[o].length-1], sc=ev(pq,pr,o,t);
      if(sc>bs){bs=sc;ba={t:"p",q:pq,r:pr};}
    }
    for(const pp of all()) if(pp.owner===o) for(const [mq,mr] of vm(pp.q,pp.r)){
      const sc=ev(mq,mr,o,pp.type); if(sc>bs){bs=sc;ba={t:"m",pp,q:mq,r:mr};}
    }
    if(!ba){turn="W";draw();return;}
    if(ba.t==="p"){const t=rsv[o].pop(); pieces.set(pk(ba.q,ba.r),{type:t,owner:o,q:ba.q,r:ba.r}); if(t==="Q") qpd[o]=true;}
    else{const p=ba.pp; pieces.delete(pk(p.q,p.r)); pieces.set(pk(ba.q,ba.r),{...p,q:ba.q,r:ba.r});}
    const l=chk(); if(l==="B"){win="W";draw();return;} if(l==="W"){win="B";draw();return;}
    turn="W";tn++;draw();
  }

  function ev(q,r,o,t){
    const op=ot(o); let sc=0;
    const oq=fq(op); if(oq){const d=hd(q,r,oq.q,oq.r); sc+=(5-d)*8;}
    const mq=fq(o); if(mq){const d=hd(q,r,mq.q,mq.r); if(d<=1) sc+=6; if(d===0) sc-=20;}
    let sq=0,sr=0,c=0; for(const p of all()){sq+=p.q;sr+=p.r;c++;}
    if(c>0) sc+=(4-hd(q,r,Math.round(sq/c),Math.round(sr/c)))*2;
    if(t==="A") sc+=3; if(t==="B") sc+=2; return sc;
  }

  // ── drawing ───────────────────────────────────────────────────────────────
  function dh(cx,cy,r,fi,st,lw){
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.closePath(); if(fi){ctx.fillStyle=fi;ctx.fill();} if(st){ctx.strokeStyle=st;ctx.lineWidth=lw||1.5;ctx.stroke();}
  }

  function draw() {
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,W,H);
    const a=all();
    if(sel) for(const [mq,mr] of mvs){const c=hc(mq,mr); dh(c.x,c.y,HS*0.35,"rgba(46,204,113,0.4)","#2ecc71",2);}
    else if(turn==="W"&&!win) for(const [pq,pr] of vpl("W")){const c=hc(pq,pr); dh(c.x,c.y,HS*0.35,"rgba(46,204,113,0.25)","rgba(46,204,113,0.5)",1);}
    for(const p of a){
      const c=hc(p.q,p.r); const s=sel&&sel.q===p.q&&sel.r===p.r;
      const h=hov&&hov.q===p.q&&hov.r===p.r&&!sel;
      const f=p.owner==="W"?"#f0e6d0":"#3a3a3a";
      const st=s?"#f1c40f":h?"#3498db":p.owner==="W"?"#999":"#222";
      dh(c.x,c.y,HS*0.85,f,st,s?3:h?2.5:1.5);
      ctx.font="bold 16px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillStyle=p.owner==="W"?"#444":"#eee"; ctx.fillText(LAB[p.type]||p.type,c.x,c.y);
    }
    ctx.font="12px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText("Hive — surround the opponent's queen",W/2,12);
    ctx.font="10px sans-serif"; ctx.textAlign="left"; ctx.fillStyle="#888";
    ctx.fillText("W: "+rsv.W.join(""),8,H-6); ctx.fillText("B: "+rsv.B.join(""),W/2+4,H-6);
    if(win) statusEl.textContent=win==="W"?"you win — queen surrounded!":"AI wins — your queen surrounded!";
    else{
      const qn=!qpd.W&&tn>=4&&rsv.W.includes("Q");
      statusEl.textContent=turn==="W"?sel?"click green to move, else click to cancel":(qn?"MUST place queen! ":"")+"click green to place, or click your piece": "AI thinking…";
    }
  }

  // ── interaction ───────────────────────────────────────────────────────────
  function pe(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)};}

  function cl(e){
    if(win||turn!=="W") return;
    const{x,y}=pe(e);
    for(const p of all()) if(p.owner==="W"){const c=hc(p.q,p.r); if(Math.hypot(x-c.x,y-c.y)<=HS*0.85){
      if(sel&&sel.q===p.q&&sel.r===p.r){sel=null;mvs=[];draw();return;}
      sel={q:p.q,r:p.r};mvs=vm(p.q,p.r);draw();return;
    }}
    if(sel){for(const [mq,mr] of mvs){const c=hc(mq,mr);if(Math.hypot(x-c.x,y-c.y)<=HS*0.5){
      const p=pieces.get(pk(sel.q,sel.r)); pieces.delete(pk(sel.q,sel.r));
      pieces.set(pk(mq,mr),{...p,q:mq,r:mr}); sel=null; mvs=[];
      const l=chk(); if(l==="W"){win="B";draw();return;} if(l==="B"){win="W";draw();return;}
      turn="B";tn++;draw();setTimeout(ai,400);return;
    }}sel=null;mvs=[];draw();return;}
    for(const [pq,pr] of vpl("W")){const c=hc(pq,pr);if(Math.hypot(x-c.x,y-c.y)<=HS*0.5){
      const rsv2=rsv.W; if(rsv2.length===0) return;
      const idx=(!qpd.W&&tn>=4&&rsv2.includes("Q"))?rsv2.lastIndexOf("Q"):rsv2.length-1;
      const t=rsv2.splice(idx,1)[0]; pieces.set(pk(pq,pr),{type:t,owner:"W",q:pq,r:pr});
      if(t==="Q") qpd.W=true; sel=null;mvs=[];
      const l=chk(); if(l==="W"){win="B";draw();return;} if(l==="B"){win="W";draw();return;}
      turn="B";tn++;draw();setTimeout(ai,400);return;
    }}
  }

  function mm(e){
    if(win||turn!=="W"||sel) return;
    const{x,y}=pe(e); let f=null;
    for(const p of all()) if(p.owner==="W"){const c=hc(p.q,p.r);if(Math.hypot(x-c.x,y-c.y)<=HS*0.85){f=p;break;}}
    if(f!==hov){hov=f;draw();}
  }

  canvas.addEventListener("click",cl); canvas.addEventListener("mousemove",mm); draw();

  return {
    destroy(){canvas.removeEventListener("click",cl);canvas.removeEventListener("mousemove",mm);ctx.clearRect(0,0,W,H);},
    restart(){ng();draw();},
    solve(){
      if(win||turn!=="W") return;
      const vp=vpl("W");
      if(vp.length>0){const[pq,pr]=vp[Math.floor(Math.random()*vp.length)];const r2=rsv.W;if(r2.length>0){
        const idx=r2.length-1; const t=r2.splice(idx,1)[0]; pieces.set(pk(pq,pr),{type:t,owner:"W",q:pq,r:pr});
        if(t==="Q")qpd.W=true;sel=null;mvs=[];
        const l=chk();if(l==="W"){win="B";draw();return;}if(l==="B"){win="W";draw();return;}
        turn="B";tn++;draw();setTimeout(ai,80);return;
      }}
      for(const p of all()) if(p.owner==="W"){const mv=vm(p.q,p.r);if(mv.length>0){
        const[mq,mr]=mv[Math.floor(Math.random()*mv.length)];
        pieces.delete(pk(p.q,p.r)); pieces.set(pk(mq,mr),{...p,q:mq,r:mr});
        const l=chk();if(l==="W"){win="B";draw();return;}if(l==="B"){win="W";draw();return;}
        turn="B";tn++;draw();setTimeout(ai,80);return;
      }}
    }
  };
}
