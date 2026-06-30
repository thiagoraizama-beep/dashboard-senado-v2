export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 70px",
        background: "var(--accent)",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(20,33,61,0.06)",
      }}
    >
      <span className="footer-bi-text" style={{ color: "#fff", fontSize: 13, textAlign: "center" }}>
        Business Intelligence da Agência Cálix • Insights
      </span>
      <img
        className="footer-calix-logo"
        src="/CALIX_branco.png"
        alt="Cálix"
        style={{ position: "absolute", right: 24, height: 28, objectFit: "contain" }}
      />
    </footer>
  );
}
