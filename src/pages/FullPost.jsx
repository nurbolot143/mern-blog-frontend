import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";

export const FullPost = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setIsLoading(false)
    })
  }, [])

  console.log(data);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  const { _id, title, createdAt, viewsCount, text, tags, imageUrl, user } = data

  return (
    <>
      <Post
        id={_id}
        title={title}
        imageUrl={imageUrl}
        user={{
          avatarUrl: user.avatarUrl,
          fullName: user.fullName,
        }}
        createdAt={createdAt}
        viewsCount={viewsCount}
        commentsCount={3}
        tags={tags}
        isFullPost
      >
        <p>{text}</p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
