"""
PRAJNA — Mock Database
======================

Centralized mock data layer for the PRAJNA Crime Intelligence Platform.

This module keeps all mock data separate from the FastAPI application so
that the data layer can be replaced by any persistent database without
changing the API routes.

Coverage: 8 suspects, 11 FIRs, 8 districts across Karnataka.
"""

from copy import deepcopy


# ---------------------------------------------------------------------------
# SUSPECTS
# ---------------------------------------------------------------------------

SUSPECTS = {
    "S001": {
        "id": "S001",
        "name": "Raju Kumar",
        "aliases": ["Raju"],
        "risk_level": "high",
        "status": "active",
        "bail_status": "on_bail",
        "bail_release_date": "2024-11-15",
        "district": "Bengaluru Urban",
        "known_associates": ["S002", "S004"],
        "linked_firs": [
            "KA/BLR/2024/001",
            "KA/BLR/2024/002",
            "KA/BLR/2024/005",
        ],
        "crime_types": [
            "theft",
            "robbery",
            "ATM skimming",
        ],
        "known_locations": [
            "Whitefield",
            "Marathahalli",
        ],
        "description": (
            "High-risk suspect linked to multiple theft and robbery cases. "
            "Known associates include Suresh Naik and Vikram Shetty."
        ),
    },
    "S002": {
        "id": "S002",
        "name": "Suresh Naik",
        "aliases": ["Suresh"],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "not_on_bail",
        "bail_release_date": None,
        "district": "Bengaluru Urban",
        "known_associates": ["S001", "S003"],
        "linked_firs": [
            "KA/BLR/2024/001",
            "KA/BLR/2024/003",
        ],
        "crime_types": [
            "theft",
            "burglary",
        ],
        "known_locations": [
            "Whitefield",
            "Indiranagar",
        ],
        "description": (
            "Medium-risk suspect associated with theft and burglary cases "
            "in Bengaluru."
        ),
    },
    "S003": {
        "id": "S003",
        "name": "Mohammed Irfan",
        "aliases": [
            "Irfan",
            "Mohammed",
        ],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "on_bail",
        "bail_release_date": "2024-12-01",
        "district": "Mysuru",
        "known_associates": ["S002"],
        "linked_firs": [
            "KA/BLR/2024/003",
            "KA/MYS/2024/001",
        ],
        "crime_types": [
            "burglary",
            "assault",
        ],
        "known_locations": [
            "Indiranagar",
            "Mysuru",
        ],
        "description": (
            "Medium-risk suspect linked to burglary and assault cases "
            "across Bengaluru and Mysuru."
        ),
    },
    "S004": {
        "id": "S004",
        "name": "Vikram Shetty",
        "aliases": ["Vikram"],
        "risk_level": "high",
        "status": "absconding",
        "bail_status": "not_on_bail",
        "bail_release_date": None,
        "district": "Bengaluru Urban",
        "known_associates": ["S001"],
        "linked_firs": [
            "KA/BLR/2024/004",
            "KA/BLR/2024/005",
        ],
        "crime_types": [
            "fraud",
            "theft",
            "ATM skimming",
        ],
        "known_locations": [
            "Electronic City",
            "Whitefield",
        ],
        "description": (
            "High-risk absconding suspect linked to fraud, theft, and "
            "ATM skimming cases."
        ),
    },
    "S009": {
        "id": "S009",
        "name": "Anisha Rodrigues",
        "aliases": ["Anisha", "AR"],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "under_investigation",
        "bail_release_date": None,
        "district": "Bengaluru Urban",
        "photo_url": "/evidence/anisha_photo.jpg",
        "known_associates": ["S006"],
        "linked_firs": [
            "KA/BLR/2024/006",
        ],
        "crime_types": [
            "cybercrime",
            "digital forensics testing",
        ],
        "known_locations": [
            "Koramangala",
            "Whitefield",
        ],
        "description": (
            "Suspect identified under cyber-forensics surveillance. "
            "Facial recognition feature vector stored in KSP biometric repository."
        ),
    },
    "S010": {
        "id": "S010",
        "name": "Virat Kohli",
        "aliases": ["VK", "King Kohli"],
        "risk_level": "high",
        "status": "absconding",
        "bail_status": "not_on_bail",
        "bail_release_date": None,
        "district": "Bengaluru Urban",
        "photo_url": "/evidence/virat_photo.svg",
        "known_associates": ["S011"],
        "linked_firs": ["KA/BLR/2024/008", "KA/BLR/2024/009"],
        "crime_types": ["financial fraud", "hawala transactions"],
        "known_locations": ["Chinnaswamy Stadium Area", "MG Road", "Delhi"],
        "nfn": "29-KA-2024-18001818",
        "description": (
            "High-risk absconding suspect flagged for financial fraud and hawala "
            "transactions across Mumbai and Bengaluru. Identified via CCTV near "
            "Chinnaswamy Stadium. Currently evading arrest."
        ),
    },
    "S011": {
        "id": "S011",
        "name": "Rohit Sharma",
        "aliases": ["Hitman", "Ro"],
        "risk_level": "high",
        "status": "active",
        "bail_status": "on_bail",
        "bail_release_date": "2024-12-15",
        "district": "Mumbai (Inter-state Warrant)",
        "photo_url": "/evidence/rohit_photo.svg",
        "known_associates": ["S010"],
        "linked_firs": ["KA/BLR/2024/008"],
        "crime_types": ["money laundering", "organized crime"],
        "known_locations": ["Mumbai", "Bengaluru"],
        "nfn": "29-KA-2024-45004500",
        "description": (
            "Active suspect released on bail, linked to inter-state money laundering "
            "ring. Associated with S010 (Virat Kohli). Monitored by ED and KSP joint task force."
        ),
    },
    "S012": {
        "id": "S012",
        "name": "Mahendra Singh Dhoni",
        "aliases": ["MSD", "Thala", "Captain Cool"],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "under_investigation",
        "bail_release_date": None,
        "district": "Chennai / Ranchi (Inter-state)",
        "photo_url": "/evidence/dhoni_photo.svg",
        "known_associates": [],
        "linked_firs": ["KA/BLR/2024/010"],
        "crime_types": ["land acquisition fraud", "benami property"],
        "known_locations": ["Ranchi", "Chennai", "Bengaluru Tech Park"],
        "nfn": "29-KA-2024-70001975",
        "description": (
            "Under investigation for benami property transactions and land acquisition "
            "fraud in Bengaluru tech corridor. Cooperating with investigation."
        ),
    },
    "S005": {
        "id": "S005",
        "name": "Deepa Hegde",
        "aliases": ["Deepa"],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "on_bail",
        "bail_release_date": "2024-10-20",
        "district": "Hubli-Dharwad",
        "known_associates": ["S007"],
        "linked_firs": ["KA/HBL/2024/001"],
        "crime_types": ["chain snatching", "pickpocketing"],
        "known_locations": ["Hubli Old Town", "Dharwad"],
        "description": (
            "Active suspect in Hubli-Dharwad region, primarily involved in "
            "chain snatching and pickpocketing near crowded markets."
        ),
    },
    "S006": {
        "id": "S006",
        "name": "Srinivas Rao",
        "aliases": ["Srini", "S. Rao"],
        "risk_level": "high",
        "status": "active",
        "bail_status": "not_on_bail",
        "bail_release_date": None,
        "district": "Bengaluru Urban",
        "known_associates": ["S004"],
        "linked_firs": ["KA/BLR/2024/006", "KA/BLR/2024/007"],
        "crime_types": ["cybercrime", "online fraud", "identity theft"],
        "known_locations": ["Koramangala", "HSR Layout"],
        "description": (
            "High-risk suspect specialising in online fraud and identity theft "
            "targeting salaried professionals in Bengaluru tech corridors."
        ),
    },
    "S007": {
        "id": "S007",
        "name": "Basavaraju K",
        "aliases": ["Basava"],
        "risk_level": "high",
        "status": "active",
        "bail_status": "not_on_bail",
        "bail_release_date": None,
        "district": "Kalaburagi",
        "known_associates": ["S005"],
        "linked_firs": ["KA/KLB/2024/001"],
        "crime_types": ["assault", "extortion"],
        "known_locations": ["Kalaburagi City", "Gulbarga Market"],
        "description": (
            "High-risk suspect with a history of violent assault and extortion "
            "in the Kalaburagi district."
        ),
    },
    "S008": {
        "id": "S008",
        "name": "Ayesha Khan",
        "aliases": ["Ayesha"],
        "risk_level": "medium",
        "status": "active",
        "bail_status": "on_bail",
        "bail_release_date": "2024-09-15",
        "district": "Mangaluru",
        "known_associates": [],
        "linked_firs": ["KA/MGR/2024/001"],
        "crime_types": ["document forgery", "fraud"],
        "known_locations": ["Mangaluru Port Area", "Hampankatta"],
        "description": (
            "Medium-risk suspect involved in document forgery and financial "
            "fraud in Mangaluru."
        ),
    },
}


# ---------------------------------------------------------------------------
# FIR RECORDS
# ---------------------------------------------------------------------------

FIRS = {
    "KA/BLR/2024/001": {
        "fir_id": "KA/BLR/2024/001",
        "short_id": "001",
        "district": "Bengaluru Urban",
        "police_station": "Whitefield Police Station",
        "year": 2024,
        "crime_type": "theft",
        "crime_types": ["theft"],
        "location": "Whitefield",
        "date": "2024-03-15",
        "status": "under_investigation",
        "suspect_ids": [
            "S001",
            "S002",
        ],
        "suspect_names": [
            "Raju Kumar",
            "Suresh Naik",
        ],
        "evidence_ids": [
            "E001",
            "E002",
        ],
        "description": (
            "Reported theft incident in the Whitefield area involving "
            "Raju Kumar and Suresh Naik."
        ),
    },
    "KA/BLR/2024/002": {
        "fir_id": "KA/BLR/2024/002",
        "short_id": "002",
        "district": "Bengaluru Urban",
        "police_station": "Marathahalli Police Station",
        "year": 2024,
        "crime_type": "robbery",
        "crime_types": ["robbery"],
        "location": "Marathahalli",
        "date": "2024-04-22",
        "status": "under_investigation",
        "suspect_ids": ["S001"],
        "suspect_names": ["Raju Kumar"],
        "evidence_ids": ["E003"],
        "description": (
            "Robbery case reported in Marathahalli with Raju Kumar "
            "identified as the primary suspect."
        ),
    },
    "KA/BLR/2024/003": {
        "fir_id": "KA/BLR/2024/003",
        "short_id": "003",
        "district": "Bengaluru Urban",
        "police_station": "Indiranagar Police Station",
        "year": 2024,
        "crime_type": "burglary",
        "crime_types": ["burglary"],
        "location": "Indiranagar",
        "date": "2024-05-10",
        "status": "under_investigation",
        "suspect_ids": [
            "S002",
            "S003",
        ],
        "suspect_names": [
            "Suresh Naik",
            "Mohammed Irfan",
        ],
        "evidence_ids": [
            "E004",
            "E005",
        ],
        "description": (
            "Burglary case in Indiranagar linked to Suresh Naik and "
            "Mohammed Irfan."
        ),
    },
    "KA/MYS/2024/001": {
        "fir_id": "KA/MYS/2024/001",
        "short_id": "MYS001",
        "district": "Mysuru",
        "police_station": "Mysuru City Police Station",
        "year": 2024,
        "crime_type": "assault",
        "crime_types": ["assault"],
        "location": "Mysuru",
        "date": "2024-06-18",
        "status": "under_investigation",
        "suspect_ids": ["S003"],
        "suspect_names": ["Mohammed Irfan"],
        "evidence_ids": ["E006"],
        "description": (
            "Assault case reported in Mysuru involving Mohammed Irfan."
        ),
    },
    "KA/BLR/2024/004": {
        "fir_id": "KA/BLR/2024/004",
        "short_id": "004",
        "district": "Bengaluru Urban",
        "police_station": "Electronic City Police Station",
        "year": 2024,
        "crime_type": "fraud",
        "crime_types": ["fraud"],
        "location": "Electronic City",
        "date": "2024-07-05",
        "status": "under_investigation",
        "suspect_ids": ["S004"],
        "suspect_names": ["Vikram Shetty"],
        "evidence_ids": [
            "E007",
            "E008",
        ],
        "description": (
            "Fraud investigation in Electronic City involving absconding "
            "suspect Vikram Shetty."
        ),
    },
    "KA/BLR/2024/005": {
        "fir_id": "KA/BLR/2024/005",
        "short_id": "005",
        "district": "Bengaluru Urban",
        "police_station": "Whitefield Police Station",
        "year": 2024,
        "crime_type": "theft",
        "crime_types": [
            "theft",
            "ATM skimming",
        ],
        "location": "Whitefield",
        "date": "2024-08-12",
        "status": "under_investigation",
        "suspect_ids": [
            "S001",
            "S004",
        ],
        "suspect_names": [
            "Raju Kumar",
            "Vikram Shetty",
        ],
        "evidence_ids": [
            "E009",
            "E010",
        ],
        "description": (
            "Theft and ATM skimming case in Whitefield linked to Raju Kumar "
            "and Vikram Shetty."
        ),
    },
    "KA/HBL/2024/001": {
        "fir_id": "KA/HBL/2024/001",
        "short_id": "HBL001",
        "district": "Hubli-Dharwad",
        "police_station": "Hubli Old Town Police Station",
        "year": 2024,
        "crime_type": "chain snatching",
        "crime_types": ["chain snatching"],
        "location": "Hubli Old Town",
        "date": "2024-09-03",
        "status": "under_investigation",
        "suspect_ids": ["S005"],
        "suspect_names": ["Deepa Hegde"],
        "evidence_ids": ["E011"],
        "description": (
            "Chain snatching incident in Hubli Old Town market area. "
            "Deepa Hegde identified from CCTV footage."
        ),
    },
    "KA/BLR/2024/006": {
        "fir_id": "KA/BLR/2024/006",
        "short_id": "006",
        "district": "Bengaluru Urban",
        "police_station": "Koramangala Police Station",
        "year": 2024,
        "crime_type": "cybercrime",
        "crime_types": ["cybercrime", "online fraud"],
        "location": "Koramangala",
        "date": "2024-09-18",
        "status": "under_investigation",
        "suspect_ids": ["S006", "S009"],
        "suspect_names": ["Srinivas Rao", "Anisha Rodrigues"],
        "evidence_ids": ["E012", "E013"],
        "description": (
            "Online fraud case filed by multiple victims in Koramangala. "
            "Srinivas Rao linked through digital payment trail."
        ),
    },
    "KA/BLR/2024/007": {
        "fir_id": "KA/BLR/2024/007",
        "short_id": "007",
        "district": "Bengaluru Urban",
        "police_station": "HSR Layout Police Station",
        "year": 2024,
        "crime_type": "identity theft",
        "crime_types": ["identity theft", "cybercrime"],
        "location": "HSR Layout",
        "date": "2024-10-05",
        "status": "chargesheeted",
        "suspect_ids": ["S006"],
        "suspect_names": ["Srinivas Rao"],
        "evidence_ids": ["E014"],
        "description": (
            "Identity theft case targeting a software engineer in HSR Layout. "
            "Suspect used cloned SIM and forged KYC documents."
        ),
    },
    "KA/KLB/2024/001": {
        "fir_id": "KA/KLB/2024/001",
        "short_id": "KLB001",
        "district": "Kalaburagi",
        "police_station": "Kalaburagi City Police Station",
        "year": 2024,
        "crime_type": "assault",
        "crime_types": ["assault", "extortion"],
        "location": "Kalaburagi City",
        "date": "2024-10-14",
        "status": "under_investigation",
        "suspect_ids": ["S007"],
        "suspect_names": ["Basavaraju K"],
        "evidence_ids": ["E015"],
        "description": (
            "Assault and extortion complaint filed by a local shopkeeper "
            "in Kalaburagi. Basavaraju K identified as the primary suspect."
        ),
    },
    "KA/MGR/2024/001": {
        "fir_id": "KA/MGR/2024/001",
        "short_id": "MGR001",
        "district": "Mangaluru",
        "police_station": "Mangaluru Port Police Station",
        "year": 2024,
        "crime_type": "document forgery",
        "crime_types": ["document forgery", "fraud"],
        "location": "Mangaluru Port Area",
        "date": "2024-11-01",
        "status": "under_investigation",
        "suspect_ids": ["S008"],
        "suspect_names": ["Ayesha Khan"],
        "evidence_ids": ["E016"],
        "description": (
            "Document forgery case involving fake shipping manifests. "
            "Ayesha Khan linked through handwriting analysis and digital records."
        ),
    },
    "KA/BLR/2024/008": {
        "fir_id": "KA/BLR/2024/008",
        "short_id": "008",
        "district": "Bengaluru Urban",
        "police_station": "Cubbon Park Police Station",
        "year": 2024,
        "crime_type": "financial fraud",
        "crime_types": ["financial fraud", "hawala transactions"],
        "location": "MG Road",
        "date": "2024-11-01",
        "status": "under_investigation",
        "suspect_ids": ["S010", "S011"],
        "suspect_names": ["Virat Kohli", "Rohit Sharma"],
        "evidence_ids": [],
        "description": (
            "Financial fraud and hawala transaction case linking inter-state suspects "
            "identified through digital payment trails on MG Road corridor."
        ),
    },
    "KA/BLR/2024/009": {
        "fir_id": "KA/BLR/2024/009",
        "short_id": "009",
        "district": "Bengaluru Urban",
        "police_station": "Chinnaswamy Stadium Area PS",
        "year": 2024,
        "crime_type": "financial fraud",
        "crime_types": ["financial fraud"],
        "location": "Chinnaswamy Stadium Area",
        "date": "2024-11-10",
        "status": "absconding",
        "suspect_ids": ["S010"],
        "suspect_names": ["Virat Kohli"],
        "evidence_ids": [],
        "description": (
            "Suspect Virat Kohli absconding after CCTV identification near "
            "Chinnaswamy Stadium area. Blue Corner Notice issued."
        ),
    },
    "KA/BLR/2024/010": {
        "fir_id": "KA/BLR/2024/010",
        "short_id": "010",
        "district": "Bengaluru Urban",
        "police_station": "Sarjapur Road Police Station",
        "year": 2024,
        "crime_type": "land acquisition fraud",
        "crime_types": ["land acquisition fraud", "benami property"],
        "location": "Bengaluru Tech Corridor",
        "date": "2024-10-20",
        "status": "under_investigation",
        "suspect_ids": ["S012"],
        "suspect_names": ["Mahendra Singh Dhoni"],
        "evidence_ids": [],
        "description": (
            "Benami property registration and land acquisition fraud case in "
            "Bengaluru tech corridor. Suspect cooperating under Section 50 PMLA."
        ),
    },
}


# ---------------------------------------------------------------------------
# LOCATIONS
# ---------------------------------------------------------------------------

LOCATIONS = {
    "L001": {
        "id": "L001",
        "name": "Whitefield",
        "district": "Bengaluru Urban",
        "latitude": 12.9698,
        "longitude": 77.7500,
        "type": "crime_location",
    },
    "L002": {
        "id": "L002",
        "name": "Marathahalli",
        "district": "Bengaluru Urban",
        "latitude": 12.9591,
        "longitude": 77.6974,
        "type": "crime_location",
    },
    "L003": {
        "id": "L003",
        "name": "Indiranagar",
        "district": "Bengaluru Urban",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "type": "crime_location",
    },
    "L004": {
        "id": "L004",
        "name": "Mysuru",
        "district": "Mysuru",
        "latitude": 12.2958,
        "longitude": 76.6394,
        "type": "crime_location",
    },
    "L005": {
        "id": "L005",
        "name": "Electronic City",
        "district": "Bengaluru Urban",
        "latitude": 12.8452,
        "longitude": 77.6602,
        "type": "crime_location",
    },
    "L006": {
        "id": "L006",
        "name": "Hubli Old Town",
        "district": "Hubli-Dharwad",
        "latitude": 15.3647,
        "longitude": 75.1240,
        "type": "crime_location",
    },
    "L007": {
        "id": "L007",
        "name": "Koramangala",
        "district": "Bengaluru Urban",
        "latitude": 12.9352,
        "longitude": 77.6245,
        "type": "crime_location",
    },
    "L008": {
        "id": "L008",
        "name": "HSR Layout",
        "district": "Bengaluru Urban",
        "latitude": 12.9116,
        "longitude": 77.6474,
        "type": "crime_location",
    },
    "L009": {
        "id": "L009",
        "name": "Kalaburagi City",
        "district": "Kalaburagi",
        "latitude": 17.3297,
        "longitude": 76.8343,
        "type": "crime_location",
    },
    "L010": {
        "id": "L010",
        "name": "Mangaluru Port Area",
        "district": "Mangaluru",
        "latitude": 12.9141,
        "longitude": 74.8560,
        "type": "crime_location",
    },
}


# ---------------------------------------------------------------------------
# EVIDENCE
# ---------------------------------------------------------------------------

EVIDENCE = {
    "E001": {
        "id": "E001",
        "type": "CCTV",
        "description": "CCTV grab at 02:41 AM showing hooded suspect tampering with commercial shutter lock in Whitefield.",
        "image_url": "/evidence/cctv_sample.svg",
        "timestamp": "2024-03-15 02:41:19 IST",
        "source": "Whitefield Main Rd Traffic & Commercial Grid",
        "linked_firs": ["KA/BLR/2024/001"],
    },
    "E002": {
        "id": "E002",
        "type": "fingerprint",
        "description": "Latent chance fingerprint lifted from broken glass counter; matched against NAFIS database with 98.4% ridge confidence.",
        "image_url": "/evidence/fingerprint_sample.svg",
        "timestamp": "2024-03-15 08:30:00 IST",
        "source": "State Fingerprint Bureau, CID Bengaluru",
        "linked_firs": ["KA/BLR/2024/001"],
    },
    "E003": {
        "id": "E003",
        "type": "vehicle",
        "description": "Automated Number Plate Recognition (ANPR) camera captured getaway vehicle KA-05-MN-4819 fleeing towards Outer Ring Road.",
        "image_url": "/evidence/vehicle_sample.svg",
        "timestamp": "2024-04-22 03:15:11 IST",
        "source": "Marathahalli Junction Smart City ANPR",
        "linked_firs": ["KA/BLR/2024/002"],
    },
    "E004": {
        "id": "E004",
        "type": "CCTV",
        "description": "Night vision residential camera footage showing two intruders climbing ventilation shaft.",
        "image_url": "/evidence/cctv_sample.svg",
        "timestamp": "2024-05-10 01:22:40 IST",
        "source": "Indiranagar 100ft Road RWA Feed",
        "linked_firs": ["KA/BLR/2024/003"],
    },
    "E005": {
        "id": "E005",
        "type": "forensic",
        "description": "Unnatural Death (UDR) Inquest Note: Identifying Trishul tattoo on right wrist matched with Missing Person FIR from Hassan district.",
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-06-18 11:45:00 IST",
        "source": "Mysuru Forensic Medical Inquest Division",
        "linked_firs": ["KA/MYS/2024/001"],
    },
    "E006": {
        "id": "E006",
        "type": "witness statement",
        "description": (
            "Witness statement recorded in Mysuru assault investigation. "
            "Eyewitness identified suspect fleeing scene on KSRTC bus route."
        ),
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-06-18 14:30:00 IST",
        "source": "Mysuru City Police Station, Witness Division",
        "linked_firs": ["KA/MYS/2024/001"],
    },
    "E007": {
        "id": "E007",
        "type": "digital records",
        "description": (
            "Digital transaction records showing fraudulent UPI transfers totalling ₹24.6 lakh "
            "linked to suspect's burner phone number."
        ),
        "image_url": "/evidence/atm_log_sample.svg",
        "timestamp": "2024-07-05 09:15:00 IST",
        "source": "Bengaluru Cyber Crime Cell — Financial Intelligence Unit",
        "linked_firs": ["KA/BLR/2024/004"],
    },
    "E008": {
        "id": "E008",
        "type": "forged document",
        "description": (
            "Forged rent agreement and fabricated Aadhaar-linked KYC documents used "
            "to open shell company accounts in Electronic City."
        ),
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-07-10 11:00:00 IST",
        "source": "Electronic City Sub-Registrar Office / SFIO",
        "linked_firs": ["KA/BLR/2024/004"],
    },
    "E009": {
        "id": "E009",
        "type": "ATM",
        "description": "Digital forensic ATM card reader telemetry showing physical skimming overlay device attached at 02:14 AM.",
        "image_url": "/evidence/atm_log_sample.svg",
        "timestamp": "2024-08-12 02:14:08 IST",
        "source": "Bank of Karnataka Hope Farm Branch",
        "linked_firs": ["KA/BLR/2024/005"],
    },
    "E010": {
        "id": "E010",
        "type": "CCTV",
        "description": "ATM booth surveillance camera grab showing suspect tampering with card insertion slot with face partially concealed.",
        "image_url": "/evidence/cctv_sample.svg",
        "timestamp": "2024-08-12 02:13:55 IST",
        "source": "Whitefield ATM Security Grid",
        "linked_firs": ["KA/BLR/2024/005"],
    },
    "E011": {
        "id": "E011",
        "type": "CCTV",
        "description": "CCTV footage from Hubli Old Town market area capturing suspect during chain snatching. Partial face identification via Karnataka Smart City CCTV Grid.",
        "image_url": "/evidence/cctv_sample.svg",
        "timestamp": "2024-09-03 11:14:22 IST",
        "source": "Hubli Old Town Market CCTV Grid",
        "linked_firs": ["KA/HBL/2024/001"],
    },
    "E012": {
        "id": "E012",
        "type": "digital records",
        "description": "Payment gateway logs from Razorpay and PhonePe showing 47 fraudulent micro-transactions. IP traced to co-working space in Koramangala.",
        "image_url": "/evidence/atm_log_sample.svg",
        "timestamp": "2024-09-18 16:45:00 IST",
        "source": "Bengaluru Cyber Crime PS — IFSO Unit",
        "linked_firs": ["KA/BLR/2024/006"],
    },
    "E013": {
        "id": "E013",
        "type": "digital records",
        "description": "IP address records and VPN exit node traces linking fraud command-and-control server to suspect's registered device IMEI.",
        "image_url": "/evidence/atm_log_sample.svg",
        "timestamp": "2024-09-19 09:00:00 IST",
        "source": "Karnataka CERT-In / Cyber Forensics Division",
        "linked_firs": ["KA/BLR/2024/006"],
    },
    "E014": {
        "id": "E014",
        "type": "forged document",
        "description": "Forged KYC documents with fabricated Aadhaar and PAN used for SIM card cloning at three telecom outlets in HSR Layout.",
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-10-05 14:30:00 IST",
        "source": "HSR Layout PS — Document Forensic Lab",
        "linked_firs": ["KA/BLR/2024/007"],
    },
    "E015": {
        "id": "E015",
        "type": "witness statement",
        "description": "Victim statement and two independent witness affidavits identifying suspect by name. CCTV corroborates presence at market at time of assault.",
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-10-14 18:00:00 IST",
        "source": "Kalaburagi City PS — Victim Support Unit",
        "linked_firs": ["KA/KLB/2024/001"],
    },
    "E016": {
        "id": "E016",
        "type": "forged document",
        "description": "Handwriting analysis report confirming forged shipping manifests. QR-code tampering identified on 11 container clearance documents.",
        "image_url": "/evidence/forensic_sample.svg",
        "timestamp": "2024-11-01 12:00:00 IST",
        "source": "Mangaluru Port Customs Forensic Cell",
        "linked_firs": ["KA/MGR/2024/001"],
    },
}


# ---------------------------------------------------------------------------
# CRIMINAL NETWORK RELATIONSHIPS
# ---------------------------------------------------------------------------

NETWORK_EDGES = [
    {
        "source": "S001",
        "target": "S002",
        "relationship": "co-accused",
        "confidence": 0.92,
        "linked_firs": ["KA/BLR/2024/001"],
    },
    {
        "source": "S001",
        "target": "S004",
        "relationship": "co-accused",
        "confidence": 0.94,
        "linked_firs": ["KA/BLR/2024/005"],
    },
    {
        "source": "S002",
        "target": "S003",
        "relationship": "co-accused",
        "confidence": 0.88,
        "linked_firs": ["KA/BLR/2024/003"],
    },
    {
        "source": "S001",
        "target": "L001",
        "relationship": "same location",
        "confidence": 0.96,
        "linked_firs": [
            "KA/BLR/2024/001",
            "KA/BLR/2024/005",
        ],
    },
    {
        "source": "S002",
        "target": "L001",
        "relationship": "same location",
        "confidence": 0.85,
        "linked_firs": ["KA/BLR/2024/001"],
    },
    {
        "source": "S001",
        "target": "L002",
        "relationship": "same location",
        "confidence": 0.82,
        "linked_firs": ["KA/BLR/2024/002"],
    },
    {
        "source": "S002",
        "target": "L003",
        "relationship": "same location",
        "confidence": 0.84,
        "linked_firs": ["KA/BLR/2024/003"],
    },
    {
        "source": "S003",
        "target": "L003",
        "relationship": "same location",
        "confidence": 0.84,
        "linked_firs": ["KA/BLR/2024/003"],
    },
    {
        "source": "S003",
        "target": "L004",
        "relationship": "same location",
        "confidence": 0.91,
        "linked_firs": ["KA/MYS/2024/001"],
    },
    {
        "source": "S004",
        "target": "L005",
        "relationship": "same location",
        "confidence": 0.90,
        "linked_firs": ["KA/BLR/2024/004"],
    },
    {
        "source": "S004",
        "target": "L001",
        "relationship": "same location",
        "confidence": 0.89,
        "linked_firs": ["KA/BLR/2024/005"],
    },
]


# ---------------------------------------------------------------------------
# BAIL RELEASE DATA
# ---------------------------------------------------------------------------

BAIL_RELEASES = [
    {
        "suspect_id": "S001",
        "suspect_name": "Raju Kumar",
        "district": "Bengaluru Urban",
        "release_date": "2024-11-15",
        "status": "on_bail",
    },
    {
        "suspect_id": "S003",
        "suspect_name": "Mohammed Irfan",
        "district": "Mysuru",
        "release_date": "2024-12-01",
        "status": "on_bail",
    },
    {
        "suspect_id": "S005",
        "suspect_name": "Suresh Kumar",
        "district": "Hubli-Dharwad",
        "release_date": "2024-12-10",
        "status": "on_bail",
    },
    {
        "suspect_id": "S007",
        "suspect_name": "Imran Khan",
        "district": "Kalaburagi",
        "release_date": "2024-11-28",
        "status": "on_bail",
    },
    {
        "suspect_id": "S008",
        "suspect_name": "Vikram Singh",
        "district": "Ballari",
        "release_date": "2024-12-15",
        "status": "on_bail",
    },
    {
        "suspect_id": "S006",
        "suspect_name": "Anand Verma",
        "district": "Mangaluru",
        "release_date": "2024-12-05",
        "status": "on_bail",
    },
    {
        "suspect_id": "S002",
        "suspect_name": "Rajesh Sharma",
        "district": "Belagavi",
        "release_date": "2024-11-20",
        "status": "on_bail",
    },
]


# ---------------------------------------------------------------------------
# FESTIVAL / EVENT DATA
# ---------------------------------------------------------------------------

FESTIVAL_EVENTS = [
    {
        "id": "F001",
        "name": "Bengaluru Karaga",
        "district": "Bengaluru Urban",
        "zone": "Whitefield",
        "event_date": "2025-04-12",
        "activity_level": 0.85,
    },
    {
        "id": "F002",
        "name": "Dasara Festival",
        "district": "Mysuru",
        "zone": "Mysuru",
        "event_date": "2025-10-02",
        "activity_level": 0.95,
    },
    {
        "id": "F003",
        "name": "Local Cultural Festival",
        "district": "Bengaluru Urban",
        "zone": "Indiranagar",
        "event_date": "2025-03-20",
        "activity_level": 0.60,
    },
    {
        "id": "F004",
        "name": "Tech Corridor Event",
        "district": "Bengaluru Urban",
        "zone": "Electronic City",
        "event_date": "2025-06-15",
        "activity_level": 0.75,
    },
    {
        "id": "F005",
        "name": "Sharanabasaveshwara Jathra",
        "district": "Kalaburagi",
        "zone": "Kalaburagi City",
        "event_date": "2025-03-28",
        "activity_level": 0.90,
    },
    {
        "id": "F006",
        "name": "Hubli Ganesh Visarjan",
        "district": "Hubli-Dharwad",
        "zone": "Hubli Old Town",
        "event_date": "2025-09-18",
        "activity_level": 0.88,
    },
    {
        "id": "F007",
        "name": "Hampi Utsav",
        "district": "Ballari",
        "zone": "Ballari Mining Belt",
        "event_date": "2025-11-04",
        "activity_level": 0.85,
    },
    {
        "id": "F008",
        "name": "Kambala Coastal Festival",
        "district": "Mangaluru",
        "zone": "Mangaluru Port Area",
        "event_date": "2025-12-14",
        "activity_level": 0.70,
    },
    {
        "id": "F009",
        "name": "Kittur Utsav",
        "district": "Belagavi",
        "zone": "Belagavi Border Corridor",
        "event_date": "2025-10-23",
        "activity_level": 0.78,
    },
]


# ---------------------------------------------------------------------------
# ECONOMIC STRESS DATA
# ---------------------------------------------------------------------------

ECONOMIC_STRESS = {
    "Whitefield": {
        "district": "Bengaluru Urban",
        "index": 0.55,
        "trend": "stable",
    },
    "Marathahalli": {
        "district": "Bengaluru Urban",
        "index": 0.62,
        "trend": "rising",
    },
    "Indiranagar": {
        "district": "Bengaluru Urban",
        "index": 0.35,
        "trend": "stable",
    },
    "Mysuru": {
        "district": "Mysuru",
        "index": 0.48,
        "trend": "stable",
    },
    "Electronic City": {
        "district": "Bengaluru Urban",
        "index": 0.68,
        "trend": "rising",
    },
    "Hubli Old Town": {
        "district": "Hubli-Dharwad",
        "index": 0.52,
        "trend": "rising",
    },
    "Koramangala": {
        "district": "Bengaluru Urban",
        "index": 0.44,
        "trend": "stable",
    },
    "HSR Layout": {
        "district": "Bengaluru Urban",
        "index": 0.40,
        "trend": "stable",
    },
    "Kalaburagi City": {
        "district": "Kalaburagi",
        "index": 0.70,
        "trend": "rising",
    },
    "Mangaluru Port Area": {
        "district": "Mangaluru",
        "index": 0.58,
        "trend": "stable",
    },
    "Belagavi Border Corridor": {
        "district": "Belagavi",
        "index": 0.64,
        "trend": "rising",
    },
    "Shivamogga Junction": {
        "district": "Shivamogga",
        "index": 0.42,
        "trend": "stable",
    },
    "Ballari Mining Belt": {
        "district": "Ballari",
        "index": 0.69,
        "trend": "rising",
    },
    "Udupi Coastal Zone": {
        "district": "Udupi",
        "index": 0.38,
        "trend": "stable",
    },
    "Davanagere Central": {
        "district": "Davanagere",
        "index": 0.46,
        "trend": "stable",
    },
}


# ---------------------------------------------------------------------------
# INFRASTRUCTURE SIGNALS
# ---------------------------------------------------------------------------

INFRASTRUCTURE_SIGNALS = {
    "Whitefield": {
        "new_atms": 8,
        "new_commercial_units": 12,
        "infrastructure_index": 0.80,
    },
    "Marathahalli": {
        "new_atms": 5,
        "new_commercial_units": 8,
        "infrastructure_index": 0.55,
    },
    "Indiranagar": {
        "new_atms": 3,
        "new_commercial_units": 5,
        "infrastructure_index": 0.35,
    },
    "Mysuru": {
        "new_atms": 6,
        "new_commercial_units": 7,
        "infrastructure_index": 0.60,
    },
    "Electronic City": {
        "new_atms": 10,
        "new_commercial_units": 15,
        "infrastructure_index": 0.90,
    },
    "Hubli Old Town": {
        "new_atms": 6,
        "new_commercial_units": 9,
        "infrastructure_index": 0.65,
    },
    "Koramangala": {
        "new_atms": 7,
        "new_commercial_units": 14,
        "infrastructure_index": 0.75,
    },
    "HSR Layout": {
        "new_atms": 5,
        "new_commercial_units": 10,
        "infrastructure_index": 0.60,
    },
    "Kalaburagi City": {
        "new_atms": 4,
        "new_commercial_units": 6,
        "infrastructure_index": 0.50,
    },
    "Mangaluru Port Area": {
        "new_atms": 6,
        "new_commercial_units": 11,
        "infrastructure_index": 0.70,
    },
    "Belagavi Border Corridor": {
        "new_atms": 5,
        "new_commercial_units": 8,
        "infrastructure_index": 0.65,
    },
    "Shivamogga Junction": {
        "new_atms": 3,
        "new_commercial_units": 5,
        "infrastructure_index": 0.45,
    },
    "Ballari Mining Belt": {
        "new_atms": 7,
        "new_commercial_units": 12,
        "infrastructure_index": 0.72,
    },
    "Udupi Coastal Zone": {
        "new_atms": 4,
        "new_commercial_units": 7,
        "infrastructure_index": 0.48,
    },
    "Davanagere Central": {
        "new_atms": 4,
        "new_commercial_units": 6,
        "infrastructure_index": 0.52,
    },
}


# ---------------------------------------------------------------------------
# PRESSURE ZONE BASE DATA
# ---------------------------------------------------------------------------

PRESSURE_ZONES = [
    {
        "zone_id": "Z001",
        "zone_name": "Whitefield",
        "district": "Bengaluru Urban",
        "latitude": 12.9698,
        "longitude": 77.7500,
    },
    {
        "zone_id": "Z002",
        "zone_name": "Marathahalli",
        "district": "Bengaluru Urban",
        "latitude": 12.9591,
        "longitude": 77.6974,
    },
    {
        "zone_id": "Z003",
        "zone_name": "Indiranagar",
        "district": "Bengaluru Urban",
        "latitude": 12.9784,
        "longitude": 77.6408,
    },
    {
        "zone_id": "Z004",
        "zone_name": "Mysuru",
        "district": "Mysuru",
        "latitude": 12.2958,
        "longitude": 76.6394,
    },
    {
        "zone_id": "Z005",
        "zone_name": "Electronic City",
        "district": "Bengaluru Urban",
        "latitude": 12.8452,
        "longitude": 77.6602,
    },
    {
        "zone_id": "Z006",
        "zone_name": "Hubli Old Town",
        "district": "Hubli-Dharwad",
        "latitude": 15.3647,
        "longitude": 75.1240,
    },
    {
        "zone_id": "Z007",
        "zone_name": "Koramangala",
        "district": "Bengaluru Urban",
        "latitude": 12.9352,
        "longitude": 77.6245,
    },
    {
        "zone_id": "Z008",
        "zone_name": "HSR Layout",
        "district": "Bengaluru Urban",
        "latitude": 12.9116,
        "longitude": 77.6474,
    },
    {
        "zone_id": "Z009",
        "zone_name": "Kalaburagi City",
        "district": "Kalaburagi",
        "latitude": 17.3297,
        "longitude": 76.8343,
    },
    {
        "zone_id": "Z010",
        "zone_name": "Mangaluru Port Area",
        "district": "Mangaluru",
        "latitude": 12.9141,
        "longitude": 74.8560,
    },
    {
        "zone_id": "Z011",
        "zone_name": "Belagavi Border Corridor",
        "district": "Belagavi",
        "latitude": 15.8497,
        "longitude": 74.4977,
    },
    {
        "zone_id": "Z012",
        "zone_name": "Shivamogga Junction",
        "district": "Shivamogga",
        "latitude": 13.9299,
        "longitude": 75.5681,
    },
    {
        "zone_id": "Z013",
        "zone_name": "Ballari Mining Belt",
        "district": "Ballari",
        "latitude": 15.1394,
        "longitude": 76.9214,
    },
    {
        "zone_id": "Z014",
        "zone_name": "Udupi Coastal Zone",
        "district": "Udupi",
        "latitude": 13.3409,
        "longitude": 74.7421,
    },
    {
        "zone_id": "Z015",
        "zone_name": "Davanagere Central",
        "district": "Davanagere",
        "latitude": 14.4644,
        "longitude": 75.9218,
    },
]


# ---------------------------------------------------------------------------
# INITIAL ALERTS
# ---------------------------------------------------------------------------

ALERTS = [
    {
        "alert_id": "A001",
        "zone_id": "Z004",
        "zone_name": "Mysuru",
        "district": "Mysuru",
        "alert_type": "high_pressure",
        "severity": "high",
        "message": (
            "Elevated crime pressure detected around Dasara festival perimeter. "
            "High footfall influx coupled with bail release S003 in vicinity."
        ),
        "active": True,
    },
    {
        "alert_id": "A002",
        "zone_id": "Z006",
        "zone_name": "Hubli Old Town",
        "district": "Hubli-Dharwad",
        "alert_type": "syndicate_movement",
        "severity": "high",
        "message": (
            "Cross-district transit alert: Associates linked to S001 (Raju Kumar) "
            "and inter-state gang detected across railway cargo yards."
        ),
        "active": True,
    },
    {
        "alert_id": "A003",
        "zone_id": "Z010",
        "zone_name": "Mangaluru Port Area",
        "district": "Mangaluru",
        "alert_type": "financial_risk",
        "severity": "medium",
        "message": (
            "Coastal hawala transit surveillance flag. Unregulated commercial "
            "money flow intercepted along container terminal corridor."
        ),
        "active": True,
    },
    {
        "alert_id": "A004",
        "zone_id": "Z009",
        "zone_name": "Kalaburagi City",
        "district": "Kalaburagi",
        "alert_type": "cross_border",
        "severity": "high",
        "message": (
            "Inter-state firearm trafficking warning: Cross-border weapon movement "
            "flagged along NH-50 corridor from Maharashtra border."
        ),
        "active": True,
    },
    {
        "alert_id": "A005",
        "zone_id": "Z001",
        "zone_name": "Whitefield",
        "district": "Bengaluru Urban",
        "alert_type": "cyber_financial",
        "severity": "high",
        "message": (
            "Tech Corridor ATM skimming syndicate & benami land transactions flagged. "
            "Surveillance subject S009 and S001 associates active."
        ),
        "active": True,
    },
    {
        "alert_id": "A006",
        "zone_id": "Z011",
        "zone_name": "Belagavi Border Corridor",
        "district": "Belagavi",
        "alert_type": "transit_anomaly",
        "severity": "medium",
        "message": (
            "Heavy commercial vehicle smuggling checkpoints activated following "
            "CCTNS inter-state suspect alert."
        ),
        "active": True,
    },
]


# ---------------------------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------------------------

def get_all_suspects():
    return deepcopy(list(SUSPECTS.values()))


def get_all_firs():
    return deepcopy(list(FIRS.values()))


def get_suspect_by_id(suspect_id):
    suspect = SUSPECTS.get(suspect_id)
    return deepcopy(suspect) if suspect else None


def get_fir_by_id(fir_id):
    fir = FIRS.get(fir_id)
    return deepcopy(fir) if fir else None


def get_active_alerts():
    return deepcopy([
        alert
        for alert in ALERTS
        if alert.get("active") is True
    ])


def get_network_data():
    """
    Return a graph-ready network containing suspects, FIRs,
    locations, evidence, and relationships.
    """

    nodes = []
    edges = []

    # Suspect nodes
    for suspect in SUSPECTS.values():
        nodes.append({
            "id": suspect["id"],
            "label": suspect["name"],
            "type": "suspect",
            "risk_level": suspect["risk_level"],
            "status": suspect["status"],
            "data": deepcopy(suspect),
        })

    # FIR nodes
    for fir in FIRS.values():
        nodes.append({
            "id": f"FIR:{fir['fir_id']}",
            "label": fir["short_id"],
            "type": "fir",
            "crime_type": fir["crime_type"],
            "data": deepcopy(fir),
        })

    # Location nodes
    for location in LOCATIONS.values():
        nodes.append({
            "id": location["id"],
            "label": location["name"],
            "type": "location",
            "data": deepcopy(location),
        })

    # Evidence nodes
    for evidence in EVIDENCE.values():
        nodes.append({
            "id": evidence["id"],
            "label": evidence["type"],
            "type": "evidence",
            "data": deepcopy(evidence),
        })

    # Existing suspect/location relationships
    edges.extend(deepcopy(NETWORK_EDGES))

    # FIR relationships
    for fir in FIRS.values():

        fir_node_id = f"FIR:{fir['fir_id']}"

        # Suspect -> FIR
        for suspect_id in fir["suspect_ids"]:
            edges.append({
                "source": suspect_id,
                "target": fir_node_id,
                "relationship": "linked to FIR",
                "confidence": 1.0,
                "linked_firs": [
                    fir["fir_id"]
                ],
            })

        # FIR -> Location
        location_id = next(
            (
                location_id
                for location_id, location in LOCATIONS.items()
                if location["name"] == fir["location"]
            ),
            None,
        )

        if location_id:
            edges.append({
                "source": fir_node_id,
                "target": location_id,
                "relationship": "reported at",
                "confidence": 1.0,
                "linked_firs": [
                    fir["fir_id"]
                ],
            })

        # FIR -> Evidence
        for evidence_id in fir["evidence_ids"]:
            edges.append({
                "source": fir_node_id,
                "target": evidence_id,
                "relationship": "supported by evidence",
                "confidence": 1.0,
                "linked_firs": [
                    fir["fir_id"]
                ],
            })

    return {
        "nodes": nodes,
        "edges": edges,
    }


def get_stats():
    """
    Return platform-wide summary statistics for the dashboard.
    """
    suspects = list(SUSPECTS.values())
    firs = list(FIRS.values())

    high_risk = sum(1 for s in suspects if s["risk_level"] == "high")
    on_bail = sum(1 for s in suspects if s["bail_status"] == "on_bail")
    absconding = sum(1 for s in suspects if s["status"] == "absconding")

    crime_type_counts: dict = {}
    fir_status_counts: dict = {}
    for fir in firs:
        ct = fir["crime_type"]
        crime_type_counts[ct] = crime_type_counts.get(ct, 0) + 1
        st = fir["status"]
        fir_status_counts[st] = fir_status_counts.get(st, 0) + 1

    active_alerts = get_active_alerts()
    districts = {s["district"] for s in suspects}

    return {
        "suspects": {
            "total": len(suspects),
            "high_risk": high_risk,
            "on_bail": on_bail,
            "absconding": absconding,
        },
        "firs": {
            "total": len(firs),
            "by_type": crime_type_counts,
            "by_status": fir_status_counts,
        },
        "zones": {
            "total": len(PRESSURE_ZONES),
        },
        "districts": {
            "total": 31,
            "active_monitored": len(districts),
            "names": sorted(districts),
        },
        "alerts": {
            "active": len(active_alerts),
        },
    }
