import React from "react";

const CountrySelect = ({ setCountryCode }) => {
  const countries = [
    { name: "Uganda", code: "+256" },
    { name: "Kenya", code: "+254" },
    { name: "Tanzania", code: "+255" },
    { name: "USA", code: "+1" },
    { name: "UK", code: "+44" },
  ];

  return (
    <select onChange={(e) => setCountryCode(e.target.value)}>
      {countries.map((c, i) => (
        <option key={i} value={c.code}>
          {c.name} ({c.code})
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;