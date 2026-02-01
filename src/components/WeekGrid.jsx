export default function WeekGrid({ days }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((done, i) => (
        <div
          key={i}
          className={`h-6 w-6 rounded-md ${
            done ? "bg-slate-900" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}