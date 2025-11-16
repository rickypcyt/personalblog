import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">About Me</h1>
          <div className="prose prose-invert">
            <p className="text-gray-400 mb-4">
              Hello! I'm a passionate developer and writer who loves sharing knowledge about web development, design, and technology.
            </p>
            <p className="text-gray-400 mb-6">
              With over 5 years of experience in the industry, I've worked on various projects ranging from small business websites to large-scale web applications. I believe in clean, efficient code and user-centered design.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">My Skills</h2>
            <ul className="space-y-2 text-gray-400">
              <li>• Frontend Development (React, Next.js, TypeScript)</li>
              <li>• UI/UX Design</li>
              <li>• Backend Development (Node.js, Express)</li>
              <li>• Database Design</li>
              <li>• DevOps & Cloud Services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Get In Touch</h2>
            <p className="text-gray-400 mb-4">
              I'm always open to interesting projects and collaborations. Feel free to reach out if you'd like to work together or just say hello!
            </p>
            <Link 
              href="/contact" 
              className="inline-block mt-2 px-6 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
