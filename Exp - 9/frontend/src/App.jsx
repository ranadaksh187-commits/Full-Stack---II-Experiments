import { useCallback, useEffect, useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const EMPTY_METRICS = {
  totalRequests: 0,
  stableRequests: 0,
  canaryRequests: 0,
  actualCanaryPercentage: '0.0%',
  lastRoutedTo: 'None',
  configuredPercentage: 10
};

async function getResponseData(response) {
  if (!response.ok) {
    throw new Error(`The server responded with ${response.status}. Please try again.`);
  }
  return response.json();
}

export default function App() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [canaryWeight, setCanaryWeight] = useState(10);
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [lastResponse, setLastResponse] = useState(null);
  const [trafficLog, setTrafficLog] = useState([]);
  const [contractResult, setContractResult] = useState(null);
  const [calcA, setCalcA] = useState('2');
  const [calcB, setCalcB] = useState('3');
  const [calcResult, setCalcResult] = useState(null);
  const [busyAction, setBusyAction] = useState('');
  const [notice, setNotice] = useState(null);

  const refreshPosts = useCallback(async () => {
    const data = await getResponseData(await fetch(`${API_BASE}/api/posts`));
    setPosts(data);
    setBackendOnline(true);
  }, []);

  const refreshMetrics = useCallback(async () => {
    const data = await getResponseData(await fetch(`${API_BASE}/api/canary/metrics`));
    setMetrics(data);
    setCanaryWeight(data.configuredPercentage);
    setBackendOnline(true);
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const [postsResponse, metricsResponse] = await Promise.all([
          fetch(`${API_BASE}/api/posts`),
          fetch(`${API_BASE}/api/canary/metrics`)
        ]);
        const [postsData, metricsData] = await Promise.all([
          getResponseData(postsResponse),
          getResponseData(metricsResponse)
        ]);
        if (active) {
          setPosts(postsData);
          setMetrics(metricsData);
          setCanaryWeight(metricsData.configuredPercentage);
          setBackendOnline(true);
        }
      } catch {
        if (active) setBackendOnline(false);
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const runAction = async (label, action, successMessage) => {
    setBusyAction(label);
    setNotice(null);
    try {
      await action();
      if (successMessage) setNotice({ type: 'success', text: successMessage });
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      });
    } finally {
      setBusyAction('');
    }
  };

  const updateCanaryWeight = (weight) => runAction(
    'weight',
    async () => {
      const response = await fetch(`${API_BASE}/api/canary/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canaryPercentage: weight })
      });
      const data = await getResponseData(response);
      setCanaryWeight(data.canaryPercentage);
      await refreshMetrics();
    },
    `The rollout target is now ${weight}% Canary.`
  );

  const sendRoutedRequest = (forceCanary = false) => runAction(
    'request',
    async () => {
      const headers = forceCanary ? { 'X-Canary-Force': 'true' } : {};
      const data = await getResponseData(await fetch(`${API_BASE}/api/canary/route`, { headers }));
      setLastResponse(data);
      setTrafficLog((previous) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString(),
          isCanary: data.servedBy.includes('Canary')
        },
        ...previous.slice(0, 9)
      ]);
      await refreshMetrics();
    },
    forceCanary ? 'Test request sent directly to the Canary version.' : 'Test request sent using the rollout percentage.'
  );

  const sendBatchTraffic = () => runAction(
    'batch',
    async () => {
      const data = await getResponseData(
        await fetch(`${API_BASE}/api/canary/batch?count=50`, { method: 'POST' })
      );
      setLastResponse({
        servedBy: '50 sample requests',
        version: `Rollout target: ${data.currentConfiguredWeight}`,
        message: `${data.actualCanaryPercentage} of all requests so far have gone to Canary.`
      });
      await refreshMetrics();
    },
    '50 sample requests completed.'
  );

  const resetCanaryMetrics = () => runAction(
    'reset',
    async () => {
      await getResponseData(await fetch(`${API_BASE}/api/canary/reset`, { method: 'POST' }));
      setTrafficLog([]);
      setLastResponse(null);
      await refreshMetrics();
    },
    'Request counts have been reset.'
  );

  const testContract = (type) => runAction(
    'contract',
    async () => {
      const payload = await getResponseData(
        await fetch(`${API_BASE}/api/contract/sample/${type}`)
      );
      const result = await getResponseData(await fetch(`${API_BASE}/api/contract/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }));
      setContractResult({ ...result, testedType: type, payloadSent: payload });
    },
    type === 'compliant' ? 'The compatible example passed the check.' : 'The incompatible example was checked.'
  );

  const runCalculator = () => runAction(
    'calculator',
    async () => {
      const params = new URLSearchParams({ a: calcA || '0', b: calcB || '0' });
      const data = await getResponseData(
        await fetch(`${API_BASE}/api/calculator/add?${params}`)
      );
      setCalcResult(data.result);
    },
    'The addition example is complete.'
  );

  const handleCreatePost = (event) => {
    event.preventDefault();
    runAction(
      'post',
      async () => {
        await getResponseData(await fetch(`${API_BASE}/api/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim() || 'A demo post created from the dashboard.',
            author: author.trim() || 'Dashboard user',
            version: 'v1.0.0'
          })
        }));
        setTitle('');
        setContent('');
        setAuthor('');
        await refreshPosts();
      },
      'Your post has been added.'
    );
  };

  const canaryPctNum = Math.max(0, Math.min(100, Number(canaryWeight)));

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Release Desk home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Release Desk</span>
        </a>
        <nav className="top-nav" aria-label="Page sections">
          <a href="#rollout">Traffic rollout</a>
          <a href="#checks">Quick checks</a>
          <a href="#posts">Posts</a>
        </nav>
        <div className={`connection-status ${backendOnline ? 'is-online' : 'is-offline'}`} role="status">
          <span className="status-dot" />
          {backendOnline ? 'System connected' : 'Backend not connected'}
        </div>
      </header>

      <div className="page-content" id="home">
        {!backendOnline && (
          <div className="connection-help" role="status">
            <span className="help-icon" aria-hidden="true">!</span>
            <div>
              <strong>Connect the backend to use the dashboard</strong>
              <p>Start the Spring Boot backend on port 8080. This page will reconnect automatically.</p>
            </div>
          </div>
        )}

        {notice && (
          <div className={`notice notice-${notice.type}`} role="status">
            <span>{notice.type === 'success' ? '✓' : '!'}</span>
            <p>{notice.text}</p>
            <button type="button" className="notice-dismiss" onClick={() => setNotice(null)} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}

        <section className="welcome-panel">
          <div className="welcome-copy">
            <p className="eyebrow">EXPERIMENT 9 · CI/CD & RELEASE TESTING</p>
            <h1>See what’s happening.<br /><span>Try it out with confidence.</span></h1>
            <p className="welcome-description">
              A simple control desk for testing how a new version is released, checking that services agree,
              and trying the posts API.
            </p>
            <a className="button button-dark" href="#rollout">Start with traffic rollout <span aria-hidden="true">↓</span></a>
          </div>
          <div className="welcome-visual" aria-hidden="true">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-core"><span>v1</span><span className="core-divider" /><span>v2</span></div>
            <span className="visual-label label-stable">Stable version</span>
            <span className="visual-label label-canary">New version</span>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="guide-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A QUICK TOUR</p>
              <h2 id="guide-title">What can I do here?</h2>
            </div>
            <p>Choose a step below. Each one can be tried independently.</p>
          </div>
          <div className="guide-grid">
            <a className="guide-item" href="#rollout">
              <span className="guide-number">01</span>
              <span><strong>Control a release</strong><small>Choose how much test traffic goes to the new version.</small></span>
              <span className="guide-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="guide-item" href="#checks">
              <span className="guide-number">02</span>
              <span><strong>Run quick checks</strong><small>Try an API compatibility check or add two numbers.</small></span>
              <span className="guide-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="guide-item" href="#posts">
              <span className="guide-number">03</span>
              <span><strong>Manage sample posts</strong><small>Add a post and see it appear in the live list.</small></span>
              <span className="guide-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="content-card rollout-card" id="rollout" aria-labelledby="rollout-title">
          <div className="card-heading">
            <div className="heading-icon icon-blue" aria-hidden="true">↗</div>
            <div>
              <p className="eyebrow">01 · RELEASE CONTROL</p>
              <h2 id="rollout-title">Choose where test traffic goes</h2>
              <p className="section-description">
                The stable version is the current release. The Canary version is the new release being tested.
                Change the target below, then send sample requests.
              </p>
            </div>
          </div>

          <div className="version-legend">
            <div className="version-item">
              <span className="version-swatch swatch-stable" />
              <span><strong>Stable · v1</strong><small>Current release</small></span>
            </div>
            <div className="version-item">
              <span className="version-swatch swatch-canary" />
              <span><strong>Canary · v2</strong><small>New release under test</small></span>
            </div>
          </div>

          <div className="rollout-control">
            <div className="control-title">
              <label htmlFor="traffic-slider">Target share for the new version</label>
              <strong className="target-value">{canaryWeight}<span>%</span></strong>
            </div>
            <input
              id="traffic-slider"
              className="traffic-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={canaryWeight}
              disabled={!backendOnline || Boolean(busyAction)}
              aria-valuetext={`${canaryWeight}% to the new version`}
              onChange={(event) => setCanaryWeight(Number(event.target.value))}
              onPointerUp={() => updateCanaryWeight(canaryWeight)}
              onKeyUp={() => updateCanaryWeight(canaryWeight)}
            />
            <div className="slider-scale"><span>0% · Stable only</span><span>100% · All to new version</span></div>
            <div className="preset-row" aria-label="Suggested rollout targets">
              {[0, 10, 25, 50, 100].map((weight) => (
                <button
                  type="button"
                  className={`preset-button ${weight === canaryWeight ? 'selected' : ''}`}
                  key={weight}
                  disabled={!backendOnline || Boolean(busyAction)}
                  onClick={() => updateCanaryWeight(weight)}
                >
                  {weight}%
                </button>
              ))}
            </div>
            <p className="plain-language-note">
              <span aria-hidden="true">ⓘ</span>
              This is the target share, not a guarantee for every small group of requests. The observed share can vary.
            </p>
          </div>

          <div
            className="traffic-visual"
            role="img"
            aria-label={`${100 - canaryPctNum} percent stable target, ${canaryPctNum} percent new version target`}
          >
            <div className="traffic-labels">
              <span><i className="legend-dot stable-dot" /> Stable <strong>{100 - canaryPctNum}%</strong></span>
              <span><i className="legend-dot canary-dot" /> New version <strong>{canaryPctNum}%</strong></span>
            </div>
            <div className="traffic-track">
              <div className="traffic-stable" style={{ width: `${100 - canaryPctNum}%` }} />
              <div className="traffic-canary" style={{ width: `${canaryPctNum}%` }} />
            </div>
          </div>

          <div className="metrics-heading">
            <div><h3>What has happened so far?</h3><p>Counts update automatically while this page is open.</p></div>
            <button
              type="button"
              className="text-button"
              disabled={!backendOnline || Boolean(busyAction)}
              onClick={resetCanaryMetrics}
            >
              Reset counts
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><span>Sample requests</span><strong>{metrics.totalRequests}</strong><small>Sent from this demo</small></div>
            <div className="stat-card"><span>To stable</span><strong>{metrics.stableRequests}</strong><small>Current version</small></div>
            <div className="stat-card"><span>To new version</span><strong>{metrics.canaryRequests}</strong><small>Canary version</small></div>
            <div className="stat-card"><span>Observed new-version share</span><strong>{metrics.actualCanaryPercentage}</strong><small>May vary from target</small></div>
          </div>

          <div className="action-panel">
            <div>
              <h3>Try sending traffic</h3>
              <p>See which version handles a request, or send a group of 50 sample requests.</p>
            </div>
            <div className="action-buttons">
              <button
                type="button"
                className="button button-primary"
                disabled={!backendOnline || Boolean(busyAction)}
                onClick={() => sendRoutedRequest(false)}
              >
                {busyAction === 'request' ? 'Sending…' : 'Send 1 sample request'}
              </button>
              <button
                type="button"
                className="button button-outline"
                disabled={!backendOnline || Boolean(busyAction)}
                onClick={() => sendRoutedRequest(true)}
              >
                Send 1 directly to new version
              </button>
              <button
                type="button"
                className="button button-outline"
                disabled={!backendOnline || Boolean(busyAction)}
                onClick={sendBatchTraffic}
              >
                {busyAction === 'batch' ? 'Sending…' : 'Send 50 sample requests'}
              </button>
            </div>
          </div>

          {lastResponse && (
            <div className="result-panel" aria-live="polite">
              <span className="result-check" aria-hidden="true">✓</span>
              <div>
                <strong>Latest result: {lastResponse.servedBy}</strong>
                <p>{lastResponse.message}</p>
                <details>
                  <summary>Show technical response</summary>
                  <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
                </details>
              </div>
            </div>
          )}

          {trafficLog.length > 0 && (
            <div className="activity-section">
              <h3>Recent sample requests</h3>
              <ul className="activity-list">
                {trafficLog.map((entry, index) => (
                  <li key={entry.id}>
                    <span className={`activity-indicator ${entry.isCanary ? 'activity-canary' : 'activity-stable'}`} />
                    <span>Request {trafficLog.length - index} went to <strong>{entry.isCanary ? 'the new version' : 'the stable version'}</strong></span>
                    <time>{entry.time}</time>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="content-card" id="checks" aria-labelledby="checks-title">
          <div className="card-heading">
            <div className="heading-icon icon-purple" aria-hidden="true">✓</div>
            <div>
              <p className="eyebrow">02 · QUICK CHECKS</p>
              <h2 id="checks-title">Check that the app behaves as expected</h2>
              <p className="section-description">These small examples show how automated checks catch issues before a release.</p>
            </div>
          </div>

          <div className="checks-grid">
            <article className="tool-card">
              <div className="tool-card-header">
                <span className="tool-icon purple-tint" aria-hidden="true">⇄</span>
                <div><h3>Do the services agree?</h3><p>Checks whether the API response includes the fields the app expects.</p></div>
              </div>
              <div className="example-box">
                <span>Compatible example</span><code>name: "Alice"</code>
                <span>Breaking example</span><code>username: "Alice"</code>
              </div>
              <div className="tool-actions">
                <button
                  type="button"
                  className="button button-primary"
                  disabled={!backendOnline || Boolean(busyAction)}
                  onClick={() => testContract('compliant')}
                >
                  Check compatible example
                </button>
                <button
                  type="button"
                  className="button button-outline"
                  disabled={!backendOnline || Boolean(busyAction)}
                  onClick={() => testContract('breaking')}
                >
                  Check breaking example
                </button>
              </div>
              {contractResult && (
                <div className={`check-result ${contractResult.contractStatus === 'PASSED' ? 'check-passed' : 'check-failed'}`} aria-live="polite">
                  <strong>{contractResult.contractStatus === 'PASSED' ? 'Passed: required fields are present' : 'Issue found: the response does not match'}</strong>
                  <p>{contractResult.explanation}</p>
                  {contractResult.missingRequiredFields?.length > 0 && (
                    <p>Missing fields: {contractResult.missingRequiredFields.join(', ')}</p>
                  )}
                  <details><summary>Show example data</summary><pre>{JSON.stringify(contractResult.payloadSent, null, 2)}</pre></details>
                </div>
              )}
            </article>

            <article className="tool-card">
              <div className="tool-card-header">
                <span className="tool-icon blue-tint" aria-hidden="true">+</span>
                <div><h3>Try a simple calculation</h3><p>Sends two numbers to the backend and shows their sum.</p></div>
              </div>
              <div className="calculator">
                <label>First number<input aria-label="First number" type="number" value={calcA} onChange={(event) => setCalcA(event.target.value)} /></label>
                <span className="plus-sign" aria-hidden="true">+</span>
                <label>Second number<input aria-label="Second number" type="number" value={calcB} onChange={(event) => setCalcB(event.target.value)} /></label>
              </div>
              <div className="tool-actions">
                <button
                  type="button"
                  className="button button-primary"
                  disabled={!backendOnline || Boolean(busyAction)}
                  onClick={runCalculator}
                >
                  {busyAction === 'calculator' ? 'Calculating…' : 'Calculate the sum'}
                </button>
                {calcResult !== null && <span className="calculation-result" aria-live="polite">Answer: <strong>{calcResult}</strong></span>}
              </div>
            </article>
          </div>
        </section>

        <section className="content-card posts-section" id="posts" aria-labelledby="posts-title">
          <div className="card-heading">
            <div className="heading-icon icon-green" aria-hidden="true">✎</div>
            <div>
              <p className="eyebrow">03 · LIVE POSTS</p>
              <h2 id="posts-title">Add a sample post</h2>
              <p className="section-description">Posts are saved by the backend and appear in the list below.</p>
            </div>
            <span className="post-count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
          </div>

          <form className="post-form" onSubmit={handleCreatePost}>
            <label>Post title<input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="For example, Our next release" required /></label>
            <label>Your name (optional)<input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Dashboard user" /></label>
            <label className="form-wide">What is this post about?<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write a short message…" rows="3" /></label>
            <div className="form-footer">
              <p>Title is required. The other fields can be left blank.</p>
              <button type="submit" className="button button-primary" disabled={!backendOnline || Boolean(busyAction)}>
                {busyAction === 'post' ? 'Adding post…' : 'Add post'}
              </button>
            </div>
          </form>

          <div className="post-list-heading"><h3>Saved posts</h3><span>Newest first</span></div>
          {posts.length > 0 ? (
            <div className="post-list">
              {[...posts].reverse().map((post) => (
                <article className="post-item" key={post.id}>
                  <div className="post-avatar" aria-hidden="true">{(post.author || 'D').charAt(0).toUpperCase()}</div>
                  <div className="post-copy">
                    <div className="post-meta"><strong>{post.author || 'Dashboard user'}</strong><span>·</span><span>Post #{post.id}</span></div>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                  </div>
                  <span className="post-version">{post.version || 'v1.0.0'}</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-posts">
              <span aria-hidden="true">▤</span>
              <strong>No posts yet</strong>
              <p>Use the form above to add the first one.</p>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span className="brand-mark footer-mark" aria-hidden="true">R</span>
          <p>Release Desk <span>·</span> Experiment 9</p>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
