#!/usr/bin/env python3
"""
Simple script to compare members in Notion CSV with TypeScript TEAM_DATA - Manual approach
"""
import csv
import os


def extract_known_members_from_ts():
    """Manually extract known members from TypeScript TEAM_DATA based on the file content we read earlier"""
    # Based on the content we read from the team.ts file
    members = [
        {'name': 'Soham Sonawane', 'role': 'President', 'department': 'Executive', 'status': 'Active'},
        {'name': 'Sharvari Tate', 'role': 'Secretary', 'department': 'Executive', 'status': 'Active'},
        {'name': 'Prajakta Jadhav', 'role': 'Vice President', 'department': 'Executive', 'status': 'Active'},
        {'name': 'Suyash Rahegaonkar', 'role': 'Treasurer', 'department': 'Executive', 'status': 'Active'},
        {'name': 'Anagha Purohit', 'role': 'Former President', 'department': 'Executive', 'status': 'Inactive'},
        {'name': 'Jui Dicholkar', 'role': 'Media Head', 'department': 'Media', 'status': 'Inactive'},
        {'name': 'Priya Kadam', 'role': 'Vice - President', 'department': 'Executive', 'status': 'Inactive'},
        {'name': 'Parth Borkar', 'role': 'Treasurer', 'department': 'Executive', 'status': 'Inactive'},
        {'name': 'Saartha Kamble', 'role': 'Secretary', 'department': 'Executive', 'status': 'Inactive'},
        {'name': 'Krishnandu Sarkar', 'role': 'Research Head', 'department': 'Research', 'status': 'Inactive'},
        {'name': 'Shreya Joshi', 'role': 'Head', 'department': 'Media', 'status': 'Active'},
        {'name': 'Arnav Ingle', 'role': 'Member', 'department': 'Media', 'status': 'Active'},
        {'name': 'Jayashri Donne', 'role': 'Member', 'department': 'Media', 'status': 'Active'},
        {'name': 'Aditya Roy', 'role': 'Head', 'department': 'Research', 'status': 'Active'},
        {'name': 'Chinmay Kadam', 'role': 'Member', 'department': 'Research', 'status': 'Active'}
    ]
    
    return members


def extract_members_from_csv():
    """Extract members from the Notion CSV database"""
    csv_file_path = os.path.join(os.path.dirname(__file__), 'members-directory-pnc-notion-db.csv')
    
    members = []
    with open(csv_file_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig to handle BOM
        # Read the file content first to check for issues
        content = f.read()
        
        # Create a string buffer to handle UTF-8 with BOM
        import io
        buffer = io.StringIO(content)
        
        # Use csv reader
        reader = csv.DictReader(buffer)
        
        for row in reader:
            # Extract relevant fields
            name = row.get('Full Name', '').strip()
            role = row.get('Role', '').strip()
            department = row.get('Department', '').strip()
            
            # Adjust department name from CSV to match TS format
            if department.lower() == 'marketing':
                department = 'Media'  # CSV uses 'Marketing' but TS uses 'Media'
            
            status = 'Active' if row.get('Status', '').strip().lower() == 'active' else 'Inactive'
            
            if name:  # Only add if name exists
                members.append({
                    'name': name,
                    'role': role,
                    'department': department,
                    'status': status
                })
    
    return members


def main():
    print("Comparing Notion CSV database with TypeScript TEAM_DATA...")
    print("=" * 65)
    
    # Get members from TypeScript based on our knowledge from reading the file
    ts_members = extract_known_members_from_ts()
    print(f"Found {len(ts_members)} members in TypeScript TEAM_DATA:")
    for i, member in enumerate(ts_members):
        print(f"  {i+1:2d}. {member['name']} ({member['role']}, {member['department']}, {member['status']})")
    
    print()
    
    # Get members from CSV
    csv_members = extract_members_from_csv()
    print(f"Found {len(csv_members)} members in Notion CSV database:")
    for i, member in enumerate(csv_members):
        print(f"  {i+1:2d}. {member['name']} ({member['role']}, {member['department']}, {member['status']})")
    
    print()
    print("Comparison Results:")
    print("=" * 65)
    
    # Extract just names for comparison
    ts_names = [m['name'].strip() for m in ts_members]
    csv_names = [m['name'].strip() for m in csv_members]
    
    names_only_ts = set(ts_names) - set(csv_names)
    names_only_csv = set(csv_names) - set(ts_names)
    
    print(f"Names in TypeScript but not in CSV: {len(names_only_ts)}")
    if names_only_ts:
        for name in names_only_ts:
            member = next(m for m in ts_members if m['name'] == name)
            print(f"    * {name} ({member['role']}, {member['department']}, {member['status']})")
    
    print(f"Names in CSV but not in TypeScript: {len(names_only_csv)}")
    if names_only_csv:
        for name in names_only_csv:
            member = next(m for m in csv_members if m['name'] == name)
            print(f"    * {name} ({member['role']}, {member['department']}, {member['status']})")
    
    print()
    print("Summary:")
    print(f"- TypeScript TEAM_DATA: {len(ts_names)} members")
    print(f"- Notion CSV database: {len(csv_names)} members")
    
    if not names_only_ts:
        print("[OK] All TypeScript members are in CSV")
    else:
        print(f"- Missing in CSV: {len(names_only_ts)} members")
        for name in names_only_ts:
            member = next(m for m in ts_members if m['name'] == name)
            print(f"    * {name} ({member['role']}, {member['department']}, {member['status']})")
    
    if not names_only_csv:
        print("[OK] All CSV members are in TypeScript")
    else:
        print(f"- Missing in TypeScript: {len(names_only_csv)} members")
        for name in names_only_csv:
            member = next(m for m in csv_members if m['name'] == name)
            print(f"    * {name} ({member['role']}, {member['department']}, {member['status']})")

    print("\nFINDINGS:")
    print("-" * 20)
    if names_only_ts:
        print(f"[ERROR] {len(names_only_ts)} members exist in TypeScript but are missing from the Notion CSV database")
        print("   These need to be added to the Notion database")
    else:
        print("[OK] All members in TypeScript exist in the Notion CSV database")
    
    if names_only_csv:
        print(f"[ERROR] {len(names_only_csv)} members exist in Notion CSV but are missing from TypeScript TEAM_DATA") 
        print("   These need to be added to the TypeScript TEAM_DATA")
    else:
        print("[OK] All members in Notion CSV exist in the TypeScript TEAM_DATA")
    

if __name__ == "__main__":
    main()