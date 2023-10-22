import dynamic from "next/dynamic";

const HomeView = dynamic(() => import("../views/home"), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default function Home() {
  return <HomeView />
}