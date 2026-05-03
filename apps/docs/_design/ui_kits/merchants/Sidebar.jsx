// Sidebar.jsx — VINR Barracuda Merchants
// Left navigation with grouped sections, brand glyph header, store-switcher footer.

const NavIcon = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:'0 0 auto'}}>
    <path d={d}/>
  </svg>
);

const ICONS = {
  home: "M3 12l9-9 9 9M5 10v10h14V10",
  txn: "M7 17l-4-4 4-4M3 13h12M17 7l4 4-4 4M21 11H9",
  customers: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  balances: "M3 6h18v12H3zM3 10h18M7 14h2",
  products: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  orders: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  billing: "M2 8h20l-2 12H4zM2 8l1.5-4h17L22 8M9 12v4M15 12v4",
  invoices: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
  subs: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2",
  reports: "M3 3v18h18M7 14l3-3 3 3 5-5",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chev: "M9 6l6 6-6 6",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35",
};

function NavItem({ id, label, icon, active, onSelect, badge }) {
  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'7px 10px', width:'100%', border:0, cursor:'pointer',
        background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: active ? '#f7fdfc' : '#a4b8bd',
        borderRadius: 6,
        fontSize: 13, fontWeight: active ? 500 : 400,
        textAlign:'left',
        transition:'background 120ms',
      }}>
      <NavIcon d={ICONS[icon]} />
      <span style={{flex:1}}>{label}</span>
      {badge && <span style={{
        background:'#2a9d90', color:'#f7fdfc',
        fontSize:10, padding:'1px 6px', borderRadius:9999, fontWeight:500
      }}>{badge}</span>}
    </button>
  );
}

function NavGroup({ title, children }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:2, padding:'8px 0'}}>
      {title && <div style={{
        fontSize:10, fontWeight:600, color:'#5c7c82',
        letterSpacing:'.06em', textTransform:'uppercase',
        padding:'8px 10px 4px',
      }}>{title}</div>}
      {children}
    </div>
  );
}

function Sidebar({ active, onSelect }) {
  return (
    <aside style={{
      width: 240, height:'100%', background:'#05191d',
      display:'flex', flexDirection:'column',
      borderRight:'1px solid #0e2c33',
      fontFamily:'Inter, sans-serif',
    }}>
      {/* brand */}
      <div style={{padding:'16px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #0e2c33'}}>
        <div style={{
          width:28, height:28, background:'#0b3b45',
          borderRadius:6, display:'grid', placeItems:'center',
        }}>
          <img src="../../assets/logo-vinr-glyph.svg" style={{width:14, color:'#f7fdfc', filter:'brightness(0) invert(1)'}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{color:'#f7fdfc', fontSize:13, fontWeight:600, lineHeight:1.1}}>VINR</div>
          <div style={{color:'#5c7c82', fontSize:10}}>Barracuda Merchants</div>
        </div>
        <NavIcon d={ICONS.chev} />
      </div>

      {/* search */}
      <div style={{padding:'10px 12px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'6px 10px', background:'#0b3b45', borderRadius:6,
          color:'#5c7c82',
        }}>
          <NavIcon d={ICONS.search}/>
          <span style={{fontSize:12, flex:1}}>Search…</span>
          <span style={{fontFamily:'Roboto Mono, monospace', fontSize:10, background:'#163c44', padding:'1px 5px', borderRadius:3}}>⌘K</span>
        </div>
      </div>

      {/* nav */}
      <div style={{flex:1, overflow:'auto', padding:'4px 8px'}}>
        <NavGroup>
          <NavItem id="home" label="Home" icon="home" active={active==='home'} onSelect={onSelect}/>
          <NavItem id="transactions" label="Transactions" icon="txn" onSelect={onSelect} active={active==='transactions'}/>
          <NavItem id="customers" label="Customers" icon="customers" active={active==='customers'} onSelect={onSelect} badge="49"/>
          <NavItem id="balances" label="Balances" icon="balances" onSelect={onSelect} active={active==='balances'}/>
        </NavGroup>
        <NavGroup title="Catalog">
          <NavItem id="products" label="Products" icon="products" onSelect={onSelect} active={active==='products'}/>
          <NavItem id="orders" label="Orders" icon="orders" onSelect={onSelect} active={active==='orders'}/>
        </NavGroup>
        <NavGroup title="Billing">
          <NavItem id="billing" label="Overview" icon="billing" onSelect={onSelect} active={active==='billing'}/>
          <NavItem id="invoices" label="Invoices" icon="invoices" active={active==='invoices'} onSelect={onSelect}/>
          <NavItem id="quotes" label="Quotes" icon="invoices" onSelect={onSelect} active={active==='quotes'}/>
          <NavItem id="subscriptions" label="Subscriptions" icon="subs" onSelect={onSelect} active={active==='subscriptions'}/>
          <NavItem id="plans" label="Plans" icon="products" onSelect={onSelect} active={active==='plans'}/>
        </NavGroup>
        <NavGroup title="Reports">
          <NavItem id="reports" label="Reports" icon="reports" onSelect={onSelect} active={active==='reports'}/>
          <NavItem id="data" label="Data" icon="reports" onSelect={onSelect} active={active==='data'}/>
        </NavGroup>
      </div>

      {/* footer / settings */}
      <div style={{borderTop:'1px solid #0e2c33', padding:'8px'}}>
        <NavItem id="settings" label="Settings" icon="settings" onSelect={onSelect} active={active==='settings'}/>
        <div style={{
          display:'flex', alignItems:'center', gap:10, padding:'10px 10px', marginTop:4,
          borderRadius:6, background:'#0b3b45',
        }}>
          <div style={{width:24, height:24, borderRadius:6, background:'#2a9d90', display:'grid', placeItems:'center', color:'#fff', fontWeight:600, fontSize:11}}>RP</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{color:'#f7fdfc', fontSize:12, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Riviera Press</div>
            <div style={{color:'#5c7c82', fontSize:10}}>Production · USD</div>
          </div>
          <NavIcon d={ICONS.chev}/>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
