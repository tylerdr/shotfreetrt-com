/** Generic, user-initiated calendar export. Accepts no answers, concern, email or quote. */
export function buildBriefReminder(now: Date, uid: string): string {
  if (!Number.isFinite(now.getTime()) || !/^[a-z0-9-]{1,40}$/i.test(uid)) throw new TypeError("Invalid reminder date or identifier");
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 7));
  const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1);
  const day = (date: Date) => date.toISOString().slice(0, 10).replaceAll("-", "");
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ShotFreeTRT//Checklist//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${uid}@shotfreetrt.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${day(start)}`, `DTEND;VALUE=DATE:${day(end)}`, "SUMMARY:Review my checklist", "DESCRIPTION:Review your saved questions and written costs.", "URL:https://shotfreetrt.com/", "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
}
