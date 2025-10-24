import React from 'react';
import { FiUsers, FiActivity, FiBarChart2, FiCalendar, FiAward, FiClock, FiCheckCircle, FiStar, FiShield, FiBriefcase } from 'react-icons/fi';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  change, 
  icon 
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="bg-emerald-100 p-3 rounded-lg text-emerald-700">
        {icon}
      </div>
    </div>
    <p className="text-emerald-600 text-sm mt-3">{change} from last month</p>
  </div>
);

// Export icon components for reuse
export const UsersIcon = () => <FiUsers className="text-xl" />;
export const ActivityIcon = () => <FiActivity className="text-xl" />;
export const ChartIcon = () => <FiBarChart2 className="text-xl" />;
export const CalendarIcon = () => <FiCalendar className="text-xl" />;
export const AwardIcon = () => <FiAward className="text-xl" />;
export const ClockIcon = () => <FiClock className="text-xl" />;
export const CheckCircleIcon = () => <FiCheckCircle className="text-xl" />;
export const StarIcon = () => <FiStar className="text-xl" />;
export const ShieldIcon = () => <FiShield className="text-xl" />;
export const BriefcaseIcon = () => <FiBriefcase className="text-xl" />;

export default DashboardCard;