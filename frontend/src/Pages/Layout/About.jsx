import React from "react";
import "../Styles/About.css";

export default function About() {
  return (
    <div className="dark:bg-gray-800 dark:text-white p-8">
      <h1 className="text-center text-4xl font-bold txt mb-6">Welcome to Our Cloud Storage Platform</h1>
      
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
        <p className="text-lg leading-relaxed">
          Our platform provides a secure and user-friendly way to upload, store, and manage your files in the cloud. Whether you're managing personal documents, multimedia files, or business data, our solution is designed to make cloud storage accessible and hassle-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
        <p className="text-lg leading-relaxed">
          We envision a world where managing your digital assets is as easy as a few clicks. Our goal is to empower individuals and businesses to securely store and access their data from anywhere, at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Why Choose Our Platform?</h2>
        <ul className="list-disc pl-8 text-lg leading-relaxed">
          <li>Top-tier security with encrypted storage solutions.</li>
          <li>Seamless file uploads and fast downloads.</li>
          <li>Intuitive interface with features like dark mode for personalized user experience.</li>
          <li>Cross-platform access—upload and access your files from any device.</li>
          <li>Scalable storage options to meet your growing needs.</li>
        </ul>
      </section>
{/*
      <section>
        <h2 className="text-3xl font-semibold mb-4">Connect With Us</h2>
        <p className="text-lg leading-relaxed">
          Have any questions or need support? Our team is here to help. Visit our <Link to="/contact" className="text-blue-500 hover:underline">Contact</Link> page to get in touch.
        </p>
      </section>
*/}
    </div>
  );
}