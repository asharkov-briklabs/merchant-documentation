// PlaceholderView — for sidebar items we didn't fully build out

function PlaceholderView({ title, description }) {
  return (
    <div style={{padding:'24px 32px', fontFamily:'Inter, sans-serif'}}>
      <h1 style={{margin:0, fontSize:30, fontWeight:600, color:'#0b3b45', letterSpacing:'-.015em'}}>{title}</h1>
      <div className="card" style={{
        marginTop:24, padding:48, textAlign:'center',
        display:'flex', flexDirection:'column', alignItems:'center', gap:12,
        border:'1px dashed #d2d6d7', background:'#fafafa', boxShadow:'none',
      }}>
        <div style={{
          width:48, height:48, borderRadius:8,
          background:'#fff', border:'1px solid #e7ebec',
          display:'grid', placeItems:'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0b3b45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <h3 style={{margin:0, fontSize:18, fontWeight:600, color:'#0b3b45'}}>{title} — coming up</h3>
        <p style={{margin:0, fontSize:13, color:'#7f8182', maxWidth:360}}>{description || 'This view is sketched in the source Figma but not built out in this prototype.'}</p>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button className="btn btn-outline btn-sm">View docs</button>
          <button className="btn btn-primary btn-sm">Get started</button>
        </div>
      </div>
    </div>
  );
}

window.PlaceholderView = PlaceholderView;
