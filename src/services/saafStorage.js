import { supabase } from "../lib/supabaseClient";

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}

function getMonthKey(dateString) {
  return dateString.slice(0, 7);
}

function mapDbEntryToApp(row) {
  return {
    id: row.id,
    date: row.entry_date,
    urgeLevel: row.urge_level || 0,
    anxietyLevel: row.anxiety_level || 0,
    trigger: row.trigger || "",
    cleaningMinutes: row.cleaning_minutes || 0,
    delayMinutes: row.delay_minutes || 0,
    mood: row.mood || "",
    note: row.note || "",
    actions: row.actions || [],
    feedback: row.feedback || null,
    totalActionMinutes: row.total_action_minutes || 0,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

function mapAppEntryToDb(entry) {
  return {
    entry_date: entry.date,
    urge_level: entry.urgeLevel,
    anxiety_level: entry.anxietyLevel,
    trigger: entry.trigger,
    cleaning_minutes: entry.cleaningMinutes,
    delay_minutes: entry.delayMinutes,
    mood: entry.mood,
    note: entry.note,
    actions: entry.actions || [],
    feedback: entry.feedback || null,
    total_action_minutes: entry.totalActionMinutes || 0,
    expires_at: addDays(new Date(), 30),
  };
}

function getMostRepeatedAction(entries) {
  const actionMap = {};

  entries.forEach((entry) => {
    const actions = entry.actions || [];

    actions.forEach((action) => {
      const type = action.type || "Action";
      actionMap[type] = (actionMap[type] || 0) + Number(action.count || 0);
    });
  });

  const sorted = Object.entries(actionMap).sort((a, b) => b[1] - a[1]);

  if (!sorted.length) return null;

  return {
    type: sorted[0][0],
    count: sorted[0][1],
  };
}

function buildMonthlySummary(entries, monthKey) {
  const totalEntries = entries.length;

  const totalActions = entries.reduce((total, entry) => {
    const actions = entry.actions || [];
    return total + actions.reduce((sum, action) => sum + Number(action.count || 0), 0);
  }, 0);

  const totalCleaningMinutes = entries.reduce(
    (sum, entry) => sum + Number(entry.cleaningMinutes || 0),
    0
  );

  const bestPauseMinutes = entries.reduce(
    (best, entry) => Math.max(best, Number(entry.delayMinutes || 0)),
    0
  );

  const anxietyTotal = entries.reduce(
    (sum, entry) => sum + Number(entry.anxietyLevel || 0),
    0
  );

  const averageAnxiety =
    totalEntries > 0 ? Number((anxietyTotal / totalEntries).toFixed(1)) : 0;

  const mostRepeated = getMostRepeatedAction(entries);

  const improved = [];

  if (bestPauseMinutes > 0) {
    improved.push(`Best pause this month was ${bestPauseMinutes} minutes.`);
  }

  if (totalEntries > 0) {
    improved.push(`${totalEntries} reflections were saved this month.`);
  }

  const patterns = [];

  if (mostRepeated) {
    patterns.push(
      `${mostRepeated.type} was the most repeated action with ${mostRepeated.count} total time(s).`
    );
  }

  if (averageAnxiety >= 7) {
    patterns.push("Average anxiety was high this month, so next goals should stay very small.");
  }

  const nextMonthGoal = [
    "Try delaying only one repeated action by 2 minutes.",
    "Use Calm Mode before repeating one action.",
    "Write the trigger before acting when possible.",
  ];

  return {
    month_key: monthKey,
    total_entries: totalEntries,
    total_actions: totalActions,
    total_cleaning_minutes: totalCleaningMinutes,
    best_pause_minutes: bestPauseMinutes,
    average_anxiety: averageAnxiety,
    most_repeated_action: mostRepeated
      ? `${mostRepeated.type} (${mostRepeated.count})`
      : null,
    summary: {
      improved,
      patterns,
      nextMonthGoal,
    },
  };
}

export async function fetchDailyEntries() {
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) {
    console.error("Fetch daily entries error:", error);
    return [];
  }

  return data.map(mapDbEntryToApp);
}

export async function saveDailyEntry(entry) {
  const { data, error } = await supabase
    .from("daily_entries")
    .insert(mapAppEntryToDb(entry))
    .select()
    .single();

  if (error) {
    console.error("Save daily entry error:", error);
    throw error;
  }

  return mapDbEntryToApp(data);
}

export async function saveMonthlySummary(entries, monthKey) {
  const monthlySummary = buildMonthlySummary(entries, monthKey);

  const { error } = await supabase
    .from("monthly_summaries")
    .upsert(monthlySummary, { onConflict: "month_key" });

  if (error) {
    console.error("Save monthly summary error:", error);
    throw error;
  }

  return monthlySummary;
}

export async function archiveExpiredEntries() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .lt("expires_at", now);

  if (error) {
    console.error("Fetch expired entries error:", error);
    return;
  }

  const expiredEntries = data.map(mapDbEntryToApp);

  if (!expiredEntries.length) return;

  const groupedByMonth = expiredEntries.reduce((groups, entry) => {
    const monthKey = getMonthKey(entry.date);

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }

    groups[monthKey].push(entry);
    return groups;
  }, {});

  for (const monthKey of Object.keys(groupedByMonth)) {
    await saveMonthlySummary(groupedByMonth[monthKey], monthKey);
  }

  const expiredIds = expiredEntries.map((entry) => entry.id);

  const { error: deleteError } = await supabase
    .from("daily_entries")
    .delete()
    .in("id", expiredIds);

  if (deleteError) {
    console.error("Delete expired entries error:", deleteError);
  }
}

export async function fetchMonthlySummaries() {
  const { data, error } = await supabase
    .from("monthly_summaries")
    .select("*")
    .order("month_key", { ascending: false });

  if (error) {
    console.error("Fetch monthly summaries error:", error);
    return [];
  }

  return data;
}