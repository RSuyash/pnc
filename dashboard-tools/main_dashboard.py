"""
Main PNC Dashboard Interface
Combines all the tools into a comprehensive admin dashboard system
"""
import asyncio
import os
import sys
from typing import Dict, Any

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from dashboard_tools.notion_data_access import EnhancedNotionDataAccess, get_member_stats
from dashboard_tools.dashboard_visualizer import DashboardVisualizer
from dashboard_tools.bulk_operations import BulkOperations

class PNCDashboard:
    """Main dashboard that combines all tools"""
    
    def __init__(self):
        self.data_access = EnhancedNotionDataAccess()
        self.visualizer = DashboardVisualizer()
        self.bulk_ops = BulkOperations()
    
    async def get_admin_dashboard_summary(self) -> Dict[str, Any]:
        """Get comprehensive admin dashboard summary"""
        # Get stats
        stats_result = await get_member_stats()
        active_result = await self.data_access.get_active_members()
        tasks_result = await self.data_access.get_members_with_pending_tasks()
        
        # Get department breakdown
        dept_stats = await self.visualizer.generate_department_performance_report("Research")  # Get one as example
        
        summary_data = {
            "system_health": "Operational",
            "timestamp": asyncio.get_event_loop().time(),
            "member_summary": {
                "total": stats_result.get("statistics", {}).get("total_members", 0) if stats_result.get("success") else 0,
                "active": active_result.get("count", 0),
                "with_tasks": tasks_result.get("count", 0)
            },
            "quick_actions": [
                "Update member status",
                "Import new members", 
                "Export member data",
                "Generate reports",
                "Sync data"
            ],
            "recent_activity": [
                "Data synchronized",
                "New member added", 
                "Status updated",
            ]
        }
        
        return {
            "success": True,
            "dashboard_data": summary_data
        }
    
    async def run_interactive_dashboard(self):
        """Run the main interactive dashboard"""
        print("╔" + "═" * 60 + "╗")
        print("║" + " " * 20 + "PNC Admin Dashboard" + " " * 19 + "║")
        print("║" + " " * 15 + "Prithvi Nature Club" + " " * 20 + "║")
        print("╚" + "═" * 60 + "╝")
        print()
        
        while True:
            print("\nSelect an option:")
            print("1. 📊 View Member Statistics")
            print("2. 🔍 Search Members")
            print("3. 📈 Generate Reports & Visualizations")
            print("4. 📥 Bulk Operations (Import/Export)")
            print("5. ⚙️  System Administration")
            print("6. 🚪 Exit Dashboard")
            print()
            
            choice = input("Enter your choice (1-6): ").strip()
            
            if choice == "1":
                print("\n" + "="*50)
                print("📊 MEMBER STATISTICS")
                print("="*50)
                
                # Show member statistics
                stats_result = await get_member_stats()
                if stats_result["success"]:
                    stats = stats_result["statistics"]
                    print(f"Total Members: {stats['total_members']}")
                    print("\nBy Department:")
                    for dept, count in stats["departments"].items():
                        print(f"  • {dept}: {count}")
                    
                    print("\nBy Status:")
                    for status, count in stats["statuses"].items():
                        print(f"  • {status}: {count}")
                    
                    print("\nBy Year:")
                    for year, count in stats["years"].items():
                        print(f"  • {year}: {count}")
                    
                    print("\nBy Role:")
                    for role, count in stats["roles"].items():
                        print(f"  • {role}: {count}")
                else:
                    print(f"❌ Error: {stats_result['message']}")
            
            elif choice == "2":
                print("\n" + "="*50)
                print("🔍 MEMBER SEARCH")
                print("="*50)
                
                # Search functionality
                search_type = input("Search by (name/dept/status/year/all): ").strip().lower()
                
                if search_type == "name":
                    name = input("Enter name to search: ").strip()
                    result = await self.data_access.search_members_by_name(name)
                elif search_type == "dept":
                    dept = input("Enter department: ").strip()
                    result = await self.data_access.get_members_by_department(dept)
                elif search_type == "status":
                    status = input("Enter status (Active/Inactive): ").strip()
                    result = await self.data_access.get_members_by_status(status)
                elif search_type == "year":
                    year = input("Enter year (24-25/25-26): ").strip()
                    result = await self.data_access.get_members_by_year(year)
                else:
                    result = await self.data_access.notion_service.get_database_content(
                        await self.data_access.get_members_database_id()
                    )
                
                if result["success"]:
                    members = result.get("members", [])
                    print(f"\nFound {len(members)} member(s):")
                    for i, member in enumerate(members[:10]):  # Show first 10
                        props = member.get("properties", {})
                        name = "Unknown"
                        
                        # Find name field
                        for prop_name, prop_value in props.items():
                            if "name" in prop_name.lower() or prop_name.lower() == "title":
                                if isinstance(prop_value, str):
                                    name = prop_value
                                elif isinstance(prop_value, dict):
                                    if "title" in prop_value and prop_value["title"]:
                                        name = prop_value["title"][0].get("text", {}).get("content", "")
                                    elif "rich_text" in prop_value and prop_value["rich_text"]:
                                        name = prop_value["rich_text"][0].get("text", {}).get("content", "")
                                break
                        
                        print(f"  {i+1}. {name}")
                    
                    if len(members) > 10:
                        print(f"  ... and {len(members) - 10} more")
                else:
                    print(f"❌ Error: {result['message']}")
            
            elif choice == "3":
                print("\n" + "="*50)
                print("📈 REPORTS & VISUALIZATIONS")
                print("="*50)
                
                print("1. Generate statistics report")
                print("2. Create department chart") 
                print("3. Create status chart")
                print("4. Create year chart")
                print("5. Export dashboard data")
                
                report_choice = input("Select report type (1-5): ").strip()
                
                if report_choice == "1":
                    report_result = await self.visualizer.generate_member_statistics_report()
                    if report_result["success"]:
                        print("\n📊 Statistics Report:")
                        print(report_result["report"])
                    else:
                        print(f"❌ Error: {report_result['message']}")
                
                elif report_choice == "2":
                    chart_result = await self.visualizer.create_department_chart()
                    if chart_result["success"]:
                        print(f"✅ {chart_result['message']}")
                    else:
                        print(f"❌ Error: {chart_result['message']}")
                
                elif report_choice == "3":
                    chart_result = await self.visualizer.create_status_chart()
                    if chart_result["success"]:
                        print(f"✅ {chart_result['message']}")
                    else:
                        print(f"❌ Error: {chart_result['message']}")
                
                elif report_choice == "4":
                    chart_result = await self.visualizer.create_year_chart()
                    if chart_result["success"]:
                        print(f"✅ {chart_result['message']}")
                    else:
                        print(f"❌ Error: {chart_result['message']}")
                
                elif report_choice == "5":
                    export_result = await self.visualizer.export_dashboard_data()
                    if export_result["success"]:
                        print(f"✅ {export_result['message']}")
                    else:
                        print(f"❌ Error: {export_result['message']}")
            
            elif choice == "4":
                print("\n" + "="*50)
                print("📥 BULK OPERATIONS")
                print("="*50)
                
                print("1. Bulk update members")
                print("2. Import members from CSV")
                print("3. Export members to CSV")
                print("4. Find duplicates")
                print("5. Update year for all members")
                
                bulk_choice = input("Select operation (1-5): ").strip()
                
                if bulk_choice == "1":
                    filter_field = input("Enter filter field (e.g., 'Status'): ").strip()
                    filter_value = input("Enter filter value (e.g., 'Active'): ").strip()
                    update_field = input("Enter field to update (e.g., 'Year'): ").strip()
                    update_value = input(f"Enter new value for {update_field}: ").strip()
                    
                    filters = {
                        "property": filter_field,
                        "select": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None,
                        "status": {"equals": filter_value} if filter_value in ["Active", "Inactive"] else None
                    }
                    
                    if "select" in filters and not filters["select"]:
                        del filters["select"]
                    if "status" in filters and not filters["status"]:
                        del filters["status"]
                        
                    updates = {update_field: update_value}
                    
                    result = await self.bulk_ops.bulk_update_members_by_filter(filters, updates)
                    if result["success"]:
                        print(f"✅ {result['message']}")
                        print(f"   Updated: {result['updated_count']}, Failed: {result['failed_count']}")
                    else:
                        print(f"❌ Error: {result['message']}")
                
                elif bulk_choice == "2":
                    csv_path = input("Enter CSV file path: ").strip()
                    result = await self.bulk_ops.bulk_import_from_csv(csv_path)
                    if result["success"]:
                        print(f"✅ {result['message']}")
                        print(f"   Created: {result['created_count']}, Failed: {result['failed_count']}")
                    else:
                        print(f"❌ Error: {result['message']}")
                
                elif bulk_choice == "3":
                    filter_field = input("Enter filter field (optional): ").strip()
                    filter_value = input("Enter filter value (optional): ").strip()
                    
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
                    
                    result = await self.bulk_ops.bulk_export_members(filters)
                    if result["success"]:
                        print(f"✅ {result['message']}")
                    else:
                        print(f"❌ Error: {result['message']}")
                
                elif bulk_choice == "4":
                    result = await self.bulk_ops.find_duplicates()
                    if result["success"]:
                        print(f"Found {result['total_duplicate_groups']} potential duplicate groups")
                        if result['duplicates_by_email']:
                            print("Duplicates by email:")
                            for email, group in result['duplicates_by_email'].items():
                                print(f"  {email}: {len(group)} members")
                        if result['duplicates_by_name']:
                            print("Duplicates by name:")
                            for name, group in result['duplicates_by_name'].items():
                                print(f"  {name}: {len(group)} members")
                    else:
                        print(f"❌ Error: {result['message']}")
                
                elif bulk_choice == "5":
                    confirm = input("Update year for ALL members based on status? (y/N): ").strip().lower()
                    if confirm == 'y':
                        result = await self.bulk_ops.update_year_for_all_members()
                        if result["success"]:
                            print(f"✅ {result['message']}")
                            print(f"   Updated: {result['updated_count']}, Failed: {result['failed_count']}")
                        else:
                            print(f"❌ Error: {result['message']}")
                    else:
                        print("Operation cancelled.")
            
            elif choice == "5":
                print("\n" + "="*50)
                print("⚙️  SYSTEM ADMINISTRATION")
                print("="*50)
                
                # Admin dashboard overview
                admin_result = await self.visualizer.generate_admin_dashboard_data()
                if admin_result["success"]:
                    summary = admin_result["dashboard_data"]["summary"]
                    print(f"Total Members: {summary['total_members']}")
                    print(f"Active Members: {summary['active_members']}")
                    print(f"Active Percentage: {summary.get('active_percentage', 'N/A')}%")
                    print(f"Members with Tasks: {summary['members_with_tasks']}")
                    print(f"Engagement Rate: {summary.get('engagement_rate', 'N/A')}%")
                    
                    print("\nBy Department:")
                    for dept, count in admin_result["dashboard_data"]["by_department"].items():
                        print(f"  {dept}: {count}")
                    
                    print("\nBy Status:")
                    for status, count in admin_result["dashboard_data"]["by_status"].items():
                        print(f"  {status}: {count}")
                else:
                    print(f"❌ Error: {admin_result['message']}")
            
            elif choice == "6":
                print("\n👋 Thank you for using the PNC Admin Dashboard!")
                print("Have a great day protecting our environment! 🌱")
                break
            
            else:
                print("\n❌ Invalid choice. Please select 1-6.")

def main():
    """Main entry point"""
    dashboard = PNCDashboard()
    asyncio.run(dashboard.run_interactive_dashboard())

if __name__ == "__main__":
    main()