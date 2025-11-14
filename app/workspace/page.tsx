import { DesktopBackground } from "@/src/presentation/components/shared/desktop-background/DesktopBackground";
import { Window } from "@/src/presentation/components/shared/window/Window";
import { Taskbar } from "@/src/presentation/components/shared/taskbar/Taskbar";
import { DesktopIcons } from "@/src/presentation/components/shared/app-icons/DesktopIcons";

export default function WorkspacePage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <DesktopBackground />
      <Window />
      <div className="h-full w-full flex flex-col p-4 md:p-5 lg:p-6">
        <Taskbar />
        <div className="flex-1 relative">
          <DesktopIcons />
        </div>
      </div>
    </div>
  );
}

