#!/usr/bin/env python3
"""
Simple script to compare members in Notion CSV with TypeScript TEAM_DATA
"""
import csv
import re
import os


def extract_members_from_ts():
    """Extract members from the TypeScript TEAM_DATA using a simpler approach"""
    ts_file_path = os.path.join(os.path.dirname(__file__), 'pnc-web', 'src', 'data', 'team.ts')
    
    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the TEAM_DATA array section
    start_marker = 'export const TEAM_DATA: TeamMember[] = ['
    start_idx = content.find(start_marker)
    
    if start_idx == -1:
        print("Could not find TEAM_DATA in team.ts")
        return []
    
    # Find the start of the actual array content (the opening bracket after the assignment)
    array_start = content.find('[', start_idx + len(start_marker))
    if array_start == -1:
        print("Could not find TEAM_DATA array start")
        return []
    
    # Find the end by counting brackets
    bracket_count = 0
    for i, char in enumerate(content[array_start:], array_start):
        if char == '{':  # Only count object braces, not array braces
            bracket_count += 1
        elif char == '}':
            bracket_count -= 1
            if bracket_count == 0:
                array_end = i + 1
                break
    else:
        print("Could not find TEAM_DATA array end")
        return []
    
    # Look for all objects within the array that have name, role, department, and status
    array_content = content[array_start:array_end]
    
    # Use regex to find all member object patterns
    # Pattern to match objects with name, role, department, and status
    member_pattern = r'\{\s*[^}]*?name\s*:\s*["\']([^"\']*)["\'][^}]*?role\s*:\s*["\']([^"\']*)["\'][^}]*?department\s*:\s*["\']([^"\']*)["\'][^}]*?status\s*:\s*["\']([^"\']*)["\'][^}]*?\}'
    
    members = []
    matches = re.finditer(member_pattern, array_content, re.DOTALL)
    
    for match in matches:
        name, role, department, status = match.groups()
        members.append({
            'name': name,
            'role': role,
            'department': department,
            'status': status
        })
    
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
    print("=" * 60)
    
    # Get members from TypeScript
    ts_members = extract_members_from_ts()
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
    print("=" * 60)
    
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


if __name__ == "__main__":
    main()