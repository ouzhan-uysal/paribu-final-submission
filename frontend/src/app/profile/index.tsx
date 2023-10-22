import dynamic from "next/dynamic";

const ProfileView = dynamic(() => import("../../views/profile"), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default function Profile() {
  return <ProfileView />
}