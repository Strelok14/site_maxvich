"use client";

import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (err) {
        console.error('Error loading videos:', err);
      }
    };
    load();
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <section id="videos" className="section-padding bg-white">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase text-primary-500">Видео</p>
          <h2 className="heading-2">Наши работы — видео</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id} className="rounded-lg overflow-hidden shadow-lg bg-white">
              <video controls className="w-full h-56 object-cover bg-black">
                <source src={video.videoUrl} />
                Ваш браузер не поддерживает видео.
              </video>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 mt-2">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
