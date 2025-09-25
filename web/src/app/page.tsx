// web/app/page.tsx
export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
        SWEat Web
      </h1>
    </main>
  );
}
