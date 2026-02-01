import Header from "@/components/Header";
import HabitCard from "@/components/HabitCard";
import WeekGrid from "@/components/WeekGrid";
import ProgressBar from "@/components/ProgressBar";
import { habits } from "./data/dummyHabits";

export default function Home() {
  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      <Header />

      <div className="space-y-3">
        {habits.map(h => (
          <HabitCard key={h.id} habit={h} />
        ))}
      </div>

      <WeekGrid days={[1,1,0,1,1,1,0]} />
      <ProgressBar value={86} />
    </main>
  );
}