export default function ContactUs() {
  return (
    <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
          Contact Us
        </h1>

        <p className="text-gray-700 text-center mb-10 text-lg">
          Have questions, feedback, or want to list your shop? Reach out to us! 
          We'll get back to you as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Subject"
              className="p-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="Message"
              rows={5}
              className="p-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info Cards */}
          <div className="flex flex-col gap-6">
            {[
              { icon: "📍", title: "Address", desc: "123 Local Street, Your City, Your Country" },
              { icon: "📞", title: "Phone", desc: "+1 234 567 890" },
              { icon: "✉️", title: "Email", desc: "support@informme.com" },
              { icon: "🌐", title: "Website", desc: "www.informme.com" },
            ].map((info) => (
              <div
                key={info.title}
                className="flex items-start gap-4 bg-green-50 text-green-700 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
              >
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{info.title}</h3>
                  <p className="text-green-800">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
