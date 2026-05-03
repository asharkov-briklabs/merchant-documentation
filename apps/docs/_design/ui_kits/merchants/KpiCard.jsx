// KpiCard.jsx — headline stat with sparkline + trend chip

function Sparkline({ values, color = '#0b3b45', positive = true }) {
  if (!values?.length) return null;
  const w = 120, h = 36;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const last = values[values.length - 1];
  const lastX = w;
  const lastY = h - ((last - min) / range) * h;
  return (
    <svg width={w} height={h} style={{display:'block'}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lastX} cy={lastY} r="2.5" fill={color}/>
    </svg>
  );
}

function TrendChip({ value }) {
  const positive = value >= 0;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:3,
      fontSize:11, fontWeight:500,
      color: positive ? '#225f47' : '#a2001d',
      background: positive ? '#e7f7ee' : '#fee2e2',
      padding:'2px 6px', borderRadius:9999,
      fontFamily:'Inter, sans-serif',
    }}>
      <span>{positive ? '↑' : '↓'}</span>
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function KpiCard({ label, value, sub, trend, sparkline, sparkColor = '#0b3b45' }) {
  return (
    <div style={{
      background:'#fff',
      border:'1px solid #f4f6f6',
      borderRadius:8,
      boxShadow:'0 1px 2px 0 rgba(0,0,0,0.04)',
      padding:'18px 20px',
      fontFamily:'Inter, sans-serif',
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontSize:12, color:'#7f8182', fontWeight:500}}>{label}</div>
        {trend !== undefined && <TrendChip value={trend}/>}
      </div>
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12}}>
        <div>
          <div style={{fontSize:26, fontWeight:600, color:'#0b3b45', letterSpacing:'-.01em', lineHeight:1.1, fontFamily:'Inter, sans-serif'}}>{value}</div>
          {sub && <div style={{fontSize:11, color:'#7f8182', marginTop:2}}>{sub}</div>}
        </div>
        {sparkline && <Sparkline values={sparkline} color={sparkColor}/>}
      </div>
    </div>
  );
}

window.KpiCard = KpiCard;
window.Sparkline = Sparkline;
window.TrendChip = TrendChip;
