# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Chisfis**, a Next.js 15 travel booking template built with TypeScript and Tailwind CSS. It's a comprehensive travel platform template featuring multiple booking types (stays, cars, flights, experiences, real estate) with responsive design and dark mode support.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting with ESLint
npm run lint
```

## Key Dependencies

### Core Framework
- **Next.js 15.3.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.2.2** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS 4.1.5** - Utility-first CSS framework
- **@tailwindcss/forms** - Form styling plugin
- **@tailwindcss/typography** - Typography plugin
- **@tailwindcss/aspect-ratio** - Aspect ratio utilities
- **Headless UI 2.2.2** - Unstyled accessible components
- **Heroicons 2.2.0** - Icon library
- **Framer Motion 12.10.4** - Animation library
- **clsx 2.1.1** - Conditional class names

### Form & Input Components
- **React DatePicker 8.4.0** - Date selection component
- **rc-slider 11.1.8** - Range slider component
- **react-swipeable 7.0.2** - Touch gesture support

### Maps & Location
- **@vis.gl/react-google-maps 1.5.2** - Google Maps integration

### Carousel & Sliders
- **embla-carousel-react 8.6.0** - Carousel component
- **embla-carousel-autoplay 8.6.0** - Autoplay plugin

### Utilities
- **lodash 4.17.21** - Utility library
- **react-use 17.6.0** - React hooks collection
- **client-only 0.0.1** - Client-side only code marker
- **sharp 0.34.1** - Image optimization

### Development Tools
- **ESLint** with Next.js configuration
- **Prettier 3.3.2** with plugins:
  - `prettier-plugin-organize-imports` - Import sorting
  - `prettier-plugin-tailwindcss` - Tailwind class sorting
- **PostCSS 8.4.31** - CSS processing

## Architecture & Structure

### Next.js App Router Structure
The project uses Next.js 15 with the App Router pattern:

#### Main App Routes (`src/app/(app)/`)
- **Home Pages**: `/` (default), `/car`, `/experience`, `/real-estate`
- **Stay Categories**: `/stay-categories/[[...handle]]` with map variant `/stay-categories-map/[[...handle]]`
- **Car Categories**: `/car-categories/[[...handle]]` with map variant `/car-categories-map/[[...handle]]`
- **Flight Categories**: `/flight-categories/[[...handle]]`
- **Experience Categories**: `/experience-categories/[[...handle]]` with map variant `/experience-categories-map/[[...handle]]`
- **Real Estate Categories**: `/real-estate-categories/[[...handle]]` with map variant `/real-estate-categories-map/[[...handle]]`
- **Listings**: `/stay-listings/[handle]`, `/car-listings/[handle]`, `/experience-listings/[handle]`, `/real-estate-listings/[handle]`

#### Account Routes (`src/app/(account)/`)
- `/account` - Main account dashboard
- `/account-billing` - Billing and payment information
- `/account-password` - Password management
- `/account-savelists` - Saved items and wishlists

#### Authentication Routes (`src/app/(auth)/`)
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password recovery

#### Other Pages (`src/app/(other-pages)/`)
- `/about` - About page with founder, hero, and statistics sections
- `/blog` - Blog listing and individual posts `/blog/[handle]`
- `/contact` - Contact page
- `/authors` - Author listing and profiles `/authors/[handle]`
- `/checkout` - Booking checkout process
- `/pay-done` - Payment confirmation
- `/subscription` - Subscription management
- `/add-listing` - Multi-step listing creation (steps 1-10)

#### API Routes (`src/app/api/`)
- `/api/hello` - Sample API endpoint

### Key Architectural Components

#### Layout System
- **ApplicationLayout** (`src/app/(app)/application-layout.tsx`) - Main app wrapper with responsive header/footer
- **Header Components** (`src/components/Header/`):
  - `Header.tsx` - Main desktop navigation with mega menu
  - `Header2.tsx` - Alternative header layout
  - `Header3.tsx` - Third header variation
  - `AvatarDropdown.tsx` - User account dropdown
  - `CategoriesDropdown.tsx` - Category navigation dropdown
  - `CurrLangDropdown.tsx` - Currency/language selector
  - `HamburgerBtnMenu.tsx` - Mobile menu toggle
  - `MegaMenuPopover.tsx` - Desktop mega menu
  - `NotifyDropdown.tsx` - Notifications dropdown
  - `SearchBtnPopover.tsx` - Search button with popover
  - **Navigation** (`src/components/Header/Navigation/`):
    - `Navigation.tsx` - Main navigation component
    - `SidebarNavigation.tsx` - Sidebar navigation for mobile
- **Footer Components**:
  - `Footer.tsx` - Main footer
  - `Footer2.tsx` - Alternative footer layout
  - `Footer3.tsx` - Third footer variation
  - `Footer4.tsx` - Fourth footer variation
  - `FooterQuickNavigation.tsx` - Mobile bottom navigation
- **Sidebar Components** (`src/components/aside/`):
  - `aside.tsx` - Main sidebar component
  - `index.tsx` - Sidebar exports
  - `aside-sidebar-navigation.tsx` - Sidebar navigation logic

#### Search & Filtering
- **HeroSearchForm** (`src/components/HeroSearchForm/`) - Main search components:
  - `HeroSearchForm.tsx` - Main search form container
  - `HeroSearchFormSmall.tsx` - Compact version
  - `StaySearchForm.tsx` - Hotel/accommodation search
  - `RentalCarSearchForm.tsx` - Car rental search
  - `FlightSearchForm.tsx` - Flight booking search
  - `ExperiencesSearchForm.tsx` - Activities/tours search
  - `RealEstateHeroSearchForm.tsx` - Property search
  - **UI Components** (`src/components/HeroSearchForm/ui/`):
    - `LocationInputField.tsx` - Location autocomplete
    - `DateRangeField.tsx` - Date picker integration
    - `GuestNumberField.tsx` - Guest/occupancy selector
    - `PropertyTypeSelectField.tsx` - Property type dropdown
    - `PriceRangeInputField.tsx` - Price range slider
    - `ButtonSubmit.tsx` - Search submission button
    - `ClearDataButton.tsx` - Form reset functionality
    - `VerticalDividerLine.tsx` - Visual separator

- **HeroSearchFormMobile** (`src/components/HeroSearchFormMobile/`) - Mobile search variants:
  - `HeroSearchFormMobile.tsx` - Mobile search container
  - `LocationInput.tsx` - Mobile location input
  - `DatesRangeInput.tsx` - Mobile date selection
  - `GuestsInput.tsx` - Mobile guest selector
  - `FieldPanelContainer.tsx` - Mobile field wrapper
  - **Specialized Mobile Forms**:
    - `StaySearchFormMobile.tsx` - Mobile stay search
    - `CarSearchFormMobile.tsx` - Mobile car search
    - `FlightSearchFormMobile.tsx` - Mobile flight search
    - `ExperienceSearchFormMobile.tsx` - Mobile experience search
    - `RealestateSearchFormMobile.tsx` - Mobile real estate search
    - `PriceRangeInput.tsx` - Mobile price range input
    - `PropertyTypeSelect.tsx` - Mobile property type selector

#### Card Components
- **Stay/Accommodation Cards**:
  - `StayCard.tsx` - Standard accommodation card
  - `StayCard2.tsx` - Alternative accommodation card layout
  - `StayCardH.tsx` - Horizontal accommodation card
- **Car Rental Cards**:
  - `CarCard.tsx` - Standard car rental card
  - `CarCardH.tsx` - Horizontal car rental card
- **Experience Cards**:
  - `ExperiencesCard.tsx` - Standard experience/activity card
  - `ExperiencesCardH.tsx` - Horizontal experience card
- **Real Estate Cards**:
  - `PropertyCard.tsx` - Standard property card
  - `PropertyCardH.tsx` - Horizontal property card
- **Flight Cards**:
  - `FlightCard.tsx` - Flight booking card
- **Category Cards**:
  - `CardCategory1.tsx` through `CardCategory7.tsx` - Various category display cards
  - `CardCategoryBox1.tsx` - Category box layout
- **Author Cards**:
  - `CardAuthorBox.tsx` - Author profile card
  - `CardAuthorBox2.tsx` - Alternative author card layout

#### Data Management
- **Data Structure** (`src/data/`):
  - `types.ts` - Core TypeScript interfaces and type definitions
  - `data.ts` - Sample data for listings, reviews, and general content
  - `listings.ts` - Mock listing data for all categories
  - `authors.ts` - Author and user profile data
  - `categories.ts` - Category definitions and metadata
  - `navigation.ts` - Navigation menu structure and links
- **Mock Data** (`src/contains/`):
  - `fakeData.ts` - Additional mock data for development
  - `contants.ts` - Application constants and configuration

### Styling & UI

#### Tailwind CSS Configuration
- Uses Tailwind CSS v4 with PostCSS
- Custom color themes and dark mode support
- Responsive design with mobile-first approach

#### Component Library
- `src/shared/` - Reusable UI components:
  - **Buttons**: Button, ButtonPrimary, ButtonSecondary, ButtonThird, ButtonCircle, ButtonClose
  - **Forms**: Input, Select, Textarea, Checkbox, NcModal
  - **Navigation**: Pagination, NextPrev
  - **UI Elements**: Avatar, Badge, Heading, Tag, Logo, LogoSvg, LogoSvgLight
  - **Theme**: SwitchDarkMode, SwitchDarkMode2
  - **Social**: SocialsList, SocialsList1, SocialsShare
  - **Advanced**: combobox, description-list, divider, fieldset, link, listbox, navbar, radio, switch, table
- Headless UI components for accessibility
- Custom form components with validation

#### Theme System
- **ThemeProvider** (`src/app/theme-provider.tsx`) - Dark mode and RTL support with Google Maps API integration
- **CustomizeControl** (`src/app/customize-control.tsx`) - Demo customization panel (can be removed for production)
- **Theme Components**:
  - `SwitchDarkMode.tsx` - Dark mode toggle switch
  - `SwitchDarkMode2.tsx` - Alternative dark mode toggle
- **Persistent theme state with localStorage**
- **Context-based theme management** with `ThemeContext`

### Key Features

#### Multi-Category Booking
- **Stay/Accommodation** - Hotels, rentals, vacation properties
- **Car Rental** - Vehicle bookings with location and date selection
- **Flights** - Air travel bookings with departure/arrival cities
- **Experiences** - Tours, activities, and local experiences
- **Real Estate** - Property listings for purchase or rental

#### Maps Integration
- **Google Maps integration** via `@vis.gl/react-google-maps`
- **Map views** for location-based listings with interactive markers
- **SectionGridHasMap** components for map + grid layouts:
  - `stay-categories-map` - Accommodation map view
  - `car-categories-map` - Car rental map view
  - `experience-categories-map` - Experience map view
  - `real-estate-categories-map` - Property map view
- **APIProvider** integration in ThemeProvider for global map access
- **MapFixedSection** component for fixed map positioning

#### Date & Guest Management
- **React DatePicker** for date selection with custom components:
  - `DatePickerCustomDay.tsx` - Custom day rendering
  - `DatePickerCustomHeaderTwoMonth.tsx` - Two-month header
  - `DatePickerCustomTime.tsx` - Time selection
- **Guest count selectors** with increment/decrement controls
- **Price range filtering** with rc-slider integration
- **Date range validation** and formatting utilities
- **Guest capacity management** for different accommodation types

### TypeScript Configuration
- **Strict TypeScript setup** with comprehensive type checking
- **Path mapping**: `@/*` points to `src/*` for clean imports
- **ES2017 target** with Next.js plugin for optimal compatibility
- **Library support**: DOM, DOM.iterable, ESNext
- **Module resolution**: Bundler mode for Next.js compatibility
- **Incremental compilation** for faster builds
- **JSX preservation** for React component handling

### Image Handling
- **Next.js Image optimization** with Sharp
- **Remote pattern allowlist** for external images:
  - `images.pexels.com` - Stock photography
  - `images.unsplash.com` - High-quality photos
  - `a0.muscache.com` - Airbnb-style property images
  - `www.gstatic.com` - Google static assets
- **3-month cache TTL** for images (2,678,400 * 6 seconds)
- **React Strict Mode disabled** for compatibility
- **Local image assets** in `src/images/` directory organized by category:
  - `avatars/` - User profile images
  - `cars/` - Vehicle images
  - `flights/` - Airline logos
  - `logos/` - Brand logos (dark/normal variants)

### Mobile Responsiveness
- Mobile-first design approach
- Separate mobile components for complex UI
- Bottom navigation for mobile
- Responsive grid layouts

## Utility Components & Sections

### Section Components
- **Landing Page Sections**:
  - `SectionBecomeAnAuthor.tsx` - Call-to-action for hosts/authors
  - `SectionClientSay.tsx` - Customer testimonials
  - `SectionDowloadApp.tsx` - Mobile app download promotion
  - `SectionGridAuthorBox.tsx` - Author grid display
  - `SectionGridCategoryBox.tsx` - Category grid layout
  - `SectionGridFeaturePlaces.tsx` - Featured places grid
  - `SectionGridFeatureProperty.tsx` - Featured properties grid
  - `SectionHowItWork.tsx` - How it works explanation
  - `SectionOurFeatures.tsx` - Feature highlights
  - `SectionSliderCards.tsx` - Card carousel component
  - `SectionSliderNewCategories.tsx` - New categories slider
  - `SectionSubscribe2.tsx` - Newsletter subscription
  - `SectionTabHeader.tsx` - Tabbed content header
  - `SectionVideos.tsx` - Video content section

### Interactive Components
- **Modals & Overlays**:
  - `ModalSelectDate.tsx` - Date selection modal
  - `ModalSelectGuests.tsx` - Guest selection modal
  - `NcModal.tsx` - Base modal component
- **Form Controls**:
  - `NcInputNumber.tsx` - Number input with increment/decrement
  - `PriceRangeSlider.tsx` - Price range selection
  - `DatePickerCustomDay.tsx` - Custom date picker day component
  - `DatePickerCustomHeaderTwoMonth.tsx` - Two-month date picker header
  - `DatePickerCustomTime.tsx` - Time selection component
- **Interactive Elements**:
  - `BtnLikeIcon.tsx` - Like/favorite button
  - `LikeSaveBtns.tsx` - Like and save button group
  - `StartRating.tsx` - Star rating component
  - `SaleOffBadge.tsx` - Sale discount badge
  - `ListingFilterTabs.tsx` - Listing filter tabs
  - `ListingReview.tsx` - Review display component

### Blog Components (`src/components/blog/`)
- `PostCard1.tsx` - Primary blog post card
- `PostCard2.tsx` - Alternative blog post card
- `PostCardMeta.tsx` - Blog post metadata
- `SectionAds.tsx` - Advertisement section
- `SectionGridPosts.tsx` - Blog posts grid
- `SectionMagazine5.tsx` - Magazine-style layout

### Hero Sections (`src/components/hero-sections/`)
- `HeroSectionWithSearchForm1.tsx` - Main hero with search form
- `HeroSectionWithSearchForm1 copy.tsx` - Hero variant

### Utility Components
- **Visual Elements**:
  - `BackgroundSection.tsx` - Background wrapper component
  - `BgGlassmorphism.tsx` - Glassmorphism background effect
  - `GallerySlider.tsx` - Image gallery slider
  - `Icons.tsx` - Icon components collection
  - `PostTypeFeaturedIcon.tsx` - Featured post icons
- **Meta Components**:
  - `PostCardMeta.tsx` - Post metadata display

### Hooks (`src/hooks/`)
- `use-carousel-arrow-buttons.ts` - Carousel navigation logic
- `use-carousel-dot-buttons.ts` - Carousel dot indicators
- `useInteractOutside.ts` - Click outside detection
- `useSnapSlider.ts` - Snap slider functionality

### Utilities (`src/utils/`)
- `animationVariants.ts` - Framer Motion animation configurations
- `converSelectedDateToString.ts` - Date formatting utility
- `convertNumbThousand.ts` - Number formatting with thousands separator
- `getT.ts` - Translation/localization helper
- `isInViewPortIntersectionObserver.ts` - Intersection Observer utility
- `isInViewport.ts` - Viewport detection utility
- `twFocusClass.ts` - Tailwind focus class utilities

## Development Notes

### File Naming Conventions
- **React components** use PascalCase (`ComponentName.tsx`)
- **Page files** use lowercase with hyphens (`page-name/page.tsx`)
- **Dynamic routes** use `[handle]` for single dynamic segments or `[[...handle]]` for catch-all routes
- **Utility files** use camelCase (`utilityName.ts`)
- **Hook files** use lowercase with hyphens (`use-hook-name.ts`)

### Component Patterns
- **Functional components** with TypeScript interfaces
- **Async server components** for data fetching (marked with `async`)
- **Client components** marked with `'use client'` directive
- **Shared components** in `src/shared/` for reusability
- **Component composition** with children props and render props patterns
- **Conditional rendering** based on props and state

### Data Fetching
- **Server-side data fetching** in async components using Next.js App Router
- **Mock data functions** in `src/data/` for development and testing
- **API routes** in `src/app/api/` for backend functionality
- **Static data** for categories, navigation, and configuration

### Responsive Design
- **Mobile-first approach** with Tailwind CSS breakpoints
- **Mobile-specific components** in separate directories/files
- **Responsive navigation patterns** with desktop/mobile variants
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly interactions** for mobile devices

### Development Environment
- **React 19** with **Next.js 15**
- **TypeScript strict mode** with ES2017 target
- **ESLint configuration** with Next.js rules
- **Prettier** with plugins:
  - `prettier-plugin-organize-imports` - Automatic import organization
  - `prettier-plugin-tailwindcss` - Tailwind class sorting
- **PostCSS** with Tailwind CSS v4
- **Sharp** for image optimization
- **Build Tools**: Standard Next.js build pipeline