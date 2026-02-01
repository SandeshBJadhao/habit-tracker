"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import HabitCard from "@/components/HabitCard";

/* % formatter: max 2 decimals, no .00 */
function formatPercent(value) {
  const v = Math.floor(value * 100) / 100;
  return Number.isInteger(v) ? v : v.toString().replace(/\.?0+$/, "");
}

export default function HabitsPage() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const todayObj = new Date();
  const day = todayObj.toLocaleDateString("en-IN", { weekday: "long" });
  const date = todayObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function getLast30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

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
    await fetchHabits(user.id);
    await fetchHistory(user.id);
    setLoading(false);
  }

  async function fetchHabits(userId) {
    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", today)
      .eq("user_id", userId);

    const merged = habitsData.map((habit) => {
      const log = logsData?.find((l) => l.habit_id === habit.id);
      return { ...habit, doneToday: !!log };
    });

    setHabits(merged || []);
  }

  async function fetchHistory(userId) {
    const days = getLast30Days();

    const { data } = await supabase
      .from("habit_logs")
      .select("habit_id, date")
      .eq("user_id", userId)
      .in("date", days);

    setHistoryLogs(data || []);
  }

  async function toggleHabit(habitId, doneToday) {
    if (doneToday) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("date", today)
        .eq("user_id", user.id);
    } else {
      await supabase.from("habit_logs").insert({
        habit_id: habitId,
        date: today,
        completed: true,
        user_id: user.id,
      });
    }

    fetchHabits(user.id);
    fetchHistory(user.id);
  }

  async function deleteHabit(habitId) {
    await supabase.from("habit_logs").delete().eq("habit_id", habitId);
    await supabase.from("habits").delete().eq("id", habitId);
    fetchHabits(user.id);
    fetchHistory(user.id);
  }

  async function addHabit() {
    if (!newHabit.trim()) return;

    await supabase.from("habits").insert({
      name: newHabit,
      user_id: user.id,
    });

    setNewHabit("");
    fetchHabits(user.id);
  }

  /* DAILY */
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.doneToday).length;
  const dailyProgress =
    totalHabits === 0 ? 0 : (completedToday / totalHabits) * 100;

  /* MONTHLY */
  const daysCount = getLast30Days().length;
  const maxMonthly = habits.length * daysCount;
  const completedMonthly = historyLogs.length;
  const monthlyProgress =
    maxMonthly === 0 ? 0 : (completedMonthly / maxMonthly) * 100;

  if (loading) {
    return <div className="p-6 text-slate-400">Loading...</div>;
  }

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
            className="text-sm text-red-400"
          >
            Logout
          </button>
        </div>

        <div className="text-sm text-slate-400 uppercase">
          {day} · {date}
        </div>

        {/* DAILY PROGRESS */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">Daily Progress</p>
            <p className="text-sm text-slate-200">
              {completedToday}/{totalHabits}
            </p>
          </div>

          <div className="w-full h-2 bg-white/10 rounded">
            <div
              className="h-2 bg-emerald-500 rounded"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400">
            {formatPercent(dailyProgress)}% completed
          </p>
        </div>

        {/* ADD */}
        <div className="flex gap-2">
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-slate-200"
            placeholder="Add new habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button
            onClick={addHabit}
            className="px-4 rounded-lg bg-emerald-600 text-white"
          >
            Add
          </button>
        </div>

        {/* TODAY LIST */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              doneToday={habit.doneToday}
              onToggle={() => toggleHabit(habit.id, habit.doneToday)}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}
        </div>

        {/* HISTORY GRID */}
        <div className="pt-6 border-t border-white/10">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">
            Last 30 Days
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] space-y-2">
              <div className="flex gap-2 text-xs text-slate-400">
                <div className="w-32">Habit</div>
                {getLast30Days().map((d) => (
                  <div key={d} className="w-6 text-center">
                    {new Date(d).getDate()}
                  </div>
                ))}
              </div>

              {habits.map((habit) => (
                <div key={habit.id} className="flex gap-2 items-center">
                  <div className="w-32 text-sm text-slate-300 truncate">
                    {habit.name}
                  </div>

                  {getLast30Days().map((d) => {
                    const done = historyLogs.some(
                      (l) => l.habit_id === habit.id && l.date === d
                    );

                    return (
                      <div
                        key={d}
                        className={`w-6 h-6 rounded ${
                          done ? "bg-emerald-500" : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MONTHLY COMPLETION */}
        <div className="pt-6 border-t border-white/10">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-slate-400">
                Monthly Completion (Last 30 Days)
              </p>
              <p className="text-sm text-slate-200">
                {formatPercent(monthlyProgress)}%
              </p>
            </div>

            <div className="w-full h-2 bg-white/10 rounded">
              <div
                className="h-2 bg-indigo-500 rounded"
                style={{ width: `${monthlyProgress}%` }}
              />
            </div>

            <p className="text-xs text-slate-400">
              {completedMonthly} / {maxMonthly} habits completed
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}