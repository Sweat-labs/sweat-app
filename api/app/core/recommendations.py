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