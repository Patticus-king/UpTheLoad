import { useEffect, useMemo, useState } from "react";
import type { FC, ReactNode } from "react";

/** Numeric type we emit to the parent/back-end */
export type LoadItem = {
  id: string;
  label?: string;
  unit_count: number;
  unit_weight: number;
  unit_length: number;
  unit_width: number;
  unit_height: number;
  stack_height: number;
};

export type LoadInfoFormProps = {
  value?: LoadItem[];
  onChange?: (items: LoadItem[], isValid: boolean) => void;
};

/** Internal string state so typing is smooth */
type LoadItemStrings = {
  id: string;
  label?: string;
  unit_count: string;
  unit_weight: string;
  unit_length: string;
  unit_width: string;
  unit_height: string;
  stack_height: string;
};

const makeId = (() => {
  let n = 0;
  return () => `load_${Date.now()}_${n++}`;
})();

const newItemS = (): LoadItemStrings => ({
  id: makeId(),
  label: "",
  unit_count: "1",
  unit_weight: "1",
  unit_length: "1",
  unit_width: "1",
  unit_height: "1",
  stack_height: "1",
});

const toStrings = (arr?: LoadItem[]): LoadItemStrings[] =>
  (arr && arr.length
    ? arr.map((x) => ({
        id: x.id ?? makeId(),
        label: x.label ?? "",
        unit_count: String(x.unit_count ?? ""),
        unit_weight: String(x.unit_weight ?? ""),
        unit_length: String(x.unit_length ?? ""),
        unit_width: String(x.unit_width ?? ""),
        unit_height: String(x.unit_height ?? ""),
        stack_height: String(x.stack_height ?? ""),
      }))
    : [newItemS()]);

const pos = (n: number) => Number.isFinite(n) && n > 0;
const posInt = (n: number) => Number.isInteger(n) && n >= 1;
const parsePos = (s: string) => { const n = Number(s); return pos(n) ? n : NaN; };
const parsePosInt = (s: string) => { const n = Number(s); return posInt(n) ? n : NaN; };

const Field: FC<{ id: string; label: string; children: ReactNode }> = ({ id, label, children }) => (
  <div className="li-field">
    <label className="li-label" htmlFor={id}>{label}</label>
    {children}
  </div>
);

const LoadInfoForm: FC<LoadInfoFormProps> = ({ value, onChange }) => {
  const [itemsS, setItemsS] = useState<LoadItemStrings[]>(() => toStrings(value));

  // allow parent to control value
  useEffect(() => {
    if (value) setItemsS(toStrings(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // Convert strings -> numeric + validate; bubble to parent
  const parsed = useMemo(() => {
    const numeric: LoadItem[] = itemsS.map((it) => ({
      id: it.id,
      label: it.label?.trim() ? it.label.trim() : undefined,
      unit_count: parsePosInt(it.unit_count) || 0,
      unit_weight: parsePos(it.unit_weight) || 0,
      unit_length: parsePos(it.unit_length) || 0,
      unit_width: parsePos(it.unit_width) || 0,
      unit_height: parsePos(it.unit_height) || 0,
      stack_height: parsePosInt(it.stack_height) || 0,
    }));
    const errs = numeric.map((it) => {
      const e: string[] = [];
      if (!posInt(it.unit_count)) e.push("unit_count ≥ 1");
      if (!pos(it.unit_weight)) e.push("unit_weight > 0");
      if (!pos(it.unit_length)) e.push("unit_length > 0");
      if (!pos(it.unit_width)) e.push("unit_width > 0");
      if (!pos(it.unit_height)) e.push("unit_height > 0");
      if (!posInt(it.stack_height)) e.push("stack_height ≥ 1");
      return e;
    });
    const isValid = errs.every((x) => x.length === 0);
    return { numeric, errs, isValid };
  }, [itemsS]);

  useEffect(() => {
    onChange?.(parsed.numeric, parsed.isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.numeric, parsed.isValid]);

  // setters
  const setText = (id: string, v: string) =>
    setItemsS((prev) => prev.map((it) => (it.id === id ? { ...it, label: v } : it)));

  const setNumStr = (id: string, key: keyof LoadItemStrings, v: string) =>
    setItemsS((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: v } : it)));

  // row ops
  const addRow = () => setItemsS((p) => [...p, newItemS()]);
  const removeRow = (id: string) => setItemsS((p) => (p.length > 1 ? p.filter((x) => x.id !== id) : p));
  const duplicateRow = (id: string) =>
    setItemsS((p) => {
      const i = p.findIndex((x) => x.id === id);
      if (i === -1) return p;
      const copy = { ...p[i], id: makeId() };
      const next = [...p];
      next.splice(i + 1, 0, copy);
      return next;
    });

  const totals = useMemo(() => {
    const units = parsed.numeric.reduce((a, b) => a + (posInt(b.unit_count) ? b.unit_count : 0), 0);
    const weight = parsed.numeric.reduce(
      (a, b) => a + (pos(b.unit_weight) && posInt(b.unit_count) ? b.unit_weight * b.unit_count : 0),
      0
    );
    return { units, weight };
  }, [parsed.numeric]);

  return (
    <div className="li-wrap">
      {itemsS.map((it, idx) => {
        const errs = parsed.errs[idx];
        const mkId = (key: keyof LoadItemStrings) => `${it.id}__${key}`;

        return (
          <div className="li-row" key={it.id}>
            <div className="li-grid">
              <Field id={mkId("label")} label="Label">
                <input
                  id={mkId("label")}
                  type="text"
                  value={it.label ?? ""}
                  onChange={(e) => setText(it.id, e.target.value)}
                  placeholder="optional"
                />
              </Field>

              <Field id={mkId("unit_count")} label="Unit Count">
                <input
                  id={mkId("unit_count")}
                  type="number"
                  inputMode="numeric"
                  value={it.unit_count}
                  onChange={(e) => setNumStr(it.id, "unit_count", e.target.value)}
                />
              </Field>

              <Field id={mkId("unit_weight")} label="Unit Weight (lbs)">
                <input
                  id={mkId("unit_weight")}
                  type="number"
                  inputMode="decimal"
                  value={it.unit_weight}
                  onChange={(e) => setNumStr(it.id, "unit_weight", e.target.value)}
                />
              </Field>

              <Field id={mkId("unit_length")} label="Unit Length (in)">
                <input
                  id={mkId("unit_length")}
                  type="number"
                  inputMode="decimal"
                  value={it.unit_length}
                  onChange={(e) => setNumStr(it.id, "unit_length", e.target.value)}
                />
              </Field>

              <Field id={mkId("unit_width")} label="Unit Width (in)">
                <input
                  id={mkId("unit_width")}
                  type="number"
                  inputMode="decimal"
                  value={it.unit_width}
                  onChange={(e) => setNumStr(it.id, "unit_width", e.target.value)}
                />
              </Field>

              <Field id={mkId("unit_height")} label="Unit Height (in)">
                <input
                  id={mkId("unit_height")}
                  type="number"
                  inputMode="decimal"
                  value={it.unit_height}
                  onChange={(e) => setNumStr(it.id, "unit_height", e.target.value)}
                />
              </Field>

              <Field id={mkId("stack_height")} label="Stack Height">
                <input
                  id={mkId("stack_height")}
                  type="number"
                  inputMode="numeric"
                  value={it.stack_height}
                  onChange={(e) => setNumStr(it.id, "stack_height", e.target.value)}
                />
              </Field>
            </div>

            <div className="li-actions">
              <button type="button" className="btn btn-ghost" onClick={() => duplicateRow(it.id)}>
                Duplicate
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => removeRow(it.id)}>
                Remove
              </button>
            </div>

            {errs.length > 0 && <div className="li-errors">{errs.join(" · ")}</div>}
          </div>
        );
      })}

      <div className="li-footer">
        <button type="button" className="btn btn-ghost" onClick={addRow}>+ Add Load</button>
        <div className="li-totals">
          <strong>Total units:</strong> {totals.units} &nbsp; | &nbsp;
          <strong>Approx. total weight (lbs):</strong> {totals.weight}
        </div>
      </div>
    </div>
  );
};

export default LoadInfoForm;
