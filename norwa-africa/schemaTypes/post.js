export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    },
    {
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "ogImage",
      title: "OG Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "metaTitle",
      title: "Meta title",
      type: "string",
    },
    {
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    },
    {
      name: "isHighlight",
      title: "Highlight this post",
      type: "boolean",
      description: "Show this post in the highlights slider on the blog page.",
      initialValue: false,
    },
    {
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube/Vimeo link or direct MP4 URL.",
    },
    {
      name: "videoFile",
      title: "Video upload",
      type: "file",
      options: {
        accept: "video/*",
      },
    },
    {
      name: "body",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    },
  ],
}
