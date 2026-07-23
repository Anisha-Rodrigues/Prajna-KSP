"""
PRAJNA - KSP Crime Intelligence Platform
Mock Database Module (mock_db.py)
"""

SUSPECTS = {
    "SUSP-001": {
        "id": "SUSP-001",
        "name": "Raju Kumar",
        "aliases": ["Raju Whitefield", "Silent Raju"],
        "risk_level": "High Risk",
        "status": "On Bail (Released 3 days ago)",
        "bail_date": "2026-07-20",
        "district": "Bengaluru East",
        "location": "Whitefield",
        "firs": ["KA/BLR/2024/001", "KA/BLR/2024/002", "KA/BLR/2024/005"],
        "associates": ["Suresh Naik", "Vikram Shetty"],
        "crime_types": ["Theft", "Armed Robbery", "ATM Skimming"],
        "modus_operandi": "Night reconnaissance followed by rapid lock-picking; operates near tech parks.",
        "phone": "+91 98765 12345",
        "aadhaar": "XXXX-XXXX-8821"
    },
    "SUSP-002": {
        "id": "SUSP-002",
        "name": "Suresh Naik",
        "aliases": ["Suru", "Fence Naik"],
        "risk_level": "Medium Risk",
        "status": "On Bail",
        "bail_date": "2026-07-15",
        "district": "Bengaluru Central",
        "location": "Indiranagar",
        "firs": ["KA/BLR/2024/001", "KA/BLR/2024/003"],
        "associates": ["Raju Kumar", "Mohammed Irfan"],
        "crime_types": ["Theft", "Burglary", "Stolen Goods Handling"],
        "modus_operandi": "Acts as fence and getaway driver for burglaries in residential layouts.",
        "phone": "+91 98765 23456",
        "aadhaar": "XXXX-XXXX-4412"
    },
    "SUSP-003": {
        "id": "SUSP-003",
        "name": "Mohammed Irfan",
        "aliases": ["Irfan Mysuru", "Blade Irfan"],
        "risk_level": "Medium Risk",
        "status": "Under Active Monitoring",
        "bail_date": "2026-06-10",
        "district": "Mysuru Urban",
        "location": "Mysuru",
        "firs": ["KA/BLR/2024/003", "KA/MYS/2024/001"],
        "associates": ["Suresh Naik"],
        "crime_types": ["Burglary", "Violent Assault"],
        "modus_operandi": "Physical intimidation during break-ins; targets commercial properties.",
        "phone": "+91 98765 34567",
        "aadhaar": "XXXX-XXXX-9901"
    },
    "SUSP-004": {
        "id": "SUSP-004",
        "name": "Vikram Shetty",
        "aliases": ["Vicky Tech", "Cyber Vikram"],
        "risk_level": "High Risk (Absconding)",
        "status": "Absconding - Lookout Circular Issued",
        "bail_date": None,
        "district": "Bengaluru South",
        "location": "Electronic City",
        "firs": ["KA/BLR/2024/004", "KA/BLR/2024/005"],
        "associates": ["Raju Kumar"],
        "crime_types": ["Financial Fraud", "ATM Skimming", "Payroll Phishing"],
        "modus_operandi": "Deploys custom skimming hardware and manipulates ATM router hardware.",
        "phone": "+91 98765 45678",
        "aadhaar": "XXXX-XXXX-1134"
    }
}

FIRS = {
    "KA/BLR/2024/001": {
        "fir_number": "KA/BLR/2024/001",
        "title": "Jewelry Store Theft at Whitefield Main Rd",
        "crime_type": "Theft",
        "location": "Whitefield, Bengaluru",
        "district": "Bengaluru East",
        "date_filed": "2024-01-15",
        "status": "Under Investigation",
        "suspects_named": ["Raju Kumar", "Suresh Naik"],
        "stolen_property_value": "₹ 14,50,000",
        "description": "Break-in at Whitefield Gold Emporium during early morning hours. CCTV captured 2 suspects fleeing on an unnumbered motorcycle."
    },
    "KA/BLR/2024/002": {
        "fir_number": "KA/BLR/2024/002",
        "title": "Armed Cash Van Robbery near Marathahalli Bridge",
        "crime_type": "Armed Robbery",
        "location": "Marathahalli, Bengaluru",
        "district": "Bengaluru East",
        "date_filed": "2024-02-04",
        "status": "Charge Sheeted",
        "suspects_named": ["Raju Kumar"],
        "stolen_property_value": "₹ 32,00,000",
        "description": "Cash logistics vehicle intercepted by armed assailants. Driver threatened with sharp weapons. Primary suspect identified as Raju Kumar."
    },
    "KA/BLR/2024/003": {
        "fir_number": "KA/BLR/2024/003",
        "title": "Villa Burglary at 100ft Road Indiranagar",
        "crime_type": "Burglary",
        "location": "Indiranagar, Bengaluru",
        "district": "Bengaluru Central",
        "date_filed": "2024-02-18",
        "status": "Under Investigation",
        "suspects_named": ["Suresh Naik", "Mohammed Irfan"],
        "stolen_property_value": "₹ 8,20,000",
        "description": "Gated residential villa broken into while owners were traveling. Latent fingerprint matches Suresh Naik."
    },
    "KA/MYS/2024/001": {
        "fir_number": "KA/MYS/2024/001",
        "title": "Market Assault & Extortion at Devaraja Market",
        "crime_type": "Assault",
        "location": "Mysuru City",
        "district": "Mysuru Urban",
        "date_filed": "2024-03-01",
        "status": "Arrest Warrant Issued",
        "suspects_named": ["Mohammed Irfan"],
        "stolen_property_value": "N/A",
        "description": "Violent altercation and extortion demands targeting local vendors. Victim suffered serious injuries."
    },
    "KA/BLR/2024/004": {
        "fir_number": "KA/BLR/2024/004",
        "title": "Corporate Phishing & Payroll Fraud",
        "crime_type": "Financial Fraud",
        "location": "Electronic City, Bengaluru",
        "district": "Bengaluru South",
        "date_filed": "2024-03-12",
        "status": "Absconding",
        "suspects_named": ["Vikram Shetty"],
        "stolen_property_value": "₹ 65,00,000",
        "description": "Unauthorized wire transfers executed via compromised HR portal credentials. Beneficiary account traced to shell entity owned by Vikram Shetty."
    },
    "KA/BLR/2024/005": {
        "fir_number": "KA/BLR/2024/005",
        "title": "ITPL Road ATM Skimming & Vault Tampering",
        "crime_type": "Theft & ATM Skimming",
        "location": "Whitefield, Bengaluru",
        "district": "Bengaluru East",
        "date_filed": "2024-03-25",
        "status": "Active Investigation",
        "suspects_named": ["Raju Kumar", "Vikram Shetty"],
        "stolen_property_value": "₹ 21,10,000",
        "description": "Custom overlay skimmer attached to high-traffic ATM kiosk. Financial intelligence links Raju Kumar's hardware procurement to Vikram Shetty."
    }
}

EVIDENCE = {
    "EVI-901": {
        "id": "EVI-901",
        "name": "Custom ATM Skimmer Overlay",
        "type": "Physical / Hardware",
        "linked_fir": "KA/BLR/2024/005",
        "details": "High-grade magnetic reader with micro micro-cam harvested from ITPL road kiosk."
    },
    "EVI-902": {
        "id": "EVI-902",
        "name": "Marathahalli CCTV Feed Footage",
        "type": "Digital Surveillance",
        "linked_fir": "KA/BLR/2024/002",
        "details": "Clear facial match (89% confidence score) identifying Raju Kumar."
    },
    "EVI-903": {
        "id": "EVI-903",
        "name": "Forged Aadhaar & PAN Batch",
        "type": "Documentary",
        "linked_fir": "KA/BLR/2024/004",
        "details": "12 counterfeit IDs used to open bank accounts in Electronic City."
    },
    "EVI-904": {
        "id": "EVI-904",
        "name": "Fingerprint Lift (Left Thumb)",
        "type": "Forensic",
        "linked_fir": "KA/BLR/2024/003",
        "details": "AFIS match confirms Suresh Naik at Indiranagar burglary scene."
    }
}

ZONES = [
    {
        "zone_id": "BLR_EAST",
        "zone_name": "Bengaluru East (Whitefield / Marathahalli)",
        "lat": 12.9698,
        "lng": 77.7500,
        "district": "Bengaluru East",
        "bail_releases_this_week": 8,
        "upcoming_festivals": 3,
        "economic_stress_index": 72,
        "new_infra_atms": 14,
        "recent_firs_count": 12,
        "patrol_units_assigned": 4
    },
    {
        "zone_id": "BLR_CENTRAL",
        "zone_name": "Bengaluru Central (Indiranagar / MG Road)",
        "lat": 12.9784,
        "lng": 77.6408,
        "district": "Bengaluru Central",
        "bail_releases_this_week": 5,
        "upcoming_festivals": 4,
        "economic_stress_index": 55,
        "new_infra_atms": 8,
        "recent_firs_count": 7,
        "patrol_units_assigned": 6
    },
    {
        "zone_id": "BLR_SOUTH",
        "zone_name": "Bengaluru South (Electronic City)",
        "lat": 12.8452,
        "lng": 77.6602,
        "district": "Bengaluru South",
        "bail_releases_this_week": 6,
        "upcoming_festivals": 1,
        "economic_stress_index": 68,
        "new_infra_atms": 19,
        "recent_firs_count": 9,
        "patrol_units_assigned": 3
    },
    {
        "zone_id": "MYS_URBAN",
        "zone_name": "Mysuru Urban (Palace & Market Precinct)",
        "lat": 12.3051,
        "lng": 76.6551,
        "district": "Mysuru",
        "bail_releases_this_week": 4,
        "upcoming_festivals": 5,
        "economic_stress_index": 60,
        "new_infra_atms": 5,
        "recent_firs_count": 6,
        "patrol_units_assigned": 5
    },
    {
        "zone_id": "MNG_COASTAL",
        "zone_name": "Mangaluru Coastal & Port Zone",
        "lat": 12.9141,
        "lng": 74.8560,
        "district": "Dakshina Kannada",
        "bail_releases_this_week": 3,
        "upcoming_festivals": 2,
        "economic_stress_index": 48,
        "new_infra_atms": 6,
        "recent_firs_count": 4,
        "patrol_units_assigned": 4
    },
    {
        "zone_id": "BEL_BORDER",
        "zone_name": "Belagavi Northern Border Zone",
        "lat": 15.8497,
        "lng": 74.4977,
        "district": "Belagavi",
        "bail_releases_this_week": 2,
        "upcoming_festivals": 1,
        "economic_stress_index": 40,
        "new_infra_atms": 3,
        "recent_firs_count": 3,
        "patrol_units_assigned": 3
    },
    {
        "zone_id": "HUB_TWIN",
        "zone_name": "Hubballi-Dharwad Commercial Corridor",
        "lat": 15.3647,
        "lng": 75.1240,
        "district": "Dharwad",
        "bail_releases_this_week": 3,
        "upcoming_festivals": 2,
        "economic_stress_index": 52,
        "new_infra_atms": 4,
        "recent_firs_count": 5,
        "patrol_units_assigned": 4
    }
]
