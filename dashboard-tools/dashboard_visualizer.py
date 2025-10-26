"""
Dashboard Visualization Tools for PNC Notion Data
Creates visualizations and reports from Notion data
"""
import asyncio
import os
import sys
import json
from typing import Dict, List, Any
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from dashboard_tools.notion_data_access import EnhancedNotionDataAccess

class DashboardVisualizer:
    """Create visualizations and reports from Notion data"""
    
    def __init__(self):
        self.data_access = EnhancedNotionDataAccess()
    
    async def generate_member_statistics_report(self):
        """Generate a comprehensive statistics report"""
        stats_result = await self.data_access.get_member_statistics()
        if not stats_result["success"]:
            return stats_result
        
        stats = stats_result["statistics"]
        
        # Create a markdown report
        report = f"""# PNC Member Statistics Report
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- Total Members: {stats['total_members']}

## By Department
"""
        
        for dept, count in stats["departments"].items():
            report += f"- {dept}: {count}\n"
        
        report += "\n## By Status\n"
        for status, count in stats["statuses"].items():
            report += f"- {status}: {count}\n"
        
        report += "\n## By Year\n"
        for year, count in stats["years"].items():
            report += f"- {year}: {count}\n"
        
        report += "\n## By Role\n"
        for role, count in stats["roles"].items():
            report += f"- {role}: {count}\n"
        
        return {
            "success": True,
            "report": report,
            "stats": stats
        }
    
    async def create_department_chart(self, save_path: str = "department_chart.png"):
        """Create a department distribution chart"""
        stats_result = await self.data_access.get_member_statistics()
        if not stats_result["success"]:
            return stats_result
        
        departments = stats_result["statistics"]["departments"]
        
        if not departments:
            return {"success": False, "message": "No department data available"}
        
        # Create the chart
        plt.figure(figsize=(10, 6))
        plt.bar(departments.keys(), departments.values())
        plt.title('PNC Members Distribution by Department')
        plt.xlabel('Departments')
        plt.ylabel('Number of Members')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(save_path)
        plt.close()
        
        return {
            "success": True,
            "message": f"Chart saved to {save_path}",
            "path": save_path
        }
    
    async def create_status_chart(self, save_path: str = "status_chart.png"):
        """Create a status distribution chart"""
        stats_result = await self.data_access.get_member_statistics()
        if not stats_result["success"]:
            return stats_result
        
        statuses = stats_result["statistics"]["statuses"]
        
        if not statuses:
            return {"success": False, "message": "No status data available"}
        
        # Create the chart
        plt.figure(figsize=(8, 6))
        plt.pie(statuses.values(), labels=statuses.keys(), autopct='%1.1f%%', startangle=90)
        plt.title('PNC Members Status Distribution')
        plt.tight_layout()
        plt.savefig(save_path)
        plt.close()
        
        return {
            "success": True,
            "message": f"Chart saved to {save_path}",
            "path": save_path
        }
    
    async def create_year_chart(self, save_path: str = "year_chart.png"):
        """Create a year distribution chart"""
        stats_result = await self.data_access.get_member_statistics()
        if not stats_result["success"]:
            return stats_result
        
        years = stats_result["statistics"]["years"]
        
        if not years:
            return {"success": False, "message": "No year data available"}
        
        # Create the chart
        plt.figure(figsize=(8, 6))
        plt.bar(years.keys(), years.values())
        plt.title('PNC Members Distribution by Year')
        plt.xlabel('Years')
        plt.ylabel('Number of Members')
        plt.tight_layout()
        plt.savefig(save_path)
        plt.close()
        
        return {
            "success": True,
            "message": f"Chart saved to {save_path}",
            "path": save_path
        }
    
    async def generate_admin_dashboard_data(self):
        """Generate comprehensive dashboard data for admins"""
        # Get all the data we need
        stats_result = await self.data_access.get_member_statistics()
        active_result = await self.data_access.get_active_members()
        tasks_result = await self.data_access.get_members_with_pending_tasks()
        
        dashboard_data = {
            "summary": {
                "total_members": stats_result.get("statistics", {}).get("total_members", 0),
                "active_members": active_result.get("count", 0),
                "members_with_tasks": tasks_result.get("count", 0),
                "timestamp": datetime.now().isoformat()
            },
            "by_department": stats_result.get("statistics", {}).get("departments", {}),
            "by_status": stats_result.get("statistics", {}).get("statuses", {}),
            "by_year": stats_result.get("statistics", {}).get("years", {}),
            "top_roles": stats_result.get("statistics", {}).get("roles", {}),
            "members_with_tasks": tasks_result.get("count", 0)
        }
        
        # Calculate additional metrics
        if dashboard_data["summary"]["total_members"] > 0:
            dashboard_data["summary"]["active_percentage"] = round(
                (dashboard_data["summary"]["active_members"] / dashboard_data["summary"]["total_members"]) * 100, 2
            )
            dashboard_data["summary"]["engagement_rate"] = round(
                (dashboard_data["summary"]["members_with_tasks"] / dashboard_data["summary"]["active_members"]) * 100 if dashboard_data["summary"]["active_members"] > 0 else 0, 2
            )
        
        return {
            "success": True,
            "dashboard_data": dashboard_data
        }
    
    async def export_dashboard_data(self, filename: str = None):
        """Export dashboard data to JSON"""
        if not filename:
            filename = f"pnc_dashboard_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        dashboard_result = await self.generate_admin_dashboard_data()
        if not dashboard_result["success"]:
            return dashboard_result
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump({
                "export_timestamp": datetime.now().isoformat(),
                "dashboard_data": dashboard_result["dashboard_data"]
            }, f, indent=2, ensure_ascii=False)
        
        return {
            "success": True,
            "message": f"Dashboard data exported to {filename}",
            "filename": filename
        }
    
    async def generate_department_performance_report(self, department: str):
        """Generate a performance report for a specific department"""
        members_result = await self.data_access.get_members_by_department(department)
        if not members_result["success"]:
            return members_result
        
        members = members_result["members"]
        
        report = {
            "department": department,
            "total_members": len(members),
            "report_date": datetime.now().strftime('%Y-%m-%d'),
            "breakdown": {
                "active_members": 0,
                "inactive_members": 0,
                "average_role_level": 0,
                "members_with_tasks": 0
            },
            "member_details": []
        }
        
        for member in members:
            props = member.get("properties", {})
            member_info = {}
            
            # Extract member info
            for prop_name, prop_value in props.items():
                prop_lower = prop_name.lower()
                
                if "name" in prop_lower or prop_name.lower() == "title":
                    member_info["name"] = str(prop_value)
                elif "status" in prop_lower:
                    status = str(prop_value).lower()
                    if "active" in status:
                        report["breakdown"]["active_members"] += 1
                    else:
                        report["breakdown"]["inactive_members"] += 1
                elif "role" in prop_lower:
                    member_info["role"] = str(prop_value)
                elif "task" in prop_lower or "project" in prop_lower:
                    tasks = str(prop_value).strip()
                    if tasks and tasks != "":
                        report["breakdown"]["members_with_tasks"] += 1
        
            report["member_details"].append(member_info)
        
        return {
            "success": True,
            "report": report
        }

# Example usage functions
async def run_dashboard_visualization():
    """Run the dashboard visualization tool"""
    visualizer = DashboardVisualizer()
    
    print("PNC Dashboard Visualization Tool")
    print("=" * 40)
    
    # Generate statistics
    print("\n1. Generating member statistics...")
    stats_result = await visualizer.generate_member_statistics_report()
    if stats_result["success"]:
        print("✓ Statistics generated")
        
        # Save report to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = f"pnc_statistics_{timestamp}.md"
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(stats_result["report"])
        print(f"✓ Report saved to {report_file}")
    
    # Generate charts
    print("\n2. Creating visualizations...")
    
    dept_chart = await visualizer.create_department_chart()
    if dept_chart["success"]:
        print(f"✓ Department chart: {dept_chart['message']}")
    
    status_chart = await visualizer.create_status_chart()
    if status_chart["success"]:
        print(f"✓ Status chart: {status_chart['message']}")
    
    year_chart = await visualizer.create_year_chart()
    if year_chart["success"]:
        print(f"✓ Year chart: {year_chart['message']}")
    
    # Generate admin dashboard data
    print("\n3. Generating admin dashboard data...")
    admin_data = await visualizer.generate_admin_dashboard_data()
    if admin_data["success"]:
        print("✓ Admin dashboard data generated")
        
        # Show summary
        summary = admin_data["dashboard_data"]["summary"]
        print(f"  Total Members: {summary['total_members']}")
        print(f"  Active Members: {summary['active_members']}")
        print(f"  Active Percentage: {summary.get('active_percentage', 'N/A')}%")
        print(f"  Members with Tasks: {summary['members_with_tasks']}")
        print(f"  Engagement Rate: {summary.get('engagement_rate', 'N/A')}%")
        
        # Export dashboard data
        export_result = await visualizer.export_dashboard_data()
        if export_result["success"]:
            print(f"✓ Dashboard data exported: {export_result['message']}")
    
    print(f"\nDashboard generation complete! Check the files in the current directory.")

if __name__ == "__main__":
    asyncio.run(run_dashboard_visualization())