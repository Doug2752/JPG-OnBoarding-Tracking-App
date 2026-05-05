// ── FITNESS SECTION — FitnessSection.js ──────────────────────
// Extraction only. No logic changes.

function FitnessSection({ storage, startDate }) {
  var [day, setDay] = useState(1);
  var [data, setData] = useState({});
  var [saved, setSaved] = useState(false);

  useEffect(function () {
    storage.load("fitness6", {}).then(function (d) { return d && setData(d); });
  });

  function getDayData(d) {
    return data[d] || { activity: "", activityOther: "", duration: "", intensity: null, notes: "", addl: "" };
  }

  function upd(k, v) {
    var n = _objectSpread(_objectSpread({}, data), {}, _defineProperty({}, day,
      _objectSpread(_objectSpread({}, getDayData(day)), {}, _defineProperty({}, k, v))
    ));
    setData(n);
    storage.save("fitness6", n);
    setSaved(true);
    setTimeout(function () { return setSaved(false); }, 1500);
  }

  var filled = {};
  DAYS.forEach(function (d) {
    var x = data[d];
    if (x && x.activity) filled[d] = true;
  });

  var dd = getDayData(day);
  var rate = ACTIVITY_RATE[dd.activity] || 0;
  var burnKcal =
    rate > 0 && parseFloat(dd.duration) > 0
      ? Math.round((parseFloat(dd.duration) / 60) * rate)
      : 0;

  var cats = {};
  ACTIVITIES.forEach(function (a) {
    if (!a[2]) {
      if (!cats[""]) cats[""] = [];
      cats[""].push(a[0]);
      return;
    }
    if (!cats[a[2]]) cats[a[2]] = [];
    cats[a[2]].push(a[0]);
  });

  return React.createElement(
    "div",
    null,
    React.createElement("div", { style: S.blockGold }, "SECTION 03 \u2014 FITNESS & ACTIVITY TRACKING"),
    React.createElement(
      "div",
      { style: S.card },
      React.createElement(
        "div",
        { style: S.infoBox },
        "Record all physical activity. Select from the dropdown or use Other. Select None if nothing was done. Select Rest for a deliberate recovery day. Calorie burn is estimated automatically from activity type and duration."
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
        })
      ),
      React.createElement("div", { style: S.dayTag }, formatDayDate(startDate, day)),

      // Activity dropdown
      React.createElement(
        Field,
        { label: "Activity / Workout" },
        React.createElement(
          "select",
          {
            style: S.select,
            value: dd.activity || "",
            onChange: function (e) { return upd("activity", e.target.value); },
          },
          React.createElement("option", { value: "" }, "Select activity..."),
          cats[""] && cats[""].map(function (a) {
            return React.createElement("option", { key: a, value: a }, a);
          }),
          Object.entries(cats)
            .filter(function ([k]) { return k; })
            .map(function ([catName, items]) {
              return React.createElement(
                "optgroup",
                { key: catName, label: catName },
                items.map(function (a) {
                  return React.createElement("option", { key: a, value: a }, a);
                })
              );
            })
        )
      ),

      // Write-in field for Other
      dd.activity === "Other \u2014 Write In" &&
        React.createElement(
          Field,
          { label: "Describe Activity" },
          React.createElement("input", {
            style: S.input,
            placeholder: "Describe your activity...",
            value: dd.activityOther || "",
            onChange: function (e) { return upd("activityOther", e.target.value); },
          })
        ),

      React.createElement(
        "div",
        { style: S.grid2 },
        React.createElement(
          Field,
          { label: "Duration (minutes)" },
          React.createElement("input", {
            type: "number", min: "0", style: S.input, placeholder: "e.g. 45",
            value: dd.duration || "",
            onChange: function (e) { return upd("duration", e.target.value); },
          })
        ),
        React.createElement(
          Field,
          { label: "Notes (steps if known)" },
          React.createElement("input", {
            style: S.input,
            value: dd.notes || "",
            onChange: function (e) { return upd("notes", e.target.value); },
          })
        )
      ),

      React.createElement(
        Field,
        { label: "Intensity 1\u201310 (RPE)" },
        React.createElement(RatingButtons, {
          value: dd.intensity,
          onChange: function (v) { return upd("intensity", v); },
        })
      ),

      // Calorie burn display
      React.createElement(
        "div",
        {
          style: {
            background: DARK, borderRadius: "4px", padding: "10px 14px",
            marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center",
          },
        },
        React.createElement(
          "div",
          null,
          React.createElement("div", { style: S.calLabel }, "Estimated Calorie Burn"),
          React.createElement(
            "div",
            { style: { fontSize: "10px", color: "#888", marginTop: "1px" } },
            rate > 0
              ? "Based on " + rate + " kcal/hr"
              : "Select activity and duration to calculate"
          )
        ),
        React.createElement(
          "div",
          { style: S.calValue },
          burnKcal > 0 ? burnKcal.toLocaleString() + " kcal" : "\u2014"
        )
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
  );
}
