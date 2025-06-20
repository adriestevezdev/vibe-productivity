import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-7xl mx-auto">
        <SignedOut>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to Vibe Productivity</h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your tasks into a vibrant voxel world
            </p>
            <p className="text-lg">
              Sign in or create an account to start building your productivity island
            </p>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to build your productivity world?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Tasks</h2>
                <p className="text-gray-600">Manage your tasks and see them come to life</p>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Pomodoro Timer</h2>
                <p className="text-gray-600">Track your focus time with the Pomodoro technique</p>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Achievements</h2>
                <p className="text-gray-600">Unlock rewards as you complete your goals</p>
              </div>
            </div>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}