// ── LOGIN — Login.js ──────────────────────────────────────────
// Extraction only. No logic changes.

function Login({ onLogin }) {
  var [u, setU] = useState("Doug");
  var [p, setP] = useState("");
  var [err, setErr] = useState("");

  function attempt() {
    var uu = (u || "").trim();
    var pp = (p || "").trim();
    if (USERS[uu] && USERS[uu] === pp) onLogin(uu);
    else setErr("Incorrect password. Please try again.");
  }

  function onKey(e) {
    if (e.key === "Enter") attempt();
  }

  return React.createElement(
    "div",
    {
      style: {
        minHeight: "100vh",
        background: GOLD,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Gill Sans MT','Gill Sans',Calibri,sans-serif",
        boxSizing: "border-box",
        width: "100%",
      },
    },
    React.createElement("img", {
      src: LOGO_LIGHT,
      alt: "Jones Performance Group",
      style: { width: "min(220px,58vw)", marginBottom: "22px", display: "block" },
    }),
    React.createElement(
      "div",
      {
        style: {
          fontSize: "clamp(22px,6vw,34px)",
          fontWeight: "900",
          color: "#000000",
          letterSpacing: "6px",
          marginBottom: "6px",
          textAlign: "center",
        },
      },
      "14-DAY TRACKING"
    ),
    React.createElement(
      "div",
      {
        style: {
          fontSize: "clamp(13px,3.5vw,16px)",
          color: "#1A1A1A",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "28px",
          textAlign: "center",
          fontWeight: "600",
        },
      },
      "Initial Onboarding Log"
    ),
    React.createElement(
      "div",
      {
        style: {
          background: "#fff",
          borderRadius: "8px",
          padding: "clamp(18px,5vw,28px)",
          width: "100%",
          maxWidth: "360px",
          border: "1px solid " + GOLD_DARK,
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
      React.createElement(
        "div",
        { style: { marginBottom: "14px" } },
        React.createElement(
          "label",
          {
            style: {
              display: "block",
              fontSize: "10px",
              fontWeight: "700",
              color: MID,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "5px",
            },
          },
          "Performer / User"
        ),
        React.createElement(
          "select",
          {
            style: _objectSpread(_objectSpread({}, S.select), {}, { background: "#F5F4F1", border: "1px solid #D8D5CF" }),
            value: u,
            onChange: function (e) { setU(e.target.value); setErr(""); },
          },
          React.createElement("option", { value: "Doug" }, "Doug"),
          React.createElement("option", { value: "Test" }, "Test")
        )
      ),
      React.createElement(
        "div",
        { style: { marginBottom: "18px" } },
        React.createElement(
          "label",
          {
            style: {
              display: "block",
              fontSize: "10px",
              fontWeight: "700",
              color: MID,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "5px",
            },
          },
          "Password"
        ),
        React.createElement("input", {
          type: "password",
          placeholder: "Password",
          value: p,
          autoComplete: "current-password",
          style: _objectSpread(_objectSpread({}, S.input), {}, { background: "#F5F4F1", border: "1px solid #D8D5CF" }),
          onChange: function (e) { setP(e.target.value); setErr(""); },
          onKeyDown: onKey,
        })
      ),
      React.createElement(
        "button",
        {
          onClick: attempt,
          style: {
            width: "100%",
            padding: "12px",
            background: GOLD,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            letterSpacing: "1px",
            fontFamily: "inherit",
          },
        },
        "Enter Tracking Log"
      ),
      err &&
        React.createElement(
          "div",
          { style: { color: RED, fontSize: "12px", textAlign: "center", marginTop: "10px" } },
          err
        )
    ),
    React.createElement(
      "div",
      {
        style: {
          marginTop: "18px",
          fontSize: "10px",
          color: DARK,
          textAlign: "center",
          letterSpacing: "1px",
          opacity: 0.6,
        },
      },
      "JPG-TK-001 \xB7 Jones Performance Group LLC \xB7 CONFIDENTIAL"
    )
  );
}
