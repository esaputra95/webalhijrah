"use client";
import { PostTable } from "@/features/posts";
import { useDeletePost, usePosts } from "@/hooks/masters/usePosts";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { PostType } from "@/types/postSchema";
import TitleContent from "@/components/layouts/TitleContent";
import { useRouter } from "next/navigation";
import { confirmDelete } from "@/lib/confirmDelete";

const Posts = () => {
  const router = useRouter();
  const { data, isLoading, isError } = usePosts();
  const deletePost = useDeletePost();

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data Post - " + isError);
    }
  }, [isError]);

  const onUpdate = (data?: PostType) => {
    if (data?.id) {
      router.push(`/admins/articles/${data.id}?mode=update`);
    }
  };

  const onView = (data?: PostType) => {
    if (data?.id) {
      router.push(`/admins/articles/${data.id}?mode=view`);
    }
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    confirmDelete(
      () =>
        new Promise<void>((resolve, reject) => {
          deletePost.mutate(
            { id },
            {
              onSuccess: () => resolve(),
              onError: (err) => reject(err),
            }
          );
        }),
      {
        text: "Data ini akan dihapus permanen!",
        successMessage: "Data berhasil dihapus!",
      }
    );
  };

  return (
    <div className="p-4">
      <TitleContent
        titleButton="+ Artikel"
        title="Daftar Artikel"
        onClickButton={() => router.push("/admins/articles/create")}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <PostTable
          data={data?.data}
          isLoading={isLoading}
          totalPages={data?.metaData?.totalPage}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onView={onView}
        />
      </div>
    </div>
  );
};

export default Posts;
