import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogIndexClient from "../components/BlogIndexClient";

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
  return <BlogIndexClient posts={posts} />;
}