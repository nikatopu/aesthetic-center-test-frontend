import { useGlobalContext } from "../../../store/GlobalContext";

export function EmptyState({ message, linkText, linkTo }) {
  const { setPage } = useGlobalContext();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        background: "#fff",
        border: "1px dashed #ccc",
        borderRadius: "8px",
      }}
    >
      <p style={{ color: "#666" }}>{message}</p>
      {linkTo && (
        <a
          onClick={() => {
            setPage(linkTo);
          }}
          style={{
            color: "var(--primary)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {linkText}
        </a>
      )}
    </div>
  );
}
