"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import HabitCard from "@/components/HabitCard";

export default function HabitsPage() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);

  // TODAY DATE (for DB)
  const today = new Date().toISOString().slice(0, 10);

  // DAY + DATE (for UI)
  const todayObj = new Date();
  const day = todayObj.toLocaleDateString("en-IN", {
    weekday: "long",
  });
  const date = todayObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // 🔐 AUTH CHECK FIRST
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);
    await fetchHabits();
    setLoading(false);
  }

  // READ HABITS + TODAY STATUS
  async function fetchHabits() {
    const { data: habitsData, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) return;

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", today);

    const merged = habitsData.map((habit) => {
      const log = logsData?.find(
        (l) => l.habit_id === habit.id
      );

      return {
        ...habit,
        doneToday: !!log,
      };
    });

    setHabits(merged);
  }

  // TICK / UNTICK
  async function toggleHabit(habitId, doneToday) {
    if (doneToday) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("date", today);
    } else {
      await supabase.from("habit_logs").insert({
        habit_id: habitId,
        date: today,
        completed: true,
        user_id: user.id,
      });
    }

    fetchHabits();
  }

  // DELETE HABIT
  async function deleteHabit(habitId) {
    await supabase.from("habit_logs").delete().eq("habit_id", habitId);
    await supabase.from("habits").delete().eq("id", habitId);
    fetchHabits();
  }

  // CREATE HABIT
  async function addHabit() {
    if (!newHabit.trim()) return;

    const { error } = await supabase.from("habits").insert({
      name: newHabit,
      user_id: user.id,
    });

    if (!error) {
      setNewHabit("");
      fetchHabits();
    }
  }

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.doneToday).length;

  const progress =
    totalHabits === 0
      ? 0
      : Math.round((completedToday / totalHabits) * 100);

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617]">
      <div className="max-w-md mx-auto p-6 space-y-6">

        {/* LOGOUT */}
        <div className="flex justify-end">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        {/* DAY + DATE */}
        <div className="text-sm text-slate-400 uppercase tracking-wide">
          {day} · {date}
        </div>

        {/* DAILY PROGRESS */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400">Daily Progress</p>
            <p className="text-sm font-medium text-slate-200">
              {completedToday}/{totalHabits}
            </p>
          </div>

          <div className="w-full h-2 bg-white/10 rounded">
            <div
              className="h-2 bg-emerald-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400">
            {progress}% completed
          </p>
        </div>

        {/* ADD HABIT */}
        <div className="flex gap-2">
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Add new habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button
            onClick={addHabit}
            className="px-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Add
          </button>
        </div>

        {/* LIST TITLE */}
        <h2 className="text-lg font-semibold text-slate-200">
          Today’s Habits
        </h2>

        {/* HABIT LIST */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              doneToday={habit.doneToday}
              onToggle={() =>
                toggleHabit(habit.id, habit.doneToday)
              }
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}