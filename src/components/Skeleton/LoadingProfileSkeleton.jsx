import React from "react";
import Skeleton from "@mui/material/Skeleton";

function LoadingProfileSkeleton() {
  return (
    <>
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        className="border border-l-amber-50"
      />
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        className="border border-l-amber-50"
      />
    </>
  );
}

export default LoadingProfileSkeleton;
