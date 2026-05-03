// Drawer.jsx — right-side detail drawer

function Drawer({ open, onClose, title, subtitle, children, footer }) {
  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0,
        background:'rgba(5,25,29,0.32)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition:'opacity 180ms ease',
        zIndex:50,
      }}/>
      <aside style={{
        position:'fixed', top:0, right:0, bottom:0,
        width: 480, background:'#fff',
        boxShadow:'-12px 0 32px -8px rgba(0,0,0,0.18)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 220ms cubic-bezier(.32,.72,0,1)',
        zIndex:51,
        fontFamily:'Inter, sans-serif',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{
          padding:'20px 24px', borderBottom:'1px solid #f4f6f6',
          display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        }}>
          <div>
            <div style={{fontSize:18, fontWeight:600, color:'#0b3b45'}}>{title}</div>
            {subtitle && <div style={{fontSize:12, color:'#7f8182', marginTop:2}}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{
            width:28, height:28, border:'1px solid #e7ebec',
            borderRadius:6, background:'#fff', cursor:'pointer',
            display:'grid', placeItems:'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0b3b45" strokeWidth="1.5"><path d="M3 3l8 8M11 3l-8 8"/></svg>
          </button>
        </div>
        <div style={{flex:1, overflow:'auto', padding:'24px'}}>{children}</div>
        {footer && (
          <div style={{padding:'16px 24px', borderTop:'1px solid #f4f6f6', display:'flex', justifyContent:'flex-end', gap:8}}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

window.Drawer = Drawer;
