"use client";

import { useState } from "react";

const Page = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  return (
    <div>
      {bookmarkedBooks && bookmarkedBooks.length > 0 ? (
        ""
      ) : (
        <div className="flex items-center justify-center mt-10">
          Nothing here yet.
        </div>
      )}
    </div>
  );
};

export default Page;
