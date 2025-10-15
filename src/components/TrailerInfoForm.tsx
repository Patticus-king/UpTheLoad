import { useEffect, useMemo, useState } from "react";

/** ---- Numeric shape we send to parent/backend ---- */
export type TrailerForm = {
  trailer_max_weight: number;   // lbs
  trailer_empty_weight: number; // lbs
  deck_length: number;          // inches
  deck_width: number;           // inches
  axles: number;                // integer >= 1
  axle_weight_limit: number;    // lbs (per axle)
};

export type TrailerInfoFormProps = {
  value?: TrailerForm; // optional initial numeric value from parent
  onChange?: (data: TrailerForm, isValid: boolean) => void;
  onSubmit?: (data: TrailerForm) => void;
};

/** ---- Internal string state so typing feels natural ---- */
type TrailerFormStrings = {
  trailer_max_weight: string;
  trailer_empty_weight: string;
  deck_length: string;
  deck_width: string;
  axles: string;
  axle_weight_limit: string;
};

const toStrs = (v?: TrailerForm): TrailerFormStrings => ({
  trailer_max_weight: v ? String(v.trailer_max_weight) : "",
  trailer_empty_weight: v ? String(v.trailer_empty_weight) : "",
  deck_length: v ? String(v.deck_length) : "",
  deck_width: v ? String(v.deck_width) : "",
  axles: v ? String(v.axles) : "1",
  axle_weight_limit: v ? String(v.axle_weight_limit) : "",
});

const parsePos = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
};
const parsePosInt = (s: string) => {
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 ? n : NaN;
};

export default function TrailerInfoForm({
  value,
  onChange,
  onSubmit,
}: TrailerInfoFormProps) {
  const [formS, setFormS] = useState<TrailerFormStrings>(() => toStrs(value));
  const [touched, setTouched] = useState(false);

  // If parent provides a new value, sync our strings.
  useEffect(() => {
    if (value) setFormS(toStrs(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // Convert strings -> numbers for validation & bubbling
  const parsed = useMemo(() => {
    const tMax = parsePos(formS.trailer_max_weight);
    const tEmpty = parsePos(formS.trailer_empty_weight);
    const deckL = parsePos(formS.deck_length);
    const deckW = parsePos(formS.deck_width);
    const axles = parsePosInt(formS.axles);
    const axleLimit = parsePos(formS.axle_weight_limit);

    const errors: string[] = [];
    if (!(Number.isFinite(tMax) && Number.isFinite(tEmpty) && tMax > tEmpty))
      errors.push("Max weight must be > empty weight (> 0).");
    if (!Number.isFinite(deckL)) errors.push("Deck length must be > 0.");
    if (!Number.isFinite(deckW)) errors.push("Deck width must be > 0.");
    if (!Number.isFinite(axles)) errors.push("Axles must be an integer ≥ 1.");
    if (!Number.isFinite(axleLimit)) errors.push("Per-axle weight limit must be > 0.");

    const isValid = errors.length === 0;

    const numeric: TrailerForm = {
      trailer_max_weight: Number.isFinite(tMax) ? (tMax as number) : 0,
      trailer_empty_weight: Number.isFinite(tEmpty) ? (tEmpty as number) : 0,
      deck_length: Number.isFinite(deckL) ? (deckL as number) : 0,
      deck_width: Number.isFinite(deckW) ? (deckW as number) : 0,
      axles: Number.isFinite(axles) ? (axles as number) : 1,
      axle_weight_limit: Number.isFinite(axleLimit) ? (axleLimit as number) : 0,
    };

    return { numeric, isValid, errors };
  }, [formS]);

  // Bubble to parent on every edit
  useEffect(() => {
    onChange?.(parsed.numeric, parsed.isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.numeric, parsed.isValid]);

  const setField = (key: keyof TrailerFormStrings, v: string) => {
    // allow empty string (user clearing), keep whatever they type
    setFormS((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!parsed.isValid) return;
    onSubmit?.(parsed.numeric);
  };

  return (
    <form className="card-inner" onSubmit={handleSubmit}>
      <div className="card-header small">Trailer Information</div>

      <div className="card-body">
        <label>
          Trailer Max Weight (lbs)
          <input
            type="number"
            inputMode="decimal"
            value={formS.trailer_max_weight}
            onChange={(e) => setField("trailer_max_weight", e.target.value)}
            placeholder="e.g., 40000"
          />
        </label>

        <label>
          Trailer Empty Weight (lbs)
          <input
            type="number"
            inputMode="decimal"
            value={formS.trailer_empty_weight}
            onChange={(e) => setField("trailer_empty_weight", e.target.value)}
            placeholder="e.g., 12000"
          />
        </label>

        <div className="dimensions-row">
          <label>
            Deck Length (in)
            <input
              type="number"
              inputMode="decimal"
              value={formS.deck_length}
              onChange={(e) => setField("deck_length", e.target.value)}
              placeholder="e.g., 636"
            />
          </label>
          <label>
            Deck Width (in)
            <input
              type="number"
              inputMode="decimal"
              value={formS.deck_width}
              onChange={(e) => setField("deck_width", e.target.value)}
              placeholder="e.g., 96"
            />
          </label>
        </div>

        <div className="dimensions-row">
          <label>
            Axles (count)
            <input
              type="number"
              inputMode="numeric"
              value={formS.axles}
              onChange={(e) => setField("axles", e.target.value)}
              placeholder="e.g., 2"
            />
          </label>
          <label>
            Per-Axle Weight Limit (lbs)
            <input
              type="number"
              inputMode="decimal"
              value={formS.axle_weight_limit}
              onChange={(e) => setField("axle_weight_limit", e.target.value)}
              placeholder="e.g., 20000"
            />
          </label>
        </div>

        {touched && !parsed.isValid && (
          <div style={{ color: "#b91c1c", fontSize: 12 }}>
            {parsed.errors.map((m, i) => (
              <div key={i}>• {m}</div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn btn-ghost" disabled={!parsed.isValid}>
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
