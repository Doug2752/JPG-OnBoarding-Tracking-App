// ── SHARED COMPONENTS — Shared.js ────────────────────────────
// Extraction only. No logic changes.

function Field({ label, labelSm, children }) {
  return React.createElement("div", { style: S.field },
    label && React.createElement("label", { style: S.label }, label),
    labelSm && React.createElement("label", { style: S.labelSm }, labelSm),
    children
  );
}

function SaveNote({ show }) {
  return show
    ? React.createElement("div", { style: S.saveNote }, "Saved.")
    : null;
}

function DayBtn({ day, active, filled, onClick }) {
  var extra = active
    ? { background: GOLD, border: "2px solid " + GOLD_DARK, color: "#fff" }
    : filled
    ? { background: GOLD_LIGHT, border: "2px solid " + GOLD, color: GOLD_DARK }
    : {};
  return React.createElement(
    "button",
    { style: _objectSpread(_objectSpread({}, S.ratingBtn), extra), onClick: onClick },
    day
  );
}

function SummaryBtn({ active, onClick }) {
  return React.createElement(
    "button",
    {
      style: _objectSpread(
        _objectSpread({}, S.ratingBtn),
        {},
        { width: "auto", padding: "0 8px", fontSize: "9px" },
        active
          ? { background: GOLD, border: "2px solid " + GOLD_DARK, color: "#fff" }
          : { background: "#f0f0f0", border: "2px solid #ccc", color: MID }
      ),
      onClick: onClick,
    },
    "Sum"
  );
}

function RatingButtons({ value, onChange, steel }) {
  return React.createElement(
    "div",
    { style: S.ratingRow },
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) {
      var active = value === n;
      var extra = active
        ? steel
          ? { background: STEEL, border: "2px solid " + STEEL_MID, color: "#fff" }
          : { background: GOLD, border: "2px solid " + GOLD_DARK, color: "#fff" }
        : {};
      return React.createElement(
        "button",
        {
          key: n,
          style: _objectSpread(_objectSpread({}, S.ratingBtn), extra),
          onClick: function () { return onChange(active ? null : n); },
        },
        n
      );
    })
  );
}

function InputWithToggle({ value, onChange, placeholder, type, unitLabel, onToggle }) {
  return React.createElement(
    "div",
    { style: { display: "flex", alignItems: "center" } },
    React.createElement("input", {
      type: type || "text",
      style: _objectSpread(_objectSpread({}, S.input), {}, { flex: 1 }),
      placeholder: placeholder,
      value: value || "",
      onChange: onChange,
    }),
    React.createElement("button", { style: S.unitBtn, onClick: onToggle }, unitLabel)
  );
}

function SleepFieldCol({ label, labelSm, children }) {
  return React.createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" } },
    React.createElement(
      "div",
      null,
      React.createElement("div", { style: _objectSpread(_objectSpread({}, S.label), {}, { fontSize: "10px" }) }, label),
      labelSm && React.createElement("div", { style: { fontSize: "9px", color: "#888", marginBottom: "2px" } }, labelSm)
    ),
    React.createElement("div", { style: { marginTop: "4px" } }, children)
  );
}
