import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

let client = require("contentful").createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN_API,
});

export async function getStaticPaths() {
  let data = await client.getEntries({
    content_type: "article",
  });
  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let data = await client.getEntries({
    content_type: "article",
    "fields.slug": params.slug,
  });

  return {
    props: {
      article: data.items[0],
    },
    revalidate: 1,
  };
}

export default function Article({ article }) {
  if (!article) return <div>404: not found</div>;
  return (
    <div className={styles.container}>
      <h1>{article.fields.title}</h1>
      <div className={styles.container}>
        {documentToReactComponents(article.fields.content, {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => (
              <Image
                src={"https:" + node.data.target.fields.file.url}
                width={node.data.target.fields.file.details.image.width}
                height={node.data.target.fields.file.details.image.height}
              />
            ),
          },
        })}
      </div>
    </div>
  );
}
