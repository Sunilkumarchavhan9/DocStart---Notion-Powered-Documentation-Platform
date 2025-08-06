import PrivacyControls from "@/components/privacy-controls";
import Navbar from "@/components/Nvabar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8">
        <PrivacyControls />
      </div>
    </div>
  );
} 