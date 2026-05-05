// ── SUPPLEMENT ADDER — SuppAdder.js ──────────────────────────
// Extraction only. No logic changes.

function SuppAdder({ suppLog, onUpdSupps, recentSupps, onUpdateRecent }) {
  var [open, setOpen] = useState(false);
  var [cat, setCat] = useState(null);
  var [q, setQ] = useState("");
  var [dosage, setDosage] = useState("");
  var [selected, setSelected] = useState("");
  var [meal, setMeal] = useState("AM");

  var filtered =
    q.length >= 2
      ? (function () {
          var ql = q.toLowerCase();
          var hits = [];
          Object.entries(SUPPLEMENTS).forEach(function ([, items]) {
            return items.forEach(function (it) {
              if (it.toLowerCase().includes(ql)) hits.push(it);
            });
          });
          return hits.slice(0, 12);
        })()
      : null;

  function addSupp(name) {
    setSelected(name);
    setQ("");
    setCat(null);
    setOpen(false);
  }

  function confirmAdd() {
    if (!selected) return;
    var entry = { name: selected, dosage: dosage || "", meal: meal };
    onUpdSupps([].concat(_toConsumableArray(suppLog), [entry]));
    var next = [selected]
      .concat(_toConsumableArray(recentSupps.filter(function (r) { return r !== selected; })))
      .slice(0, 10);
    onUpdateRecent(next);
    setSelected("");
    setDosage("");
    setMeal("AM");
  }

  function removeSupp(i) {
    onUpdSupps(suppLog.filter(function (_, idx) { return idx !== i; }));
  }

  var MEALS = ["AM", "Midday", "PM"];
  var mc = { AM: GOLD, Midday: STEEL, PM: GREEN };

  return React.createElement(
    "div",
    null,
    // Grouped display by meal
    MEALS.map(function (m) {
      var items = suppLog.filter(function (e) { return e.meal === m; });
      if (!items.length) return null;
      return React.createElement(
        "div",
        { key: m, style: { marginBottom: "6px" } },
        React.createElement(
          "div",
          {
            style: {
              fontSize: "10px",
              fontWeight: "700",
              color: mc[m],
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "3px",
            },
          },
          m
        ),
        React.createElement(
          "div",
          { style: S.chipWrap },
          items.map(function (e, i) {
            var ri = suppLog.indexOf(e);
            return React.createElement(
              "span",
              { key: i, style: S.chip },
              e.name,
              e.dosage ? " \u2014 " + e.dosage : "",
              React.createElement(
                "button",
                { style: S.chipX, onClick: function () { return removeSupp(ri); } },
                "\xD7"
              )
            );
          })
        )
      );
    }),

    // Confirm-add panel
    selected &&
      React.createElement(
        "div",
        {
          style: {
            background: GOLD_LIGHT,
            border: "1px solid " + GOLD,
            borderRadius: "4px",
            padding: "10px 12px",
            marginBottom: "8px",
          },
        },
        React.createElement(
          "div",
          { style: { fontSize: "11px", fontWeight: "700", color: GOLD_DARK, marginBottom: "8px" } },
          "Adding: ",
          selected
        ),
        React.createElement(
          "div",
          { style: S.grid3 },
          React.createElement(
            Field,
            { label: "Dosage (e.g. 400mg)" },
            React.createElement("input", {
              style: S.input,
              placeholder: "Dosage...",
              value: dosage,
              onChange: function (e) { return setDosage(e.target.value); },
            })
          ),
          React.createElement(
            Field,
            { label: "Meal" },
            React.createElement(
              "select",
              {
                style: S.select,
                value: meal,
                onChange: function (e) { return setMeal(e.target.value); },
              },
              MEALS.map(function (m) {
                return React.createElement("option", { key: m, value: m }, m);
              })
            )
          ),
          React.createElement(
            Field,
            { label: " " },
            React.createElement(
              "button",
              {
                style: _objectSpread(_objectSpread({}, S.copyBtn), {}, {
                  width: "100%",
                  background: GOLD,
                  color: "#fff",
                  border: "none",
                  marginTop: "14px",
                }),
                onClick: confirmAdd,
              },
              "Add \u2713"
            )
          )
        ),
        React.createElement(
          "button",
          {
            style: { fontSize: "11px", color: "#888", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" },
            onClick: function () { setSelected(""); setDosage(""); },
          },
          "Cancel"
        )
      ),

    // Toggle button
    React.createElement(
      "button",
      {
        style: _objectSpread(_objectSpread({}, S.copyBtn), {}, { marginBottom: "6px" }),
        onClick: function () { return setOpen(!open); },
      },
      open ? "\u25B2 Close" : "\uFF0B Add Supplement"
    ),

    // Search / browse panel
    open &&
      React.createElement(
        "div",
        { style: { marginBottom: "8px" } },
        React.createElement("input", {
          style: _objectSpread(_objectSpread({}, S.input), {}, { marginBottom: "5px", fontSize: "12px" }),
          placeholder: "Search supplements...",
          value: q,
          onChange: function (e) { return setQ(e.target.value); },
        }),
        React.createElement(
          "div",
          { style: S.suppPanel },
          // Recent supplements
          !q && recentSupps.length > 0 &&
            React.createElement(
              "div",
              null,
              React.createElement("div", { style: S.suppRecent }, "\u2605 Recent"),
              recentSupps.map(function (s) {
                return React.createElement(
                  "div",
                  { key: s, style: S.suppRecentItem, onClick: function () { return addSupp(s); } },
                  s
                );
              })
            ),
          // Search results
          q &&
            filtered &&
            filtered.map(function (s) {
              return React.createElement(
                "div",
                { key: s, style: S.suppItem, onClick: function () { return addSupp(s); } },
                s
              );
            }),
          // Category browse
          !q &&
            Object.entries(SUPPLEMENTS).map(function ([catName, items]) {
              return React.createElement(
                "div",
                { key: catName },
                React.createElement(
                  "div",
                  {
                    style: S.suppCat,
                    onClick: function () { return setCat(cat === catName ? null : catName); },
                  },
                  cat === catName ? "\u25BC" : "\u25B6",
                  " ",
                  catName
                ),
                cat === catName &&
                  items.map(function (s) {
                    return React.createElement(
                      "div",
                      { key: s, style: S.suppItem, onClick: function () { return addSupp(s); } },
                      s
                    );
                  })
              );
            })
        )
      )
  );
}
