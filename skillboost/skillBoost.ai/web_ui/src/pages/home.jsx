import FeatureCard from "../components/featureCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  const features = [
    {
      title: "AI-Powered Questions",
      description: "Practice real interview questions with AI-generated responses.",
      icon: "/undraw_ai-code-generation_imyw.png",
    },
    {
      title: "Real-Time Feedback",
      description: "Get instant evaluation and suggestions on your answers.",
      icon: "/undraw_feedback_ebmx.png",
    },
    {
      title: "Track Progress",
      description: "Monitor your learning journey with detailed stats.",
      icon: "/undraw_progress-tracking_9m3o.png",
    },
    {
      title: "Custom Practice",
      description: "Choose topics & experience level to personalize your session.",
      icon: "/undraw_settings_2quf.png",
    },
  ];

  const nameFromEmail = user?.email?.split("@")[0];

  const handleStartPractice = () => {
    if (!user || !user.email) {
      alert("Please log in to start practicing.");
      navigate("/login");
    } else {
      navigate("/practise");
    }
  };

  return (
    <>
      <h3 style={{ paddingLeft: "40px" }}>
        {user ? `Welcome, ${nameFromEmail}` : "Welcome to SkillBoost.ai"}
      </h3>

      <section
        style={{
          padding: "60px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "20px",
              color: "#1f2937",
            }}
          >
            Ace Your Interviews with AI-Powered Practice
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "30px",
              color: "#374151",
            }}
          >
            Practice real questions and get instant, intelligent feedback to
            sharpen your skills.
          </p>
          <button
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={handleStartPractice}
          >
            Start Practicing
          </button>
        </div>

        <img
          src="/undraw_code-thinking_0vf2.png"
          alt="AI Interview Illustration"
          style={{ maxWidth: "550px", height: "auto" }}
        />
      </section>

      <section style={{ padding: "60px 40px", backgroundColor: "#fff" }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "30px",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          Key Features
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {features.map((feat, i) => (
            <FeatureCard
              key={i}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "60px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
        }}
      >
        <div style={{ maxWidth: "550px" }}>
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "20px",
              color: "#1f2937",
            }}
          >
            Why Choose SkillBoost.ai?
          </h2>
          <ul
            style={{
              paddingLeft: "20px",
              lineHeight: "1.8",
              color: "#374151",
            }}
          >
            <li>Simple and easy to use interface</li>
            <li>Built specifically for frontend/backend developers</li>
            <li>Real-time AI-driven interview practice</li>
            <li>Detailed performance tracking and feedback</li>
          </ul>
        </div>

        <img
          src="/undraw_firmware_3fxd.png"
          alt="Why Choose Us Illustration"
          style={{ maxWidth: "550px", height: "350px" }}
        />
      </section>
    </>
  );
}
