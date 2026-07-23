"""
PRAJNA - KSP Crime Intelligence Platform
Pressure Engine Module (pressure_engine.py)
Computes Crime Pressure Scores & Anomaly Signals across Karnataka Zones.
"""

from mock_db import ZONES

def calculate_zone_pressure(zone):
    """
    Computes weighted pressure score for a single zone.
    Weights:
      - Bail releases (weight 0.4): scaled relative to max expected 10
      - Upcoming festivals (weight 0.3): scaled relative to max expected 5
      - Economic stress index (weight 0.2): raw 0-100 score
      - New ATMs/Infra (weight 0.1): scaled relative to max expected 20
    """
    bail_norm = min(1.0, zone["bail_releases_this_week"] / 10.0) * 100
    fest_norm = min(1.0, zone["upcoming_festivals"] / 5.0) * 100
    econ_norm = zone["economic_stress_index"]
    infra_norm = min(1.0, zone["new_infra_atms"] / 20.0) * 100

    score = round(
        (bail_norm * 0.40) +
        (fest_norm * 0.30) +
        (econ_norm * 0.20) +
        (infra_norm * 0.10),
        1
    )

    if score >= 70:
        level = "High"
        color = "red"
    elif score >= 45:
        level = "Medium"
        color = "amber"
    else:
        level = "Low"
        color = "green"

    # Generate natural language explanation
    reasons = []
    if zone["bail_releases_this_week"] >= 5:
        reasons.append(f"{zone['bail_releases_this_week']} repeat offenders released on bail this week")
    if zone["upcoming_festivals"] >= 3:
        reasons.append(f"{zone['upcoming_festivals']} major public gatherings/festivals scheduled")
    if zone["economic_stress_index"] >= 65:
        reasons.append(f"Elevated local economic stress index ({zone['economic_stress_index']}/100)")
    if zone["new_infra_atms"] >= 10:
        reasons.append(f"{zone['new_infra_atms']} new unmonitored ATM kiosks installed")

    explanation = "Critical threat vector driven by " + ", ".join(reasons) + "." if reasons else "Normal operational baseline."

    # Patrol recommendation
    if level == "High":
        recommendation = f"Deploy +{max(3, zone['bail_releases_this_week'] // 2)} night patrol units to high-density commercial/ATM corridors. Intensify surveillance on recent bail releases."
    elif level == "Medium":
        recommendation = "Maintain heightened mobile beat patrolling between 22:00 and 04:00 hours. Conduct random vehicle checks."
    else:
        recommendation = "Maintain routine beat coverage and community policing presence."

    return {
        "zone_id": zone["zone_id"],
        "zone_name": zone["zone_name"],
        "lat": zone["lat"],
        "lng": zone["lng"],
        "district": zone["district"],
        "score": score,
        "level": level,
        "color": color,
        "metrics": {
            "bail_releases": zone["bail_releases_this_week"],
            "upcoming_festivals": zone["upcoming_festivals"],
            "economic_stress": zone["economic_stress_index"],
            "new_infra_atms": zone["new_infra_atms"]
        },
        "breakdown": {
            "bail_contribution": round(bail_norm * 0.40, 1),
            "festival_contribution": round(fest_norm * 0.30, 1),
            "economic_contribution": round(econ_norm * 0.20, 1),
            "infra_contribution": round(infra_norm * 0.10, 1)
        },
        "explanation": explanation,
        "recommendation": recommendation
    }

def get_all_zone_pressures():
    return [calculate_zone_pressure(z) for z in ZONES]

def get_active_alerts():
    """Returns high-pressure zone anomalies as active alerts."""
    pressures = get_all_zone_pressures()
    alerts = []
    for p in pressures:
        if p["score"] >= 65:
            alerts.append({
                "alert_id": f"ALT-{p['zone_id']}",
                "zone_id": p["zone_id"],
                "zone_name": p["zone_name"],
                "score": p["score"],
                "level": p["level"],
                "message": f"ANOMALY DETECTED: {p['zone_name']} pressure score at {p['score']} ({p['level']} Risk).",
                "recommendation": p["recommendation"]
            })
    return alerts
