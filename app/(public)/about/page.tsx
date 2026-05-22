export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        About MohanJournal
      </h1>
      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-lg text-gray-600 leading-relaxed">
          MohanJournal is an open access academic journal platform dedicated
          to publishing high-quality peer-reviewed research across multiple
          disciplines.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our mission is to make academic research freely accessible to
          everyone, breaking down barriers between researchers and readers
          worldwide.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-10">
          For Authors
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Submit your research paper through our easy-to-use author portal.
          Our editorial team reviews every submission carefully and provides
          constructive feedback.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-10">
          Peer Review Process
        </h2>
        <p className="text-gray-600 leading-relaxed">
          All submitted papers undergo a rigorous peer review process.
          Our team of expert reviewers ensures the highest standards of
          academic quality.
        </p>
      </div>
    </div>
  )
}