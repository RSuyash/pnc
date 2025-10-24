import DashboardPage from '@/components/dashboard/DashboardPage';
import SettingsPage from '@/components/dashboard/pages/SettingsPage';
import CalendarPage from '@/components/dashboard/pages/CalendarPage';
import ProfilePage from '@/components/dashboard/pages/ProfilePage';
import MessagesPage from '@/components/dashboard/pages/MessagesPage';

interface DashboardRouterProps {
  page: string;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ page }) => {
  switch(page) {
    case 'settings':
      return <SettingsPage />;
    case 'calendar':
      return <CalendarPage />;
    case 'profile':
      return <ProfilePage />;
    case 'messages':
      return <MessagesPage />;
    case 'dashboard':
    default:
      return <DashboardPage />;
  }
};

export default DashboardRouter;