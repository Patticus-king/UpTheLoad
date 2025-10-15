// src/Input-PG.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Input-PG.css";

import TrailerInfoForm, { type TrailerForm } from "./components/TrailerInfoForm";

const API_URL = "http://127.0.0.1:5050/generate";

/** Numeric type the backend expects for each load */
export type LoadItem = {
  id: string;
  label?: string;
  unit_count: number;   // >= 1
  unit_weight: number;  // > 0
  unit_length: number;  // > 0
  unit_width: number;   // > 0
  unit_height: number;  // > 0
  stack_height: number; // >= 1
};

type GenerateResponse = {
  status: "success" | "error";
  error?: string;
  svg?: string;
  summary?: {
    axles: number;
    payload_capacity_lbs: number;
    per_axle_total_limit_lbs: number;
    total_units_placed: number;
    total_weight_placed_lbs: number;
    approx_length_used_in: number;
    deck_length_in: number;
    deck_width_in: number;
  };
  placements?: any[];
  generated_at?: number;
};

/* ─────────────────────────────────────────────────────────────
   Little helpers
────────────────────────────────────────────────────────────── */
const makeId = (() => {
  let n = 0;
  return () => `load_${Date.now()}_${n++}`;
})();

const pos = (n: number) => Number.isFinite(n) && n > 0;
const posInt = (n: number) => Number.isInteger(n) && n >= 1;
const parsePos = (s: string) => {
  const n = Number(s);
  return pos(n) ? n : NaN;
};
const parsePosInt = (s: string) => {
  const n = Number(s);
  return posInt(n) ? n : NaN;
};

/* ─────────────────────────────────────────────────────────────
   Load Modal (string state for smooth typing)
────────────────────────────────────────────────────────────── */
type LoadModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (load: LoadItem) => void;
  initial?: Partial<LoadItem>; // to support future “edit” if needed
};

function LoadModal({ open, onClose, onSave, initial }: LoadModalProps) {
  if (!open) return null;

  type LoadS = {
    label: string;
    unit_count: string;
    unit_weight: string;
    unit_length: string;
    unit_width: string;
    unit_height: string;
    stack_height: string;
  };

  const [form, setForm] = useState<LoadS>({
    label: initial?.label ?? "",
    unit_count: initial?.unit_count != null ? String(initial.unit_count) : "1",
    unit_weight: initial?.unit_weight != null ? String(initial.unit_weight) : "1",
    unit_length: initial?.unit_length != null ? String(initial.unit_length) : "1",
    unit_width: initial?.unit_width != null ? String(initial.unit_width) : "1",
    unit_height: initial?.unit_height != null ? String(initial.unit_height) : "1",
    stack_height: initial?.stack_height != null ? String(initial.stack_height) : "1",
  });

  const parsed = useMemo(() => {
    const item: LoadItem = {
      id: makeId(),
      label: form.label.trim() ? form.label.trim() : undefined,
      unit_count: parsePosInt(form.unit_count) || 0,
      unit_weight: parsePos(form.unit_weight) || 0,
      unit_length: parsePos(form.unit_length) || 0,
      unit_width: parsePos(form.unit_width) || 0,
      unit_height: parsePos(form.unit_height) || 0,
      stack_height: parsePosInt(form.stack_height) || 0,
    };
    const errs: string[] = [];
    if (!posInt(item.unit_count)) errs.push("Unit count must be ≥ 1");
    if (!pos(item.unit_weight)) errs.push("Unit weight must be > 0");
    if (!pos(item.unit_length)) errs.push("Unit length must be > 0");
    if (!pos(item.unit_width))  errs.push("Unit width must be > 0");
    if (!pos(item.unit_height)) errs.push("Unit height must be > 0");
    if (!posInt(item.stack_height)) errs.push("Stack height must be ≥ 1");
    return { item, errs, valid: errs.length === 0 };
  }, [form]);

  const set = (k: keyof LoadS, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--narrow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Add Load</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="li-grid">
            <div className="li-field">
              <label className="li-label" htmlFor="ld_label">Label (optional)</label>
              <input id="ld_label" type="text" value={form.label} onChange={(e) => set("label", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_unit_count">Unit Count</label>
              <input id="ld_unit_count" type="number" inputMode="numeric" value={form.unit_count} onChange={(e) => set("unit_count", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_unit_weight">Unit Weight (lbs)</label>
              <input id="ld_unit_weight" type="number" inputMode="decimal" value={form.unit_weight} onChange={(e) => set("unit_weight", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_unit_length">Unit Length (in)</label>
              <input id="ld_unit_length" type="number" inputMode="decimal" value={form.unit_length} onChange={(e) => set("unit_length", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_unit_width">Unit Width (in)</label>
              <input id="ld_unit_width" type="number" inputMode="decimal" value={form.unit_width} onChange={(e) => set("unit_width", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_unit_height">Unit Height (in)</label>
              <input id="ld_unit_height" type="number" inputMode="decimal" value={form.unit_height} onChange={(e) => set("unit_height", e.target.value)} />
            </div>

            <div className="li-field">
              <label className="li-label" htmlFor="ld_stack_height">Stack Height</label>
              <input id="ld_stack_height" type="number" inputMode="numeric" value={form.stack_height} onChange={(e) => set("stack_height", e.target.value)} />
            </div>
          </div>

          {parsed.errs.length > 0 && (
            <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 8 }}>
              {parsed.errs.map((m, i) => <div key={i}>• {m}</div>)}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!parsed.valid} onClick={() => onSave(parsed.item)}>
            Save Load
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
────────────────────────────────────────────────────────────── */
export default function InputPg() {
  const navigate = useNavigate();

  // Trailer
  const [trailer, setTrailer] = useState<TrailerForm>({
    trailer_max_weight: 0,
    trailer_empty_weight: 0,
    deck_length: 0,
    deck_width: 0,
    axles: 1,
    axle_weight_limit: 0,
  });
  const [trailerValid, setTrailerValid] = useState(false);

  // Loads (added via modal)
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const hasLoads = loads.length > 0;

  // Server state
  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load Modal
  const [loadModalOpen, setLoadModalOpen] = useState(false);

  const handleTrailerChange = (data: TrailerForm, isValid: boolean) => {
    setTrailer(data);
    setTrailerValid(isValid);
  };

  const addLoad = (item: LoadItem) => {
    setLoads((prev) => [...prev, item]);
    setLoadModalOpen(false);
  };

  const removeLoad = (id: string) => {
    setLoads((prev) => prev.filter((x) => x.id !== id));
  };

  const canGenerate = trailerValid && hasLoads;

  const handleGenerate = async () => {
    setServerErr(null);
    setResult(null);

    if (!canGenerate) {
      setServerErr("Please complete valid trailer info and add at least one load.");
      return;
    }

    setSubmitting(true);
    try {
      const cleanLoads = loads.map((l) => ({
        unit_count: l.unit_count,
        unit_weight: l.unit_weight,
        unit_length: l.unit_length,
        unit_width: l.unit_width,
        unit_height: l.unit_height,
        stack_height: l.stack_height,
      }));

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trailer, loads: cleanLoads }),
      });

      const json: GenerateResponse = await res.json();

      if (!res.ok || json.status === "error") {
        setServerErr(json.error || `Server error (${res.status})`);
      } else {
        setResult(json);
        setShowPreview(true);
      }
    } catch (e: any) {
      setServerErr(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const copySVG = async () => {
    if (!result?.svg) return;
    try {
      await navigator.clipboard.writeText(result.svg);
      alert("SVG copied to clipboard.");
    } catch {
      alert("Could not copy. Try downloading.");
    }
  };

  const downloadSVG = () => {
    if (!result?.svg) return;
    const blob = new Blob([result.svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "load_plan.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="light-page">
      <div className="container">

        {/* Row: Trailer card + Add Load CTA */}
        <div className="row-two">
          <div className="card">
            <div className="card-body">
              <TrailerInfoForm value={trailer} onChange={handleTrailerChange} />
            </div>
          </div>

          <div className="add-load-panel">
            <button className="add-load-cta" onClick={() => setLoadModalOpen(true)}>
              <span className="big-plus">+</span>
              <span>Add Load</span>
            </button>

            {/* Load chips list */}
            {loads.length > 0 && (
              <div className="load-chips">
                {loads.map((ld) => (
                  <div className="chip" key={ld.id} title={`${ld.unit_count} x ${ld.unit_length}×${ld.unit_width}×${ld.unit_height} (stack ${ld.stack_height})`}>
                    <span className="chip-label">{ld.label || "Load"}</span>
                    <button className="chip-x" onClick={() => removeLoad(ld.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer row with actions */}
        <div className="footer-row">
          <button className="btn btn-ghost" onClick={() => navigate("/")}>Back</button>
          <div className="spacer" />
          {serverErr && <div className="error-text">{serverErr}</div>}
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={!canGenerate || submitting}
          >
            {submitting ? "Generating..." : "Generate Plan"}
          </button>
        </div>
      </div>

      {/* Load Modal */}
      <LoadModal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        onSave={addLoad}
      />

      {/* Preview Modal */}
      {showPreview && result?.svg && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Load Plan Preview</h3>
              <button className="modal-close" aria-label="Close" onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="modal-body">
              {result.summary && (
                <div className="summary-grid">
                  <div><strong>Axles:</strong> {result.summary.axles}</div>
                  <div><strong>Payload Capacity:</strong> {result.summary.payload_capacity_lbs} lbs</div>
                  <div><strong>Per-Axle Limit (total):</strong> {result.summary.per_axle_total_limit_lbs} lbs</div>
                  <div><strong>Total Units Placed:</strong> {result.summary.total_units_placed}</div>
                  <div><strong>Total Weight Placed:</strong> {result.summary.total_weight_placed_lbs} lbs</div>
                  <div><strong>Length Used:</strong> {result.summary.approx_length_used_in} in</div>
                  <div><strong>Deck:</strong> {result.summary.deck_length_in} × {result.summary.deck_width_in} in</div>
                </div>
              )}
              <div className="svg-view" dangerouslySetInnerHTML={{ __html: result.svg! }} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={copySVG}>Copy SVG</button>
              <button className="btn btn-primary" onClick={downloadSVG}>Download SVG</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
