export default function TestPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Page</h1>
      <p>If you can see this, basic Next.js routing is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
