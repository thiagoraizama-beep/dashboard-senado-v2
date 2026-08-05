import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { GEO_URL, UF_TO_REGIAO } from "./brazilRegions.js";

function colorForRecall(value, max, min) {
  const t = max === min ? 1 : (value - min) / (max - min);
  const lightness = 82 - t * 42;
  return `hsl(217, 75%, ${lightness}%)`;
}

export default function BrazilRegionMap({ data }) {
  const [hovered, setHovered] = useState(null);
  const values = data.map((d) => d.recall);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const byRegion = Object.fromEntries(data.map((d) => [d.regiao, d]));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 220, height: 260, flexShrink: 0, overflow: "visible" }}>
        <ComposableMap projection="geoMercator" projectionConfig={{ center: [-54, -15], scale: 290 }} width={220} height={260}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const uf = geo.properties.sigla;
                const regiao = UF_TO_REGIAO[uf];
                const info = byRegion[regiao];
                const isHovered = hovered === regiao;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHovered(regiao)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill: info ? colorForRecall(info.recall, max, min) : "var(--border)",
                        stroke: "var(--card-bg)",
                        strokeWidth: isHovered ? 1.2 : 0.6,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: info ? colorForRecall(info.recall, max, min) : "var(--border)",
                        stroke: "var(--card-bg)",
                        strokeWidth: 1.2,
                        outline: "none",
                      },
                      pressed: {
                        fill: info ? colorForRecall(info.recall, max, min) : "var(--border)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
        {data
          .slice()
          .sort((a, b) => b.recall - a.recall)
          .map((d) => (
            <div
              key={d.regiao}
              onMouseEnter={() => setHovered(d.regiao)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                borderRadius: 8,
                background: hovered === d.regiao ? "var(--accent-soft)" : "transparent",
                cursor: "pointer",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: colorForRecall(d.recall, max, min),
                  display: "inline-block",
                }}
              />
              {d.regiao} <strong>{d.recall}%</strong>
            </div>
          ))}
      </div>
    </div>
  );
}
