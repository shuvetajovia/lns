# Design Specifications

## Brand Guidelines

**Brand Name:** Mother Nature
**Tagline:** The First Step in Health
**Core Theme:** Premium Native Foods, Organic, Traditional Kanchipuram Roots.

### Typography
The application leverages modern, readable typography to ensure a premium look and feel.
- **Primary Font (Headings):** Playfair Display (Serif, brings a traditional, premium, and trustworthy feel).
- **Secondary Font (Body):** Outfit (Sans-serif, modern, clean, and highly legible).

### Color Palette
While the exact hex codes are defined in `index.css` via CSS variables, the general palette follows:
- **Primary:** Earthy tones (Greens, Browns) reflecting "Mother Nature" and organic roots.
- **Backgrounds:** Off-whites and warm creams to represent natural purity.
- **Accents:** Soft gold or vibrant leaf green to highlight CTAs (Add to Cart, Checkout).
- **Text:** Dark slate (rather than pure black) for softer contrast and readability.

## User Interface (UI)

- **Layout:** Responsive grid system. Clean whitespace to emphasize product imagery and quality.
- **Micro-interactions:** Framer Motion is used for subtle entry animations, hover effects on product cards, and smooth modal transitions. This creates a dynamic and engaging experience without being overwhelming.
- **Icons:** Lucide React icons are used throughout the application for a consistent, lightweight, and modern iconography style.

## User Experience (UX)

- **Pincode Verification:** Users can verify delivery availability early in the flow via the pincode checker, preventing frustration during checkout.
- **Seamless Checkout:** Razorpay is integrated directly into the flow to provide a secure and uninterrupted checkout experience without redirecting users away from the storefront.
