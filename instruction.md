AURUM

"Where Every Meal Becomes a Memory"

1. Brand Identity & Concept

Restaurant Name: Aurum (Latin for Gold, symbolizing the pinnacle of culinary excellence).
Vibe & Mood: Elegant, Expensive, Modern, and Minimal. The brand tone is sophisticated, grounded,
and highly exclusive.
Color Palette:
Deep Black (#0F0F0F): Depth, contrast, and modern sleekness.
Signature Gold (#D4AF37): Luxurious accents, CTAs, and highlights.
Ivory (#F8F4E9): Clean, minimalist backgrounds.
Typography: Playfair Display (Headings) and Poppins (Body text).

2. Technical Stack & Architecture

Frontend Ecosystem
Framework: React.js
Styling: Tailwind CSS
Animations: Framer Motion (fade-ins, parallax,
golden glow)

Backend & Infrastructure
Server: Node.js with Express.js
Database: MongoDB
Security: JWT (JSON Web Tokens)
Payments: Stripe / Razorpay

3. Website Structure & UI/UX
1. Hero Section
Background: Full-screen looping video (video.mp4) with parallax scrolling.
Overlay: Center-aligned H1 "AURUM", Subheading "Fine Dining Experience".
Buttons: "Book Now" (Gold), "Explore Menu" (Ivory/Ghost).
•
•
•

•
•
•

•
•
•
•

•
•
•

2. Luxury Statistics Section
Data Points: 15+ Years of Excellence | 50+ Signature Dishes | 25K+ Happy Guests | 5 Star Dining
Experience.
Effect: Dynamic count-up animation on scroll.
3. Signature Dishes Section
Cards: Wagyu Steak, Truffle Pasta, Lobster Thermidor, Gold Leaf Dessert.
Details: Dish Name, Price, Ingredients, and a Gold "Chef Recommendation" badge. Hover triggers a
smooth zoom.
4. Chef's Special & Gallery
Chef Section: 50/50 split. Large portrait alongside "Meet Chef Alexander" and an elegant signature
graphic.
Gallery: Premium Masonry Grid with filters (Food, Interior, Events, Chef). Hover applies a zoom and a
signature "Golden glow" shadow.
5. Reviews, Membership & Footer
Reviews: Luxury card slider auto-advancing every 5 seconds (5-star rating, portrait, quote).
VIP Club: Deep black section outlining Priority Reservations, Private Events, Chef's Table, and Birthday
Specials.
Footer: Minimalist deep black footer containing hours, map, reservation number, and the closing quote:
"Dining is not just eating. It is an experience."

4. Core Functionality & Logic

Table Reservation System
A polished React form collecting Name, Email, Phone, Date, Time, Guests, and Special Requests.
Features a custom calendar picker, time slots, and a real-time availability checker powered by
MongoDB. Triggers a confirmation email via Node.js.
AI-Powered Table Recommendation (Unique Feature)
Users select an occasion (Couple, Family, Business Meeting, Birthday). The AI logic processes this and
dynamically outputs a tailored suggestion, such as: "Recommended: Window Table #12 (Best View
Rating: 98%)" to provide an intelligent, bespoke booking experience.
•

•

•
•

•

•

•
•

•

THE MASTER PROMPT (v10.0)
Copy and paste the text below into your AI development tool to generate the project:
[ROLE & CONTEXT]
You are an elite, high-end brand strategist, full-stack web developer, and digital designer representing a luxury
restaurant. Your task is to generate content, web code, architecture recommendations, and marketing materials that
strictly adhere to the brand's core identity and modern development standards.
[BRAND IDENTITY & CONCEPT]
* Restaurant Name: Aurum
* Tagline: "Where Every Meal Becomes a Memory."
* Vibe & Mood: Elegant, Expensive, Modern, and Minimal.
* Colors: Deep Black (#0F0F0F), Signature Gold (#D4AF37), Ivory (#F8F4E9).
* Typography: Playfair Display (Headings), Poppins (Body).
[TECHNICAL STACK & ARCHITECTURE]
* Frontend: React.js, Tailwind CSS, Framer Motion.
* Backend: Node.js, Express.js.
* Database & Auth: MongoDB, JWT.
* Payment Gateway: Stripe or Razorpay.
[UI/UX & STRUCTURE]
1. Hero: Full-screen video.mp4, H1 "AURUM", "Book Now" & "Explore Menu" buttons, Framer Motion fade-ins.
2. Stats: Animated counters (15+ Years, 50+ Dishes, 25K+ Guests, 5 Stars).
3. Dishes: Hover-zoom cards (Wagyu, Truffle Pasta, Lobster, Gold Leaf Dessert) with Chef Recommendation
badges.
4. Chef: 50/50 split, Chef Alexander portrait, signature image.
5. Gallery: Masonry grid, category filters, golden glow hover effect.
6. Reviews: 5-second auto-slider with 5-star ratings and quotes.
7. VIP Club: Deep black background, elite perks, gold CTA button.
8. Footer: Opening hours, map, reservation number, and quote: "Dining is not just eating. It is an experience."
[FUNCTIONALITY]
9. Reservation System: React form, custom calendar picker, real-time MongoDB availability checker, email
automation.
10. AI Recommendation: User selects occasion (Couple, Business, etc.), system dynamically suggests specific
tables (e.g., "Recommended: Window Table #12 - Best View Rating: 98%").