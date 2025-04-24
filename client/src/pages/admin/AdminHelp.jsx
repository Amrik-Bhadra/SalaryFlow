import { useState } from 'react';
import { MdSearch, MdExpandMore, MdExpandLess, MdEmail, MdChat, MdHelp, MdArticle, MdVideoLibrary } from 'react-icons/md';
import { FaDiscord, FaGithub } from 'react-icons/fa';

const AdminHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      question: "How do I get started with the admin dashboard?",
      answer: "To get started, first familiarize yourself with the navigation menu on the left. It contains all the main sections of the admin dashboard. We recommend starting with the Dashboard overview to get a sense of your key metrics and data."
    },
    {
      question: "How can I customize my dashboard view?",
      answer: "You can customize your dashboard by using the Settings menu. There you'll find options to change the theme, adjust notifications, and configure your preferred view settings. You can also rearrange widgets by dragging and dropping them."
    },
    {
      question: "What are the system requirements?",
      answer: "Our application is web-based and works best with modern browsers like Chrome, Firefox, Safari, or Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
    },
    {
      question: "How do I manage user permissions?",
      answer: "User permissions can be managed through the Users section. As an admin, you can assign roles, modify access levels, and set specific permissions for individual users or groups."
    },
    {
      question: "How can I export my data?",
      answer: "Data can be exported from most tables and reports using the export button (usually located in the top right of the interface). We support various formats including CSV, Excel, and PDF."
    }
  ];

  const resources = [
    {
      title: "Documentation",
      icon: MdArticle,
      description: "Comprehensive guides and API references",
      link: "#"
    },
    {
      title: "Video Tutorials",
      icon: MdVideoLibrary,
      description: "Step-by-step video guides",
      link: "#"
    },
    {
      title: "Community Forum",
      icon: FaDiscord,
      description: "Connect with other users",
      link: "#"
    },
    {
      title: "GitHub Repository",
      icon: FaGithub,
      description: "Access source code and contribute",
      link: "#"
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ResourceCard = ({ title, icon: Icon, description, link }) => (
    <a
      href={link}
      className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-sky bg-opacity-10">
          <Icon className="text-2xl text-sky" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Help & Support</h1>
        <p className="text-gray-500 text-sm">Find answers and get support</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MdSearch className="text-gray-400 text-xl" />
        </div>
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="p-2 rounded-lg bg-sky bg-opacity-10">
            <MdEmail className="text-xl text-sky" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Email Support</h3>
            <p className="text-sm text-gray-500">Get help via email</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="p-2 rounded-lg bg-sky bg-opacity-10">
            <MdChat className="text-xl text-sky" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Live Chat</h3>
            <p className="text-sm text-gray-500">Chat with support team</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="p-2 rounded-lg bg-sky bg-opacity-10">
            <MdHelp className="text-xl text-sky" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Schedule Demo</h3>
            <p className="text-sm text-gray-500">Book a walkthrough</p>
          </div>
        </button>
      </div>

      {/* Resources Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFaq.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium text-gray-800">{item.question}</span>
                {expandedFaq === index ? (
                  <MdExpandLess className="text-2xl text-gray-400" />
                ) : (
                  <MdExpandMore className="text-2xl text-gray-400" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-sky bg-opacity-5 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Still need help?</h3>
            <p className="text-gray-600">Our support team is here to assist you</p>
          </div>
          <button className="px-6 py-2 bg-sky text-white rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHelp; 