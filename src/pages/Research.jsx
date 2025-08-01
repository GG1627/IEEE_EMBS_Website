export default function Research() {
  return (
    <div className="min-h-screen bg-white px-6 md:px-12">
      {/* Spacer to offset fixed navbar */}
      <div className="h-24"></div>  {/* 👈 pushes content down ~96px */}

      <h1 className="text-4xl font-bold text-[#00629b] mb-6">Research</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        Learn about how students at UF are diving into real-world biomedical research...
      </p>
    </div>
  );
}
