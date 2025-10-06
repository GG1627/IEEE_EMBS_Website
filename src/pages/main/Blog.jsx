import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../pages/auth/AuthContext";
import { useSnackbar } from "../../components/ui/Snackbar";
import Footer from "../../components/layout/Footer";
import { gradientPresets } from "../../styles/ieeeColors";
import GradientMesh from "../../components/ui/GradientMesh";

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
  const [postImages, setPostImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editEventDate, setEditEventDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Post expansion states
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  // Image carousel states
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [carouselIntervals, setCarouselIntervals] = useState({});

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
          .order("event_date", { ascending: false });

        if (error) {
          console.error("Error fetching blog posts:", error);
          showSnackbar("Error loading blog posts", { customColor: "#dc2626" });
          // Fallback to default post if no posts exist
          setPosts([
            {
              id: "default",
              title: "Welcome to the Blog",
              content:
                "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
              created_at: "2025-08-06T00:00:00Z",
              image_urls: [],
            },
          ]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error("Exception fetching blog posts:", error);
        setPosts([
          {
            id: "default",
            title: "Welcome to the Blog",
            content:
              "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
            created_at: "2025-08-06T00:00:00Z",
            image_urls: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showSnackbar]);

  // Auto-start carousels for posts with multiple images
  useEffect(() => {
    posts.forEach((post) => {
      if (post.image_urls && post.image_urls.length > 1) {
        startCarousel(post.id, post.image_urls.length);
      }
    });

    // Cleanup function to clear all intervals when component unmounts or posts change
    return () => {
      Object.values(carouselIntervals).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [posts]);

  // Handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      showSnackbar(`Images too large (max 5MB): ${invalidFiles.join(", ")}`, {
        customColor: "#dc2626",
      });
    }

    if (validFiles.length > 0) {
      setPostImages((prev) => [...prev, ...validFiles]);

      // Create previews for new files
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle edit image upload
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      showSnackbar(`Images too large (max 5MB): ${invalidFiles.join(", ")}`, {
        customColor: "#dc2626",
      });
    }

    if (validFiles.length > 0) {
      setEditImages((prev) => [...prev, ...validFiles]);

      // Create previews for new files
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditImagePreviews((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Upload multiple images to Supabase storage
  const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  // Handle blog post submission
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !eventDate) {
      showSnackbar("Please fill in all required fields including event date", {
        customColor: "#dc2626",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls = [];
      if (postImages.length > 0) {
        imageUrls = await uploadImages(postImages);
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title: postTitle.trim(),
            content: postContent.trim(),
            image_urls: imageUrls,
            event_date: new Date(eventDate).toISOString(),
            author_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      showSnackbar("Blog post published successfully!", {
        customColor: "#007377",
      });

      // Reset form
      setPostTitle("");
      setPostContent("");
      setPostImages([]);
      setImagePreviews([]);
      setEventDate("");
      setShowAdminForm(false);

      // Refresh posts
      const { data: updatedPosts, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("event_date", { ascending: false });

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

  // Start editing a post
  const startEditingPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImages([]);
    setEditImagePreviews(post.image_urls || []);
    setEditEventDate(
      post.event_date
        ? new Date(post.event_date).toISOString().split("T")[0]
        : ""
    );
    setShowAdminForm(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
    setEditImages([]);
    setEditImagePreviews([]);
    setEditEventDate("");
  };

  // Handle edit post submission
  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim() || !editEventDate) {
      showSnackbar("Please fill in all required fields including event date", {
        customColor: "#dc2626",
      });
      return;
    }

    setIsEditing(true);
    try {
      let imageUrls = [...editImagePreviews];

      if (editImages.length > 0) {
        const newImageUrls = await uploadImages(editImages);
        imageUrls = [
          ...editImagePreviews.filter((url) => url.startsWith("http")),
          ...newImageUrls,
        ];
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title: editTitle.trim(),
          content: editContent.trim(),
          image_urls: imageUrls,
          event_date: new Date(editEventDate).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPost.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      showSnackbar("Blog post updated successfully!", {
        customColor: "#007377",
      });

      // Reset edit form
      cancelEditing();

      // Refresh posts
      const { data: updatedPosts, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("event_date", { ascending: false });

      if (!fetchError) {
        setPosts(updatedPosts || []);
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
      showSnackbar("Error updating blog post", { customColor: "#dc2626" });
    } finally {
      setIsEditing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Toggle post expansion
  const togglePostExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  // Check if content should be truncated (more than 100 characters)
  const shouldTruncate = (content) => {
    return content.length > 100;
  };

  // Carousel navigation functions
  const nextImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: prev[postId] === 0 ? totalImages - 1 : (prev[postId] || 0) - 1,
    }));
  };

  // Start automatic carousel for a post
  const startCarousel = (postId, totalImages) => {
    // Clear existing interval if any
    if (carouselIntervals[postId]) {
      clearInterval(carouselIntervals[postId]);
    }

    // Start new interval
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [postId]: ((prev[postId] || 0) + 1) % totalImages,
      }));
    }, 8000); // 8 seconds

    setCarouselIntervals((prev) => ({
      ...prev,
      [postId]: interval,
    }));
  };

  // Stop automatic carousel for a post
  const stopCarousel = (postId) => {
    if (carouselIntervals[postId]) {
      clearInterval(carouselIntervals[postId]);
      setCarouselIntervals((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[postId];
        return newIntervals;
      });
    }
  };

  // Enhanced navigation functions that restart the carousel
  const nextImageWithCarousel = (postId, totalImages) => {
    nextImage(postId, totalImages);
    startCarousel(postId, totalImages); // Restart carousel after manual navigation
  };

  const prevImageWithCarousel = (postId, totalImages) => {
    prevImage(postId, totalImages);
    startCarousel(postId, totalImages); // Restart carousel after manual navigation
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <GradientMesh colors={gradientPresets.outreach} />
      </div>
      {/* Fixed admin button - absolutely positioned */}
      {role === "admin" && (
        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          className="fixed top-18 right-2 z-20 w-12 h-12 bg-pink-500/20 backdrop-blur-md border border-pink-300/30 rounded-full hover:bg-pink-500/30 hover:border-pink-400/50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 group hover:cursor-pointer"
        >
          {showAdminForm ? (
            <svg
              className="w-8 h-8 text-pink-600 group-hover:text-pink-700 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-pink-600 group-hover:text-pink-700 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 pt-20 px-6 md:px-18 pb-12 relative z-10">
        {/* Admin Form */}
        {role === "admin" && showAdminForm && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-[#007377] rounded flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              Create New Post
            </h2>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="post-title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Title *
                    </label>
                    <input
                      id="post-title"
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors"
                      placeholder="Enter post title..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label
                      htmlFor="post-content"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Content *
                    </label>
                    <textarea
                      id="post-content"
                      required
                      rows={6}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors resize-vertical"
                      placeholder="Write your post content..."
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Event Date */}
                  <div>
                    <label
                      htmlFor="event-date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Event Date *
                    </label>
                    <input
                      id="event-date"
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="group">
                    <label
                      htmlFor="post-image"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Image (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="post-image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreviews((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                                setPostImages((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5MB per image. Select multiple files.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setPostTitle("");
                    setPostContent("");
                    setPostImages([]);
                    setImagePreviews([]);
                    setEventDate("");
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#007377] hover:bg-[#005c60] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Form */}
        {role === "admin" && editingPost && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Blog Post
              </h2>
            </div>

            <form onSubmit={handleEditPost} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group">
                    <label
                      htmlFor="edit-title"
                      className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200"
                    >
                      Post Title *
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                      placeholder="Enter an engaging title..."
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="edit-content"
                      className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200"
                    >
                      Post Content *
                    </label>
                    <textarea
                      id="edit-content"
                      required
                      rows={8}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 transition-all duration-200 resize-vertical bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                      placeholder="Share your story, insights, or event recap..."
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="edit-event-date"
                      className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200"
                    >
                      Event Date *
                    </label>
                    <input
                      id="edit-event-date"
                      type="date"
                      required
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label
                      htmlFor="edit-image"
                      className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200"
                    >
                      Featured Image (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageUpload}
                        className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors file:duration-200"
                      />
                    </div>
                    {editImagePreviews.length > 0 && (
                      <div className="mt-4 p-4 bg-white/60 rounded-xl border-2 border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                          {editImagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditImagePreviews((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                  if (!preview.startsWith("http")) {
                                    setEditImages((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Maximum file size: 5MB per image. Select multiple files to
                      add more.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isEditing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  {isEditing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Update Post
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-500 text-white px-8 py-4 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
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
          <div className="space-y-8">
            {posts.map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              const needsTruncation = shouldTruncate(post.content);

              return (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Left side - Content */}
                    <div className="lg:col-span-2 p-8 min-h-[300px]">
                      <div className="space-y-4">
                        {/* Title with Edit Button */}
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="text-3xl font-bold text-[#00629b] leading-tight flex-1">
                            {post.title}
                          </h2>
                          {role === "admin" && (
                            <button
                              onClick={() => startEditingPost(post)}
                              className="flex-shrink-0 w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/30 hover:border-blue-400/50 rounded-lg transition-all duration-200 flex items-center justify-center group"
                              title="Edit post"
                            >
                              <svg
                                className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {formatDate(post.event_date)}
                          </span>
                        </div>

                        {/* Content - starts right after date */}
                        <div className="space-y-1">
                          <div className="relative">
                            <p
                              className={`text-gray-700 leading-relaxed whitespace-pre-wrap transition-all duration-300 font-[400] ${
                                !isExpanded && needsTruncation
                                  ? "line-clamp-6"
                                  : ""
                              }`}
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp:
                                  !isExpanded && needsTruncation ? 8 : "none",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {post.content}
                            </p>
                            {/* Fade gradient overlay - more aggressive */}
                            {!isExpanded && needsTruncation && (
                              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/55 to-transparent pointer-events-none" />
                            )}
                          </div>

                          {/* See More/Less Button - tighter spacing */}
                          {needsTruncation && (
                            <button
                              onClick={() => togglePostExpansion(post.id)}
                              className="inline-flex items-center gap-2 text-[#007377] hover:text-[#005c60] font-medium transition-colors duration-200 group mt-1 hover:cursor-pointer"
                            >
                              <span>
                                {isExpanded ? "Show Less" : "See More"}
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Images */}
                    <div className="lg:col-span-1 relative">
                      {post.image_urls &&
                      post.image_urls.length > 0 &&
                      post.image_urls.some(
                        (url) => url && url.trim() !== ""
                      ) ? (
                        <div className="relative p-6">
                          <div
                            className="relative bg-gray-50 rounded-xl overflow-hidden shadow-inner group h-80"
                            onMouseEnter={() => stopCarousel(post.id)}
                            onMouseLeave={() => {
                              if (post.image_urls.length > 1) {
                                startCarousel(post.id, post.image_urls.length);
                              }
                            }}
                          >
                            {/* Stacked images with fade effect */}
                            {post.image_urls.map((imageUrl, index) => {
                              const currentIndex =
                                currentImageIndex[post.id] || 0;
                              const isActive = index === currentIndex;

                              return (
                                <div
                                  key={index}
                                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                    isActive
                                      ? "opacity-100 z-10"
                                      : "opacity-0 z-0"
                                  }`}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`${post.title} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                  {/* Subtle gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                                </div>
                              );
                            })}

                            {/* Navigation arrows for multiple images */}
                            {post.image_urls.length > 1 && (
                              <>
                                <button
                                  onClick={() =>
                                    prevImageWithCarousel(
                                      post.id,
                                      post.image_urls.length
                                    )
                                  }
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    nextImageWithCarousel(
                                      post.id,
                                      post.image_urls.length
                                    )
                                  }
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}

                            {/* Image indicators */}
                            {post.image_urls.length > 1 && (
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                                {post.image_urls.map((_, index) => {
                                  const currentIndex =
                                    currentImageIndex[post.id] || 0;
                                  return (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        setCurrentImageIndex((prev) => ({
                                          ...prev,
                                          [post.id]: index,
                                        }));
                                        startCarousel(
                                          post.id,
                                          post.image_urls.length
                                        ); // Restart carousel
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentIndex
                                          ? "bg-white scale-125"
                                          : "bg-white/60 hover:bg-white/80"
                                      }`}
                                    />
                                  );
                                })}
                              </div>
                            )}

                            {/* Image counter */}
                            {post.image_urls.length > 1 && (
                              <div className="absolute top-3 right-3 z-20 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                                {(currentImageIndex[post.id] || 0) + 1} /{" "}
                                {post.image_urls.length}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[300px] lg:min-h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg
                              className="w-12 h-12 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-sm">No image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
