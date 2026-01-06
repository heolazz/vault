import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  className?: string;
}

const AudioVisualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      if (!isPlaying) return; // Stop drawing if paused

      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = 6; // LEBAR BAR DIPERBESAR BIAR KELIHATAN
      const gap = 2;
      const barCount = Math.floor(width / (barWidth + gap));
      const step = Math.floor(bufferLength / barCount);

      // WARNA MERAH MENYALA
      ctx.fillStyle = '#fa2d48'; 

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        // Scale tinggi bar agar lebih responsif
        const barHeight = (value / 255) * height * 1.5; 

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.beginPath();
        // Fallback untuk browser lama yang gak support roundRect
        if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        } else {
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    };

    if (isPlaying) {
        draw();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(animationId);
  }, [analyser, isPlaying]);

  return <canvas ref={canvasRef} className={className} width={300} height={100} />;
};

export default AudioVisualizer;