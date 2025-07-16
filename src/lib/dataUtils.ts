
import type { DailyLogData, MonthData } from './types';
import { FULL_DAYS_OF_WEEK } from './constants';

export function getInitialDailyLogData(dateStr: string): DailyLogData {
  const date = new Date(dateStr + 'T00:00:00'); // Ensure correct date parsing
  return {
    creation_date: dateStr,
    day_of_week: FULL_DAYS_OF_WEEK[date.getDay()],

    mood: '',
    energy: '',
    habit_sleep: false,
    habit_exercise: false,
    habit_walk: false,
    habit_read: false,
    habit_study: false,
    habit_work: false,
    habit_groom_am: false,
    habit_groom_pm: false,

    schedule_sleep_met_goal: false,
    schedule_sleep_actual_hours: '',
    schedule_wakeup_prep_done: false,
    schedule_exercise_workout_complete: false,
    schedule_exercise_type: [],
    schedule_exercise_calories_burned: '',
    schedule_exercise_notes_performance: '',
    schedule_shower_1_done: false,
    schedule_am_grooming_done: false,
    schedule_breakfast_ate: false,
    schedule_breakfast_details: [],
    schedule_buffer_transition_done: false,
    schedule_walk_complete_6k_steps: false,
    schedule_walk_current_step_count: '',
    schedule_read_gte_1hr: false,
    schedule_read_book_material: [],
    schedule_read_pages_progress: '',
    schedule_lunch_prep_eat_clean_done: false,
    schedule_lunch_meal_details: [],
    schedule_entertainment_1_flex_intentional: false,
    schedule_entertainment_1_flex_activities: [],
    schedule_personal_time_errands_flex_intentional: false,
    schedule_personal_time_errands_flex_activities: [],
    schedule_supper_prep_eat_ate: false,
    schedule_supper_meal_details: [],
    schedule_clean_cleaned: false,
    schedule_shower_2_pm_groom_done: false,
    schedule_entertainment_2_social_flex_intentional: false,
    schedule_entertainment_2_social_flex_activities: [],
    schedule_wind_down_prep_sleep_done: false,
    schedule_wind_down_activities: [],

    nutrition_total_calories_consumed: '',
    nutrition_water_intake: '',

    day_stats_mood: '',
    day_stats_energy: '',
    day_stats_steps: '',
    day_stats_exercise_calories: '',
    day_stats_total_calories: '',

    study_log_topics: [],
    study_log_notes: '',
    study_log_hours: '',

    nutrition_log_breakfast: [],
    nutrition_log_lunch: [],
    nutrition_log_supper: [],
    nutrition_log_snacks: [],
    nutrition_log_total_calories: '',

    ai_summary: '',
  };
}

export function getInitialMonthData(year: number, month: number): MonthData {
  const monthData: MonthData = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    monthData[dateStr] = getInitialDailyLogData(dateStr);
  }
  return monthData;
}

function formatArrayForSummary(items: string[] | string): string {
    if (Array.isArray(items)) {
      if (items.length === 0) return 'N/A';
      return items.map(note => `- ${note}`).join('\n');
    }
    // For single string values, just return them or N/A
    return items || 'N/A';
};

export function formatDataForAISummary(data: DailyLogData): string {
  let logString = `---
creation-date: ${data.creation_date}
day: ${data.day_of_week}
tags: daily-note
---

## Daily Snapshot 📊
- mood:: ${data.mood}
- energy:: ${data.energy}
- habit_sleep:: ${data.habit_sleep ? 'Yes' : 'No'}
- habit_exercise:: ${data.habit_exercise ? 'Yes' : 'No'}
- habit_walk:: ${data.habit_walk ? 'Yes' : 'No'}
- habit_read:: ${data.habit_read ? 'Yes' : 'No'}
- habit_study:: ${data.habit_study ? 'Yes' : 'No'}
- habit_work:: ${data.habit_work ? 'Yes' : 'No'}
- habit_groom_am:: ${data.habit_groom_am ? 'Yes' : 'No'}
- habit_groom_pm:: ${data.habit_groom_pm ? 'Yes' : 'No'}

## Today's Schedule ⏳
- **00:00 - 08:00:** **Sleep**
  - [${data.schedule_sleep_met_goal ? 'x' : ' '}] Met 8hr Goal?
  - Actual Sleep Hours: ${data.schedule_sleep_actual_hours}
- **08:10 - 08:50:** **Exercise**
  - [${data.schedule_exercise_workout_complete ? 'x' : ' '}] Workout Complete?
  - Exercise Type: 
${formatArrayForSummary(data.schedule_exercise_type)}
  - Calories Burned: ${data.schedule_exercise_calories_burned}
  - Notes/Performance: 
${formatArrayForSummary(data.schedule_exercise_notes_performance)}
- **09:30 - 09:50:** **Breakfast**
  - [${data.schedule_breakfast_ate ? 'x' : ' '}] Ate Breakfast?
  - Breakfast Details: 
${formatArrayForSummary(data.schedule_breakfast_details)}
- **11:10 - 12:10:** **Walk**
  - [${data.schedule_walk_complete_6k_steps ? 'x' : ' '}] Walk Complete (>=6k steps)?
  - Steps Taken: ${data.schedule_walk_current_step_count}
- **12:10 - 13:10:** **Read**
  - [${data.schedule_read_gte_1hr ? 'x' : ' '}] Read >= 1hr?
  - Book/Material: 
${formatArrayForSummary(data.schedule_read_book_material)}
  - Pages/Progress: 
${formatArrayForSummary(data.schedule_read_pages_progress)}
- **13:10 - 14:10:** **Lunch Prep/Eat/Clean**
  - [${data.schedule_lunch_prep_eat_clean_done ? 'x' : ' '}] Done?
  - Meal Details: 
${formatArrayForSummary(data.schedule_lunch_meal_details)}
- **14:10 - 17:10:** **Entertainment Block 1 / Flex**
  - [${data.schedule_entertainment_1_flex_intentional ? 'x' : ' '}] Used Time Intentionally?
  - Activities: 
${formatArrayForSummary(data.schedule_entertainment_1_flex_activities)}
- **17:10 - 18:10:** **Personal Time / Errands / Flex**
  - [${data.schedule_personal_time_errands_flex_intentional ? 'x' : ' '}] Used Time Intentionally?
  - Activities: 
${formatArrayForSummary(data.schedule_personal_time_errands_flex_activities)}
- **18:10 - 18:40:** **Supper Prep/Eat**
  - [${data.schedule_supper_prep_eat_ate ? 'x' : ' '}] Ate Supper?
  - Meal Details: 
${formatArrayForSummary(data.schedule_supper_meal_details)}
- **23:00 - 00:00:** **Wind down / Prep for sleep**
  - [${data.schedule_wind_down_prep_sleep_done ? 'x' : ' '}] Done?
  - Wind Down Activities: 
${formatArrayForSummary(data.schedule_wind_down_activities)}
- **Throughout Day:** **Nutrition**
  - Total Calories Consumed: ${data.nutrition_total_calories_consumed}
  - Water Intake: ${data.nutrition_water_intake}

---

## Day Stats 📊
- Mood Today: ${data.mood}
- Energy Level: ${data.energy}
- Steps: ${data.schedule_walk_current_step_count}
- Exercise Calories: ${data.schedule_exercise_calories_burned}
- Total Calories: ${data.nutrition_total_calories_consumed || data.nutrition_log_total_calories}

## Study Log 📚
- Topic(s):
${formatArrayForSummary(data.study_log_topics)}
- Notes/Key Takeaways:
${formatArrayForSummary(data.study_log_notes)}
- Hours Logged:
  \`\`\`
  ${data.study_log_hours}
  \`\`\`

## Nutrition Log 🍎
- Breakfast:
${formatArrayForSummary(data.nutrition_log_breakfast)}
- Lunch:
${formatArrayForSummary(data.nutrition_log_lunch)}
- Supper:
${formatArrayForSummary(data.nutrition_log_supper)}
- Snacks:
${formatArrayForSummary(data.nutrition_log_snacks)}
- Total Calories:
  \`\`\`
  ${data.nutrition_log_total_calories}
  \`\`\`
`;
  return logString;
}
