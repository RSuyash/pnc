import EnhancedHeroSection from '@/components/about-us/EnhancedHeroSection';
import MissionVisionCards from '@/components/about-us/MissionVisionCards';
import InteractiveTimeline from '@/components/about-us/InteractiveTimeline';
import CoreValuesGrid from '@/components/about-us/CoreValuesGrid';
import TeamDirectory from '@/components/about-us/TeamDirectory';
import FloatingCTA from '@/components/about-us/FloatingCTA';

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      <EnhancedHeroSection />
      <MissionVisionCards />
      <InteractiveTimeline />
      <CoreValuesGrid />
      <TeamDirectory />
      <FloatingCTA />
    </main>
  );
};

export default AboutUsPage;