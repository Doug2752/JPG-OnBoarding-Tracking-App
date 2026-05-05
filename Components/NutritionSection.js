// ── NUTRITION SECTION — NutritionSection.js ──────────────────
// Extraction only. No logic changes.

function NutritionSection({ storage, startDate }) {
  var [day, setDay] = useState(1);
  var [data, setData] = useState({});
  var [recentSupps, setRecentSupps] = useState([]);
  var [saved, setSaved] = useState(false);
  var [estimates, setEstimates] = useState({});
  var [estimating, setEstimating] = useState({});

  useEffect(function () {
    storage.load("nutrition6", {}).then(function (d) { return d && setData(d); });
    storage.load("recentSupps6", []).then(function (d) { return d && setRecentSupps(d); });
    storage.load("calEst6", {}).then(function (d) { return d && setEstimates(d); });
  }, []);

  function getDayData(d) {
    return data[d] || { am: "", midday: "", pm: "", snacks: [], suppLog: [], addl: "" };
  }

  function upd(k, v) {
    var dd = _objectSpread(_objectSpread({}, getDayData(day)), {}, _defineProperty({}, k, v));
    var n = _objectSpread(_objectSpread({}, data), {}, _defineProperty({}, day, dd));
    setData(n);
    storage.save("nutrition6", n);
    setSaved(true);
    setTimeout(function () { return setSaved(false); }, 1500);
  }

  function updRecents(r) {
    setRecentSupps(r);
    storage.save("recentSupps6", r);
  }

  async function runEstimate(meal, text) {
    if (!text || text.trim().length < 5) return;
    var key = day + "_" + meal;
    setEstimating(function (prev) { return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, true)); });
    var result = await estimateCalories(text);
    setEstimating(function (prev) { return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, false)); });
    if (result && result.cal) {
      var n = _objectSpread(_objectSpread({}, estimates), {}, _defineProperty({}, key, result));
      setEstimates(n);
      storage.save("calEst6", n);
    }
  }

  var dd = getDayData(day);
  var isSummary = day === 15;

  var filled = {};
  DAYS.forEach(function (d) {
    var x = data[d];
    if (x && (x.am || x.midday || x.pm)) filled[d] = true;
  });

  var snacks = dd.snacks || [];
  var dayCal =
    ["am", "midday", "pm"].reduce(function (s, m) {
      var e = estimates[day + "_" + m];
      return s + (e ? e.cal : 0);
    }, 0) +
    snacks.reduce(function (s, _, i) {
      var e = estimates[day + "_snack" + i];
      return s + (e ? e.cal : 0);
    }, 0);

  function buildSummary() {
    var totalCal = 0, entryCount = 0;
    DAYS.forEach(function (d) {
      ["am", "midday", "pm"].forEach(function (m) {
        var e = estimates[d + "_" + m];
        if (e) { totalCal += e.cal || 0; entryCount++; }
      });
      var x = data[d];
      if (x && x.snacks) x.snacks.forEach(function (_, i) {
        var e = estimates[d + "_snack" + i];
        if (e) { totalCal += e.cal || 0; entryCount++; }
      });
    });
    return { totalCal, entryCount };
  }

  var sumData = isSummary ? buildSummary() : null;

  return React.createElement(
    "div",
    null,
    React.createElement("div", { style: S.blockGold }, "SECTION 01 \u2014 NUTRITION TRACKING"),
    React.createElement(
      "div",
      { style: S.card },
      !isSummary &&
        React.createElement(
          "div",
          { style: S.infoBox },
          "Record everything you eat and drink \u2014 AM, Midday, PM. Press Return in any field to calculate calories. Use Add Snack for anything eaten between meals. Each snack generates its own estimate and contributes to the daily total."
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
        ? React.createElement(
            "div",
            null,
            React.createElement("div", { style: _objectSpread(_objectSpread({}, S.blockCharcoal), {}, { borderRadius: "4px" }) }, "14-DAY NUTRITION SUMMARY"),
            React.createElement(
              "div",
              { style: { background: "#f8f8f6", border: "1px solid " + BORDER, borderTop: "none", borderRadius: "0 0 4px 4px", padding: "16px" } },
              React.createElement(
                "div",
                { style: S.grid2 },
                React.createElement(
                  "div",
                  { style: { background: GOLD, borderRadius: "6px", padding: "14px", textAlign: "center" } },
                  React.createElement("div", { style: { fontSize: "28px", fontWeight: "700", color: "#fff" } }, sumData.totalCal.toLocaleString()),
                  React.createElement("div", { style: { fontSize: "9px", color: "rgba(255,255,255,0.8)", letterSpacing: "1px", marginTop: "2px" } }, "ESTIMATED TOTAL CALORIES")
                ),
                React.createElement(
                  "div",
                  { style: { background: CHARCOAL, borderRadius: "6px", padding: "14px", textAlign: "center" } },
                  React.createElement("div", { style: { fontSize: "28px", fontWeight: "700", color: "#fff" } }, sumData.entryCount),
                  React.createElement("div", { style: { fontSize: "9px", color: "#aaa", letterSpacing: "1px", marginTop: "2px" } }, "MEALS & SNACKS WITH ESTIMATES")
                )
              ),
              React.createElement(
                "div",
                { style: { marginTop: "12px", fontSize: "11px", color: "#888", fontStyle: "italic" } },
                "Calorie values are AI-generated estimates from your meal descriptions. For general awareness only."
              )
            )
          )

        // Daily entry view
        : React.createElement(
            "div",
            null,
            React.createElement("div", { style: S.dayTag }, formatDayDate(startDate, day)),
            React.createElement(MealBlock, {
              mealKey: "am", mealLabel: "AM", dayVal: day,
              estimates: estimates, estimating: estimating,
              getVal: function (k) { return getDayData(day)[k] || ""; },
              onUpd: upd, onEstimate: runEstimate,
            }),
            React.createElement(MealBlock, {
              mealKey: "midday", mealLabel: "Midday", dayVal: day,
              estimates: estimates, estimating: estimating,
              getVal: function (k) { return getDayData(day)[k] || ""; },
              onUpd: upd, onEstimate: runEstimate,
            }),
            React.createElement(MealBlock, {
              mealKey: "pm", mealLabel: "PM", dayVal: day,
              estimates: estimates, estimating: estimating,
              getVal: function (k) { return getDayData(day)[k] || ""; },
              onUpd: upd, onEstimate: runEstimate,
            }),

            // Snacks
            React.createElement(
              "div",
              { style: { marginBottom: "12px" } },
              snacks.map(function (snack, i) {
                return React.createElement(SnackBlock, {
                  key: i, idx: i, snackText: snack, dayVal: day,
                  estimates: estimates, estimating: estimating,
                  onUpdText: function (text) {
                    var s = _toConsumableArray(snacks);
                    s[i] = text;
                    upd("snacks", s);
                  },
                  onEstimate: runEstimate,
                  onRemove: function () {
                    var s = snacks.filter(function (_, idx) { return idx !== i; });
                    upd("snacks", s);
                  },
                });
              }),
              snacks.length < 10 &&
                React.createElement(
                  "button",
                  {
                    style: _objectSpread(_objectSpread({}, S.copyBtn), {}, { fontSize: "11px" }),
                    onClick: function () { return upd("snacks", [].concat(_toConsumableArray(snacks), [""])); },
                  },
                  "+ Add Snack"
                )
            ),

            // Daily calorie total
            dayCal > 0 &&
              React.createElement(
                "div",
                { style: S.calTotal },
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: S.calLabel }, "Estimated Daily Calories"),
                  React.createElement("div", { style: { fontSize: "10px", color: "#888", marginTop: "1px" } }, "AI estimate \u2014 approximate only")
                ),
                React.createElement("div", { style: S.calValue }, dayCal.toLocaleString(), " kcal")
              ),

            // Supplements
            React.createElement(
              "div",
              { style: S.addlWrap },
              React.createElement("div", { style: S.addlLabel }, "Supplements \u2014 Day ", day),
              React.createElement(
                "div",
                { style: { fontSize: "10px", color: "#888", marginBottom: "8px", fontStyle: "italic" } },
                "Include name and dosage for each (e.g. Vitamin D3 \u2014 5,000 IU)"
              ),
              React.createElement(SuppAdder, {
                suppLog: dd.suppLog || [],
                onUpdSupps: function (log) { return upd("suppLog", log); },
                recentSupps: recentSupps,
                onUpdateRecent: updRecents,
              })
            ),

            // Additional info
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
