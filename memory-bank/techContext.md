# Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.3.3 for type safety
- **Styling**: Tailwind CSS 3.4.1 for rapid UI development
- **UI Components**: Custom components with shadcn/ui foundation (proven stack from collectly)
- **State Management**: React state + Server Actions for data mutations
- **Icons**: Lucide React 0.316.0

### Backend
- **Database**: Supabase (PostgreSQL)
  - Real-time capabilities for collaborative features
  - Built-in authentication system
  - Row Level Security (RLS) for data protection
- **API**: Next.js API Routes (App Router)
- **File Storage**: Supabase Storage (for user avatars, collection thumbnails)
- **Authentication**: Supabase Auth (@supabase/auth-helpers-nextjs 0.8.7)

### Key Dependencies (Based on Proven collectly Stack)
```json
{
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/supabase-js": "^2.39.0",
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.316.0",
    "next": "^15.3.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.0",
    "tailwind-merge": "^2.2.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "postcss": "^8.4.33",
    "prettier": "^3.2.4",
    "prettier-plugin-tailwindcss": "^0.5.11",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.3.3"
  }
}
```

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier with Tailwind plugin
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git with conventional commits
- **Linting**: eslint-config-next for Next.js best practices

### Deployment
- **Hosting**: Vercel (seamless Next.js integration)
- **Database**: Supabase cloud
- **Domain**: TBD
- **SSL**: Automatic via Vercel
- **CDN**: Vercel Edge Network
- **Environment**: Production deployment after local testing

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Development Setup Requirements
- Node.js 18+
- Git
- Supabase account (project already created)
- Vercel account (for deployment)
- GitHub repository: https://github.com/karinadalca/tabsverse.git

## TypeScript Configuration
Using proven tsconfig.json from collectly:
- Strict mode enabled
- Path mapping with "@/*" for clean imports
- ESModuleInterop for library compatibility
- Target ES2017 for broad browser support

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach
- Cross-device synchronization support

## Performance Targets
- **Initial Page Load**: < 1s
- **Tab/Collection Save**: < 300ms
- **Cross-Device Sync**: < 500ms
- **Collection Sharing**: < 200ms
- **Search/Filter**: < 100ms (real-time)

## Unique Technical Considerations
- **Web Extension Integration**: Future consideration for browser extension
- **Real-time Collaboration**: Live updates when sharing collections
- **Bookmark Import**: Support for importing from various browsers
- **Mobile App**: Future native mobile app consideration
- **Offline Support**: PWA capabilities for offline access

## Scalability Considerations
- **Database Design**: Optimized for collaborative features and social sharing
- **CDN Strategy**: Global distribution for shared collections
- **Caching**: Intelligent caching for frequently accessed collections
- **Search**: Full-text search capabilities for large resource collections
