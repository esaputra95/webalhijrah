"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

const RequestUpdate = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Redirect to the form page with id as search param
    router.push(`/submissions/requests/form?id=${id}`);
  }, [id, router]);

  return null;
};

export default RequestUpdate;
