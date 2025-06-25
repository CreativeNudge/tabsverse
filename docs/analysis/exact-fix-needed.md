# Image Upload Fix: Database Update Issue

**Date**: June 25, 2025  
**Status**: 🎯 **ROOT CAUSE CONFIRMED**  
**Issue**: Dashboard layout not passing coverImageUrl to API

## 🔍 **Problem Confirmed**

### **What's Working**:
- ✅ Image upload to storage (files in bucket)
- ✅ Create Curation modal sets `formData.coverImageUrl`
- ✅ API accepts and handles `coverImageUrl` parameter
- ✅ Database field `cover_image_url` exists and works

### **What's Broken**:
- ❌ Dashboard layout not passing `coverImageUrl` from form to API call

## 🔧 **Exact Fix Needed**

In `/app/(dashboard)/layout.tsx`, line 77-82:

**BEFORE (Missing coverImageUrl)**:
```javascript
await createGroupMutation.mutateAsync({
  title: formData.title,
  description: formData.description,
  visibility: formData.visibility,
  tags: formData.tags,
  primary_category: formData.primary_category,
  secondary_category: formData.secondary_category || null
})
```

**AFTER (Add coverImageUrl)**:
```javascript
await createGroupMutation.mutateAsync({
  title: formData.title,
  description: formData.description,
  visibility: formData.visibility,
  tags: formData.tags,
  primary_category: formData.primary_category,
  secondary_category: formData.secondary_category || null,
  coverImageUrl: formData.coverImageUrl  // ADD THIS LINE
})
```

## 🎯 **This Will Fix**

1. ✅ Images upload and save URL to database
2. ✅ Images display in collection cards  
3. ✅ Images display in detail pages
4. ✅ No storage policy changes needed
5. ✅ No random behavior - consistent workflow

## 📝 **Simple One-Line Fix**

This is literally just adding one line to pass the data through to the API that already handles it correctly.
