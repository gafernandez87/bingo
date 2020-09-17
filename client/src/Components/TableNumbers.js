import React, { memo } from "react";

const allNumbers = [];
for (let i = 0; i <= 8; i++) {
  const row = [];
  for (let j = 1; j <= 10; j++) {
    row.push(i * 10 + j);
  }
  if (i === 9) {
    allNumbers.push(row.slice(0, row.length - 1));
  } else {
    allNumbers.push(row);
  }
}
const TableNumbers = ({ doneNumbers }) => {
  return (
    <table>
      <tbody>
        {allNumbers.map((row, i) => {
          return (
            <tr key={i}>
              {row.map((n) => (
                <td
                  key={n}
                  style={
                    doneNumbers.includes(n)
                      ? { backgroundColor: "#a1e49b" }
                      : null
                  }
                >
                  {n}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default memo(TableNumbers);
