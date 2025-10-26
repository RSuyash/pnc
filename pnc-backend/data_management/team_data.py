"""
Team member data from the frontend team.ts file
"""

TEAM_DATA = [
    # Current Executive Committee (25-26)
    {
        "id": 1,
        "name": "Soham Sonawane",
        "role": "President",
        "department": "Executive",
        "email": "s12233050007@gmail.com",
        "interests": "Aquatic Ecosystems, Avian Ecology, Botany, Climate Science, Conservation Technology, Entomology, Environmental Policy, Herpetology",
        "skills": "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
        "status": "Active",
        "image": "/images/team/soham.png",
        "isHead": True
    },
    {
        "id": 2,
        "name": "Sharvari Tate",
        "role": "Secretary",
        "department": "Executive",
        "email": "1332250378@mitwpu.edu.in",
        "interests": "Aquatic Ecosystems, Climate Science, Conservation Technology, Environmental Policy",
        "skills": "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
        "status": "Active",
        "image": "/images/team/sharvari.png",
        "isHead": False
    },
    {
        "id": 3,
        "name": "Prajakta Jadhav",
        "role": "Vice President",
        "department": "Executive",
        "email": "",
        "status": "Active",
        "image": "/images/team/prajakta.png",
        "isHead": False
    },
    {
        "id": 4,
        "name": "Suyash Rahegaonkar",
        "role": "Treasurer",
        "department": "Executive",
        "email": "1332250296@mitwpu.edu.in",  # This is the key one!
        "interests": "Climate Science, Environmental Policy",
        "skills": "Data Analysis, GIS, Grant Writing, Leadership, Project Management, Public Speaking, Scientific Writing",
        "status": "Active",
        "image": "/images/team/suyash.png",
        "isHead": False
    },
    # Previous Executive Committee (24-25)
    {
        "id": 5,
        "name": "Anagha Purohit",
        "role": "Former President",
        "department": "Executive",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/president_24-25.PNG",
        "isHead": False
    },
    # Previous Department Heads (24-25)
    {
        "id": 6,
        "name": "Jui Dicholkar",
        "role": "Media Head",
        "department": "Media",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/media_head_24-25.PNG",
        "isHead": True
    },
    {
        "id": 7,
        "name": "Priya Kadam",
        "role": "Vice - President",
        "department": "Executive",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/vice_president.PNG",
        "isHead": False
    },
    {
        "id": 8,
        "name": "Parth Borkar",
        "role": "Treasurer",
        "department": "Executive",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/treasurer_24_25.PNG",
        "isHead": False
    },
    {
        "id": 9,
        "name": "Saartha Kamble",
        "role": "Secretary",
        "department": "Executive",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/secretary_24_25.PNG",
        "isHead": False
    },
    {
        "id": 10,
        "name": "Krishnandu Sarkar",
        "role": "Research Head",
        "department": "Research",
        "email": "",
        "status": "Inactive",
        "image": "/images/team/research_head_24-25.PNG",
        "isHead": True
    },
    # Current Media Department (25-26)
    {
        "id": 11,
        "name": "Shreya Joshi",
        "role": "Head",
        "department": "Media",
        "email": "1332250538@mitwpu.edu.in",
        "interests": "Climate Science, Conservation Technology",
        "skills": "Leadership, Project Management",
        "status": "Active",
        "image": "/images/team/Media_head.png",
        "isHead": True
    },
    {
        "id": 12,
        "name": "Arnav Ingle",
        "role": "Member",
        "department": "Media",
        "email": "1332250630@mitwpu.edu.in",
        "interests": "Avian Ecology, Climate Science, Conservation Technology, Environmental Policy",
        "skills": "Data Analysis, GIS, Project Management",
        "status": "Active",
        "isHead": False
    },
    {
        "id": 13,
        "name": "Jayashri Donne",
        "role": "Member",
        "department": "Media",
        "email": "1332250127@mitwpu.edu.in",
        "interests": "Aquatic Ecosystems, Botany, Environmental Policy, Herpetology",
        "skills": "Grant Writing, Project Management, Scientific Writing",
        "status": "Active",
        "isHead": False
    },
    # Current Research Department (25-26)
    {
        "id": 14,
        "name": "Aditya Roy",
        "role": "Head",
        "department": "Research",
        "email": "",
        "status": "Active",
        "image": "/images/team/Research_Head.png",
        "isHead": True
    },
    {
        "id": 15,
        "name": "Chinmay Kadam",
        "role": "Member",
        "department": "Research",
        "email": "",
        "status": "Active",
        "isHead": False
    }
]

def get_active_members():
    """Get all active team members"""
    return [member for member in TEAM_DATA if member.get("status") == "Active"]

def find_member_by_email(email):
    """Find a team member by email"""
    if not email:
        return None
    for member in TEAM_DATA:
        if member.get("email", "").lower() == email.lower():
            return member
    return None

def find_member_by_name(name):
    """Find a team member by name"""
    if not name:
        return None
    for member in TEAM_DATA:
        if member.get("name", "").lower() == name.lower():
            return member
    return None