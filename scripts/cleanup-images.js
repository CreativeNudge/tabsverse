#!/usr/bin/env node

/**
 * Cleanup Script for Tabsverse Curation Images
 * Finds and removes orphaned images from Supabase Storage
 * Usage: npm run cleanup-images
 */

const readline = require('readline')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

function extractFilePathFromUrl(url) {
  try {
    const matches = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/)
    return matches ? matches[1] : null
  } catch (error) {
    return null
  }
}

async function findOrphanedImages() {
  try {
    console.log('🔍 Scanning storage for orphaned images...')

    // Get all images in storage
    const { data: files, error: storageError } = await supabase.storage
      .from('curation-images')
      .list('curation-covers', {
        limit: 1000,
        offset: 0
      })

    if (storageError || !files) {
      throw new Error(`Failed to list storage files: ${storageError?.message}`)
    }

    console.log(`📁 Found ${files.length} files in storage`)

    // Get all image URLs from database
    const { data: curations, error: dbError } = await supabase
      .from('groups')
      .select('cover_image_url')
      .not('cover_image_url', 'is', null)

    if (dbError) {
      throw new Error(`Failed to query database: ${dbError.message}`)
    }

    console.log(`🗄️  Found ${curations?.length || 0} curations with images`)

    // Extract file names from database URLs
    const referencedFiles = new Set(
      curations
        ?.map(c => extractFilePathFromUrl(c.cover_image_url || ''))
        .filter(Boolean)
        .map(path => path?.split('/').pop())
        .filter(Boolean) || []
    )

    // Find orphaned files
    const orphanedFiles = files
      .filter(file => !referencedFiles.has(file.name))
      .map(file => ({
        name: file.name,
        path: `curation-covers/${file.name}`,
        size: file.metadata?.size || 0
      }))

    return orphanedFiles

  } catch (error) {
    console.error('❌ Failed to find orphaned images:', error)
    return []
  }
}

async function cleanupOrphanedImages(orphanedFiles) {
  try {
    const filePaths = orphanedFiles.map(file => file.path)
    
    const { data, error } = await supabase.storage
      .from('curation-images')
      .remove(filePaths)

    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      deletedCount: filePaths.length
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

async function main() {
  console.log('🧹 Tabsverse Image Cleanup Tool')
  console.log('================================')

  try {
    // Find orphaned images
    const orphanedFiles = await findOrphanedImages()

    if (orphanedFiles.length === 0) {
      console.log('✅ No orphaned images found! Storage is clean.')
      rl.close()
      return
    }

    // Show findings
    console.log(`\n⚠️  Found ${orphanedFiles.length} orphaned images:`)
    
    let totalSize = 0
    orphanedFiles.forEach((file, index) => {
      totalSize += file.size
      console.log(`   ${index + 1}. ${file.name} (${formatFileSize(file.size)})`)
    })

    console.log(`\n📊 Total size: ${formatFileSize(totalSize)}`)

    // Ask for confirmation
    const answer = await ask('\n❓ Do you want to delete these orphaned images? (y/N): ')

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n🗑️  Deleting orphaned images...')
      
      const result = await cleanupOrphanedImages(orphanedFiles)
      
      if (result.success) {
        console.log(`✅ Successfully deleted ${result.deletedCount} orphaned images`)
        console.log(`💾 Freed up ${formatFileSize(totalSize)} of storage space`)
      } else {
        console.log(`❌ Cleanup failed: ${result.error}`)
      }
    } else {
      console.log('❌ Cleanup cancelled')
    }

  } catch (error) {
    console.error('❌ Script failed:', error)
  } finally {
    rl.close()
  }
}

// Run the script
main()
