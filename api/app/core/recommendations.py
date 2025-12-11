from __future__ import annotations

def calculate_bmi(weight_lbs: float, height_in: float) -> float:
    if height_in <= 0:
        raise ValueError("height must be positive")
    return 703 * weight_lbs / (height_in ** 2)


def classify_bmi(bmi: float) -> str:
    if bmi < 18.5:
        return "underweight"
    if bmi < 25:
        return "normal"
    if bmi < 30:
        return "overweight"
    return "obese"


def suggest_target_weight(bmi: float, current_weight: float) -> float:
    if bmi < 18.5:
        return current_weight + 10
    if bmi < 25:
        return current_weight
    if bmi < 30:
        return max(current_weight - 10, 0)
    return max(current_weight - 20, 0)


def suggest_rate_lbs_per_week(bmi_category: str) -> float:
    if bmi_category in ("overweight", "obese"):
        return 1.0
    if bmi_category == "underweight":
        return 0.5
    return 0.0


def estimate_weeks_to_target(current_weight: float, target_weight: float, rate_lbs_per_week: float) -> int:
    diff = abs(current_weight - target_weight)
    if rate_lbs_per_week <= 0 or diff == 0:
        return 0
    return int(round(diff / rate_lbs_per_week))


def build_recommendation(weight_lbs: float, height_in: float) -> dict:
    bmi = calculate_bmi(weight_lbs, height_in)
    bmi_category = classify_bmi(bmi)
    target_weight = suggest_target_weight(bmi, weight_lbs)
    rate = suggest_rate_lbs_per_week(bmi_category)
    weeks = estimate_weeks_to_target(weight_lbs, target_weight, rate)

    if bmi_category == "underweight":
        summary = "You are below the recommended weight range. Gradual weight gain is advised."
    elif bmi_category == "normal":
        summary = "You are in the recommended weight range. Focus on maintaining healthy habits."
    elif bmi_category == "overweight":
        summary = "You are above the recommended weight range. Gradual weight loss is advised."
    else:
        summary = "You are significantly above the recommended weight range. A structured weight-loss plan is recommended."

    return {
        "bmi": round(bmi, 1),
        "bmi_category": bmi_category,
        "current_weight_lbs": weight_lbs,
        "target_weight_lbs": target_weight,
        "suggested_rate_lbs_per_week": rate,
        "estimated_weeks_to_target": weeks,
        "summary": summary,
    }

def get_recommended_tasks(main_goal: str, activity_level: str):
    """
    Generate recommended daily tasks based on user's main goal and activity level.
    """

    recommendations = []

    if main_goal == "build_muscle":
        recommendations = [
            {
                "task_name": "Upper Body Strength",
                "description": "Push-ups, rows, presses for muscle growth.",
                "calories": 180,
            },
            {
                "task_name": "Lower Body Strength",
                "description": "Squats, lunges, deadlifts for leg development.",
                "calories": 200,
            },
            {
                "task_name": "Core Strength",
                "description": "Planks, sit-ups, stability exercises.",
                "calories": 120,
            },
        ]

    elif main_goal == "weight_loss":
        recommendations = [
            {
                "task_name": "Cardio Training",
                "description": "Jogging, biking, or HIIT for fat burning.",
                "calories": 250,
            },
            {
                "task_name": "Light Strength",
                "description": "Low weight, high reps to boost metabolism.",
                "calories": 150,
            },
            {
                "task_name": "Long Walk",
                "description": "45–60 minutes brisk walk.",
                "calories": 180,
            },
        ]

    elif main_goal == "be_healthier":
        recommendations = [
            {
                "task_name": "Long Walk",
                "description": "20–30 minutes at a moderate pace to improve heart health.",
                "calories": 120,
            },
            {
                "task_name": "Full Body Mobility + Light Strength",
                "description": "10 min mobility + 10 min bodyweight exercises (squats, glute bridges, rows).",
                "calories": 150,
            },
            {
                "task_name": "Lifestyle Activity Boost",
                "description": "Take stairs, park farther away, or do 10 minutes of household movement.",
                "calories": 80,
            },
        ]

    else:
        recommendations = [
            {
                "task_name": "Light Activity",
                "description": "Go for a short walk today.",
                "calories": 60,
            }
        ]

    if activity_level == "5-7":
        for task in recommendations:
            task["calories"] += 50

    elif activity_level == "1-3":
        for task in recommendations:
            task["calories"] -= 20

    for task in recommendations:
        task["calories"] = max(task["calories"], 0)

    return recommendations
