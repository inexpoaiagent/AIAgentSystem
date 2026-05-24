import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import ActionRuntime from "./components/ActionRuntime";

export default function App() {
  return (
    <div className="dark">
      <ActionRuntime />
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
