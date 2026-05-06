import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export const metadata = {
  title: "Blog · Career & Cover Letter Tips",
  description:
    "Free, practical advice on cover letters, resumes, and job searching from InstantCoverLetter.ai.",
};

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const fullPath = path.join(postsDir, file);
      const content = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(content);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString().slice(0, 10),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <main className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 py-16 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="text-indigo-300 hover:text-indigo-200 text-sm mb-8 inline-block transition"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white dark:text-white">
          Career & Cover Letter Blog
        </h1>
        <p className="text-slate-400 mb-12">
          Real, no-fluff advice on cover letters, resumes, and job searching.
        </p>

        {posts.length === 0 ? (
          <p className="text-slate-400">
            New posts coming soon. In the meantime, try the{" "}
            <Link href="/" className="text-indigo-300 hover:underline">
              free cover letter generator
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition"
              >
                <p className="text-xs text-slate-500 mb-2">{post.date}</p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm">{post.description}</p>
                <span className="inline-block mt-3 text-indigo-300 text-sm font-semibold">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}