# Username System & Social Identity Roadmap

**Priority**: 🔥 **Critical** - Required for social platform evolution  
**Timeline**: Next 2-4 weeks  
**Dependencies**: Current auth system, social features already built  

---

## Overview

Tabsverse has evolved into a **social platform for digital curation** with public sharing, likes, comments, and discovery features. To unlock the full potential of these social features, we need a proper username system that enables user identity, attribution, and community building.

## Current State

### ✅ **Social Features Already Built**
- Public curation sharing
- Like/unlike functionality  
- Comment system (database ready)
- View tracking and analytics
- User profiles (`/profile` route exists)
- Follow system (database ready)
- Public discovery/browse functionality

### ❌ **Missing Identity Layer**
- No usernames for public attribution
- Generic user display (email-based)
- No memorable user URLs (`/@username`)
- No public user profiles
- Limited social discovery capabilities

---

## The Username System

### **Phase 1: Core Username Infrastructure** 
*Timeline: Week 1-2*

#### Database Schema Updates
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN display_name TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN website TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT; -- if not already exists

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_display_name ON users(display_name);
```

#### Username Validation Rules
- **Length**: 3-20 characters
- **Format**: Alphanumeric, underscores, hyphens only
- **Case**: Case-insensitive storage, preserve display case
- **Reserved**: Block system words (`admin`, `api`, `help`, `about`, `settings`, `support`, etc.)
- **Unique**: Globally unique across platform

#### User Experience Flow
1. **New Users**: Username required during signup flow
2. **Existing Users**: Prompt for username on next login with auto-suggestions
3. **Profile Completion**: Encourage bio, avatar, display name for better discovery

### **Phase 2: Social URLs & Profiles**
*Timeline: Week 2-3*

#### New Route Structure
```
Current: /curations/uuid-123-456
New:     /@username/curation-slug

/profile → /@username (redirect)
/@username → User profile page
/@username/[slug] → Pretty curation URLs
```

#### Public User Profiles
- Display all public curations
- User stats (total tabs curated, followers, following)
- Bio, website, join date
- Follow/unfollow functionality
- Social proof (popular curations, recent activity)

#### URL Generation System
- Auto-generate curation slugs from titles
- Handle slug conflicts with numbering
- Redirect old UUID URLs to new pretty URLs
- Canonical URL support for SEO

### **Phase 3: Enhanced Social Features**
*Timeline: Week 3-4*

#### Discovery & Attribution
- Creator attribution on all public curations
- "More from @username" suggestions
- User search functionality
- Popular curators discovery page

#### Social Proof & Engagement
- User reputation based on likes, follows, views
- Featured curators program
- Top curations by creator
- Social sharing with proper attribution

---

## Technical Implementation

### **Username Availability API**
```typescript
POST /api/username/check
{
  "username": "karina_dalca"
}
→ { "available": true, "suggestions": ["karina_d", "karina_dalca1"] }
```

### **Username Claiming Flow**
```typescript
// For existing users
PATCH /api/users/me
{
  "username": "karina_dalca",
  "display_name": "Karina Dalca",
  "bio": "Building beautiful digital experiences"
}
```

### **URL Rewriting System**
- Middleware to handle `/@username` routes
- Slug generation utils for curation URLs
- 301 redirects from old UUID URLs
- Sitemap generation for SEO

### **Profile Enhancement**
- Avatar upload with image optimization
- Bio with markdown support (links, formatting)
- Social links (Twitter, LinkedIn, personal website)
- Privacy settings (public/private profile)

---

## User Experience Considerations

### **Onboarding Flow for Existing Users**
1. **Login Prompt**: "Choose your username to complete your profile"
2. **Auto-suggestions**: Based on display name or email
3. **Availability Check**: Real-time validation with suggestions
4. **Profile Enhancement**: Optional bio, avatar, website
5. **Preview**: Show how profile will look publicly

### **New User Signup Flow**
1. Email/password → Username selection → Profile setup
2. Integrated experience with immediate username availability
3. Profile preview before completion
4. Option to import profile info from social accounts

### **Username Change Policy**
- **Initial Period**: Free changes for first 30 days
- **Established Users**: One free change per year, then paid
- **Premium Feature**: Unlimited changes for premium users
- **Redirect Preservation**: Old usernames redirect for 6 months

---

## Social Platform Evolution

### **Community Features Unlocked**
With usernames in place, these features become possible:

1. **Following System**: Follow favorite curators for personalized feed
2. **Mentions**: `@username` mentions in comments and descriptions  
3. **Creator Programs**: Featured curators, verification badges
4. **Social Discovery**: Find curators by interests, activity, popularity
5. **Collaboration**: Shared curations with multiple contributors

### **Content Quality & Moderation**
- User reputation system based on engagement
- Community reporting with username attribution
- Curator verification for trusted sources
- Quality scoring for discovery algorithms

### **Monetization Opportunities**
- Premium usernames (short, branded handles)
- Creator tools and analytics
- Sponsored curation placements
- Premium profile features

---

## Success Metrics

### **Phase 1 Goals**
- 95% of existing users claim usernames within 2 weeks
- Username availability check < 200ms response time
- Zero username conflicts or validation errors

### **Phase 2 Goals**  
- 50% improvement in sharing metrics with pretty URLs
- User profile engagement > 30% monthly active users
- SEO improvement with indexed user profiles

### **Phase 3 Goals**
- Social discovery drives 25% of new curation views
- Average user follows 5+ other curators
- Creator attribution increases curation quality scores

---

## Implementation Priority

### **Critical Path** (Weeks 1-2)
1. Username database schema and validation
2. Username claiming UI for existing users
3. Basic profile pages with username display
4. URL routing for `/@username` structure

### **High Impact** (Weeks 2-3)
1. Pretty URLs for curations (`/@username/slug`)
2. Enhanced profile pages with stats and bio
3. Creator attribution on all public content
4. Username-based sharing and discovery

### **Polish & Growth** (Weeks 3-4)
1. Advanced profile features (avatars, social links)
2. Following/followers functionality
3. Social discovery and search
4. Creator tools and analytics

---

## Risk Mitigation

### **Technical Risks**
- **Database Migration**: Test username migration on staging first
- **URL Conflicts**: Comprehensive reserved word list and validation
- **Performance**: Proper indexing and caching for username lookups

### **User Experience Risks**
- **Username Squatting**: Rate limiting and email verification
- **Change Requests**: Clear policy with grace period for mistakes
- **Privacy Concerns**: Opt-out of public discovery, private profiles

### **Business Risks**
- **Brand Protection**: Reserve key brand terms and competitor names
- **Legal Issues**: Username policy covering harassment, impersonation
- **Scalability**: Design system to handle millions of users from start

---

## Conclusion

The username system is the **missing foundation** that will transform Tabsverse from a bookmark tool into a thriving social platform. With public sharing, likes, comments, and discovery already built, usernames are the critical piece that enables community, attribution, and viral growth.

**Implementation should begin immediately** to unlock the full potential of existing social features and position Tabsverse for rapid user growth and engagement.

---

**Next Steps:**
1. Begin database schema design and migration planning
2. Create username validation and suggestion system
3. Design onboarding flow for existing users  
4. Plan pretty URL structure and redirects
5. Prototype public profile pages

**Dependencies:**
- Current auth system (✅ Ready)
- Social features (✅ Built)
- Database infrastructure (✅ Scalable)
- UI components (✅ Design system ready)

**Estimated Effort:** 3-4 weeks full-time development
**Impact:** 🚀 **Platform transformation** - enables true social platform features