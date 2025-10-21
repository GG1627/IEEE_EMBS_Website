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
  const [postType, setPostType] = useState("image"); // "image" or "video"
  const [videoLink, setVideoLink] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState("");

  // Edit states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editEventDate, setEditEventDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editPostType, setEditPostType] = useState("image");
  const [editVideoLink, setEditVideoLink] = useState("");
  const [editVideoThumbnail, setEditVideoThumbnail] = useState(null);
  const [editVideoThumbnailPreview, setEditVideoThumbnailPreview] =
    useState("");

  // Post expansion states
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  // Modal states
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // Handle video thumbnail upload
  const handleVideoThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Thumbnail too large (max 5MB)", {
        customColor: "#dc2626",
      });
      return;
    }

    setVideoThumbnail(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoThumbnailPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle edit video thumbnail upload
  const handleEditVideoThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Thumbnail too large (max 5MB)", {
        customColor: "#dc2626",
      });
      return;
    }

    setEditVideoThumbnail(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditVideoThumbnailPreview(e.target.result);
    };
    reader.readAsDataURL(file);
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

  // Upload video thumbnail to Supabase storage
  const uploadVideoThumbnail = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const filePath = `blog-images/thumbnails/${fileName}`;

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
      console.error("Error uploading video thumbnail:", error);
      throw error;
    }
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

    if (postType === "video" && !videoLink.trim()) {
      showSnackbar("Please provide a video link for video posts", {
        customColor: "#dc2626",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls = [];
      let thumbnailUrl = "";

      if (postType === "image") {
        if (postImages.length > 0) {
          imageUrls = await uploadImages(postImages);
        }
      } else if (postType === "video") {
        if (videoThumbnail) {
          thumbnailUrl = await uploadVideoThumbnail(videoThumbnail);
        }
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
            post_type: postType,
            video_link: postType === "video" ? videoLink.trim() : null,
            video_thumbnail: postType === "video" ? thumbnailUrl : null,
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
      setPostType("image");
      setVideoLink("");
      setVideoThumbnail(null);
      setVideoThumbnailPreview("");
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
    setEditPostType(post.post_type || "image");
    setEditVideoLink(post.video_link || "");
    setEditVideoThumbnail(null);
    setEditVideoThumbnailPreview(post.video_thumbnail || "");
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
    setEditPostType("image");
    setEditVideoLink("");
    setEditVideoThumbnail(null);
    setEditVideoThumbnailPreview("");
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

    if (editPostType === "video" && !editVideoLink.trim()) {
      showSnackbar("Please provide a video link for video posts", {
        customColor: "#dc2626",
      });
      return;
    }

    setIsEditing(true);
    try {
      let imageUrls = [...editImagePreviews];
      let thumbnailUrl = editVideoThumbnailPreview;

      if (editPostType === "image") {
        if (editImages.length > 0) {
          const newImageUrls = await uploadImages(editImages);
          imageUrls = [
            ...editImagePreviews.filter((url) => url.startsWith("http")),
            ...newImageUrls,
          ];
        }
      } else if (editPostType === "video") {
        if (editVideoThumbnail) {
          thumbnailUrl = await uploadVideoThumbnail(editVideoThumbnail);
        }
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title: editTitle.trim(),
          content: editContent.trim(),
          image_urls: imageUrls,
          event_date: new Date(editEventDate).toISOString(),
          updated_at: new Date().toISOString(),
          post_type: editPostType,
          video_link: editPostType === "video" ? editVideoLink.trim() : null,
          video_thumbnail: editPostType === "video" ? thumbnailUrl : null,
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

  // Modal functions
  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    // Disable body scroll
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPost(null);
    setShowModal(false);
    // Re-enable body scroll
    document.body.style.overflow = "unset";
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
      <div className="flex-1 pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
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
                    {/* Post Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Type *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="postType"
                            value="image"
                            checked={postType === "image"}
                            onChange={(e) => setPostType(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Image Post</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="postType"
                            value="video"
                            checked={postType === "video"}
                            onChange={(e) => setPostType(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Video Post</span>
                        </label>
                      </div>
                    </div>

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

                    {/* Image Upload - Only for Image Posts */}
                    {postType === "image" && (
                      <div className="group">
                        <label
                          htmlFor="post-image"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Images (Optional)
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
                    )}

                    {/* Video Fields - Only for Video Posts */}
                    {postType === "video" && (
                      <>
                        {/* Video Link */}
                        <div>
                          <label
                            htmlFor="video-link"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Video Link *
                          </label>
                          <input
                            id="video-link"
                            type="url"
                            required
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors"
                            placeholder="https://drive.google.com/file/d/..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Paste your Google Drive or other video sharing link
                          </p>
                        </div>

                        {/* Video Thumbnail Upload */}
                        <div className="group">
                          <label
                            htmlFor="video-thumbnail"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Video Thumbnail (Optional)
                          </label>
                          <div className="relative">
                            <input
                              id="video-thumbnail"
                              type="file"
                              accept="image/*"
                              onChange={handleVideoThumbnailUpload}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007377] focus:border-[#007377] transition-colors file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                          </div>
                          {videoThumbnailPreview && (
                            <div className="mt-3">
                              <img
                                src={videoThumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5MB. This will be the thumbnail shown for your
                            video.
                          </p>
                        </div>
                      </>
                    )}
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
                      setPostType("image");
                      setVideoLink("");
                      setVideoThumbnail(null);
                      setVideoThumbnailPreview("");
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
                        Maximum file size: 5MB per image. Select multiple files
                        to add more.
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
            <div className="space-y-6">
              {posts.map((post) => {
                const needsTruncation = shouldTruncate(post.content);
                const truncatedContent = needsTruncation
                  ? post.content.substring(0, 420) + "..."
                  : post.content;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px]">
                      {/* Left side - Images or Video Thumbnail */}
                      <div className="relative">
                        {post.post_type === "video" && post.video_thumbnail ? (
                          <div
                            className="relative h-80 lg:h-full min-h-[400px] bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] overflow-hidden group cursor-pointer"
                            onClick={() =>
                              window.open(post.video_link, "_blank")
                            }
                          >
                            <img
                              src={post.video_thumbnail}
                              alt={`${post.title} - Video Thumbnail`}
                              className="w-full h-full object-contain bg-transparent"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            {/* Video Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg
                                  className="w-8 h-8 text-gray-800 ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            {/* Video Tag */}
                            <div className="absolute top-3 left-3 bg-[#4c00c7] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                              VIDEO
                            </div>
                          </div>
                        ) : post.image_urls &&
                          post.image_urls.length > 0 &&
                          post.image_urls.some(
                            (url) => url && url.trim() !== ""
                          ) ? (
                          <div
                            className="relative h-80 lg:h-full min-h-[400px] bg-gradient-to-br from-[#772583]/60 to-[#00629b]/60 overflow-hidden group"
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
                                    className="w-full h-full object-contain bg-transparent"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                  {/* Subtle gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
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
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                                        );
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
                        ) : (
                          <div className="h-80 lg:h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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

                      {/* Right side - Content */}
                      <div className="p-8 flex flex-col justify-between">
                        <div className="space-y-2">
                          {/* Date and Reading Time */}
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="font-medium">
                              {formatDate(post.event_date)}
                            </span>
                            <span>•</span>
                            <span>
                              {Math.ceil(post.content.length / 450)} minute read
                            </span>
                          </div>

                          {/* Title with Edit Button */}
                          <div className="flex items-start justify-between gap-4">
                            <h2 className="text-5xl font-light text-gray-900 leading-tight flex-1 group-hover:text-[#007377] transition-colors">
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

                          {/* Content */}
                          <div className="space-y-3">
                            <div className="relative">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap italic font-light">
                                {truncatedContent}
                              </p>
                              {/* Fade gradient overlay */}
                              {needsTruncation && (
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                              )}
                            </div>

                            {/* See More Button */}
                            {needsTruncation && (
                              <div className="pt-0">
                                <div className="border-t border-gray-400 mb-2"></div>
                                <button
                                  onClick={() => openModal(post)}
                                  className="inline-flex items-center gap-1 text-[#007377] hover:text-[#005c60] font-medium transition-all duration-200 group text-sm"
                                >
                                  <span>Read More</span>
                                  <svg
                                    className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal for expanded post view */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-4xl font-light text-gray-900">
                {selectedPost.title}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
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
                    {formatDate(selectedPost.event_date)}
                  </span>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap italic font-light text-lg">
                    {selectedPost.content}
                  </p>
                </div>

                {/* Images or Video Thumbnail */}
                {selectedPost.post_type === "video" &&
                selectedPost.video_thumbnail ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Video
                    </h3>
                    <div
                      className="relative group cursor-pointer"
                      onClick={() =>
                        window.open(selectedPost.video_link, "_blank")
                      }
                    >
                      <img
                        src={selectedPost.video_thumbnail}
                        alt={`${selectedPost.title} - Video Thumbnail`}
                        className="w-full h-auto object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow bg-gray-50"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {/* Video Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg
                            className="w-8 h-8 text-gray-800 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Video Tag */}
                      <div className="absolute top-3 left-3 bg-[#4c00c7] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                        VIDEO
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedPost.image_urls &&
                  selectedPost.image_urls.length > 0 &&
                  selectedPost.image_urls.some(
                    (url) => url && url.trim() !== ""
                  ) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Images
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedPost.image_urls.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`${selectedPost.title} - Image ${index + 1}`}
                              className="w-full h-auto object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow bg-gray-50"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
