// ── SNACK BLOCK — SnackBlock.js ───────────────────────────────
// Extraction only. No logic changes.

function SnackBlock({ idx, snackText, dayVal, estimates, estimating, onUpdText, onEstimate, onRemove }) {
  var estKey = dayVal + "_snack" + idx;
  var est = estimates[estKey];
  var isLoading = estimating[estKey];

  function handleKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEstimate("snack" + idx, e.target.value);
    }
  }

  return React.createElement(
    "div",
    {
      style: {
        marginBottom: "10px",
        background: "#fafaf8",
        border: "1px solid " + BORDER,
        borderRadius: "4px",
        padding: "10px 12px",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            fontSize: "11px",
            fontWeight: "700",
            color: GOLD,
            textTransform: "uppercase",
            letterSpacing: "1px",
          },
        },
        "Snack ",
        idx + 1
      ),
      React.createElement(
        "button",
        {
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#aaa",
            fontSize: "14px",
            fontWeight: "700",
            fontFamily: "inherit",
          },
          onClick: onRemove,
        },
        "\xD7"
      )
    ),
    React.createElement(
      "div",
      { style: { fontSize: "10px", color: "#888", fontStyle: "italic", marginBottom: "4px" } },
      "Describe snack. Press Return to calculate calories."
    ),
    React.createElement("textarea", {
      style: _objectSpread(_objectSpread({}, S.textarea), {}, { minHeight: "44px" }),
      placeholder: "Example: Apple and peanut butter, protein shake, handful of almonds.",
      value: snackText || "",
      onChange: function (e) { return onUpdText(e.target.value); },
      onBlur: function (e) { return onEstimate("snack" + idx, e.target.value); },
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
