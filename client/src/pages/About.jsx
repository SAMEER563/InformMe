export default function About() {
  return (
    <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto p-6 bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          About Inform Me
        </h1>

        {/* Intro Text */}
        <div className="text-gray-700 space-y-6 text-lg">
          <p>
            Welcome to <span className="font-semibold text-green-600">Inform Me</span>! 
            Your ultimate guide to discovering the best shops and services near you. 
            Explore top-rated restaurants, grocery stores, medical shops, mobile shops, salons, and repair services — all in one place.
          </p>

          <p>
            Every shop listed on our platform is <span className="font-semibold text-green-600">verified and trusted</span>, helping you make smart choices quickly.
            Check nearby results, read top reviews, and enjoy fast search to find exactly what you need in your neighborhood.
          </p>

          <p>
            Are you a shop owner? Join our platform and reach thousands of potential customers in your area. 
            <span className="text-green-700 font-semibold"> Inform Me</span> makes it effortless for businesses and users to connect.
          </p>
        </div>

        {/* Shop Categories Cards */}
        <h2 className="text-2xl font-semibold text-green-700 mt-10 mb-6 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { icon: "🍽️", title: "Restaurants" },
            { icon: "🛒", title: "Grocery Stores" },
            { icon: "💊", title: "Medical Shops" },
            { icon: "📱", title: "Mobile Shops" },
            { icon: "💇‍♀️", title: "Salons" },
            { icon: "🔧", title: "Repair Services" },
          ].map((category) => (
            <div
              key={category.title}
              className="flex flex-col items-center justify-center gap-3 bg-green-50 text-green-700 font-semibold rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <span className="text-3xl">{category.icon}</span>
              <span>{category.title}</span>
            </div>
          ))}
        </div>

        {/* Features Cards */}
        <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6 text-center">
          Why Choose Inform Me
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: "✔️", title: "Verified Shops", desc: "All listings are trusted." },
            { icon: "📍", title: "Nearby Results", desc: "See shops near you." },
            { icon: "⭐", title: "Top Reviews", desc: "Ratings help you choose the best option." },
            { icon: "⚡", title: "Fast Search", desc: "Find what you want instantly." },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 bg-green-50 text-green-700 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-green-800">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
