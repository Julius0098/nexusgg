'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Bookmark, Copy, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { getTool, validateTool } from '../lib/tools';
import { number, sensitivity } from '../lib/math';

async function clipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return 'Copied';
  } catch {
    return 'Clipboard unavailable. Select and copy the result.';
  }
}

export function Calculator({ slug, preview = false }: { slug: string; preview?: boolean }) {
  const tool = getTool(slug)!;
  const fields = tool.fields!;
  const initial = fields.map(field => field.initial);
  const [values, setValues] = useState(initial);
  const [notice, setNotice] = useState('');
  const sens = slug === 'sensitivity-converter';

  useEffect(() => {
    if (!sens) return;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('nexusgg-sensitivity') ?? 'null');
      if (Array.isArray(saved) && saved.every(value => typeof value === 'string')) {
        validateTool(tool, saved);
        setValues(saved);
      }
    } catch { /* Ignore unavailable or malformed preferences. */ }
  }, [sens, tool]);

  let result = '';
  let error = '';
  try {
    result = validateTool(tool, values);
  } catch (issue) {
    error = (issue as Error).message;
  }
  const stats = sens && !error ? sensitivity(values[0], values[1], Number(values[2]), Number(values[3])) : null;
  const save = () => {
    try {
      localStorage.setItem('nexusgg-sensitivity', JSON.stringify(values));
      setNotice('Saved on this device.');
    } catch {
      setNotice('Browser storage is unavailable.');
    }
  };
  const swap = () => {
    setValues([values[1], values[0], values[2], stats ? String(stats.converted) : values[3]]);
    setNotice('');
  };

  return <div className={'calculator ' + (preview ? 'preview-calc' : '')}>
    <div className="calc-heading"><span className="icon-tile"><SlidersHorizontal size={18}/></span><strong>{tool.title}</strong>{sens && <button type="button" className="icon-button swap" title="Swap source and target games" aria-label="Swap source and target games" onClick={swap}><ArrowLeftRight size={17}/></button>}</div>
    <div className="fields">
      {fields.map((field, index) => <label key={field.label}>
        <span>{field.label}</span>
        {field.options ? <select value={values[index]} onChange={event => {setValues(current => current.map((value, position) => position === index ? event.target.value : value)); setNotice('');}}>
          {field.options.map(option => <option key={option}>{option}</option>)}
        </select> : <input type="number" min={field.min} max={field.max} step={field.integer ? 1 : 'any'} inputMode={field.integer && field.min! >= 0 ? 'numeric' : 'decimal'} value={values[index]} onChange={event => {setValues(current => current.map((value, position) => position === index ? event.target.value : value)); setNotice('');}}/>}
      </label>)}
    </div>
    <div className="result-panel" aria-live="polite">
      <div><span className="result-label">{sens ? 'Converted sensitivity' : 'Result'}</span>
      {error ? <p className="form-error">{error}</p> : <output>{result}</output>}</div>
      <button type="button" className="icon-button" disabled={!!error} aria-label="Copy result" title="Copy result" onClick={async () => setNotice(await clipboard(result))}><Copy size={17}/></button>
    </div>
    {stats && <div className="calc-stats"><span>eDPI <b>{number(stats.edpi)}</b></span><span>cm / 360° <b>{number(stats.cm)}</b></span></div>}
    <div className="actions">
      <button className="small-button" type="button" onClick={() => {setValues(initial); setNotice('');}}><RotateCcw size={14}/> Reset</button>
      {sens && <button className="small-button" type="button" disabled={!!error} onClick={save}><Bookmark size={14}/> Save settings</button>}
      <span role="status">{notice}</span>
    </div>
  </div>;
}

const presets = {
  Classic: { color:'#50ecff', size:10, gap:4, thickness:2, outline:1, opacity:100 },
  Precision: { color:'#82ff73', size:6, gap:2, thickness:2, outline:0, opacity:100 },
  HighContrast: { color:'#ffffff', size:13, gap:6, thickness:3, outline:2, opacity:100 },
};
type Crosshair = typeof presets.Classic;

function CrosshairBuilder() {
  const [style, setStyle] = useState<Crosshair>(presets.Classic);
  const [background, setBackground] = useState('Dark');
  const [notice, setNotice] = useState('');
  const { color, size, gap, thickness, outline, opacity } = style;
  const arms = [
    { top: 64 - gap - size, left: 64 - thickness / 2, width: thickness, height: size },
    { top: 64 + gap, left: 64 - thickness / 2, width: thickness, height: size },
    { top: 64 - thickness / 2, left: 64 - gap - size, width: size, height: thickness },
    { top: 64 - thickness / 2, left: 64 + gap, width: size, height: thickness },
  ];
  const result = 'Color ' + color + ', size ' + size + ' px, gap ' + gap + ' px, thickness ' + thickness + ' px, outline ' + outline + ' px, opacity ' + opacity + '%';
  return <div className="calculator">
    <div className={'reticle-scene scene-' + background.toLowerCase()} aria-label="Crosshair preview">
      <div className="reticle" style={{opacity: opacity / 100}}>
        {arms.map((arm, index) => <span key={index} style={{...arm, background:color, boxShadow:'0 0 0 ' + outline + 'px black'}}/>)}
      </div>
    </div>
    <div className="fields">
      <label><span>Preview background</span><select value={background} onChange={event => setBackground(event.target.value)}>{['Dark','Light','Mixed'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label><span>Color</span><input type="color" value={color} onChange={event => setStyle({...style, color:event.target.value})}/></label>
      {([['size',2,25],['gap',0,20],['thickness',1,8],['outline',0,4],['opacity',0,100]] as const).map(([name,min,max]) =>
        <label key={name}><span>{name.charAt(0).toUpperCase() + name.slice(1)} <b>{style[name]}</b></span><input type="range" min={min} max={max} value={style[name]} onChange={event => setStyle({...style,[name]:Number(event.target.value)})}/></label>)}
    </div>
    <div className="actions">{Object.entries(presets).map(([label, value]) => <button key={label} className="small-button" onClick={() => {setStyle(value);setNotice('');}}>{label === 'HighContrast' ? 'High contrast' : label}</button>)}</div>
    <div className="actions">
      <button className="small-button" onClick={() => {setStyle(presets.Classic);setBackground('Dark');setNotice('');}}><RotateCcw size={14}/> Reset</button>
      <button className="small-button" onClick={async () => setNotice(await clipboard(result))}><Copy size={14}/> Copy settings</button>
      <span role="status">{notice}</span>
    </div>
  </div>;
}

function ReactionTest() {
  const [phase, setPhase] = useState<'idle'|'waiting'|'ready'|'early'|'done'>('idle');
  const [attempts, setAttempts] = useState<number[]>([]);
  const [notice, setNotice] = useState('');
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef(0);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); cancelAnimationFrame(frame.current); }, []);
  const last = attempts.at(-1);
  const average = attempts.length ? Math.round(attempts.reduce((sum, value) => sum + value, 0) / attempts.length) : 0;
  const label = {idle:'Start reaction test',waiting:'Wait for green…',ready:'Press now!',early:'Too soon. Try again',done:last + ' ms · Try again'};
  const act = () => {
    if (phase === 'waiting') {
      if (timer.current) clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
      setPhase('early');
    } else if (phase === 'ready') {
      setAttempts(current => [...current, Math.round(performance.now() - start.current)]);
      setPhase('done');
    } else {
      setPhase('waiting');
      setNotice('');
      timer.current = setTimeout(() => {
        frame.current = requestAnimationFrame(() => { start.current = performance.now(); setPhase('ready'); });
      }, 1400 + Math.random() * 2400);
    }
  };
  return <div className="calculator">
    <button className={'test-button phase-' + phase} onClick={act} onKeyDown={event => {if (event.repeat) event.preventDefault();}}><span aria-live="polite">{label[phase]}</span></button>
    <div className="calc-stats"><span>Attempts <b>{attempts.length}</b></span><span>Average <b>{attempts.length ? average + ' ms' : '—'}</b></span></div>
    <div className="actions">
      <button className="small-button" onClick={() => {if (timer.current) clearTimeout(timer.current);cancelAnimationFrame(frame.current);setAttempts([]);setPhase('idle');setNotice('');}}><RotateCcw size={14}/> Reset</button>
      <button className="small-button" disabled={last === undefined} onClick={async () => setNotice(await clipboard(last + ' ms · Average ' + average + ' ms'))}><Copy size={14}/> Copy result</button>
      <span role="status">{notice}</span>
    </div>
  </div>;
}

function ClickTest() {
  const [end, setEnd] = useState(0);
  const [remaining, setRemaining] = useState(5);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (!end) return;
    const id = setInterval(() => {
      const left = Math.max(0, (end - performance.now()) / 1000);
      setRemaining(left);
      if (!left) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [end]);
  return <div className="calculator">
    <button className="test-button" onKeyDown={event => {if (event.repeat) event.preventDefault();}} onClick={() => {
      const now = performance.now();
      if (end > now) setCount(current => current + 1);
      else if (!end || remaining === 0) {setCount(0);setRemaining(5);setNotice('');setEnd(now + 5000);}
    }}>{!end ? 'Start five-second test' : remaining > 0 ? 'Keep clicking!' : number(count / 5) + ' CPS · Try again'}</button>
    <div className="calc-stats"><span>Remaining <b>{remaining.toFixed(1)} s</b></span><span>Clicks <b>{count}</b></span></div>
    <div className="actions"><button className="small-button" onClick={() => {setEnd(0);setCount(0);setRemaining(5);setNotice('');}}><RotateCcw size={14}/> Reset</button><button className="small-button" disabled={!end || remaining > 0} onClick={async () => setNotice(await clipboard(number(count / 5) + ' CPS'))}><Copy size={14}/> Copy result</button><span role="status">{notice}</span></div>
  </div>;
}

function SessionTimer() {
  const [minutes, setMinutes] = useState('25');
  const [end, setEnd] = useState(0);
  const [left, setLeft] = useState(1500000);
  const [notice, setNotice] = useState('');
  const valid = Number(minutes) >= 0.1 && Number(minutes) <= 1440 && Number.isFinite(Number(minutes));
  useEffect(() => {
    if (!end) return;
    const tick = () => {
      const next = Math.max(0, end - Date.now());
      setLeft(next);
      if (!next) {setEnd(0);setNotice('Time is up.');}
    };
    const id = setInterval(tick, 200);
    document.addEventListener('visibilitychange', tick);
    return () => {clearInterval(id); document.removeEventListener('visibilitychange',tick);};
  }, [end]);
  const seconds = Math.ceil(left / 1000);
  const clock = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  return <div className="calculator">
    <div className="fields"><label><span>Duration in minutes (0.1–1440)</span><input type="number" step="any" min="0.1" max="1440" disabled={!!end} value={minutes} onChange={event => {setMinutes(event.target.value);setLeft(Number(event.target.value) * 60000);setNotice('');}}/></label></div>
    <div className="result-panel"><div><span className="result-label">Time remaining</span><output>{valid ? clock : 'Enter a valid duration'}</output></div></div>
    <div className="actions">
      <button className="small-button" disabled={!valid} onClick={() => {
        if (end) {setLeft(Math.max(0, end - Date.now()));setEnd(0);}
        else {const duration = left || Number(minutes) * 60000;setLeft(duration);setEnd(Date.now() + duration);setNotice('');}
      }}>{end ? 'Pause' : 'Start / resume'}</button>
      <button className="small-button" onClick={() => {setMinutes('25');setLeft(1500000);setEnd(0);setNotice('');}}><RotateCcw size={14}/> Reset</button>
      <button className="small-button" disabled={!valid} onClick={async () => setNotice(await clipboard(clock))}><Copy size={14}/> Copy time</button>
      <span role="status">{notice}</span>
    </div>
  </div>;
}

export function ToolWidget({slug}: {slug: string}) {
  switch (slug) {
    case 'crosshair-builder': return <CrosshairBuilder/>;
    case 'reaction-time-test': return <ReactionTest/>;
    case 'cps-test': return <ClickTest/>;
    case 'session-timer': return <SessionTimer/>;
    default: return <Calculator slug={slug}/>;
  }
}

export function ReportForm({ email }: { email?: string }) {
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  return <div className="calculator report-form">
    <label><span>Bug report or suggestion</span><textarea rows={5} value={message} onChange={event => setMessage(event.target.value)}/></label>
    <div className="actions">
      <button className="small-button" disabled={!message.trim()} onClick={async () => setNotice(await clipboard(message.trim()))}>Copy report</button>
      {email && message.trim() && <a className="small-button" href={'mailto:' + email + '?subject=NEXUSGG%20feedback&body=' + encodeURIComponent(message.trim())}>Open email draft</a>}
      <span role="status">{notice}</span>
    </div>
    {!email && <p className="muted">A feedback email hasn’t been configured yet. You can copy your report to share it.</p>}
  </div>;
}
