import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
      <Card className="max-w-xl w-full bg-[#111117]/80 border-white/10 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-300 mx-auto mb-5" />
        <h1 className="text-3xl font-bold mb-3">This workspace route does not exist.</h1>
        <p className="text-gray-400 mb-6">
          The link may be outdated, or your role may not have access. Use the workspace navigation or run a QA route audit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/workspace">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to workspace
            </Button>
          </Link>
          <Link to="/qa-audit">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Search className="w-4 h-4 mr-2" />
              Run QA audit
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
