import OiAIIntro from "./OiAIIntro";
import OiAIIntroParticles from "./OiAIIntroParticles";
import OiAIFilterDefs from "./OiAIFilterDefs";
import OiAICocoaDust from "./OiAICocoaDust";
import OiAIPaperGrain from "./OiAIPaperGrain";
import OiAIPageFrame from "./OiAIPageFrame";
import OiAIMobileBottomBar from "./OiAIMobileBottomBar";
import OiAIHiddenCartControls from "./OiAIHiddenCartControls";
import OiAIDrawerBackdrop from "./OiAIDrawerBackdrop";
import OiAICartDrawer from "./OiAICartDrawer";
import OiAIModalBackdrop from "./OiAIModalBackdrop";
import OiAIQuickViewModal from "./OiAIQuickViewModal";
import OiAIFeedbackBackdrop from "./OiAIFeedbackBackdrop";
import OiAIFeedbackModal from "./OiAIFeedbackModal";
import OiAIToast from "./OiAIToast";
import OiAIAnnouncementToast from "./OiAIAnnouncementToast";
import OiAISiteLayout from "./OiAISiteLayout";

export default function OiAIExperience() {
  return (
    <>
      <OiAIIntro />
      <OiAIIntroParticles />
      <OiAIFilterDefs />
      <OiAICocoaDust />
      <OiAIPaperGrain />
      <OiAIPageFrame />
      <OiAISiteLayout />
      <OiAIMobileBottomBar />
      <OiAIHiddenCartControls />
      <OiAIDrawerBackdrop />
      <OiAICartDrawer />
      <OiAIModalBackdrop />
      <OiAIQuickViewModal />
      <OiAIFeedbackBackdrop />
      <OiAIFeedbackModal />
      <OiAIToast />
      <OiAIAnnouncementToast />
    </>
  );
}
