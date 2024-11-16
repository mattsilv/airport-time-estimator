export default function EnvTest() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Environment Test</h1>
      <pre
        style={{ background: "#f5f5f5", padding: "10px", borderRadius: "4px" }}
      >
        {JSON.stringify(
          {
            REACT_APP_TOMTOM_API_KEY:
              process.env.REACT_APP_TOMTOM_API_KEY?.substring(0, 5) + "...",
            NODE_ENV: process.env.NODE_ENV,
            allEnvVars: Object.keys(process.env).filter((key) =>
              key.startsWith("NEXT_")
            ),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
