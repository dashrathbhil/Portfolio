type Screen = "scan" | "result";

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 20 6v5.5c0 5.1-3.4 8.5-8 10-4.6-1.5-8-4.9-8-10V6l8-3.5Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
}

function SettingsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="m19.4 13.5 1.1.8-1.2 2.1-1.3-.5a7.8 7.8 0 0 1-1.8 1l-.2 1.5h-2.4l-.3-1.5a7.8 7.8 0 0 1-1.8-1l-1.3.5-1.2-2.1 1.1-.8a7 7 0 0 1 0-2l-1.1-.8 1.2-2.1 1.3.5a7.8 7.8 0 0 1 1.8-1l.3-1.5h2.4l.2 1.5a7.8 7.8 0 0 1 1.8 1l1.3-.5 1.2 2.1-1.1.8a7 7 0 0 1 0 2Z" transform="translate(-1.2 -1)" /></svg>;
}

function DeviceIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>;
}

function ScanIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 7H12a5 5 0 0 0-5 5v5m24-10h5a5 5 0 0 1 5 5v5M7 31v5a5 5 0 0 0 5 5h5m14 0h5a5 5 0 0 0 5-5v-5" /></svg>;
}

function KeyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9m-3 3 3 3m-6-1 3 3" /></svg>;
}

function UploadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 3 3 3-4 5 6" /></svg>;
}

function AppHeader() {
  return (
    <header className="infracore-ui__header">
      <div className="infracore-ui__brand"><span className="infracore-ui__shield"><ShieldIcon /></span><span>InfraCore <strong>LAPS</strong></span></div>
      <span className="infracore-ui__settings"><SettingsIcon /></span>
    </header>
  );
}

function ScanScreen() {
  return (
    <>
      <div className="infracore-ui__scan-intro">
        <h3>Scan QR Code</h3>
        <p>Point your camera at the screen</p>
      </div>
      <div className="infracore-ui__scanner">
        <span className="infracore-ui__corner infracore-ui__corner--tl" />
        <span className="infracore-ui__corner infracore-ui__corner--tr" />
        <span className="infracore-ui__corner infracore-ui__corner--bl" />
        <span className="infracore-ui__corner infracore-ui__corner--br" />
        <div className="infracore-ui__scan-center"><span><ScanIcon /></span><strong>Tap to scan</strong></div>
      </div>
      <div className="infracore-ui__upload"><UploadIcon /><span>Upload from Gallery</span></div>
    </>
  );
}

function ResultScreen() {
  return (
    <>
      <div className="infracore-ui__result-heading">
        <div className="infracore-ui__device-heading">
          <span className="infracore-ui__device-icon"><DeviceIcon /></span>
          <div><h3>WORKSTATION-042</h3><p><span className="infracore-ui__status-dot" />Decrypted Successfully</p></div>
        </div>
        <div className="infracore-ui__person">
          <span className="infracore-ui__avatar">PS</span>
          <span><strong>Priya Sharma</strong><small>EMP-1048 · Assigned user</small></span>
        </div>
      </div>

      <div className="infracore-ui__result-content">
        <section className="infracore-ui__detail-section">
          <div className="infracore-ui__section-heading"><h4>Device details</h4></div>
          <div className="infracore-ui__detail-grid">
            <div><span>Serial number</span><strong>SN-7Q4M-219</strong></div>
            <div><span>Operating system</span><strong>Windows 11 Pro</strong></div>
          </div>
        </section>

        <section className="infracore-ui__detail-section">
          <div className="infracore-ui__section-heading"><h4>Hardware</h4></div>
          <div className="infracore-ui__spec-list">
            <div><span>Processor</span><strong>Intel Core i5-1340P</strong></div>
            <div><span>Memory</span><strong>16 GB RAM</strong></div>
            <div><span>Storage</span><strong>512 GB SSD</strong></div>
          </div>
        </section>

        <section className="infracore-ui__detail-section">
          <div className="infracore-ui__section-heading"><h4>Software</h4></div>
          <div className="infracore-ui__software-tags"><span>Microsoft 365</span><span>Microsoft Edge</span></div>
        </section>

        <section className="infracore-ui__security-card">
          <div className="infracore-ui__security-title"><span className="infracore-ui__security-icon"><ShieldIcon /></span><div><strong>Credential access</strong><small>Protected QR lookup</small></div><span className="infracore-ui__secure-status">READY</span></div>
          <div className="infracore-ui__password-label">Administrator password</div>
          <div className="infracore-ui__password-value"><KeyIcon /><strong>Test@123</strong></div>
        </section>

        <div className="infracore-ui__updated"><span>Last updated by <strong>Admin</strong></span><span>Today · 10:42 AM</span></div>
      </div>
      <div className="infracore-ui__scan-again"><ScanIcon /><span>Scan Another</span><span aria-hidden="true">↗</span></div>
    </>
  );
}

export function InfraCoreLapsMockup({ screen, label }: { screen: Screen; label: string }) {
  return (
    <div
      className={`infracore-ui infracore-ui--${screen}`}
      role="group"
      aria-label={label}
    >
      <AppHeader />
      <div className="infracore-ui__body">
        {screen === "scan" ? <ScanScreen /> : <ResultScreen />}
      </div>
    </div>
  );
}
