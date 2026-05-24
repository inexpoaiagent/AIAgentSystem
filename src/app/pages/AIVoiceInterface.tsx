import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  ChevronLeft,
  Languages,
  Settings,
  X,
} from "lucide-react";

export default function AIVoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [waveform, setWaveform] = useState<number[]>(Array(50).fill(0));

  const conversation = [
    { speaker: "You", text: "What are the top marketing priorities for this quarter?", time: "2:34 PM" },
    { speaker: "AI Assistant", text: "Based on your company data, the top 3 priorities are: 1) Increasing organic search traffic by 40%, 2) Launching the new product campaign, 3) Improving email engagement rates.", time: "2:34 PM" },
    { speaker: "You", text: "Focus on the SEO strategy first", time: "2:35 PM" },
    { speaker: "AI Assistant", text: "I've activated the SEO Agent. We're analyzing your current keyword rankings and competitor landscape. I'll have a comprehensive strategy ready in 3 minutes.", time: "2:35 PM" },
  ];

  // Simulate waveform animation
  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setWaveform(Array(50).fill(0).map(() => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveform(Array(50).fill(0));
    }
  }, [isListening, isSpeaking]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript("Speaking...");
      setTimeout(() => {
        setIsListening(false);
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        {isListening && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        )}
        {isSpeaking && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/workspace">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Workspace
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Globe className="w-3 h-3 mr-1" />
              {currentLanguage}
            </Badge>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] p-8">
        {/* Main Voice Interface */}
        <div className="max-w-4xl w-full">
          {/* Status Badge */}
          <div className="text-center mb-8">
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-lg py-2 px-4">
                  <Mic className="w-4 h-4 mr-2 animate-pulse" />
                  Listening...
                </Badge>
              </motion.div>
            )}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg py-2 px-4">
                  <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                  AI Speaking...
                </Badge>
              </motion.div>
            )}
            {!isListening && !isSpeaking && (
              <Badge className="bg-white/5 text-gray-400 border-white/10 text-lg py-2 px-4">
                Tap to speak
              </Badge>
            )}
          </div>

          {/* Central AI Avatar */}
          <motion.div
            className="flex justify-center mb-12"
            animate={{
              scale: isListening || isSpeaking ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isListening || isSpeaking ? Infinity : 0,
            }}
          >
            <div className="relative">
              <div className={`w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl ${
                isListening 
                  ? "from-blue-500 to-cyan-500 shadow-blue-500/50" 
                  : isSpeaking 
                  ? "from-purple-500 to-pink-500 shadow-purple-500/50"
                  : "from-blue-500 to-purple-600 shadow-blue-500/30"
              }`}>
                <Brain className="w-24 h-24 text-white" />
              </div>
              {(isListening || isSpeaking) && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-500/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Waveform Visualization */}
          <div className="flex items-center justify-center gap-1 h-32 mb-12">
            {waveform.map((height, index) => (
              <motion.div
                key={index}
                className="w-2 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full"
                initial={{ height: 4 }}
                animate={{ height: isListening || isSpeaking ? height : 4 }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-xl inline-block max-w-2xl">
                <p className="text-lg text-gray-300">{transcript}</p>
              </Card>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              <Languages className="w-6 h-6" />
            </Button>

            <Button
              size="lg"
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full border-0 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
          </div>

          {/* Language Options */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {["English", "Spanish", "French", "German", "Chinese"].map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant="outline"
                onClick={() => setCurrentLanguage(lang)}
                className={`${
                  currentLanguage === lang
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "border-white/10 text-gray-400 hover:bg-white/5"
                }`}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        <div className="max-w-4xl w-full mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Conversation History</h3>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 p-4 backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className={msg.speaker === "You" ? "bg-white/10 text-white" : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"}>
                        {msg.speaker === "You" ? "You" : <Brain className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.speaker}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
