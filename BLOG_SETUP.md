# Blog Admin Feature Setup

This document explains how to set up the admin blog posting feature for the IEEE EMBS website.

## Database Setup

### 1. Create the blog_posts table

Run the SQL commands in `database_setup.sql` in your Supabase SQL editor:

```sql
-- The SQL commands will create:
-- 1. blog_posts table with proper structure
-- 2. Storage bucket for blog images
-- 3. Row Level Security (RLS) policies
-- 4. Storage policies for image uploads
```

### 2. Verify the setup

After running the SQL commands, verify that:

1. The `blog_posts` table exists in your Supabase dashboard
2. The `blog-images` storage bucket is created
3. RLS policies are active on the `blog_posts` table

## Features

### For Admins
- **New Post Button**: Admins see a "New Post" button in the top-right of the blog page
- **Blog Post Form**: Clicking "New Post" reveals a form with:
  - Title field (required)
  - Content textarea (required)
  - Image upload (optional, max 5MB)
  - Image preview
  - Publish and Cancel buttons
- **Image Upload**: Images are uploaded to Supabase storage and displayed in posts
- **Real-time Updates**: New posts appear immediately after publishing

### For All Users
- **Blog Display**: All users can view published blog posts
- **Image Support**: Posts can include featured images
- **Responsive Design**: Blog posts are mobile-friendly
- **Loading States**: Proper loading indicators while fetching posts

## Usage

### Creating a Blog Post (Admin Only)

1. Navigate to the Blog page
2. Click the "New Post" button
3. Fill in the title and content
4. Optionally upload a featured image
5. Click "Publish Post"

### Viewing Blog Posts (All Users)

1. Navigate to the Blog page
2. Scroll through published posts
3. Posts are displayed in reverse chronological order (newest first)

## Technical Details

### Database Schema

```sql
blog_posts:
- id: UUID (Primary Key)
- title: TEXT (Required)
- content: TEXT (Required)
- image_url: TEXT (Optional)
- author_id: UUID (References auth.users)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Security

- **RLS Enabled**: Row Level Security is enabled on the blog_posts table
- **Admin Only Write**: Only users with `role = 'admin'` can create, update, or delete posts
- **Public Read**: All users can read published blog posts
- **Image Security**: Images are stored in a public bucket but upload is restricted to authenticated users

### File Structure

```
src/pages/main/Blog.jsx - Main blog component with admin functionality
database_setup.sql - Database schema and policies
BLOG_SETUP.md - This setup guide
```

## Troubleshooting

### Common Issues

1. **"Error loading blog posts"**: Check if the `blog_posts` table exists and RLS policies are correct
2. **"Error uploading image"**: Verify the `blog-images` storage bucket exists and policies are set
3. **Admin button not showing**: Check if the user has `role = 'admin'` in the members table
4. **Permission denied**: Ensure RLS policies are properly configured

### Debug Steps

1. Check Supabase logs for any error messages
2. Verify user role in the members table
3. Test RLS policies in Supabase dashboard
4. Check browser console for JavaScript errors
