// CustomersView.jsx

const CUSTOMERS = [
  {id:'cus_3KaYz9pQRb6tMx', name:'Ana Soriano',   email:'ana@rivierapress.com', spend:'$12,420.00', invoices:14, status:'active', country:'ES', joined:'Mar 12, 2024'},
  {id:'cus_3KaYy1Lz4t8Cqr', name:'Daniel Kühn',   email:'d.kuhn@bauwerk.de',     spend:'$8,108.40',  invoices:9, status:'active', country:'DE', joined:'Feb 04, 2024'},
  {id:'cus_3KaYx7Mn0fE1aw', name:'Yuki Tanaka',   email:'yuki@nori.jp',          spend:'$6,920.00',  invoices:7, status:'active', country:'JP', joined:'Jan 19, 2024'},
  {id:'cus_3KaYwpL2kQRb6t', name:'Marc Allard',   email:'marc@cafe-laurent.fr',  spend:'$2,840.00',  invoices:4, status:'pending', country:'FR', joined:'Apr 02, 2024'},
  {id:'cus_3KaYvcF8vN9oqz', name:'Riviera Press', email:'billing@rivierapress.com', spend:'$48,210.00', invoices:38, status:'active', country:'US', joined:'Aug 14, 2023'},
  {id:'cus_3KaYu2tKp7XaNm', name:'Sasha Volkov',  email:'sasha@volkov.studio',   spend:'$1,108.00',  invoices:2, status:'draft',  country:'CZ', joined:'Apr 22, 2024'},
  {id:'cus_3KaYt9kDqL0Bn4', name:'Priya Raman',   email:'priya@lotusyoga.in',    spend:'$4,420.00',  invoices:6, status:'active', country:'IN', joined:'Dec 09, 2023'},
  {id:'cus_3KaYsmW8oRk2cE', name:'Beatriz Lima',  email:'b.lima@ondaazul.br',    spend:'$15,810.00', invoices:21, status:'active', country:'BR', joined:'Sep 27, 2023'},
  {id:'cus_3KaYrx9zVm4Cdr', name:'Henrik Olsen',  email:'henrik@nordforge.no',   spend:'$920.00',    invoices:1, status:'failed', country:'NO', joined:'Apr 25, 2024'},
];

function CountryFlag({ code }) {
  // tiny emoji-free abbreviation tile
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      width:20, height:14, borderRadius:2, background:'#f4f6f6',
      fontSize:9, fontWeight:600, color:'#616363',
      fontFamily:'Roboto Mono, monospace',
      border:'1px solid #e7ebec',
    }}>{code}</span>
  );
}

function CustomersView({ onOpenCustomer }) {
  const [query, setQuery] = React.useState('');
  const filtered = CUSTOMERS.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={{padding:'24px 32px', display:'flex', flexDirection:'column', gap:20, fontFamily:'Inter, sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div>
          <h1 style={{margin:0, fontSize:30, fontWeight:600, color:'#0b3b45', letterSpacing:'-.015em'}}>Customers</h1>
          <div style={{fontSize:13, color:'#7f8182', marginTop:4}}>{CUSTOMERS.length} customers · {CUSTOMERS.filter(c=>c.status==='active').length} active</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-outline">Import</button>
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">+ Add customer</button>
        </div>
      </div>

      {/* filter bar */}
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'0 12px', flex:1, maxWidth:320,
          height:36, border:'1px solid #e7ebec', borderRadius:6, background:'#fff',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7f8182" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name or email…" style={{
            border:0, outline:0, flex:1, fontSize:13, fontFamily:'Inter, sans-serif', background:'transparent', color:'#0b3b45',
          }}/>
        </div>
        <button className="btn btn-outline btn-sm">Status: All ▾</button>
        <button className="btn btn-outline btn-sm">Country: All ▾</button>
        <button className="btn btn-outline btn-sm">Spend ▾</button>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost btn-sm">Columns ⋯</button>
      </div>

      <DataTable
        onRowClick={onOpenCustomer}
        columns={[
          { key:'name', label:'Customer', render:(v,r)=>(
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background:'linear-gradient(135deg, #2a9d90, #0b3b45)',
                color:'#fff', display:'grid', placeItems:'center',
                fontSize:11, fontWeight:600,
              }}>{v.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
              <div>
                <div style={{fontWeight:500, color:'#0b3b45'}}>{v}</div>
                <div style={{fontSize:11, color:'#7f8182'}}>{r.email}</div>
              </div>
            </div>
          )},
          { key:'country', label:'', width:30, sortable:false, render:(v)=> <CountryFlag code={v}/> },
          { key:'spend', label:'Total spend', mono:true, align:'right', width:130, render:(v)=> <span style={{fontWeight:500}}>{v}</span> },
          { key:'invoices', label:'Invoices', align:'right', width:90, mono:true, muted:true },
          { key:'status', label:'Status', width:110, sortable:false, render:(v)=> <StatusBadge status={v}/> },
          { key:'joined', label:'Joined', align:'right', muted:true, width:130 },
        ]}
        rows={filtered}/>
    </div>
  );
}

window.CustomersView = CustomersView;
window.CountryFlag = CountryFlag;
window.CUSTOMERS = CUSTOMERS;
