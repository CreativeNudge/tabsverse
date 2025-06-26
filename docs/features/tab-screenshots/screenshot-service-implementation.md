# Enhanced Metadata API with Screenshot Fallback

## Implementation Plan

### 1. Screenshot Service Integration
Use **htmlcsstoimage.com** for sites without good og:image coverage.

### 2. Social Platform Special Handling
- **Instagram/Facebook**: Use generic branded placeholders instead of broken images
- **Twitter/X**: Handle their API restrictions
- **LinkedIn**: May work with screenshots

### 3. Smart Image Selection Priority
1. High-quality og:image/twitter:image (current system)
2. Generated screenshot (new)
3. Platform-specific placeholder (social sites)
4. Category-based image (existing fallback)

### 4. Implementation Files to Update
- `/app/api/metadata/route.ts` - Add screenshot generation
- `/lib/utils/urlMetadata.ts` - Add social platform detection
- Environment variables for screenshot API key

### 5. Cost Analysis
- **Screenshot service**: $9/month for 1000 screenshots
- **Expected usage**: ~200 screenshots for 1000 tabs (20% fallback rate)
- **ROI**: Dramatic visual improvement for edge cases

### 6. Social Platform Placeholders
Instead of broken images, show beautiful branded cards:
- Instagram → Pink gradient with Instagram logo
- Facebook → Blue gradient with Facebook logo  
- Twitter → Black gradient with X logo
- LinkedIn → Blue gradient with LinkedIn logo

This creates consistent, professional appearance even for blocked content.
