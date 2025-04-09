import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">About PrepPal</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          At PrepPal, we're on a mission to simplify meal planning and preparation for everyone. We
          believe that eating well shouldn't be complicated or time-consuming. Our AI-powered
          platform takes the stress out of meal prep by finding personalized meal plans that fit
          your dietary preferences, time constraints, and cooking skill level.
        </p>
        <p className="text-gray-600">
          Whether you're a busy professional, a parent juggling family meals, or someone just
          looking to eat healthier, PrepPal is designed to make your life easier and your meals more
          delicious.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-700 text-2xl font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Tell Us About Your Needs</h3>
            <p className="text-sm text-gray-600">
              Input your dietary preferences, allergies, available cooking time, and other
              constraints.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-700 text-2xl font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Generate Your Meal Plan</h3>
            <p className="text-sm text-gray-600">
              Our AI creates a customized meal plan with recipes that match your requirements.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-700 text-2xl font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Shop & Prep with Ease</h3>
            <p className="text-sm text-gray-600">
              Get a consolidated shopping list and step-by-step preparation instructions.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
        <p className="text-gray-600 mb-6">
          PrepPal was founded by a team of food enthusiasts, technology experts, and
          health-conscious individuals who understand the challenges of consistent meal planning.
          We're committed to continually improving our platform based on user feedback and
          nutritional science.
        </p>

        <div className="flex justify-center">
          <button
            className="btn btn-primary"
            onClick={() => document.dispatchEvent(new CustomEvent('openFeedbackModal'))}
          >
            Get in Touch With Us
          </button>
        </div>
      </div>

      <div className="bg-primary-100 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Join the PrepPal Community</h2>
        <p className="text-gray-600 mb-4">
          Start your journey to easier, healthier meal preparation today.
        </p>
        <button className="btn btn-secondary" onClick={() => (window.location.href = '/signup')}>
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
