"use client";
import dynamic from "next/dynamic";
import Loader from "src/components/loader";

const HomeView = dynamic(() => import("../views/home"), {
  ssr: false,
  loading: () => <Loader />
});

export default function Home() {
  return <HomeView />
}
