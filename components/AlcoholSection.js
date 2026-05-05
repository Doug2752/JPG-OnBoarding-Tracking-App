// ── ALCOHOL SECTION — AlcoholSection.js ──────────────────────
// Extraction only. No logic changes.

function AlcoholSection({ storage, startDate }) {
  var [day, setDay] = useState(1);
  var [data, setData] = useState({});
  var [saved, setSaved] = useState(false);

  useEffect(function () {
    storage.load("alcohol6", {}).then(function (d) { return d && setData(d); });
  });

  function getDayData(d) {
    return data[d] || { beer: "", mixed: "", otherNone: "", notes: "", addl: "" };
  }

  function upd(k, v) {
    var n = _objectSpread(_objectSpread({}, data), {}, _defineProperty({}, day,
      _objectSpread(_objectSpread({}, getDayData(day)), {}, _defineProperty({}, k, v))
    ));
    setData(n);
    storage.save("alcohol6", n);
    setSaved(true);
    setTimeout(function () { return setSaved(false); }, 1500);
  }

  var filled = {};
  DAYS.forEach(function (d) {
    var x = data[d];
    if (x && (x.beer || x.mixed || x.otherNone)) filled[d] = true;
  });

  var dd = getDayData(day);
  var isSummary = day === 15;

  function buildSummary() {
    var b = 0, m = 0;
    DAYS.forEach(function (d) {
      var x = data[d];
      if (!x) return;
      b += parseInt(x.beer) || 0;
      m += parseInt(x.mixed) || 0;
    });
    return { totalBeer: b, totalMixed: m, total: b + m };
  }

  return React.createElement(
    "div",
    null,
    React.createElement("div", { style: S.blockGold }, "SECTION 02 \u2014 ALCOHOL TRACKING"),
    React.createElement(
      "div",
      { style: S.card },
      !isSummary &&
        React.createElement(
          "div",
          { style: S.infoBox },
          "Track all alcohol consumed each day. If no alcohol was consumed, write None in the Other / None field. Do not leave any day blank."
        ),
      React.createElement("div", { style: { fontSize: "11px", color: "#6A6A6A", marginBottom: "7px" } }, "Select a day to log:"),
      React.createElement(
        "div",
        { style: S.dayPicker },
        DAYS.map(function (d) {
          return React.createElement(DayBtn, {
            key: d, day: d, active: d === day, filled: !!filled[d],
            onClick: function () { return setDay(d); },
          });
        }),
        React.createElement(SummaryBtn, { active: day === 15, onClick: function () { return setDay(15); } })
      ),

      // Summary view
      isSummary
        ? (function () {
            var s = buildSummary();
            return React.createElement(
              "div",
              null,
              React.createElement("div", { style: _objectSpread(_objectSpread({}, S.blockCharcoal), {}, { borderRadius: "4px" }) }, "14-DAY ALCOHOL SUMMARY"),
              React.createElement(
                "div",
                { style: { background: "#f8f8f6", border: "1px solid " + BORDER, borderTop: "none", borderRadius: "0 0 4px 4px", padding: "16px" } },
                React.createElement(
                  "div",
                  { style: S.grid3 },
                  [["Beer (12 oz)", s.totalBeer], ["Mixed Drinks", s.totalMixed], ["Total Drinks", s.total]].map(function ([l, v]) {
                    return React.createElement(
                      "div",
                      { key: l, style: { background: CHARCOAL, borderRadius: "6px", padding: "12px", textAlign: "center" } },
                      React.createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: GOLD } }, v),
                      React.createElement("div", { style: { fontSize: "9px", color: "#aaa", letterSpacing: "1px", marginTop: "2px" } }, l.toUpperCase())
                    );
                  })
                )
              )
            );
          })()

        // Daily entry view
        : React.createElement(
            "div",
            null,
            React.createElement("div", { style: S.dayTag }, formatDayDate(startDate, day)),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", alignItems: "end" } },
              React.createElement(
                "div",
                { style: S.field },
                React.createElement("label", { style: S.label }, "Beer (12 oz drinks)"),
                React.createElement("input", {
                  type: "number", min: "0", style: S.input,
                  value: dd.beer || "",
                  onChange: function (e) { return upd("beer", e.target.value); },
                })
              ),
              React.createElement(
                "div",
                { style: S.field },
                React.createElement("label", { style: S.label }, "Mixed Drinks"),
                React.createElement("input", {
                  type: "number", min: "0", style: S.input,
                  value: dd.mixed || "",
                  onChange: function (e) { return upd("mixed", e.target.value); },
                })
              ),
              React.createElement(
                "div",
                { style: S.field },
                React.createElement("label", { style: S.label }, "Other / None"),
                React.createElement("label", { style: S.labelSm }, "Wine, spirits, or write None"),
                React.createElement("input", {
                  style: S.input, placeholder: "None",
                  value: dd.otherNone || "",
                  onChange: function (e) { return upd("otherNone", e.target.value); },
                })
              )
            ),
            React.createElement(
              Field,
              { label: "Notes" },
              React.createElement("textarea", {
                style: S.textarea,
                value: dd.notes || "",
                onChange: function (e) { return upd("notes", e.target.value); },
              })
            ),
            React.createElement(
              "div",
              { style: S.addlWrap },
              React.createElement("div", { style: S.addlLabel }, "Additional Information \u2014 Day ", day),
              React.createElement("textarea", {
                style: S.textarea,
                value: dd.addl || "",
                onChange: function (e) { return upd("addl", e.target.value); },
              })
            ),
            React.createElement(SaveNote, { show: saved })
          )
    )
  );
}
