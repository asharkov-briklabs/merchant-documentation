// InvoicesView.jsx

const INVOICES = [
  {id:'INV-2487', customer:'Riviera Press', issued:'Apr 27, 2025', due:'May 11, 2025', amount:'$3,500.00', status:'open'},
  {id:'INV-2486', customer:'Ana Soriano',   issued:'Apr 24, 2025', due:'May 08, 2025', amount:'$1,240.00', status:'paid'},
  {id:'INV-2485', customer:'Daniel Kühn',   issued:'Apr 22, 2025', due:'May 06, 2025', amount:'$92.40',    status:'paid'},
  {id:'INV-2484', customer:'Marc Allard',   issued:'Apr 20, 2025', due:'May 04, 2025', amount:'$48.00',    status:'failed'},
  {id:'INV-2483', customer:'Yuki Tanaka',   issued:'Apr 18, 2025', due:'May 02, 2025', amount:'$215.00',   status:'paid'},
  {id:'INV-2482', customer:'Beatriz Lima',  issued:'Apr 15, 2025', due:'Apr 29, 2025', amount:'$842.00',   status:'pending'},
  {id:'INV-2481', customer:'Priya Raman',   issued:'Apr 12, 2025', due:'Apr 26, 2025', amount:'$1,108.00', status:'refunded'},
  {id:'INV-2480', customer:'Henrik Olsen',  issued:'Apr 10, 2025', due:'Apr 24, 2025', amount:'$920.00',   status:'failed'},
  {id:'INV-2479', customer:'Sasha Volkov',  issued:'Apr 08, 2025', due:'Apr 22, 2025', amount:'$220.00',   status:'draft'},
];

function InvoicesView({ onOpenInvoice }) {
  const totals = {
    paid: INVOICES.filter(i=>i.status==='paid').length,
    open: INVOICES.filter(i=>i.status==='open' || i.status==='pending').length,
    overdue: INVOICES.filter(i=>i.status==='failed').length,
  };
  return (
    <div style={{padding:'24px 32px', display:'flex', flexDirection:'column', gap:20, fontFamily:'Inter, sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div>
          <h1 style={{margin:0, fontSize:30, fontWeight:600, color:'#0b3b45', letterSpacing:'-.015em'}}>Invoices</h1>
          <div style={{fontSize:13, color:'#7f8182', marginTop:4}}>Manage and send invoices to your customers</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-outline">Send reminder</button>
          <button className="btn btn-primary">+ New invoice</button>
        </div>
      </div>

      {/* mini-KPIs */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
        <div className="card" style={{padding:'14px 18px'}}>
          <div style={{fontSize:12, color:'#7f8182', fontWeight:500}}>Paid this month</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:6}}>
            <div style={{fontSize:20, fontWeight:600, color:'#0b3b45'}}>$1,547.40</div>
            <div style={{fontSize:11, color:'#7f8182'}}>{totals.paid} invoices</div>
          </div>
        </div>
        <div className="card" style={{padding:'14px 18px'}}>
          <div style={{fontSize:12, color:'#7f8182', fontWeight:500}}>Outstanding</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:6}}>
            <div style={{fontSize:20, fontWeight:600, color:'#0b3b45'}}>$4,342.00</div>
            <div style={{fontSize:11, color:'#7f8182'}}>{totals.open} invoices</div>
          </div>
        </div>
        <div className="card" style={{padding:'14px 18px', borderColor:'#fde68a', background:'#fffaeb'}}>
          <div style={{fontSize:12, color:'#523f03', fontWeight:500}}>Overdue · attention</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:6}}>
            <div style={{fontSize:20, fontWeight:600, color:'#0b3b45'}}>$968.00</div>
            <div style={{fontSize:11, color:'#523f03'}}>{totals.overdue} invoices · oldest 14 days</div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{borderBottom:'1px solid #e7ebec', display:'flex', gap:0}}>
        {['All','Open','Paid','Overdue','Drafts'].map((t,i)=>(
          <button key={t} style={{
            padding:'10px 14px', border:0, background:'transparent', cursor:'pointer',
            fontSize:13, fontWeight: i===0 ? 600 : 500, color: i===0 ? '#0b3b45' : '#7f8182',
            borderBottom: i===0 ? '2px solid #0b3b45' : '2px solid transparent',
            marginBottom:-1,
          }}>{t} {i===0 && <span style={{color:'#7f8182', fontWeight:400}}>· {INVOICES.length}</span>}</button>
        ))}
      </div>

      <DataTable
        onRowClick={onOpenInvoice}
        columns={[
          { key:'id', label:'Invoice', mono:true, width:120, render:v=> <span style={{color:'#0b3b45', fontWeight:500}}>{v}</span> },
          { key:'customer', label:'Customer' },
          { key:'amount', label:'Amount', align:'right', mono:true, width:120, render:v=> <span style={{fontWeight:500}}>{v}</span>},
          { key:'status', label:'Status', width:110, sortable:false, render:v=> <StatusBadge status={v}/> },
          { key:'issued', label:'Issued', align:'right', muted:true, width:130 },
          { key:'due', label:'Due', align:'right', muted:true, width:130 },
        ]}
        rows={INVOICES}/>
    </div>
  );
}

window.InvoicesView = InvoicesView;
window.INVOICES = INVOICES;
