export function parseRank(rankRaw: string) {
  const rank = (rankRaw || "").toUpperCase();
  const isDan = rank.includes("DAN");
  const type = isDan ? "DAN" : "KUP";

  let number = "—";
  if (isDan) {
    const m = rank.match(/[XIV]+|\d+/);
    if (m) number = m[0];
  } else {
    number = rank.replace(/\D/g, "") || "—";
  }
  return { type, number, rank };
}
