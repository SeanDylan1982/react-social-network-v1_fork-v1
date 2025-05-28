import { fetchPosts } from "../../api/PostApi";
import SuspenseWrapper from "../../shared/SuspenseWrapper";
import { IPost } from "../../types/PostInterfaces";
//@ts-ignore
import { lazy, useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import SmallSpinner from "../../shared/SmallSpinner";
interface PostsListProps {
  data: IPost[];
  refetch: any;
}
const Post = lazy(() => import("./Post" /* webpackChunkName: "Post" */));
const PostsList = () => {
  const { data: postsData, isLoading, error } = useQuery(["posts"], fetchPosts, {
    onSuccess: (data) => {
      console.log('Query succeeded with data:', data);
    },
    onError: (err) => {
      console.error('Query failed with error:', err);
    }
  });

  if (isLoading) {
    return <SmallSpinner />;
  }

  if (error) {
    console.error('Error in PostsList:', error);
    return <div>Error loading posts</div>;
  }  console.log('PostsData:', postsData);
  const posts = postsData?.data || [];

  return (
    <div className="flex items-center justify-center flex-wrap w-full flex-col">
      <SuspenseWrapper>
        {Array.isArray(posts) ? (
          posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center p-4 text-gray-600">No posts found</div>
          )
        ) : (
          <div className="text-center p-4 text-red-600">Error loading posts</div>
        )}
      </SuspenseWrapper>
    </div>
  );
};

export default PostsList;
