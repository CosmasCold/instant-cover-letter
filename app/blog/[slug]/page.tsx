import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { notFound } from "next/navigation";
import BlogPostClient from "../../components/BlogPostClient";

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
  return <BlogPostClient post={post!} />;
}