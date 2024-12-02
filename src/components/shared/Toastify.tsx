"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const TostifyClient = dynamic(
  () => import("@/components/shared/ToastifyClient"),
  { ssr: false }
);

export default function Toastify() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return <>{show && <TostifyClient />}</>;
}
