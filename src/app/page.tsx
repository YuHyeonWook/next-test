"use client";

import BreakoutGame from "@/components/PhaserGame";

export default function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">벽돌 부수기 게임</h1>
      <BreakoutGame />
      <p className="mt-4 text-gray-600">마우스를 사용하여 패들을 움직이세요</p>
    </div>
  );
}
