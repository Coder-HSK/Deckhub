import { useState } from "react";

// ─── CARD ENGINE ─────────────────────────────────────────────────────
const SUITS = ['♠','♥','♦','♣'];
const VALS  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function mkDeck() {
  const d = [];
  for (const s of SUITS) for (const v of VALS) d.push({ s, v, id:`${s}${v}-${Math.random()}` });
  return shuffle(d);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function faceVal(v) {
  if (['J','Q','K'].includes(v)) return 10;
  if (v === 'A') return 11;
  return +v;
}
function calcHand(cards) {
  let t=0, aces=0;
  for (const c of cards) {
    if (c.hidden) continue;
    t += faceVal(c.v);
    if (c.v==='A') aces++;
  }
  while (t>21 && aces>0) { t-=10; aces--; }
  return t;
}
function calcAll(cards) {
  let t=0, aces=0;
  for (const c of cards) {
    t += faceVal(c.v);
    if (c.v==='A') aces++;
  }
  while (t>21 && aces>0) { t-=10; aces--; }
  return t;
}
const isBJ   = cards => cards.length===2 && calcAll(cards)===21;

// ─── CHIPS ────────────────────────────────────────────────────────────
const CHIPS = [
  { val:5,   bg:'#dc2626' },
  { val:10,  bg:'#2563eb' },
  { val:25,  bg:'#16a34a' },
  { val:50,  bg:'#7c3aed' },
  { val:100, bg:'#1a1a1a' },
];

// ─── CARD COMPONENT ───────────────────────────────────────────────────
function Card({ card }) {
  // HIDDEN CARD (Card Back)
  if (card.hidden) return (
    <div style={{
      width:76, height:110, borderRadius:12, flexShrink:0,
      background:'#1a1a1a', // Deep black to match the UI buttons
      border:'1px solid #333',
      boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
      display:'flex', alignItems:'center', justifyContent:'center',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Sleek minimalist logo on the card back */}
      <div style={{
        fontFamily:'DM Mono, monospace', fontSize:14, fontWeight:500,
        letterSpacing:'0.1em', color:'#fff', opacity:0.8,
        transform: 'rotate(-45deg)'
      }}>
        DECK<span style={{color:'#b0a090'}}>HUB</span>
      </div>
    </div>
  );

  // REVEALED CARD (Card Front)
  const red = ['♥','♦'].includes(card.s);
  const col = red ? '#dc2626' : '#1a1a1a'; // Matches your red chip and black button
  
  return (
    <div style={{
      minHeight:'100vh', background:'#f5f4f0', color:'#1a1a1a',
      display:'flex', flexDirection:'column', alignItems:'center',
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      // Push the whole game down slightly for mobile safe areas
      padding:'max(env(safe-area-inset-top), 20px) 12px 40px',
    }}>

      {/* ── Nav ── */}
      <div style={{
        width:'100%', maxWidth:680,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        marginBottom:20, paddingTop:10 // Reduced padding since safe-area handles it now
      }}>
        {card.v}
        <span style={{ fontSize: 12, display:'block', marginTop: 2 }}>{card.s}</span>
      </div>
      
      {/* Center Suit */}
      <div style={{ 
        fontSize:32, textAlign:'center', color:col, lineHeight:1, 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        opacity: 0.15 // Huge, subtle watermark in the center
      }}>
        {card.s}
      </div>

      {/* Bottom Right Value */}
      <div style={{ 
        fontSize:14, fontWeight:600, color:col, lineHeight:1, 
        fontFamily:"'DM Sans', sans-serif", letterSpacing:'-0.05em',
        transform:'rotate(180deg)' 
      }}>
        {card.v}
        <span style={{ fontSize: 12, display:'block', marginTop: 2 }}>{card.s}</span>
      </div>
    </div>
  );
}

// ─── CHIP BUTTON ─────────────────────────────────────────────────────
function ChipBtn({ chip, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:54, height:54, borderRadius:'50%',
      background: disabled ? '#e8e6e0' : chip.bg,
      border:'3px dashed rgba(255,255,255,0.4)',
      color: disabled ? '#aaa' : '#fff', fontWeight:700, fontSize:13,
      cursor: disabled?'not-allowed':'pointer',
      opacity: disabled?0.5:1,
      boxShadow:'0 3px 10px rgba(0,0,0,0.15)',
      outline:'none', transition:'transform 0.1s, opacity 0.2s',
      fontFamily:'inherit',
    }}
    onMouseDown={e=>{ if(!disabled) e.currentTarget.style.transform='scale(0.92)'; }}
    onMouseUp={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    >
      ${chip.val}
    </button>
  );
}

// ─── ACTION BUTTON ────────────────────────────────────────────────────
function ActionBtn({ label, onClick, bg='#1a1a1a', border='#1a1a1a', textCol='#fff', disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled?'#f5f4f0':bg,
      border:`1.5px solid ${disabled?'#e8e6e0':border}`,
      color: disabled?'#aaa':textCol,
      padding:'13px 26px', borderRadius:10,
      fontSize:14, fontWeight:600,
      cursor: disabled?'not-allowed':'pointer',
      fontFamily:'inherit', minWidth:100,
      transition:'opacity 0.15s, transform 0.1s',
      boxShadow: disabled?'none':'0 2px 6px rgba(0,0,0,0.04)'
    }}
    onMouseDown={e=>{ if(!disabled) e.currentTarget.style.transform='scale(0.96)'; }}
    onMouseUp={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}
    >
      {label}
    </button>
  );
}

// ─── RESULT BADGE ─────────────────────────────────────────────────────
const RESULT_STYLE = {
  blackjack: { bg:'#fff4e8', color:'#d4700a', text:'Blackjack!' }, 
  win:       { bg:'#edfaf4', color:'#1da362', text:'Win'        }, 
  push:      { bg:'#f5f4f0', color:'#888',    text:'Push'       },
  lose:      { bg:'#fee2e2', color:'#b91c1c', text:'Lose'       },
  bust:      { bg:'#fecaca', color:'#991b1b', text:'Bust'       },
};
function ResultBadge({ result }) {
  if (!result) return null;
  const s = RESULT_STYLE[result] || {};
  return (
    <span style={{
      background:s.bg, color:s.color,
      fontSize:11, fontWeight:600, letterSpacing:'0.08em',
      padding:'4px 10px', borderRadius:6, textTransform:'uppercase',
      fontFamily:'DM Mono, monospace',
    }}>{s.text}</span>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────────────────
export default function Blackjack({onExit}) {
  const [deck,        setDeck]        = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [hands,       setHands]       = useState([]); 
  const [activeHand,  setActiveHand]  = useState(0);
  const [phase,       setPhase]       = useState('bet'); 
  const [balance,     setBalance]     = useState(1000);
  const [pendingBet,  setPendingBet]  = useState(0);
  const [msg,         setMsg]         = useState('');
  const [msgColor,    setMsgColor]    = useState('#1a1a1a');

  function addChip(val) {
    if (phase !== 'bet') return;
    if (pendingBet + val > balance) return;
    setPendingBet(b => b+val);
  }
  function clearBet() { if (phase==='bet') setPendingBet(0); }

  function deal() {
    if (pendingBet===0 || pendingBet>balance) return;
    const bet = pendingBet;
    let d = mkDeck();
    const p1=d.shift(), d1=d.shift(), p2=d.shift(), d2={...d.shift(),hidden:true};

    const pCards=[p1,p2];
    const dCards=[d1,d2];
    const dFull =[d1,{...d2,hidden:false}];

    setBalance(b => b-bet);
    setPendingBet(0);
    setDeck(d);
    setDealerCards(dCards);
    setActiveHand(0);
    setMsg('');

    const pBJ = isBJ(pCards);
    const dBJ = isBJ(dFull);

    if (pBJ || dBJ) {
      setDealerCards(dFull); 
      let result, text, payout=0, col='#1a1a1a';
      
      if (pBJ && dBJ) { 
        result='push';      
        text='🤝 Push — Both Blackjack!';   
        payout=bet;                        
        col='#888'; 
      }
      else if (pBJ) { 
        result='blackjack'; 
        text='🎉 Blackjack! Pays 3 to 2';   
        payout=bet+Math.floor(bet*1.5);    
        col='#d4700a'; 
      }
      else { 
        result='lose';      
        text='😔 Dealer has Blackjack.';                                        
        col='#b91c1c'; 
      }
      
      setBalance(b => b+payout);
      setHands([{cards:pCards, bet, result, doubled:false}]);
      setMsg(text); 
      setMsgColor(col);
      setPhase('result');
      return; 
    }

    setHands([{cards:pCards, bet, result:null, doubled:false}]);
    setPhase('play');
  }

  function hit() {
    if (phase!=='play') return;
    const d=[...deck];
    const card=d.shift();
    setDeck(d);
    const newHands = hands.map((h,i) =>
      i===activeHand ? {...h, cards:[...h.cards,card]} : h
    );
    const t = calcHand(newHands[activeHand].cards);
    if (t>21) {
      const busted = newHands.map((h,i) => i===activeHand ? {...h,result:'bust'} : h);
      setHands(busted);
      if (activeHand < newHands.length-1) { setActiveHand(a=>a+1); }
      else { runDealer(busted,d); }
    } else if (t===21) {
      setHands(newHands);
      advanceOrDealer(newHands,d);
    } else {
      setHands(newHands);
    }
  }

  function stand() {
    if (phase!=='play') return;
    advanceOrDealer(hands,deck);
  }

  function advanceOrDealer(currentHands, currentDeck) {
    if (activeHand < currentHands.length-1) {
      setActiveHand(a=>a+1);
      setHands(currentHands);
    } else {
      runDealer(currentHands, currentDeck);
    }
  }

  function doubleDown() {
    if (phase!=='play') return;
    const h=hands[activeHand];
    if (h.cards.length!==2 || h.bet>balance) return;
    const d=[...deck];
    const card=d.shift();
    setDeck(d);
    setBalance(b=>b-h.bet);
    const newHands=hands.map((hand,i)=>
      i===activeHand ? {...hand, cards:[...hand.cards,card], bet:hand.bet*2, doubled:true} : hand
    );
    setHands(newHands);
    if (activeHand < newHands.length-1) { setActiveHand(a=>a+1); }
    else { runDealer(newHands,d); }
  }

  function split() {
    if (phase!=='play') return;
    const h=hands[activeHand];
    if (h.cards.length!==2 || hands.length>=2 || h.bet>balance) return;
    if (faceVal(h.cards[0].v)!==faceVal(h.cards[1].v)) return;
    const d=[...deck];
    const c1=d.shift(), c2=d.shift();
    setDeck(d);
    setBalance(b=>b-h.bet);
    const hand1={cards:[h.cards[0],c1], bet:h.bet, result:null, doubled:false};
    const hand2={cards:[h.cards[1],c2], bet:h.bet, result:null, doubled:false};
    const newHands=[...hands];
    newHands.splice(activeHand,1,hand1,hand2);
    setHands(newHands);
  }

  function runDealer(finalHands, currentDeck) {
    let dCards=dealerCards.map(c=>({...c,hidden:false}));
    let d=[...currentDeck];
    while (calcAll(dCards)<17) dCards.push(d.shift());
    setDeck(d);
    setDealerCards(dCards);
    const dTotal=calcAll(dCards);
    const dBusted=dTotal>21;

    const resolved=finalHands.map(h=>{
      if (h.result==='bust') return h;
      const pTotal=calcHand(h.cards);
      let result;
      if (dBusted || pTotal>dTotal) result='win';
      else if (pTotal===dTotal)      result='push';
      else                           result='lose';
      return {...h,result};
    });
    setHands(resolved);

    let payout=0;
    for (const h of resolved) {
      if (h.result==='win')  payout+=h.bet*2;
      if (h.result==='push') payout+=h.bet;
    }
    setBalance(b=>b+payout);

    const wins  = resolved.filter(h=>h.result==='win').length;
    const losses= resolved.filter(h=>['lose','bust'].includes(h.result)).length;
    const pushes= resolved.filter(h=>h.result==='push').length;
    let text='Round over.', col='#1a1a1a';
    if (dBusted)          { text='💥 Dealer busts — you win!'; col='#1da362'; }
    else if (wins>0 && losses===0 && pushes===0) { text='🎉 You win!';    col='#1da362'; }
    else if (losses>0 && wins===0) { text=pushes>0?'Round over.':'😔 Dealer wins.'; col='#b91c1c'; }
    else if (pushes===resolved.length) { text='🤝 Push — it\'s a tie!'; col='#888'; }
    setMsg(text); setMsgColor(col);
    setPhase('result');
  }

  function newRound() {
    setPhase('bet'); setHands([]); setDealerCards([]);
    setMsg(''); setActiveHand(0); setPendingBet(0);
  }
  function resetBalance() { setBalance(1000); newRound(); }

  const curHand = hands[activeHand];
  const canDouble = curHand && curHand.cards.length===2 && curHand.bet<=balance && phase==='play';
  const canSplit  = curHand && curHand.cards.length===2 && hands.length<2 &&
                    faceVal(curHand.cards[0].v)===faceVal(curHand.cards[1].v) &&
                    curHand.bet<=balance && phase==='play';

  const dealerVisible = phase==='result' ? calcAll(dealerCards) : calcHand(dealerCards);

  return (
    <div style={{
      minHeight:'100vh', background:'#f5f4f0', color:'#1a1a1a',
      display:'flex', flexDirection:'column', alignItems:'center',
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      padding:'20px 12px 40px',
    }}>

      {/* ── Nav ── */}
      <div style={{
        width:'100%', maxWidth:680,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        marginBottom:20, paddingTop:20
      }}>
        {/* The New Exit Button */}
        <button onClick={onExit} style={{
          background:'transparent', border:'none', color:'#888',
          fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:600,
          cursor:'pointer', display:'flex', alignItems:'center', padding:0,
          transition: 'color 0.15s'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#1a1a1a'}
        onMouseOut={e => e.currentTarget.style.color = '#888'}
        >
          ← Leave Table
        </button>

        <div style={{ fontSize:12, color:'#888', letterSpacing:'0.06em', fontFamily:'DM Mono,monospace' }}>
          BLACKJACK · TABLE 1
        </div>
        
        <div style={{
          background:'#fff', border:'1px solid #e8e6e0',
          borderRadius:8, padding:'6px 18px',
          color:'#1a1a1a', fontWeight:600, fontSize:15,
          fontFamily:'DM Mono,monospace', letterSpacing:'0.06em',
        }}>
          ${balance.toLocaleString()}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{
        width:'100%', maxWidth:680,
        background:'#fff',
        border:'1px solid #e8e6e0',
        borderRadius:24,
        padding:'28px 24px 28px',
        boxShadow:'0 8px 32px rgba(0,0,0,0.03)',
        position:'relative', overflow:'hidden',
      }}>
        {/* felt radial */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 10%, rgba(0,0,0,0.02) 0%, transparent 65%)',
        }}/>

        {/* table text */}
        <div style={{
          position:'absolute', top:12, left:'50%', transform:'translateX(-50%)',
          fontSize:10, letterSpacing:'0.22em', color:'rgba(0,0,0,0.15)',
          textTransform:'uppercase', whiteSpace:'nowrap',
          fontFamily:'DM Mono,monospace',
        }}>
          Blackjack pays 3 to 2 · Dealer stands on 17
        </div>

        {/* ── Dealer ── */}
        <div style={{ textAlign:'center', marginTop:20, marginBottom:28 }}>
          <div style={{
            fontSize:11, letterSpacing:'0.16em', fontFamily:'DM Mono,monospace',
            color:'#aaa', textTransform:'uppercase', marginBottom:12,
          }}>
            Dealer{dealerCards.length>0 && phase!=='bet' ? ` — ${dealerVisible}` : ''}
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', minHeight:104 }}>
            {dealerCards.length>0
              ? dealerCards.map(c=><Card key={c.id} card={c}/>)
              : <div style={{ alignSelf:'center', color:'#ddd', fontSize:13 }}>—</div>
            }
          </div>
        </div>

        {/* divider */}
        <div style={{ borderTop:'1px solid #e8e6e0', margin:'0 -24px 24px' }}/>

        {/* ── Player ── */}
        <div style={{ textAlign:'center' }}>
          {hands.length===0 ? (
            <div style={{
              minHeight:104, display:'flex', alignItems:'center', justifyContent:'center',
              color:'#bbb', fontSize:13,
            }}>
              Select chips below and press Deal
            </div>
          ) : (
            <div style={{ display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap' }}>
              {hands.map((h,i)=>(
                <div key={i} style={{ textAlign:'center' }}>
                  <div style={{
                    fontSize:11, letterSpacing:'0.14em', fontFamily:'DM Mono,monospace',
                    color: i===activeHand && phase==='play' ? '#1da362' : '#aaa',
                    textTransform:'uppercase', marginBottom:10,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}>
                    <span>{hands.length>1?`Hand ${i+1}`:'You'} — {calcHand(h.cards)}</span>
                    <ResultBadge result={h.result}/>
                  </div>
                  <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
                    {h.cards.map(c=><Card key={c.id} card={c}/>)}
                  </div>
                  <div style={{ marginTop:8, fontSize:12, color:'#aaa', fontFamily:'DM Mono,monospace' }}>
                    Bet ${h.bet}{h.doubled?' (doubled)':''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Message ── */}
      <div style={{ height:36, display:'flex', alignItems:'center', justifyContent:'center', marginTop:16 }}>
        {msg && (
          <div style={{ fontSize:18, fontWeight:600, color:msgColor, letterSpacing:'-0.01em' }}>
            {msg}
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div style={{ width:'100%', maxWidth:680 }}>

        {/* Bet phase */}
        {phase==='bet' && (
          <div>
            <div style={{
              fontSize:11, textAlign:'center', letterSpacing:'0.16em',
              color:'#888', fontFamily:'DM Mono,monospace', textTransform:'uppercase',
              marginBottom:14,
            }}>
              {pendingBet>0 ? `Bet: $${pendingBet}` : 'Choose chips'}
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              {CHIPS.map(c=>(
                <ChipBtn key={c.val} chip={c}
                  onClick={()=>addChip(c.val)}
                  disabled={pendingBet+c.val>balance}
                />
              ))}
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              {pendingBet>0 && (
                <ActionBtn label="Clear" onClick={clearBet} bg="#fff" border="#e8e6e0" textCol="#1a1a1a"/>
              )}
              <ActionBtn
                label={pendingBet>0 ? `Deal  ·  $${pendingBet}` : 'Place a bet first'}
                onClick={deal}
                disabled={pendingBet===0}
                bg="#1a1a1a" border="#1a1a1a" textCol="#fff"
              />
            </div>
          </div>
        )}

        {/* Play phase */}
        {phase==='play' && (
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <ActionBtn label="Hit"       onClick={hit}        bg="#1a1a1a" border="#1a1a1a" textCol="#fff"/>
            <ActionBtn label="Stand"     onClick={stand}      bg="#fff" border="#e8e6e0" textCol="#1a1a1a"/>
            <ActionBtn label="Double ↓" onClick={doubleDown} bg="#fff" border="#e8e6e0" textCol="#1a1a1a" disabled={!canDouble}/>
            <ActionBtn label="Split"     onClick={split}      bg="#fff" border="#e8e6e0" textCol="#1a1a1a" disabled={!canSplit}/>
          </div>
        )}

        {/* Result phase */}
        {phase==='result' && (
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            {balance>0
              ? <ActionBtn label="Next Round →" onClick={newRound} bg="#1a1a1a" border="#1a1a1a" textCol="#fff"/>
              : <>
                  <ActionBtn label="Out of chips" onClick={()=>{}} disabled bg="#fff" border="#e8e6e0" textCol="#1a1a1a"/>
                  <ActionBtn label="Top up $1,000" onClick={resetBalance} bg="#1a1a1a" border="#1a1a1a" textCol="#fff"/>
                </>
            }
          </div>
        )}
      </div>
    </div>
  );
}