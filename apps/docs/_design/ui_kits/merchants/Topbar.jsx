// Topbar.jsx — VINR Barracuda Merchants

const TIcon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

function Topbar({ title, breadcrumb = [], onTestModeToggle, testMode }) {
  return (
    <div style={{
      height: 64, padding:'0 24px',
      borderBottom:'1px solid #f4f6f6',
      background:'#fff',
      display:'flex', alignItems:'center', gap:16,
      fontFamily:'Inter, sans-serif',
    }}>
      <div style={{flex:1, display:'flex', alignItems:'center', gap:8, minWidth:0}}>
        {breadcrumb.length > 0 ? (
          <div style={{display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#7f8182'}}>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <TIcon d="M9 6l6 6-6 6" size={12}/>}
                <span style={{
                  color: i === breadcrumb.length - 1 ? '#0b3b45' : '#7f8182',
                  fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <h2 style={{margin:0, fontSize:18, fontWeight:600, color:'#0b3b45'}}>{title}</h2>
        )}
      </div>

      {/* test mode toggle */}
      <button onClick={onTestModeToggle} style={{
        display:'flex', alignItems:'center', gap:8,
        height:32, padding:'0 12px',
        border:'1px solid #e7ebec', borderRadius:6,
        background:'#fff', cursor:'pointer',
        fontSize:12, fontWeight:500, color:'#0b3b45',
      }}>
        <span style={{
          width:8, height:8, borderRadius:'50%',
          background: testMode ? '#ffda44' : '#2a9d90',
        }}/>
        {testMode ? 'Test mode' : 'Live mode'}
      </button>

      <button style={iconBtn} aria-label="Help"><TIcon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></button>
      <button style={iconBtn} aria-label="Notifications">
        <TIcon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0"/>
        <span style={{
          position:'absolute', top:6, right:6,
          width:6, height:6, borderRadius:'50%', background:'#d80027'
        }}/>
      </button>
      <div style={{width:1, height:24, background:'#e7ebec'}}/>
      <div style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer'}}>
        <div style={{
          width:32, height:32, borderRadius:'50%',
          background:'linear-gradient(135deg, #2a9d90, #0b3b45)',
          color:'#fff', display:'grid', placeItems:'center',
          fontSize:12, fontWeight:600,
        }}>L</div>
        <div style={{lineHeight:1.15, fontSize:12}}>
          <div style={{fontWeight:500, color:'#0b3b45'}}>Léo Mendès</div>
          <div style={{color:'#7f8182', fontSize:11}}>Owner</div>
        </div>
        <TIcon d="M6 9l6 6 6-6" size={14}/>
      </div>
    </div>
  );
}

const iconBtn = {
  position:'relative',
  width:32, height:32,
  display:'grid', placeItems:'center',
  border:'1px solid #e7ebec', borderRadius:6,
  background:'#fff', cursor:'pointer', color:'#0b3b45',
};

window.Topbar = Topbar;
