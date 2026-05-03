// components.jsx — shadcn-VINR primitives

// ============================ Button ============================
function Button({ variant='primary', size='md', children, ...rest }) {
  const variants = {
    primary:    { bg:'#0b3b45', fg:'#f7fdfc', bd:'transparent', hover:'#05191d' },
    secondary:  { bg:'#f4f6f6', fg:'#0b3b45', bd:'transparent', hover:'#eceff0' },
    outline:    { bg:'#fff',    fg:'#0b3b45', bd:'#e7ebec',     hover:'#fafafa' },
    ghost:      { bg:'transparent', fg:'#0b3b45', bd:'transparent', hover:'#f4f6f6' },
    destructive:{ bg:'#d80027', fg:'#fff',    bd:'transparent', hover:'#a2001d' },
    link:       { bg:'transparent', fg:'#0b3b45', bd:'transparent', hover:'transparent', underline:true },
  };
  const sizes = {
    sm: { h:30, px:10, fz:13, rd:4 },
    md: { h:36, px:14, fz:14, rd:6 },
    lg: { h:40, px:18, fz:15, rd:6 },
    icon:{ h:36, w:36, px:0, fz:14, rd:6 },
  };
  const v = variants[variant], s = sizes[size];
  const [hover, setHover] = React.useState(false);
  return (
    <button {...rest}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        height:s.h, width:s.w, padding:s.w?0:`0 ${s.px}px`,
        background: hover ? v.hover : v.bg,
        color:v.fg, border:`1px solid ${v.bd}`,
        borderRadius:s.rd, fontSize:s.fz, fontWeight:500,
        fontFamily:'Inter, sans-serif',
        cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
        textDecoration: v.underline && hover ? 'underline' : 'none',
        transition:'background 120ms', lineHeight:1,
      }}>
      {children}
    </button>
  );
}

// ============================ Input ============================
function Input(props) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input {...props}
      onFocus={(e)=>{setFocus(true); props.onFocus?.(e);}}
      onBlur={(e)=>{setFocus(false); props.onBlur?.(e);}}
      style={{
        height:36, padding:'0 12px', borderRadius:6,
        border:`1px solid ${focus ? '#0b3b45' : '#e7ebec'}`,
        boxShadow: focus ? '0 0 0 3px rgba(11,59,69,0.12)' : 'none',
        fontSize:14, fontFamily:'Inter, sans-serif', color:'#0b3b45',
        background:'#fff', outline:'none',
        ...props.style,
      }}/>
  );
}

// ============================ Label / Field ============================
function Field({ label, hint, error, children }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6, fontFamily:'Inter, sans-serif'}}>
      {label && <label style={{fontSize:13, fontWeight:500, color:'#0b3b45'}}>{label}</label>}
      {children}
      {error
        ? <div style={{fontSize:12, color:'#a2001d'}}>{error}</div>
        : hint && <div style={{fontSize:12, color:'#7f8182'}}>{hint}</div>}
    </div>
  );
}

// ============================ Switch ============================
function Switch({ checked, onChange }) {
  return (
    <button onClick={()=>onChange?.(!checked)} style={{
      width:36, height:20, padding:2,
      border:0, borderRadius:9999,
      background: checked ? '#0b3b45' : '#d2d6d7',
      cursor:'pointer', transition:'background 150ms',
      display:'flex', alignItems:'center',
    }}>
      <span style={{
        width:16, height:16, borderRadius:'50%', background:'#fff',
        boxShadow:'0 1px 2px 0 rgba(0,0,0,0.15)',
        transform: checked ? 'translateX(16px)' : 'translateX(0)',
        transition:'transform 150ms',
      }}/>
    </button>
  );
}

// ============================ Tabs ============================
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{display:'inline-flex', gap:4, padding:4, background:'#f4f6f6', borderRadius:6}}>
      {tabs.map(t=>(
        <button key={t.value} onClick={()=>onChange(t.value)} style={{
          height:28, padding:'0 12px', border:0, borderRadius:4,
          background: value===t.value ? '#fff' : 'transparent',
          color:'#0b3b45', fontSize:13, fontWeight:500, cursor:'pointer',
          fontFamily:'Inter, sans-serif',
          boxShadow: value===t.value ? '0 1px 2px 0 rgba(0,0,0,0.06)' : 'none',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ============================ Alert ============================
function Alert({ tone='info', title, children }) {
  const tones = {
    info:    { bg:'#e7f7f7', fg:'#0b3b45', bd:'#c6e8e8' },
    warn:    { bg:'#fffaeb', fg:'#523f03', bd:'#fde68a' },
    error:   { bg:'#fee2e2', fg:'#4d1703', bd:'#fecaca' },
    success: { bg:'#e7f7ee', fg:'#225f47', bd:'#c8e8d8' },
  };
  const t = tones[tone];
  return (
    <div style={{
      padding:'12px 14px', border:`1px solid ${t.bd}`, background:t.bg, color:t.fg,
      borderRadius:6, fontFamily:'Inter, sans-serif', fontSize:13,
    }}>
      {title && <div style={{fontWeight:600, marginBottom:2}}>{title}</div>}
      <div style={{lineHeight:1.5}}>{children}</div>
    </div>
  );
}

// ============================ Progress ============================
function Progress({ value=0 }) {
  return (
    <div style={{height:8, background:'#f4f6f6', borderRadius:9999, overflow:'hidden'}}>
      <div style={{height:'100%', width:`${value}%`, background:'#0b3b45', borderRadius:9999, transition:'width 200ms'}}/>
    </div>
  );
}

// ============================ Avatar ============================
function Avatar({ initials, size=32, color }) {
  return (
    <span style={{
      width:size, height:size, borderRadius:'50%',
      background: color || 'linear-gradient(135deg, #2a9d90, #0b3b45)',
      color:'#fff', display:'inline-grid', placeItems:'center',
      fontSize:Math.round(size*0.36), fontWeight:600, fontFamily:'Inter, sans-serif',
    }}>{initials}</span>
  );
}

// ============================ Breadcrumb ============================
function Breadcrumb({ items }) {
  return (
    <nav style={{display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter, sans-serif'}}>
      {items.map((it,i)=>(
        <React.Fragment key={i}>
          {i>0 && <span style={{color:'#a4a7a8'}}>/</span>}
          <span style={{
            color: i===items.length-1 ? '#0b3b45' : '#7f8182',
            fontWeight: i===items.length-1 ? 500 : 400,
          }}>{it}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

// ============================ Tooltip ============================
function Tooltip({ children, text }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{position:'relative', display:'inline-flex'}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && (
        <span style={{
          position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
          padding:'4px 8px', background:'#05191d', color:'#f7fdfc',
          fontSize:11, borderRadius:4, whiteSpace:'nowrap',
          fontFamily:'Inter, sans-serif', pointerEvents:'none', zIndex:10,
        }}>{text}</span>
      )}
    </span>
  );
}

// ============================ Dialog ============================
function Dialog({ open, onClose, title, description, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:50,
      background:'rgba(5,25,29,0.45)',
      display:'grid', placeItems:'center',
      animation:'fadeIn 150ms ease',
    }}>
      <style>{`@keyframes fadeIn {from{opacity:0}to{opacity:1}}`}</style>
      <div onClick={e=>e.stopPropagation()} style={{
        width:440, background:'#fff', borderRadius:8,
        boxShadow:'0 20px 50px -10px rgba(0,0,0,0.3)',
        padding:24, fontFamily:'Inter, sans-serif',
      }}>
        <div style={{fontSize:18, fontWeight:600, color:'#0b3b45'}}>{title}</div>
        {description && <div style={{fontSize:13, color:'#7f8182', marginTop:6}}>{description}</div>}
        <div style={{marginTop:16}}>{children}</div>
        {footer && <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:20}}>{footer}</div>}
      </div>
    </div>
  );
}

// ============================ Select ============================
function Select({ value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const cur = options.find(o=>o.value===value) || options[0];
  return (
    <div style={{position:'relative', display:'inline-block', fontFamily:'Inter, sans-serif'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        height:36, padding:'0 12px', minWidth:160,
        border:'1px solid #e7ebec', borderRadius:6, background:'#fff',
        color:'#0b3b45', fontSize:14, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
      }}>
        <span>{cur.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#7f8182" strokeWidth="1.5"><path d="M3 4.5l3 3 3-3"/></svg>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, minWidth:'100%',
          background:'#fff', border:'1px solid #e7ebec', borderRadius:6,
          boxShadow:'0 8px 24px -6px rgba(0,0,0,0.14)',
          padding:4, zIndex:10,
        }}>
          {options.map(o=>(
            <div key={o.value} onClick={()=>{onChange(o.value); setOpen(false);}} style={{
              padding:'7px 10px', borderRadius:4, fontSize:14, cursor:'pointer',
              color:'#0b3b45',
              background: o.value===value ? '#f4f6f6' : 'transparent',
            }}>{o.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Button, Input, Field, Switch, Tabs, Alert, Progress, Avatar, Breadcrumb, Tooltip, Dialog, Select });
