import type { ScheduleItemConfig } from '@/lib/types';

export const scheduleItemsConfig: ScheduleItemConfig[] = [
  {
    idPrefix: "sleep", title: "Sleep", time: "00:00 - 08:00",
    details: [
      { type: "checkbox", label: "Met 8hr Goal?", field: "schedule_sleep_met_goal" },
      { type: "input", inputType: "text", label: "Actual Sleep Hours", field: "schedule_sleep_actual_hours", placeholder: "e.g., 7.5 hours" },
    ],
  },
  {
    idPrefix: "wakeup", title: "Wake up / Prep", time: "08:00 - 08:10",
    details: [], // No specific inputs/checkboxes in template, can add a general "Done?" if needed
  },
  {
    idPrefix: "exercise", title: "Exercise", time: "08:10 - 08:50",
    details: [
      { type: "checkbox", label: "Workout Complete?", field: "schedule_exercise_workout_complete" },
      { type: "multi-input", label: "Exercise Type", field: "schedule_exercise_type", placeholder: "e.g., Running, Weights" },
      { type: "input", inputType: "text", label: "Calories Burned", field: "schedule_exercise_calories_burned", placeholder: "e.g., 300" },
      { type: "multi-input", label: "Notes/Performance", field: "schedule_exercise_notes_performance", placeholder: "How did it go?" },
    ],
  },
  {
    idPrefix: "shower1", title: "Shower 1", time: "08:50 - 09:00",
    details: [{ type: "checkbox", label: "Done?", field: "schedule_shower_1_done" }],
  },
  {
    idPrefix: "amgroom", title: "AM Grooming & Teeth", time: "09:00 - 09:30",
    details: [{ type: "checkbox", label: "Done?", field: "schedule_am_grooming_done" }],
  },
  {
    idPrefix: "breakfast", title: "Breakfast", time: "09:30 - 09:50",
    details: [
      { type: "checkbox", label: "Ate Breakfast?", field: "schedule_breakfast_ate" },
      { type: "multi-input", label: "Breakfast Details", field: "schedule_breakfast_details", placeholder: "What did you eat?" },
    ],
  },
  {
    idPrefix: "buffer", title: "Buffer / Transition", time: "09:50 - 10:00",
    details: [], // Or a "Used Effectively?" checkbox
  },
  {
    idPrefix: "walk", title: "Walk", time: "11:10 - 12:10",
    details: [
      { type: "checkbox", label: "Walk Complete (>=6k steps)?", field: "schedule_walk_complete_6k_steps" },
      { type: "input", inputType: "text", label: "Current Step Count", field: "schedule_walk_current_step_count", placeholder: "e.g., 7500" },
    ],
  },
  {
    idPrefix: "read", title: "Read", time: "12:10 - 13:10",
    details: [
      { type: "checkbox", label: "Read >= 1hr?", field: "schedule_read_gte_1hr" },
      { type: "multi-input", label: "Book/Material", field: "schedule_read_book_material", placeholder: "e.g., Atomic Habits" },
      { type: "multi-input", label: "Pages/Progress", field: "schedule_read_pages_progress", placeholder: "e.g., Ch 3-4, 20 pages" },
    ],
  },
  {
    idPrefix: "lunch", title: "Lunch Prep/Eat/Clean", time: "13:10 - 14:10",
    details: [
      { type: "checkbox", label: "Done?", field: "schedule_lunch_prep_eat_clean_done" },
      { type: "multi-input", label: "Meal Details", field: "schedule_lunch_meal_details", placeholder: "What did you eat?" },
    ],
  },
  {
    idPrefix: "ent1", title: "Entertainment Block 1 / Flex", time: "14:10 - 17:10",
    details: [
      { type: "checkbox", label: "Used Time Intentionally?", field: "schedule_entertainment_1_flex_intentional" },
      { type: "multi-input", label: "Activities", field: "schedule_entertainment_1_flex_activities", placeholder: "What did you do?" },
    ],
  },
  {
    idPrefix: "personal", title: "Personal Time / Errands / Flex", time: "17:10 - 18:10",
    details: [
      { type: "checkbox", label: "Used Time Intentionally?", field: "schedule_personal_time_errands_flex_intentional" },
      { type: "multi-input", label: "Activities", field: "schedule_personal_time_errands_flex_activities", placeholder: "What did you do?" },
    ],
  },
  {
    idPrefix: "supper", title: "Supper Prep/Eat", time: "18:10 - 18:40",
    details: [
      { type: "checkbox", label: "Ate Supper?", field: "schedule_supper_prep_eat_ate" },
      { type: "multi-input", label: "Meal Details", field: "schedule_supper_meal_details", placeholder: "What did you eat?" },
    ],
  },
  {
    idPrefix: "clean", title: "Clean", time: "18:40 - 19:10",
    details: [{ type: "checkbox", label: "Cleaned?", field: "schedule_clean_cleaned" }],
  },
  {
    idPrefix: "shower2", title: "Shower 2 + PM Groom/Teeth", time: "19:10 - 19:55",
    details: [{ type: "checkbox", label: "Done?", field: "schedule_shower_2_pm_groom_done" }],
  },
  {
    idPrefix: "ent2", title: "Entertainment Block 2 / Social / Flex", time: "19:55 - 23:00",
    details: [
      { type: "checkbox", label: "Used Time Intentionally?", field: "schedule_entertainment_2_social_flex_intentional" },
      { type: "multi-input", label: "Activities", field: "schedule_entertainment_2_social_flex_activities", placeholder: "What did you do?" },
    ],
  },
  {
    idPrefix: "winddown", title: "Wind down / Prep for sleep", time: "23:00 - 00:00",
    details: [
      { type: "checkbox", label: "Done?", field: "schedule_wind_down_prep_sleep_done" },
      { type: "multi-input", label: "Wind Down Activities", field: "schedule_wind_down_activities", placeholder: "e.g., Reading, meditation" },
    ],
  },
];
