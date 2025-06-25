# Edit Image Feature Implementation Plan

**Date**: June 25, 2025  
**Status**: 🔧 **BUILDING MODULAR IMAGE SYSTEM**  
**Goal**: Reusable image upload with compression + old image deletion

## 🎯 **Requirements Analysis**

### **Core Features Needed**:
1. ✅ **Modular upload service** - reusable across create/edit
2. ✅ **Automatic compression** to 600×600 square format  
3. ✅ **Old image deletion** from storage (save space)
4. ✅ **Simple edit modal** - upload area + update button
5. ✅ **One image per curation** - no extras allowed
6. ✅ **Tabsverse design language** - consistent with other modals

### **Technical Architecture**:
- **Enhanced upload service** with compression + deletion
- **Edit image modal** matching Tabsverse design patterns
- **Edit button overlay** on curation detail page images
- **API integration** for updating existing curations

## 📋 **Implementation Steps**

### **Step 1: Enhanced Image Upload Service**
Create modular service that handles:
- Automatic 600×600 compression
- Old image detection and deletion  
- Consistent file naming and storage
- Error handling and rollback

### **Step 2: Edit Image Modal Component**
Simple modal following Tabsverse patterns:
- DialogContent structure (like CreateCurationModal)
- Upload area with compression feedback
- Cancel/Save Changes buttons with gradients
- Loading states and error handling

### **Step 3: Edit Button Integration**
Add hover overlay to detail page images:
- "Edit Image" button appears on hover
- Positioned over large cover image
- Consistent with existing action patterns

### **Step 4: API Integration**
Update curation API to handle image updates:
- Fetch current image URL
- Delete old image from storage
- Update database with new URL
- Atomic operations with rollback

## 🎨 **Design Consistency**

Following established Tabsverse patterns:
- **Modal Structure**: DialogContent + DialogHeader + DialogFooter
- **Button Styling**: Cancel (outline) + Save Changes (gradient)
- **Upload Area**: Dashed border with hover states
- **Typography**: Same fonts and sizing as CreateCurationModal
- **Color Scheme**: Stone/amber palette with brand gradients

## 🔧 **Storage Optimization**

Each curation gets exactly one image:
- **Before Upload**: Query database for current image URL
- **Delete Old**: Remove file from storage before uploading new
- **Upload New**: Compressed 600×600 square format
- **Update Database**: Atomic update with new URL
- **No Orphans**: Guaranteed no leftover files in storage

This ensures sustainable storage costs and clean file management.
