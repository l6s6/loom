import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Search, Trash } from "lucide-react";
import {
  mainNavItems,
  smartViewsConfig,
} from "@/components/layout/sidebar/SidebarNavigation.ts";
import SidebarBlock from "@/components/layout/sidebar/SidebarBlock.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCreateAndNavigateNote } from "@/features/notes/hooks.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { resetDemoData } from "@/api/apiClient.ts";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const Sidebar = () => {
  const navigate = useNavigate();
  const { createAndNavigate } = useCreateAndNavigateNote();

  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    await resetDemoData();
    setIsResetting(true);
    setTimeout(() => {
      window.location.reload();
    }, 60000);
    setIsResetting(false);
  };

  return (
    <aside className="bg-bg-sidebar transition-all duration-300 w-sidebar flex flex-col h-full border-r border-border-subtle px-4">
      <div className="items-center flex flex-row justify-between h-navbar border-b border-border-subtle">
        <div
          className="flex flex-row items-center gap-2 text-2xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          <BookOpen />
          Loom
        </div>
      </div>

      <div className="py-4 flex-1">
        <SidebarBlock label="workbench" configObject={mainNavItems} />
        <SidebarBlock label="smart views" configObject={smartViewsConfig} />
      </div>
      {import.meta.env.VITE_IS_DEMO === "true" && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <div className="w-full flex mb-4">
                <Button variant="destructive" className="flex-1" size="xl">
                  <h3 className="text-sm truncate font-medium">Reset Data</h3>
                </Button>
              </div>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 dark:text-destructive">
                <Trash />
              </AlertDialogMedia>
              <AlertDialogTitle>Reset Data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all data back to the example data and may take
                up to 60 seconds.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleReset}>
                {isResetting ? (
                  <ClipLoader loading={true} size={20} speedMultiplier={0.66} />
                ) : (
                  "Reset"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="flex gap-2  flex-row border-t border-border-subtle py-4 w-full">
        <Button
          onClick={() => createAndNavigate()}
          className="flex-1"
          size="xl"
        >
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-sm truncate text-white font-medium">
              Capture Thought
            </h3>
          </div>
        </Button>
        <Link to="/">
          <Button variant="outline" className="flex" size="icon-xl">
            <Search />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
