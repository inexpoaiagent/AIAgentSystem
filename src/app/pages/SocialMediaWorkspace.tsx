import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, ChevronLeft, Calendar, Image, Video, MessageSquare, Heart, Share2, TrendingUp } from "lucide-react";

export default function SocialMediaWorkspace() {
  const posts = [
    { platform: "LinkedIn", type: "Post", content: "How AI agents are transforming business operations...", scheduled: "Today, 10:00 AM", status: "Scheduled", engagement: "Est. 2.5K" },
    { platform: "Twitter", type: "Thread", content: "5 ways AI can automate your workflow", scheduled: "Today, 2:00 PM", status: "Draft", engagement: "Est. 1.8K" },
    { platform: "Instagram", type: "Reel", content: "Behind the scenes: AI at work", scheduled: "Tomorrow, 11:00 AM", status: "Scheduled", engagement: "Est. 5.2K" },
  ];

  const analytics = [
    { platform: "LinkedIn", followers: "15.2K", engagement: "4.2%", posts: 42 },
    { platform: "Twitter", followers: "28.4K", engagement: "3.8%", posts: 156 },
    { platform: "Instagram", followers: "12.8K", engagement: "5.1%", posts: 38 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Social Media Workspace</h1>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
            <MessageSquare className="w-4 h-4 mr-2" />
            Generate Post
          </Button>
        </div>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {analytics.map((platform, i) => (
            <Card key={i} className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
              <h3 className="font-semibold mb-4">{platform.platform}</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Followers</div>
                  <div className="text-2xl font-bold">{platform.followers}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Engagement</div>
                    <div className="text-lg font-semibold text-green-400">{platform.engagement}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Posts</div>
                    <div className="text-lg font-semibold">{platform.posts}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Content Calendar
          </h2>
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {post.platform}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {post.type}
                      </Badge>
                    </div>
                    <Badge className={post.status === 'Scheduled' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-3">{post.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.scheduled}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {post.engagement}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">Edit</Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">Preview</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              AI Content Ideas
            </h3>
            <div className="space-y-3">
              {["5 AI automation tips for businesses", "How we scaled with AI agents", "Customer success story spotlight"].map((idea, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-blue-500/30 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-sm">{idea}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-blue-400 hover:bg-blue-500/10">Use</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#111117]/50 backdrop-blur-xl border-white/10 p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Generate Post", icon: MessageSquare, color: "blue" },
                { label: "Create Reel", icon: Video, color: "purple" },
                { label: "Design Image", icon: Image, color: "pink" },
                { label: "Schedule Posts", icon: Calendar, color: "orange" },
              ].map((action, i) => (
                <Button key={i} variant="outline" className="h-20 flex-col border-white/10 hover:bg-white/10">
                  <action.icon className={`w-6 h-6 mb-2 text-${action.color}-400`} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
