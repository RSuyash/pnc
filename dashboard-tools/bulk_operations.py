"""
Bulk Operations Tool for PNC Admins
Provides bulk update, creation, and management capabilities
"""
import asyncio
import os
import sys
import json
import csv
from typing import Dict, List, Any, Optional
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from dashboard_tools.notion_data_access import EnhancedNotionDataAccess

class BulkOperations:
    """Handle bulk operations for efficient data management"""
    
    def __init__(self):
        self.data_access = EnhancedNotionDataAccess()
    
    async def bulk_update_members_by_filter(self, filters: Dict, updates: Dict) -> Dict[str, Any]:
        """Update multiple members that match specific filters"""
        search_result = await self.data_access.advanced_search_members(filters=filters)
        
        if not search_result["success"]:
            return search_result
        
        members = search_result["members"]
        updated_count = 0
        failed_updates = []
        
        for member in members:
            try:
                # Prepare update properties based on the schema
                properties_to_update = {}
                
                # Get the schema to properly format the updates
                db_id = await self.data_access.get_members_database_id()
                schema_result = await self.data_access.notion_service.get_database_schema(db_id)
                
                if schema_result["success"]:
                    schema = schema_result["schema"]
                    
                    # Map the update fields to the correct property names
                    for update_field, update_value in updates.items():
                        for prop_name, prop_info in schema.items():
                            if update_field.lower() in prop_name.lower():
                                formatted_value = await self.data_access.notion_service.format_property_value(
                                    prop_name, prop_info, update_value
                                )
                                if formatted_value:
                                    properties_to_update[prop_name] = formatted_value
                                break
                
                # Update the member
                if properties_to_update:
                    update_result = await self.data_access.notion_service.update_database_entry(
                        member["id"], properties_to_update
                    )
                    
                    if update_result["success"]:
                        updated_count += 1
                    else:
                        failed_updates.append({
                            "member_id": member["id"],
                            "error": update_result["message"]
                        })
            except Exception as e:
                failed_updates.append({
                    "member_id": member["id"],
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Updated {updated_count} members",
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates
        }
    
    async def bulk_import_from_csv(self, csv_file_path: str) -> Dict[str, Any]:
        """Import members from a CSV file"""
        if not os.path.exists(csv_file_path):
            return {"success": False, "message": f"CSV file not found: {csv_file_path}"}
        
        # Read the CSV file
        members_to_add = []
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    members_to_add.append(dict(row))
        except Exception as e:
            return {"success": False, "message": f"Error reading CSV: {str(e)}"}
        
        # Get the database schema
        db_id = await self.data_access.get_members_database_id()
        schema_result = await self.data_access.notion_service.get_database_schema(db_id)
        
        if not schema_result["success"]:
            return {"success": False, "message": "Could not get database schema"}
        
        schema = schema_result["schema"]
        created_count = 0
        failed_creations = []
        
        for member_data in members_to_add:
            try:
                # Map CSV columns to Notion properties
                properties = {}
                
                for csv_key, csv_value in member_data.items():
                    if csv_value is None:
                        csv_value = ""
                    
                    # Find matching property in schema
                    for prop_name, prop_info in schema.items():
                        if csv_key.lower().replace(" ", "_") == prop_name.lower().replace(" ", "_"):
                            formatted_value = await self.data_access.notion_service.format_property_value(
                                prop_name, prop_info, csv_value
                            )
                            if formatted_value:
                                properties[prop_name] = formatted_value
                            break
                
                # Create the entry in Notion
                result = await self.data_access.notion_service.create_database_entry(db_id, properties)
                
                if result["success"]:
                    created_count += 1
                else:
                    failed_creations.append({
                        "member_data": member_data,
                        "error": result["message"]
                    })
            except Exception as e:
                failed_creations.append({
                    "member_data": member_data,
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Created {created_count} members from CSV",
            "created_count": created_count,
            "failed_count": len(failed_creations),
            "failed_creations": failed_creations,
            "csv_file": csv_file_path
        }
    
    async def bulk_export_members(self, filters: Optional[Dict] = None, filename: Optional[str] = None) -> Dict[str, Any]:
        """Export members to CSV with optional filtering"""
        search_result = await self.data_access.advanced_search_members(filters=filters if filters else {})
        
        if not search_result["success"]:
            return search_result
        
        members = search_result["members"]
        
        if not members:
            return {"success": False, "message": "No members found to export"}
        
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"pnc_members_export_{timestamp}.csv"
        
        # Extract headers from the first member's properties
        headers = set()
        for member in members:
            for prop_name in member.get("properties", {}).keys():
                headers.add(prop_name)
        
        headers = sorted(list(headers))
        
        # Write to CSV
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            writer.writeheader()
            
            for member in members:
                row = {}
                for header in headers:
                    prop_value = member.get("properties", {}).get(header, {})
                    # Extract text content from Notion property structure
                    if isinstance(prop_value, dict):
                        if "title" in prop_value and prop_value["title"]:
                            row[header] = prop_value["title"][0].get("text", {}).get("content", "")
                        elif "rich_text" in prop_value and prop_value["rich_text"]:
                            row[header] = prop_value["rich_text"][0].get("text", {}).get("content", "")
                        elif "select" in prop_value and prop_value["select"]:
                            row[header] = prop_value["select"].get("name", "")
                        elif "status" in prop_value and prop_value["status"]:
                            row[header] = prop_value["status"].get("name", "")
                        elif "email" in prop_value:
                            row[header] = prop_value["email"]
                        elif "phone_number" in prop_value:
                            row[header] = prop_value["phone_number"]
                        elif "number" in prop_value:
                            row[header] = prop_value["number"]
                        elif "checkbox" in prop_value:
                            row[header] = prop_value["checkbox"]
                        else:
                            row[header] = str(prop_value)
                    else:
                        row[header] = str(prop_value)
                
                writer.writerow(row)
        
        return {
            "success": True,
            "message": f"Exported {len(members)} members to {filename}",
            "count": len(members),
            "filename": filename
        }
    
    async def bulk_delete_members_by_filter(self, filters: Dict) -> Dict[str, Any]:
        """Delete multiple members that match specific filters (soft delete by updating status)"""
        # NOTE: Notion doesn't allow true deletion via API, so we'll update status to "Deleted"
        search_result = await self.data_access.advanced_search_members(filters=filters)
        
        if not search_result["success"]:
            return search_result
        
        members = search_result["members"]
        deleted_count = 0
        failed_deletions = []
        
        # First, try to update the status to "Deleted"
        for member in members:
            try:
                # Find the status property and update it to "Deleted"
                db_id = await self.data_access.get_members_database_id()
                schema_result = await self.data_access.notion_service.get_database_schema(db_id)
                
                if schema_result["success"]:
                    schema = schema_result["schema"]
                    
                    # Find the status property
                    status_prop_name = None
                    for prop_name, prop_info in schema.items():
                        if "status" in prop_name.lower():
                            status_prop_name = prop_name
                            break
                    
                    if status_prop_name:
                        # Prepare update to "Deleted" status
                        status_prop_info = schema[status_prop_name]
                        formatted_value = await self.data_access.notion_service.format_property_value(
                            status_prop_name, status_prop_info, "Deleted"
                        )
                        
                        if formatted_value:
                            update_result = await self.data_access.notion_service.update_database_entry(
                                member["id"], {status_prop_name: formatted_value}
                            )
                            
                            if update_result["success"]:
                                deleted_count += 1
                            else:
                                failed_deletions.append({
                                    "member_id": member["id"],
                                    "error": update_result["message"]
                                })
                    else:
                        # If no status property, archive the page
                        archive_result = await self.data_access.notion_service.delete_database_entry(member["id"])
                        if archive_result["success"]:
                            deleted_count += 1
                        else:
                            failed_deletions.append({
                                "member_id": member["id"],
                                "error": archive_result["message"]
                            })
                else:
                    failed_deletions.append({
                        "member_id": member["id"],
                        "error": "Could not get schema for update"
                    })
            except Exception as e:
                failed_deletions.append({
                    "member_id": member["id"],
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Processed deletion for {deleted_count} members",
            "deleted_count": deleted_count,
            "failed_count": len(failed_deletions),
            "failed_deletions": failed_deletions
        }
    
    async def find_duplicates(self) -> Dict[str, Any]:
        """Find potential duplicate members based on email or name"""
        search_result = await self.data_access.notion_service.get_database_content(
            await self.data_access.get_members_database_id()
        )
        
        if not search_result["success"]:
            return search_result
        
        members = search_result["content"]
        
        # Group members by potential duplicate indicators
        email_groups = {}
        name_groups = {}
        
        for member in members:
            props = member.get("properties", {})
            email = None
            name = None
            
            # Find email
            for prop_name, prop_value in props.items():
                if "email" in prop_name.lower():
                    email = prop_value.get("email", "")
                    if not email:
                        rich_text = prop_value.get("rich_text", [])
                        if rich_text:
                            email = rich_text[0].get("text", {}).get("content", "")
                    break
            
            # Find name
            for prop_name, prop_value in props.items():
                if "name" in prop_name.lower() or prop_name.lower() == "title":
                    if "title" in prop_value:
                        title_array = prop_value["title"]
                        if title_array:
                            name = title_array[0].get("text", {}).get("content", "")
                    elif "rich_text" in prop_value:
                        rich_text = prop_value["rich_text"]
                        if rich_text:
                            name = rich_text[0].get("text", {}).get("content", "")
                    break
            
            if email:
                email_lower = email.lower().strip()
                if email_lower not in email_groups:
                    email_groups[email_lower] = []
                email_groups[email_lower].append(member)
            
            if name:
                name_lower = name.lower().strip()
                if name_lower not in name_groups:
                    name_groups[name_lower] = []
                name_groups[name_lower].append(member)
        
        # Find groups with more than one member (potential duplicates)
        duplicate_emails = {email: group for email, group in email_groups.items() if len(group) > 1}
        duplicate_names = {name: group for name, group in name_groups.items() if len(group) > 1}
        
        return {
            "success": True,
            "duplicates_by_email": duplicate_emails,
            "duplicates_by_name": duplicate_names,
            "total_duplicate_groups": len(duplicate_emails) + len(duplicate_names)
        }
    
    async def update_year_for_all_members(self) -> Dict[str, Any]:
        """Update year for all members based on their status"""
        # This follows the same logic as the existing data management service
        search_result = await self.data_access.notion_service.get_database_content(
            await self.data_access.get_members_database_id()
        )
        
        if not search_result["success"]:
            return search_result
        
        members = search_result["content"]
        updated_count = 0
        failed_updates = []
        
        # Get schema to find Year and Status properties
        db_id = await self.data_access.get_members_database_id()
        schema_result = await self.data_access.notion_service.get_database_schema(db_id)
        
        if not schema_result["success"]:
            return {"success": False, "message": "Could not get database schema"}
        
        schema = schema_result["schema"]
        
        # Find the property names
        year_prop_name = None
        status_prop_name = None
        
        for prop_name, prop_info in schema.items():
            if "year" in prop_name.lower():
                year_prop_name = prop_name
            elif "status" in prop_name.lower():
                status_prop_name = prop_name
        
        if not year_prop_name:
            return {"success": False, "message": "Year property not found"}
        if not status_prop_name:
            return {"success": False, "message": "Status property not found"}
        
        for member in members:
            try:
                # Get current status
                current_status = None
                props = member.get("properties", {})
                status_prop = props.get(status_prop_name, {})
                
                if "status" in status_prop and status_prop["status"]:
                    current_status = status_prop["status"].get("name")
                
                # Determine year based on status
                year_to_set = "24-25" if current_status == "Inactive" else "25-26" if current_status == "Active" else "25-26"
                
                # Update the year
                year_prop_info = schema[year_prop_name]
                formatted_value = await self.data_access.notion_service.format_property_value(
                    year_prop_name, year_prop_info, year_to_set
                )
                
                if formatted_value:
                    update_result = await self.data_access.notion_service.update_database_entry(
                        member["id"], {year_prop_name: formatted_value}
                    )
                    
                    if update_result["success"]:
                        updated_count += 1
                    else:
                        failed_updates.append({
                            "member_id": member["id"],
                            "error": update_result["message"]
                        })
            except Exception as e:
                failed_updates.append({
                    "member_id": member["id"],
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Updated year for {updated_count} members",
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates
        }

# Command line interface functions
async def run_bulk_operations():
    """Interactive bulk operations interface"""
    bulk_ops = BulkOperations()
    
    print("PNC Bulk Operations Tool")
    print("=" * 30)
    print("Options:")
    print("1. Bulk Update Members")
    print("2. Import Members from CSV")
    print("3. Export Members to CSV")
    print("4. Find Duplicates")
    print("5. Update Year for All Members")
    print("6. Bulk Delete Members")
    
    choice = input("\nEnter your choice (1-6): ").strip()
    
    if choice == "1":
        print("\nBulk Update - This will update members matching specific criteria")
        filter_field = input("Enter filter field (e.g., 'Status'): ").strip()
        filter_value = input("Enter filter value (e.g., 'Active'): ").strip()
        update_field = input("Enter field to update (e.g., 'Year'): ").strip()
        update_value = input(f"Enter new value for {update_field}: ").strip()
        
        filters = {
            "property": filter_field,
            "select": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None,
            "status": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None
        }
        
        # Clean up the filters object
        if "select" in filters and not filters["select"]:
            del filters["select"]
        if "status" in filters and not filters["status"]:
            del filters["status"]
            
        updates = {update_field: update_value}
        
        result = await bulk_ops.bulk_update_members_by_filter(filters, updates)
        
    elif choice == "2":
        csv_path = input("Enter CSV file path: ").strip()
        result = await bulk_ops.bulk_import_from_csv(csv_path)
        
    elif choice == "3":
        print("Leave blank to export all members")
        filter_field = input("Enter filter field (optional): ").strip()
        filter_value = input("Enter filter value (optional): ").strip()
        filename = input("Enter output filename (optional): ").strip()
        
        filters = None
        if filter_field and filter_value:
            filters = {
                "property": filter_field,
                "select": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None,
                "status": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None
            }
            if "select" in filters and not filters["select"]:
                del filters["select"]
            if "status" in filters and not filters["status"]:
                del filters["status"]
        
        result = await bulk_ops.bulk_export_members(
            filters=filters,
            filename=filename if filename else None
        )
        
    elif choice == "4":
        result = await bulk_ops.find_duplicates()
        if result["success"]:
            print(f"\nFound {result['total_duplicate_groups']} potential duplicate groups")
            
            if result["duplicates_by_email"]:
                print("\nDuplicates by email:")
                for email, group in result["duplicates_by_email"].items():
                    print(f"  {email}: {len(group)} members")
            
            if result["duplicates_by_name"]:
                print("\nDuplicates by name:")
                for name, group in result["duplicates_by_name"].items():
                    print(f"  {name}: {len(group)} members")
        
    elif choice == "5":
        confirm = input("This will update the year for ALL members based on their status. Continue? (y/N): ")
        if confirm.lower() == 'y':
            result = await bulk_ops.update_year_for_all_members()
        else:
            print("Operation cancelled.")
            return
            
    elif choice == "6":
        filter_field = input("Enter filter field for deletion (e.g., 'Status'): ").strip()
        filter_value = input("Enter filter value (e.g., 'Inactive'): ").strip()
        
        filters = {
            "property": filter_field,
            "select": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None,
            "status": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None
        }
        
        # Clean up the filters object
        if "select" in filters and not filters["select"]:
            del filters["select"]
        if "status" in filters and not filters["status"]:
            del filters["status"]
            
        confirm = input(f"This will mark {filter_field}={filter_value} members as deleted. Continue? (y/N): ")
        if confirm.lower() == 'y':
            result = await bulk_ops.bulk_delete_members_by_filter(filters)
        else:
            print("Operation cancelled.")
            return
            
    else:
        print("Invalid choice")
        return
    
    if "result" in locals() and result:
        if result.get("success"):
            print(f"✓ Success: {result.get('message', 'Operation completed')}")
            if "updated_count" in result:
                print(f"  Updated: {result.get('updated_count', 0)}")
            if "created_count" in result:
                print(f"  Created: {result.get('created_count', 0)}")
            if "failed_count" in result and result.get("failed_count", 0) > 0:
                print(f"  Failed: {result.get('failed_count', 0)}")
        else:
            print(f"✗ Error: {result.get('message', 'Operation failed')}")

if __name__ == "__main__":
    asyncio.run(run_bulk_operations())