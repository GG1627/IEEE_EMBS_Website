import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../pages/auth/AuthContext";
import { useSnackbar } from "../../components/ui/Snackbar";
import Footer from "../../components/layout/Footer";

export default function Blog() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("member");
  const [showAdminForm, setShowAdminForm] = useState(false);
  
  // Admin form states
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("members")
            .select("role")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user role:", error);
            setRole("member");
          } else {
            setRole(data?.role || "member");
          }
        } catch (error) {
          console.error("Exception fetching user role:", error);
          setRole("member");
        }
      } else {
        setRole("member");
      }
    };

    fetchRole();
  }, [user]);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching blog posts:", error);
          showSnackbar("Error loading blog posts", { customColor: "#dc2626" });
          // Fallback to default post if no posts exist
          setPosts([{
            id: "default",
            title: "Welcome to the Blog",
            content: "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
            created_at: "2025-08-06T00:00:00Z",
            image_url: null
          }]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error("Exception fetching blog posts:", error);
        setPosts([{
          id: "default",
          title: "Welcome to the Blog",
          content: "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
          created_at: "2025-08-06T00:00:00Z",
          image_url: null
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showSnackbar]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showSnackbar("Image size must be less than 5MB", { customColor: "#dc2626" });
        return;
      }
      setPostImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle blog post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showSnackbar("Please fill in all required fields", { customColor: "#dc2626" });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (postImage) {
        imageUrl = await uploadImage(postImage);
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([{
          title: postTitle.trim(),
          content: postContent.trim(),
          image_url: imageUrl,
          author_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      showSnackbar("Blog post published successfully!", { customColor: "#007377" });
      
      // Reset form
      setPostTitle("");
      setPostContent("");
      setPostImage(null);
      setImagePreview(null);
      setShowAdminForm(false);
      
      // Refresh posts
      const { data: updatedPosts, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!fetchError) {
        setPosts(updatedPosts || []);
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      showSnackbar("Error publishing blog post", { customColor: "#dc2626" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 md:p-18">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#00629b]">Blog</h1>
          {role === "admin" && (
            <button
              onClick={() => setShowAdminForm(!showAdminForm)}
              className="bg-[#007377] text-white px-6 py-3 rounded-lg hover:bg-[#005c60] transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showAdminForm ? "Cancel" : "New Post"}
            </button>
          )}
        </div>

        {/* Admin Form */}
        {role === "admin" && showAdminForm && (
          <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#007377] mb-6">Create New Blog Post</h2>
            <form onSubmit={handleSubmitPost} className="space-y-6">
              <div>
                <label htmlFor="post-title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  id="post-title"
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label htmlFor="post-content" className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Content *
                </label>
                <textarea
                  id="post-content"
                  required
                  rows={6}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200 resize-vertical"
                  placeholder="Write your blog post content here..."
                />
              </div>

              <div>
                <label htmlFor="post-image" className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image (Optional)
                </label>
                <input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors duration-200"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#007377] text-white px-6 py-3 rounded-lg hover:bg-[#005c60] focus:outline-none focus:ring-2 focus:ring-[#007377] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Post
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setPostTitle("");
                    setPostContent("");
                    setPostImage(null);
                    setImagePreview(null);
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007377]"></div>
            <span className="ml-3 text-gray-600">Loading blog posts...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-300 rounded-lg p-6 shadow-sm relative"
              >
                <span className="absolute top-4 right-6 text-sm text-gray-500">
                  {formatDate(post.created_at)}
                </span>
                <h2 className="text-2xl font-semibold text-[#772583] mb-2 pr-32">
                  {post.title}
                </h2>
                {post.image_url && (
                  <div className="mb-4">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="max-w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
