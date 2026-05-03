// DataTable.jsx — compact table with checkbox col, sortable headers, status badges

function StatusBadge({ status }) {
  const map = {
    paid:    { bg:'#e7f7ee', fg:'#225f47', dot:'#225f47', label:'Paid' },
    pending: { bg:'#fef3c7', fg:'#523f03', dot:'#a78600', label:'Pending' },
    failed:  { bg:'#fee2e2', fg:'#4d1703', dot:'#a2001d', label:'Failed' },
    refunded:{ bg:'#f4f6f6', fg:'#616363', dot:'#7f8182', label:'Refunded' },
    open:    { bg:'#e7f7f7', fg:'#0b3b45', dot:'#2a9d90', label:'Open' },
    draft:   { bg:'#f4f6f6', fg:'#616363', dot:'#a4a7a8', label:'Draft' },
    active:  { bg:'#e7f7ee', fg:'#225f47', dot:'#6da544', label:'Active' },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px', borderRadius:9999,
      background:s.bg, color:s.fg,
      fontSize:11, fontWeight:500, fontFamily:'Inter, sans-serif',
    }}>
      <span style={{width:6, height:6, borderRadius:'50%', background:s.dot}}/>
      {s.label}
    </span>
  );
}

function DataTable({ columns, rows, selectable = true, onRowClick }) {
  const [selected, setSelected] = React.useState(new Set());
  const allOn = selected.size === rows.length && rows.length > 0;
  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(rows.map(r => r.id)));

  return (
    <div style={{
      background:'#fff', border:'1px solid #f4f6f6',
      borderRadius:8, boxShadow:'0 1px 2px 0 rgba(0,0,0,0.04)',
      fontFamily:'Inter, sans-serif', overflow:'hidden',
    }}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
        <thead>
          <tr style={{background:'#fafafa', borderBottom:'1px solid #f4f6f6'}}>
            {selectable && (
              <th style={{...th, width:36}}>
                <Checkbox checked={allOn} onChange={toggleAll}/>
              </th>
            )}
            {columns.map(c => (
              <th key={c.key} style={{...th, textAlign: c.align || 'left', width: c.width}}>
                <span style={{display:'inline-flex', alignItems:'center', gap:4, cursor:'pointer'}}>
                  {c.label}
                  {c.sortable !== false && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#a4a7a8" strokeWidth="1.5"><path d="M3 4l2-2 2 2M3 6l2 2 2-2"/></svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}
                onClick={() => onRowClick?.(r)}
                style={{
                  borderBottom:'1px solid #f4f6f6',
                  cursor: onRowClick ? 'pointer' : 'default',
                  background: selected.has(r.id) ? '#fafafa' : '#fff',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = selected.has(r.id) ? '#fafafa' : '#fff'}
            >
              {selectable && (
                <td style={td} onClick={e => e.stopPropagation()}>
                  <Checkbox checked={selected.has(r.id)} onChange={() => toggle(r.id)}/>
                </td>
              )}
              {columns.map(c => (
                <td key={c.key} style={{...td, textAlign: c.align || 'left', fontFamily: c.mono ? 'Roboto Mono, monospace' : 'Inter', color: c.muted ? '#7f8182' : '#0b3b45'}}>
                  {c.render ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width:16, height:16, padding:0,
      border:`1px solid ${checked ? '#0b3b45' : '#e7ebec'}`,
      borderRadius:4,
      background: checked ? '#0b3b45' : '#fff',
      cursor:'pointer', display:'grid', placeItems:'center',
    }}>
      {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 5l2 2 4-5"/></svg>}
    </button>
  );
}

const th = {
  padding:'10px 12px',
  fontSize:11, fontWeight:500, color:'#7f8182',
  textTransform:'uppercase', letterSpacing:'.04em',
};
const td = {
  padding:'12px',
  fontSize:13,
  verticalAlign:'middle',
};

window.DataTable = DataTable;
window.StatusBadge = StatusBadge;
window.Checkbox = Checkbox;
