import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from '../axios'
import { Post } from "../components";

export const PostsByTag = () => {

  const { tag } = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    try {
      const { data } = await axios.get(`/tags/${tag}`);

      setPosts(data)
    } catch (err) {
      console.warn(err);
      alert(`Не удалось найти посты по тэгу ${tag}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPosts()
  }, [tag])

  if (isLoading) {
    return [...Array(5)].map((item, idx) => (
      <Post isLoading={true} key={idx} />
    ))
  }

  return <>
    <h2 style={{ fontSize: 45, color: 'blue' }}>
      #{tag}
    </h2>
    {
      posts.map((item) => {
        const { _id, title, createdAt, viewsCount, tags, imageUrl, user } = item;

        return <Post
          id={_id}
          key={_id}
          title={title}
          imageUrl={imageUrl ? `http://localhost:4444${imageUrl}` : ''}
          user={{
            avatarUrl: user.avatarUrl,
            fullName: user.fullName,
          }}
          createdAt={createdAt}
          viewsCount={viewsCount}
          commentsCount={3}
          tags={tags}
        />
      })
    }
  </>
};
