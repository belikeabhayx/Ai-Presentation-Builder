import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className="h-20 w-20">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </>
  );
}
