import React from "react";
import "../Styles/Contact.css";

export default function Contact() {
  return (
    <div className="contact-container dark:bg-gray-800 dark:text-white p-8">
      <h1 className="text-center text-4xl font-bold mb-6">Contact Our Admin</h1>
      <div className="max-w-xl mx-auto">
        <div className="mb-6 p-4 border rounded dark:bg-gray-700 dark:border-gray-600">
          <h2 className="text-2xl font-semibold colortxt">Suriyapraksh</h2>
          <p className="text-lg">Email: <a href="mailto:admin@example.com" className="text-blue-600 dark:text-blue-400">suriyaprakashraja849@gmail.com</a></p>
          <p className="text-lg">Phone: <a href="tel:+919486531371" className="text-blue-600 dark:text-blue-400">+91 9486531371</a></p>
        </div>
      </div>
    </div>
  );
}