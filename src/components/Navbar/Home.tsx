import { Button } from "antd";

function Home() {
  const features = [
    {
      icon: "🗄️",
      title: "Multiple Data Sources",
      description: "Import data from multiple sources to train your agent.",
    },
    {
      icon: "🎨",
      title: "Customizations",
      description:
        "Customize your agent's look and feel to match your brand's style and website design.",
    },

    {
      icon: "🔒",
      title: "Privacy & Security",
      description:
        "Your data is hosted on secure servers with robust encryption and access control.",
    },
    {
      icon: "🔄",
      title: "Auto-Retrain",
      description:
        "Set your agent to retrain automatically and always be synced with your data.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Reduce customer support by 90% with custom{" "}
                <span className="text-blue-500">AI Agents</span>
              </h1>

              <p className="text-gray-600 text-lg">
                Saass chatbot will help you build a custom AI agent, embed it on
                your website and let it handle customer support, lead
                generation, user engagement, and lot more.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Personalized Onboarding Help</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Friendly Pricing As You Scale</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>100% Privacy & Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>7 - Day Free Trial</span>
                </div>
              </div>
            </div>

            {/* Right Column - Integration UI */}
            <div className="bg-blue-50 p-8 rounded-xl">
              <img
                src="https://i.ibb.co/VxKN3Mj/integration-dashboard.png"
                alt="Integration Dashboard"
                className="w-full rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Build, Customize, and Scale Your Agent in
              One Place.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
