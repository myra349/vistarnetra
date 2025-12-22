const API_BASE = "http://localhost:4000";

export async function getData() {
  const res = await fetch(`${API_BASE}/api/data`);
  return res.json();
}

export async function generateTimetable() {
  const res = await fetch(`${API_BASE}/api/generate`);
  return res.json();
}
