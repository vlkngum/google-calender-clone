export {};

declare global {
  interface Window {
    currentMonth: number | null;
    currentYear: number | null;
    selectedDay: number | null;
  }
}