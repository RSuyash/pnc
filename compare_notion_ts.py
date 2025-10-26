#!/usr/bin/env python3
"""
Script to compare members in Notion database CSV with TypeScript TEAM_DATA
"""
import json
import csv
import re
import os


def parse_team_ts_to_json():
    """Parse the TypeScript TEAM_DATA to extract member information"""
    ts_file_path = os.path.join(os.path.dirname(__file__), 'pnc-web', 'src', 'data', 'team.ts')
    
    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the TEAM_DATA array content
    start_marker = 'export const TEAM_DATA: TeamMember[] = ['
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Could not find TEAM_DATA in team.ts")
        return []
    
    # Find the start of the actual array content (after the '=' and opening bracket)
    array_start = start_idx + len(start_marker) - 1  # -1 to include the last character of start_marker
    while array_start < len(content) and content[array_start] != '[':
        array_start += 1
    
    if array_start >= len(content) or content[array_start] != '[':
        print("Could not find TEAM_DATA array start")
        return []
    
    # Find the end by counting brackets
    bracket_count = 0
    for i, char in enumerate(content[array_start:], array_start):
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                array_end = i + 1
                break
    else:
        print("Could not find TEAM_DATA array end")
        return []
    
    array_content = content[array_start:array_end].strip()
    
    # Now find each member object within the array
    members = []
    
    # Find all objects within the array, accounting for nested structures
    i = 1  # Skip the first opening bracket
    while i < len(array_content) - 1:
        if array_content[i] == '{':
            # Start of a new member object
            brace_count = 0
            obj_start = i
            for j, char in enumerate(array_content[obj_start:], obj_start):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        # Complete object found
                        obj_content = array_content[obj_start:j+1]
                        
                        # Extract name
                        name_match = re.search(r'"name"\s*:\s*["\']([^"\']*)["\']|name\s*:\s*["\']([^"\']*)["\']', obj_content)
                        if name_match:
                            # Take the first non-None group
                            member_name = next(g for g in name_match.groups() if g is not None)
                            
                            # Extract other fields
                            role_match = re.search(r'"role"\s*:\s*["\']([^"\']*)["\']|role\s*:\s*["\']([^"\']*)["\']', obj_content)
                            role = next((g for g in (role_match.groups() if role_match else (None, None)) if g is not None), "") if role_match else ""
                            
                            dept_match = re.search(r'"department"\s*:\s*["\']([^"\']*)["\']|department\s*:\s*["\']([^"\']*)["\']', obj_content)
                            department = next((g for g in (dept_match.groups() if dept_match else (None, None)) if g is not None), "") if dept_match else ""
                            
                            status_match = re.search(r'"status"\s*:\s*["\']([^"\']*)["\']|status\s*:\s*["\']([^"\']*)["\']', obj_content)
                            status = next((g for g in (status_match.groups() if status_match else (None, None)) if g is not None), "") if status_match else ""
                            
                            members.append({
                                'name': member_name,
                                'role': role,
                                'department': department,
                                'status': status
                            })
                        
                        i = j + 1
                        break
                elif j >= len(array_content) - 1:  # Prevent infinite loop
                    i = j + 1
                    break
            else:
                # End of content reached without finding closing brace
                break
        else:
            i += 1
    
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
    ts_members = parse_team_ts_to_json()
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