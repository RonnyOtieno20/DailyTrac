
export interface DailyLogData {
  // Metadata
  creation_date: string; // YYYY-MM-DD
  day_of_week: string;

  // Habit Tracking Inline Fields
  mood: string;
  energy: string;
  steps: string; 
  habit_sleep: boolean;
  habit_exercise: boolean;
  habit_exercise_notes: string;
  habit_walk: boolean;
  habit_read: boolean;
  habit_study: boolean;
  habit_work: boolean;
  habit_groom_am: boolean;
  habit_groom_pm: boolean;

  // Today's Schedule
  schedule_sleep_met_goal: boolean;
  schedule_sleep_actual_hours: string; 

  schedule_wakeup_prep_done: boolean; 

  schedule_exercise_workout_complete: boolean;
  schedule_exercise_type: string[];
  schedule_exercise_calories_burned: string; 
  schedule_exercise_notes_performance: string; 

  schedule_shower_1_done: boolean;

  schedule_am_grooming_done: boolean;

  schedule_breakfast_ate: boolean;
  schedule_breakfast_details: string[]; 

  schedule_buffer_transition_done: boolean;

  schedule_walk_complete_6k_steps: boolean;
  schedule_walk_current_step_count: string; 

  schedule_read_gte_1hr: boolean;
  schedule_read_book_material: string[]; 
  schedule_read_pages_progress: string; 

  schedule_lunch_prep_eat_clean_done: boolean;
  schedule_lunch_meal_details: string[]; 

  schedule_entertainment_1_flex_intentional: boolean;
  schedule_entertainment_1_flex_activities: string[]; 

  schedule_personal_time_errands_flex_intentional: boolean;
  schedule_personal_time_errands_flex_activities:string[]; 

  schedule_supper_prep_eat_ate: boolean;
  schedule_supper_meal_details: string[]; 

  schedule_clean_cleaned: boolean;

  schedule_shower_2_pm_groom_done: boolean;

  schedule_entertainment_2_social_flex_intentional: boolean;
  schedule_entertainment_2_social_flex_activities: string[]; 

  schedule_wind_down_prep_sleep_done: boolean;
  schedule_wind_down_activities: string[]; 

  // Throughout Day: Nutrition
  nutrition_total_calories_consumed: string; 
  nutrition_water_intake: string; 

  // Day Stats (populated based on other fields or direct input if needed)
  day_stats_mood: string; 
  day_stats_energy: string; 
  day_stats_steps: string; 
  day_stats_exercise_calories: string; 
  day_stats_total_calories: string; 

  // Study Log
  study_log_topics: string[]; 
  study_log_notes: string; 
  study_log_hours: string; 

  // Nutrition Log
  nutrition_log_breakfast: string[]; 
  nutrition_log_lunch: string[]; 
  nutrition_log_supper: string[]; 
  nutrition_log_snacks: string[]; 
  nutrition_log_total_calories: string; 

  // AI Summary
  ai_summary?: string;
}

export type DailyLogField = keyof DailyLogData;

export interface MonthData {
  [dateKey: string]: DailyLogData; // Key: "YYYY-MM-DD"
}

export interface ScheduleItemConfig {
  idPrefix: string;
  title: string;
  time: string;
  details: Array<{
    type: 'checkbox';
    label: string;
    field: DailyLogField;
  } | {
    type: 'input' | 'textarea' | 'multi-input';
    label: string;
    field: DailyLogField;
    inputType?: 'text' | 'number';
    placeholder?: string;
  }>;
}
