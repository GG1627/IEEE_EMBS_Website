import Footer from "../../components/layout/Footer";

export default function Blog() {
  const posts = [
    {
      date: "August 6, 2025",
      title: "Welcome to the Blog",
      body: "Here you'll find short summaries after every UF EMBS event and meeting, highlighting what we covered, explored, or accomplished. Whether you missed a GBM or just want a recap, check back here for all our latest updates!",
    },
    // Future posts can be added here
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 md:p-18">
        <h1 className="text-4xl font-bold text-[#00629b] mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-6 shadow-sm relative"
            >
              <span className="absolute top-4 right-6 text-sm text-gray-500">
                {post.date}
              </span>
              <h2 className="text-2xl font-semibold text-[#772583] mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{post.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
