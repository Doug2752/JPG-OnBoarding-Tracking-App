// ── MEAL BLOCK — MealBlock.js ─────────────────────────────────
// Extraction only. No logic changes.

function MealBlock({ mealKey, mealLabel, dayVal, estimates, estimating, getVal, onUpd, onEstimate }) {
  var estKey = dayVal + "_" + mealKey;
  var est = estimates[estKey];
  var isLoading = estimating[estKey];

  var placeholder =
    mealKey === "am"
      ? "Example: 2 scrambled eggs, whole wheat toast with butter, black coffee."
      : mealKey === "midday"
      ? "Example: Grilled chicken sandwich, side salad, sparkling water."
      : "Example: Salmon fillet, roasted vegetables, brown rice.";

  function handleKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEstimate(mealKey, e.target.value);
    }
  }

  return React.createElement(
    "div",
    { style: { marginBottom: "12px" } },
    React.createElement(
      "div",
      {
        style: {
          fontSize: "11px",
          fontWeight: "700",
          color: GOLD,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "3px",
        },
      },
      mealLabel
    ),
    React.createElement(
      "div",
      { style: { fontSize: "10px", color: "#888", fontStyle: "italic", marginBottom: "4px" } },
      "Describe food and drink. Press Return to calculate calories."
    ),
    React.createElement("textarea", {
      style: S.textarea,
      placeholder: placeholder,
      value: getVal(mealKey),
      onChange: function (e) { return onUpd(mealKey, e.target.value); },
      onBlur: function (e) { return onEstimate(mealKey, e.target.value); },
      onKeyDown: handleKey,
    }),
    isLoading &&
      React.createElement(
        "div",
        { style: _objectSpread(_objectSpread({}, S.calEst), {}, { color: "#aaa" }) },
        "\u23F3 Estimating calories..."
      ),
    !isLoading &&
      est &&
      React.createElement(
        "div",
        { style: S.calEst },
        "~ ",
        est.cal.toLocaleString(),
        " kcal estimated",
        est.note ? " \u00B7 " + est.note : ""
      )
  );
}
