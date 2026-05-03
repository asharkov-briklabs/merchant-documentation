// HomeView.jsx — VINR Merchants home/overview
// KPIs, area chart placeholder, recent transactions, balance card

function AreaChart() {
  // 28 daily data points
  const data = [42,48,46,55,52,60,58,63,68,72,69,74,80,78,84,82,88,86,92,89,95,93,99,96,103,108,112,118];
  const w = 100, h = 100;
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1))*w;
    const y = h - ((v-30)/(120-30))*h;
    return [x,y];
  });
  const linePts = pts.map(p => p.join(',')).join(' ');
  const areaPts = `0,${h} ${linePts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{width:'100%', height:220, display:'block'}}>
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0b3b45" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#0b3b45" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#grad)"/>
      <polyline points={linePts} fill="none" stroke="#0b3b45" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

function HomeView({ onOpenTxn }) {
  const recentTxns = [
    {id:'tx_84a91c', customer:'Ana Soriano', amount:'$1,240.00', method:'Visa · 4242', status:'paid', date:'Apr 27, 11:42'},
    {id:'tx_84a8df', customer:'Daniel Kühn', amount:'$92.40',    method:'Apple Pay',   status:'paid', date:'Apr 27, 10:08'},
    {id:'tx_84a872', customer:'Riviera Press', amount:'$3,500.00', method:'ACH · …8821', status:'pending', date:'Apr 27, 09:14'},
    {id:'tx_84a755', customer:'Marc Allard', amount:'$48.00',  method:'Visa · 1881', status:'failed', date:'Apr 26, 22:30'},
    {id:'tx_84a6e2', customer:'Yuki Tanaka', amount:'$215.00', method:'Klarna',     status:'paid', date:'Apr 26, 18:15'},
  ];
  return (
    <div style={{padding:'24px 32px', display:'flex', flexDirection:'column', gap:24, fontFamily:'Inter, sans-serif'}}>
      {/* hero */}
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:12, color:'#7f8182', fontWeight:500}}>Welcome back, Léo</div>
          <h1 style={{margin:'4px 0 0', fontSize:30, fontWeight:600, letterSpacing:'-.015em', color:'#0b3b45'}}>Today's overview</h1>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-outline">Apr 1 – Apr 27</button>
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">+ New charge</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}}>
        <KpiCard label="Gross volume" value="$84,219.40" sub="vs $74,108 last period" trend={13.6}
          sparkline={[42,48,46,55,52,60,58,63,68,72,69,74,80,78,84,82,88]}/>
        <KpiCard label="Successful payments" value="1,284" sub="98.2% success rate" trend={4.2} sparkColor="#2a9d90"
          sparkline={[20,22,21,24,26,25,28,30,29,31,33,32,35,38,40,39,41]}/>
        <KpiCard label="New customers" value="49" sub="this month" trend={-1.4} sparkColor="#0052b4"
          sparkline={[5,4,6,5,7,6,8,7,5,4,6,5,4,5,4,3,4]}/>
        <KpiCard label="Failed payments" value="22" sub="$1,108.00 in volume" trend={-8.1} sparkColor="#a2001d"
          sparkline={[3,4,2,5,3,4,2,3,1,2,3,2,1,2,1,2,1]}/>
      </div>

      {/* chart + balance side by side */}
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16}}>
        <div className="card" style={{padding:0}}>
          <div style={{padding:'18px 20px', borderBottom:'1px solid #f4f6f6', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:14, fontWeight:600, color:'#0b3b45'}}>Gross volume</div>
              <div style={{fontSize:12, color:'#7f8182', marginTop:2}}>USD · last 28 days</div>
            </div>
            <div style={{display:'flex', gap:4, padding:2, background:'#f4f6f6', borderRadius:6}}>
              {['7d','28d','90d','12m'].map((l,i)=>(
                <button key={l} style={{
                  height:24, padding:'0 10px', border:0, borderRadius:4, fontSize:12, fontWeight:500, cursor:'pointer',
                  background: i===1 ? '#fff' : 'transparent', color:'#0b3b45',
                  boxShadow: i===1 ? '0 1px 2px 0 rgba(0,0,0,0.06)' : 'none',
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{padding:'12px 8px 8px'}}><AreaChart/></div>
          <div style={{padding:'8px 20px 16px', display:'flex', justifyContent:'space-between', fontSize:11, color:'#a4a7a8', fontFamily:'Roboto Mono, monospace'}}>
            <span>Mar 31</span><span>Apr 7</span><span>Apr 14</span><span>Apr 21</span><span>Apr 27</span>
          </div>
        </div>

        {/* balance card */}
        <div className="card" style={{padding:0, display:'flex', flexDirection:'column'}}>
          <div style={{padding:'18px 20px', borderBottom:'1px solid #f4f6f6'}}>
            <div style={{fontSize:14, fontWeight:600, color:'#0b3b45'}}>Balance</div>
          </div>
          <div style={{padding:'18px 20px', display:'flex', flexDirection:'column', gap:14}}>
            <div>
              <div style={{fontSize:11, color:'#7f8182', textTransform:'uppercase', letterSpacing:'.04em'}}>Available · USD</div>
              <div style={{fontSize:24, fontWeight:600, color:'#0b3b45', marginTop:4}}>$42,108.21</div>
            </div>
            <div>
              <div style={{fontSize:11, color:'#7f8182', textTransform:'uppercase', letterSpacing:'.04em'}}>Pending</div>
              <div style={{fontSize:18, fontWeight:500, color:'#0b3b45', marginTop:2}}>$8,420.00</div>
            </div>
            <div style={{height:1, background:'#f4f6f6'}}/>
            <div style={{fontSize:12, color:'#7f8182'}}>Next payout in 2 days · $42,108.21</div>
            <button className="btn btn-primary" style={{marginTop:'auto'}}>Pay out instantly</button>
          </div>
        </div>
      </div>

      {/* recent txns */}
      <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3 style={{margin:0, fontSize:16, fontWeight:600, color:'#0b3b45'}}>Recent transactions</h3>
          <button className="btn btn-ghost btn-sm">View all →</button>
        </div>
        <DataTable
          selectable={false}
          onRowClick={onOpenTxn}
          columns={[
            { key:'id', label:'Transaction', mono:true, width:160, render:(v,r)=> <span style={{color:'#0b3b45', fontWeight:500}}>{v}</span> },
            { key:'customer', label:'Customer' },
            { key:'method', label:'Method' },
            { key:'status', label:'Status', width:110, render:(v) => <StatusBadge status={v}/>, sortable:false },
            { key:'amount', label:'Amount', align:'right', mono:true, width:120, render:(v)=> <span style={{fontWeight:500}}>{v}</span>},
            { key:'date', label:'Date', align:'right', width:140, muted:true },
          ]}
          rows={recentTxns}/>
      </div>
    </div>
  );
}

window.HomeView = HomeView;
