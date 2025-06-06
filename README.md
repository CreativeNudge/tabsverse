# Tabsverse

Your personal digital content hub. Organize, access, and share your web discoveries across devices and with your community.

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CreativeNudge/tabsverse.git
cd tabsverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
tabsverse/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected routes
│   ├── (public)/          # Public routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript definitions
├── memory-bank/          # Project documentation
└── documentation/        # Additional docs
```

## Memory Bank

This project uses the Memory Bank methodology for maintaining context across development sessions. See `/memory-bank/` for comprehensive project documentation.

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features

### Core Features
- **Personal Collections**: Organize web resources into custom collections
- **Cross-Device Sync**: Access your collections from anywhere
- **Smart Organization**: Tags, categories, and intelligent sorting
- **Resource Management**: Save, annotate, and organize web content

### Social Features
- **Collection Sharing**: Share collections publicly or with specific users
- **Community Discovery**: Explore collections shared by other users
- **Following System**: Follow users and discover new content
- **Collaborative Collections**: Work together on shared collections

### Planned Features
- **Browser Extension**: One-click saving from any webpage
- **Mobile App**: Native mobile experience
- **AI Recommendations**: Intelligent content suggestions
- **Advanced Analytics**: Insights into your digital habits

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit using conventional commits: `git commit -m "feat: add new feature"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

See `.env.example` for required environment variables.

## Documentation

- [Memory Bank](/memory-bank/) - Comprehensive project documentation
- [API Documentation](/documentation/api/) - API reference (coming soon)
- [Component Guide](/documentation/components/) - Component documentation (coming soon)

## License

[MIT License](LICENSE)

## Support

For support, email support@tabsverse.com or join our [Discord community](https://discord.gg/tabsverse).
