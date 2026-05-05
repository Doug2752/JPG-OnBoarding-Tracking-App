// ── CLIENT INFO — ClientInfo.js ───────────────────────────────
// Extraction only. No logic changes.

function ClientInfo({ storage }) {
  var def = {
    fullName: "", dateStarted: "", phoneEmail: "", occupation: "",
    primaryGoal: "", goal2: "", goal3: "", nonNeg: "", hobbies: "",
    fitnessActivity: "", eatingHabits: "", sleepPatterns: "",
    injuries: "", additional: "",
  };

  var [data, setData] = useState(def);
  var [saved, setSaved] = useState(false);

  useEffect(function () {
    storage.load("clientInfo", def).then(function (d) { return d && setData(d); });
  });

  function upd(k, v) {
    var n = _objectSpread(_objectSpread({}, data), {}, _defineProperty({}, k, v));
    setData(n);
    storage.save("clientInfo", n);
    setSaved(true);
    setTimeout(function () { return setSaved(false); }, 1500);
  }

  var inp = function (k) {
    return React.createElement("input", {
      style: S.input,
      value: data[k] || "",
      onChange: function (e) { return upd(k, e.target.value); },
    });
  };

  var ta = function (k, rows) {
    return React.createElement("textarea", {
      style: _objectSpread(_objectSpread({}, S.textarea), {}, { minHeight: (rows || 2) * 28 + "px" }),
      value: data[k] || "",
      onChange: function (e) { return upd(k, e.target.value); },
    });
  };

  return React.createElement(
    "div",
    null,
    React.createElement("div", { style: S.blockGold }, "CLIENT INFORMATION"),
    React.createElement(
      "div",
      { style: S.card },
      React.createElement(
        "div",
        { style: S.infoBox },
        "Complete this section once at the start of your 14-day period. Be specific \u2014 vague answers produce ambiguity which may taint the results."
      ),
      React.createElement(
        "div",
        { style: S.grid2 },
        React.createElement(Field, { label: "Full Name" }, inp("fullName")),
        React.createElement(Field, { label: "Date Started (MM/DD/YYYY)" }, inp("dateStarted"))
      ),
      React.createElement(Field, { label: "Phone / Email" }, inp("phoneEmail")),
      React.createElement(Field, { label: "Occupation & Work Schedule" }, ta("occupation", 3)),
      React.createElement(Field, { label: "Goal 1 \u2014 Primary Goal: why are you here?" }, ta("primaryGoal", 3)),
      React.createElement(Field, { label: "Goal 2" }, ta("goal2", 2)),
      React.createElement(Field, { label: "Goal 3" }, ta("goal3", 2)),
      React.createElement(Field, { label: "Current Non-Negotiables" }, ta("nonNeg", 2)),
      React.createElement(Field, { label: "Hobbies & Free Time" }, ta("hobbies", 2)),
      React.createElement(Field, { label: "Current Fitness Activity" }, ta("fitnessActivity", 2)),
      React.createElement(Field, { label: "Current Eating Habits \u2014 describe a typical day" }, ta("eatingHabits", 3)),
      React.createElement(Field, { label: "Sleep \u2014 typical bedtime, wake time, quality" }, ta("sleepPatterns", 2)),
      React.createElement(Field, { label: "Injuries, Medical Conditions, or Physical Limitations" }, ta("injuries", 2)),
      React.createElement(
        "div",
        { style: S.addlWrap },
        React.createElement("div", { style: S.addlLabel }, "Additional Information"),
        ta("additional", 4)
      ),
      React.createElement(SaveNote, { show: saved })
    )
  );
}
