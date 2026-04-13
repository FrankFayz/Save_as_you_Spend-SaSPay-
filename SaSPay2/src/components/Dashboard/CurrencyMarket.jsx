import React, { useEffect, useState } from "react";
import "./CurrencyMarket.css";

const currencyNames = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  CHF: "Swiss Franc",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  UGX: "Ugandan Shilling",
  TZS: "Tanzanian Shilling",
};

const fallbackRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  CHF: 0.88,
  JPY: 154.0,
  KES: 150.0,
  UGX: 3800.0,
  TZS: 2500.0,
};

const CurrencyMarket = () => {
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRates = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!response.ok) {
        throw new Error("Could not fetch market data.");
      }

      const data = await response.json();
      const fetchedRates = data.rates || data.conversion_rates || {};
      const filteredRates = {
        USD: fetchedRates.USD,
        EUR: fetchedRates.EUR,
        GBP: fetchedRates.GBP,
        CHF: fetchedRates.CHF,
        JPY: fetchedRates.JPY,
        KES: fetchedRates.KES,
        UGX: fetchedRates.UGX,
        TZS: fetchedRates.TZS,
      };

      if (Object.values(filteredRates).some((value) => value == null)) {
        throw new Error("Incomplete exchange rate data.");
      }

      setRates(filteredRates);
      setLastUpdated(data.time_last_update_utc || data.date || new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("CurrencyMarket fetch error:", err);
      setRates(fallbackRates);
      setLastUpdated("fallback");
      setUsingFallback(true);
      setError(
        "Unable to load live currency data. Showing fallback rates instead. Please check your internet connection for live values."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const currencyList = rates
    ? Object.entries(rates).map(([code, rate]) => {
        const strength = code === "USD" ? 1 : 1 / rate;
        return {
          code,
          name: currencyNames[code] || code,
          rate,
          strength,
        };
      })
    : [];

  const maxStrength = currencyList.reduce(
    (max, item) => Math.max(max, item.strength),
    0
  );

  const displayList = currencyList
    .sort((a, b) => b.strength - a.strength)
    .map((item) => ({
      ...item,
      normalized: maxStrength ? item.strength / maxStrength : 0,
      barWidth: maxStrength ? Math.round((item.strength / maxStrength) * 100) : 0,
    }));

  return (
    <div className="currency-market">
      <div className="currency-market-header">
        <div>
          <h3>Currency Market Snapshot</h3>
          <p>
            Live overview of East African shillings and global benchmark currencies
            against the US Dollar.
          </p>
        </div>
        <button className="currency-refresh" onClick={fetchRates}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="currency-loading">Loading exchange rates…</div>
      ) : (
        <>
          {error && <div className="currency-error">{error}</div>}

          <div className="currency-market-meta">
            <span>Base currency: USD</span>
            <span>Updated: {lastUpdated === "fallback" ? "Fallback data" : lastUpdated}</span>
          </div>

          <div className="currency-market-grid">
            {displayList.map(({ code, name, rate, barWidth }) => (
              <div key={code} className="currency-card">
                <div className="currency-card-top">
                  <div>
                    <strong>{code}</strong>
                    <p>{name}</p>
                  </div>
                  <span className="currency-rate">1 USD = {rate.toFixed(4)}</span>
                </div>

                <div className="currency-bar-track">
                  <div
                    className="currency-bar-fill"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyMarket;
