import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const content = fs.readFileSync(fullPath, "utf8");
  const { data, content: markdown } = matter(content);
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(markdown);

  return {
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date || "",
    contentHtml: processedContent.toString(),
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.description };
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/blog"
          className="text-indigo-300 hover:text-indigo-200 text-sm mb-8 inline-block transition"
        >
          ← All articles
        </Link>

        <article>
          <p className="text-xs text-slate-500 mb-3">{post!.date}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post!.title}
          </h1>
          <div
            className="article-content article-dark"
            dangerouslySetInnerHTML={{ __html: post!.contentHtml }}
          />
        </article>

        <div className="mt-16 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Need a cover letter right now?
          </h3>
          <p className="text-slate-300 mb-5">
            Generate a tailored one in seconds. Free, no signup.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            Try InstantCoverLetter.ai →
          </Link>
        </div>

      </div>
    </main>
  );
}