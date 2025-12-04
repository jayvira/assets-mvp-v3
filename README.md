# Next.js Application Template

This is a clean template for building web applications with Next.js. It provides a basic structure with essential components and styling, making it easy to start building your own application.

## Features

- Modern Next.js setup with TypeScript
- Tailwind CSS for styling
- Clean and minimal layout structure
- Mode switching functionality (Design/Build/Develop)
- Responsive navigation components
- Theme support

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with providers
│   └── globals.css      # Global styles
├── components/
│   ├── LayoutContent.tsx    # Main layout wrapper
│   ├── Navbar.tsx          # Top navigation bar
│   └── LeftSidebar.tsx     # Left sidebar navigation
├── context/
│   ├── ModeContext.tsx     # Mode switching context
│   ├── NavigatorContext.tsx # Navigation state context
│   └── PagesContext.tsx    # Pages state context
```

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key (required for Brand Assistant compliance checks):
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Customization

This template provides a minimal setup that you can easily customize:

1. Update the theme in `tailwind.config.js`
2. Modify the layout components in `src/components`
3. Add your own pages and components
4. Customize the navigation and mode switching functionality

## Dependencies

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Radix UI (for UI components)

## License

MIT
