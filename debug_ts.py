#!/usr/bin/env python3
"""
Debug script to understand the TEAM_DATA structure
"""
import os

def debug_team_ts():
    ts_file_path = os.path.join(os.path.dirname(__file__), 'pnc-web', 'src', 'data', 'team.ts')
    
    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Looking for TEAM_DATA...")
    
    start_marker = 'export const TEAM_DATA: TeamMember[] = ['
    start_idx = content.find(start_marker)
    
    print(f"Start marker found at position: {start_idx}")
    
    if start_idx != -1:
        # Print the context around the marker
        context_start = max(0, start_idx - 20)
        context_end = min(len(content), start_idx + len(start_marker) + 20)
        print(f"Context around marker: '{content[context_start:context_end]}'")
        
        # Find the opening bracket after this marker
        array_start = content.find('[', start_idx + len(start_marker))
        print(f"Opening bracket found at position: {array_start}")
        
        if array_start != -1:
            print(f"Character at array_start: '{content[array_start]}'")
            
            # Find the end of the array by counting brackets
            bracket_count = 0
            array_content = ""
            for i, char in enumerate(content[array_start:], array_start):
                if char == '[':
                    bracket_count += 1
                    array_content += char
                elif char == ']':
                    array_content += char
                    bracket_count -= 1
                    if bracket_count == 0:
                        print(f"Found end of array at position: {i}")
                        print(f"Array content length: {len(array_content)}")
                        print(f"First 200 chars of array: {array_content[:200]}")
                        break
            else:
                print("Could not find end of array - bracket count:", bracket_count)
        else:
            print("Couldn't find opening bracket after marker")
    else:
        print("Could not find start marker in file")

if __name__ == "__main__":
    debug_team_ts()