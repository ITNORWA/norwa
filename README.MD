<div align="center">
  <img src="/Norwa Website/assets/screenshots/white norwa logo.svg" alt="Norwa Africa Logo" width="400"/>
</div>

# Norwa Africa - Water & Energy Solutions Website

Welcome to the official repository for the Norwa Africa company website. This project showcases our mission, solutions, and impact as a leader in sustainable water and energy solutions across Africa. Our goal is to empower futures by providing reliable and innovative technologies that transform communities.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=google-chrome)](https://www.norwaafrica.com)

---

## 📖 Table of Contents

- [🚀 Introduction](#-introduction)
- [✨ Key Features](#-key-features)
- [📸 Website Preview](#-website-preview)
- [💻 Technology Stack](#-technology-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔧 Customization Guide](#-customization-guide)
- [🤝 Credits](#-credits)
- [📞 Contact](#-contact)

---

## 🚀 Introduction

Norwa Africa is dedicated to solving the continent's most pressing water and energy challenges. This website serves as our digital gateway, providing comprehensive information about our services, which include **Borehole Solutions**, **Water Treatment**, **Solar Solutions**, and **Water Pumps**. It also highlights our commitment to community empowerment through initiatives like the **Norwa Academy**.

Our digital presence is designed to be as resilient, accessible, and impactful as the solutions we provide.

## ✨ Key Features

This website is packed with features designed to inform, engage, and convert visitors into partners and clients.

- **💧 Detailed Solution Pages:** In-depth information on our core services, from domestic water treatment to large-scale industrial plants.
- **🏗️ Project Showcase:** An interactive gallery of our completed projects and references, demonstrating our real-world impact.
- **🎓 Norwa Academy Portal:** A dedicated section outlining our training programs, including the "Women in Water Technology" (WIWT) initiative.
- **📝 Interactive Submission Forms:**
  - **Water Analysis / Borehole Report:** Allows clients to upload their technical documents for expert review.
  - **Contact & Feedback Forms:** Easy-to-use forms for general inquiries and customer feedback.
- **📱 Fully Responsive Design:** A seamless experience across all devices, from desktops to mobile phones.
- **💬 Floating WhatsApp Button:** Instant, direct communication with our support team for immediate assistance.
- **动态 Hero Section:** An engaging homepage hero with a background video that tells our story.
- **📰 News & Events Section:** Stay updated with the latest company news, announcements, and community events.

---

## 📸 Website Preview

A glimpse into the clean, professional, and mission-focused design of the Norwa Africa website.

**Homepage Hero Section**
_The first impression, featuring a powerful video and our core mission._
![Homepage Screenshot](/Norwa%20Website/assets/screenshots/homepage.png) <!-- Replace with your actual screenshot path -->

---

**Key Pages Showcase**
_A collage of some of the most important sections of the site._

| Borehole Solutions Page | Norwa Academy | Water Analysis Form |
| :---: | :---: | :---: |
| ![Borehole Solutions](/Norwa%20Website/assets/screenshots/borehole-page.png) | ![Norwa Academy](/Norwa%20Website/assets/screenshots/academy-page.png) | ![Water Analysis Form](/Norwa%20Website/assets/screenshots/form-page.png) |

---

## 💻 Technology Stack

This is a static website built with modern, reliable, and widely-supported technologies.

-   **Frontend:** HTML5, CSS3, JavaScript (ES6)
-   **Framework:** [Bootstrap 5](https://getbootstrap.com/) - For responsive layout and pre-styled components.
-   **JavaScript Libraries:**
    -   [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) - For engaging scroll animations.
    -   [Swiper.js](https://swiperjs.com/) - For touch-enabled sliders and carousels.
    -   [GLightbox](https://biati-digital.github.io/glightbox/) - For an elegant and responsive gallery lightbox.
    -   [Isotope](https://isotope.metafizzy.co/) - For filterable and sortable project galleries.
    -   [PureCounter](https://github.com/srexi/purecounterjs) - For animating numbers and statistics.
-   **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)

---

## 📂 Project Structure

The project follows a standard and intuitive file structure, making it easy to navigate and maintain.

/
|-- assets/
|   |-- css/
|   |   |-- main.css         (Main stylesheet)
|   |   |-- home-styles.css  (Homepage-specific styles)
|   |-- js/
|   |   |-- main.js          (Global custom JavaScript, including WhatsApp & form logic)
|   |-- img/               (All images, logos, and project photos)
|   |-- vendor/            (Third-party libraries like Bootstrap, Swiper, etc.)
|
|-- forms/                   (PHP scripts for form processing - if any)
|-- screenshots/             (For storing README screenshots)
|
|-- index.html               (Homepage)
|-- about.html
|-- borehole.html
|-- contact.html
|-- water Analysis.html
|-- ... (all other HTML pages)
|
|-- README.md                (This file)

---

## ⚙️ Getting Started

To run this project on your local machine, simply follow these steps.

1.  **Clone the Repository**
    ```sh
    git clone git@github.com:ITNORWA/norwa.git
    ```
2.  **Navigate to the Project Directory**
    ```sh
    cd norwa-africa-website
    ```
3.  **Open in Browser**
    -   Simply open the `index.html` file in your favorite web browser.
    -   For best results and to handle any potential cross-origin issues, it's recommended to use a live server extension (like "Live Server" in VS Code).

---

## 🔧 Customization Guide

Here’s how to update the most common parts of the website:

#### 1. Contact Information & Footer Links
-   **Location:** In the `<footer id="footer">` section of **every `.html` file**.
-   **Action:** Find and replace the placeholder addresses, phone numbers, email addresses, and social media links.

#### 2. WhatsApp Floating Button
-   **Location:** `assets/js/main.js`
-   **Action:** Find the section commented as `// --- WhatsApp Floating Button Logic ---`. Update the `phoneNumber` and `message` variables to your desired values.

    ```javascript
    if (whatsAppButton) {
        const phoneNumber = '254710869870'; // <-- CHANGE THIS NUMBER
        const message = encodeURIComponent("Hello! I'm visiting your website..."); // <-- CHANGE THIS MESSAGE
        // ... rest of the code
    }
    ```

#### 3. Water Analysis / Feedback Forms
-   The client-side validation logic is located in `assets/js/main.js` under the `// --- Water Analysis Form Validation Logic ---` comment.
-   To change where the form submits data, update the `action` attribute in the `<form>` tag on `water Analysis.html` and `feedback.html`. You will need a backend service to process the form data.

#### 4. Adding a New Project or News Article
-   Navigate to `projects.html` or `news.html`.
-   Find the HTML structure for an existing item (e.g., an `<article>` or a `.col-lg-4` div).
-   Copy and paste this structure, then replace the text, image `src`, and link `href` with your new content.


## 🤝 Credits
This website was built using the **"NiceSchool"** template provided by [BootstrapMade](https://bootstrapmade.com/). We are grateful for their excellent work, which provided a solid foundation for this project.

-   **Template:** NiceSchool by BootstrapMade
-   **License:** [BootstrapMade License](https://bootstrapmade.com/license/)


## 📞 Contact
**Norwa Africa Ltd** - Empowering Africa's Future, One Drop at a Time.

-   **Website:** [www.norwaafrica.com](https://www.norwaafrica.com)
-   **Email:** <info@norwaafrica.com>
-   **Phone (Nairobi):** +254 710869870