
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Moon, Sun, Zap, RotateCw } from 'lucide-react';

interface StarMap3DProps {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  userZodiac?: any;
  onMapGenerated?: () => void;
}

interface StarPosition {
  x: number;
  y: number;
  z: number;
  brightness: number;
  constellation: string;
  name: string;
  color: string;
}

interface PlanetPosition {
  x: number;
  y: number;
  z: number;
  name: string;
  sign: string;
  degree: number;
  color: string;
  size: number;
}

export default function StarMap3D({ birthDate, birthTime, birthPlace, userZodiac, onMapGenerated }: StarMap3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [stars, setStars] = useState<StarPosition[]>([]);
  const [planets, setPlanets] = useState<PlanetPosition[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [rotationX, setRotationX] = useState(-0.3);
  const [rotationY, setRotationY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  // Format birth date to dd/mm/yyyy
  const formatBirthDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const getZodiacSignFromDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const zodiacSigns = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
      'Thiên Bình', 'Hổ Cáp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0];
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1];
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2];
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3];
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4];
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5];
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6];
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7];
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8];
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9];
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10];
    return zodiacSigns[11];
  };

  const calculatePlanetPosition = (planetIndex: number, date: Date, hour: number, minute: number) => {
    const totalMinutes = hour * 60 + minute;
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

    // More accurate base calculation from birth date
    const yearsSince2000 = (date.getFullYear() - 2000) + (dayOfYear / 365.25);
    const baseAngle = (dayOfYear / 365.25) * Math.PI * 2;
    const timeOfDay = (totalMinutes / 1440) * Math.PI * 2;

    // More realistic orbital periods and starting positions
    const orbitalPeriods = [1, 0.24, 0.62, 1, 1.88, 11.86, 29.46, 84.01, 164.8];
    const startingAngles = [0, 1.2, 2.4, 0, 0.8, 5.2, 3.7, 1.1, 4.9]; // Different starting positions

    let planetAngle = (baseAngle / orbitalPeriods[planetIndex]) + startingAngles[planetIndex] + (yearsSince2000 * 0.1);

    // For Sun (index 0), adjust to match user's zodiac more accurately
    if (planetIndex === 0 && userZodiac) {
      const zodiacOrder = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
        'Thiên Bình', 'Hổ Cáp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];
      const userZodiacIndex = zodiacOrder.indexOf(userZodiac.name);
      if (userZodiacIndex !== -1) {
        // Position Sun in the middle of user's zodiac sign
        planetAngle = (userZodiacIndex * 30 + 15) * (Math.PI / 180) + (timeOfDay * 0.05);
      }
    }

    const distances = [180, 140, 160, 200, 240, 300, 360, 420, 480];
    const radius = distances[planetIndex];

    const inclination = Math.sin(planetAngle + planetIndex * 0.3) * 0.25;

    return {
      x: Math.cos(planetAngle) * radius,
      y: Math.sin(inclination) * 50,
      z: Math.sin(planetAngle) * radius,
      degree: Math.floor(((planetAngle * 180 / Math.PI) % 360 + 360) % 360)
    };
  };

  const generateStarMap = () => {
    const date = new Date(birthDate);
    const [hour, minute] = birthTime.split(':').map(Number);

    const newStars: StarPosition[] = [];
    const constellations = [
      { name: 'Bạch Dương', stars: 8, region: 0 },
      { name: 'Kim Ngưu', stars: 10, region: 1 },
      { name: 'Song Tử', stars: 7, region: 2 },
      { name: 'Cự Giải', stars: 6, region: 3 },
      { name: 'Sư Tử', stars: 12, region: 4 },
      { name: 'Xử Nữ', stars: 9, region: 5 },
      { name: 'Thiên Bình', stars: 5, region: 6 },
      { name: 'Hổ Cáp', stars: 8, region: 7 },
      { name: 'Nhân Mã', stars: 11, region: 8 },
      { name: 'Ma Kết', stars: 6, region: 9 },
      { name: 'Bảo Bình', stars: 7, region: 10 },
      { name: 'Song Ngư', stars: 5, region: 11 }
    ];

    constellations.forEach((constellation, constIndex) => {
      const regionAngle = (constIndex / 12) * Math.PI * 2;
      const regionRadius = 500 + Math.random() * 100;

      for (let i = 0; i < constellation.stars; i++) {
        const starAngle = regionAngle + (Math.random() - 0.5) * 0.8;
        const radius = regionRadius + (Math.random() - 0.5) * 80;
        const height = (Math.random() - 0.5) * 60;

        newStars.push({
          x: Math.cos(starAngle) * radius,
          y: height,
          z: Math.sin(starAngle) * radius,
          brightness: 0.5 + Math.random() * 0.5,
          constellation: constellation.name,
          name: `${constellation.name} ${i + 1}`,
          color: ['#ffffff', '#ffe4b5', '#87ceeb', '#ffd700'][Math.floor(Math.random() * 4)]
        });
      }
    });

    const planetData = [
      { name: 'Mặt Trời', color: '#ffd700', size: 14 },
      { name: 'Mặt Trăng', color: '#e6e6fa', size: 10 },
      { name: 'Thủy Tinh', color: '#87ceeb', size: 6 },
      { name: 'Kim Tinh', color: '#ffc0cb', size: 8 },
      { name: 'Hỏa Tinh', color: '#ff4500', size: 7 },
      { name: 'Mộc Tinh', color: '#daa520', size: 12 },
      { name: 'Thổ Tinh', color: '#b8860b', size: 11 },
      { name: 'Thiên Vương', color: '#4169e1', size: 7 },
      { name: 'Hải Vương', color: '#0000cd', size: 7 }
    ];

    const zodiacSigns = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
      'Thiên Bình', 'Hổ Cáp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];

    const newPlanets: PlanetPosition[] = planetData.map((planet, index) => {
      const position = calculatePlanetPosition(index, date, hour, minute);

      let planetSign;
      if (index === 0 && userZodiac) {
        // Sun (Mặt Trời) must always be in the user's actual zodiac sign
        planetSign = userZodiac.name;
      } else {
        // For other planets, use calculated sign
        const signIndex = Math.floor((position.degree + 15) / 30) % 12;
        planetSign = zodiacSigns[signIndex];
      }

      return {
        x: position.x,
        y: position.y,
        z: position.z,
        name: planet.name,
        sign: planetSign,
        degree: position.degree,
        color: planet.color,
        size: planet.size
      };
    });

    setStars(newStars);
    setPlanets(newPlanets);

    setTimeout(() => {
      setIsGenerating(false);
      onMapGenerated?.();
    }, 800);
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fov = 1000;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height) / 2);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.6, '#0f0a2e');
    gradient.addColorStop(1, '#0a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const nebulaGradient = ctx.createRadialGradient(centerX * 0.7, centerY * 0.3, 0, centerX * 0.7, centerY * 0.3, 300);
    nebulaGradient.addColorStop(0, 'rgba(148, 87, 235, 0.08)');
    nebulaGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
    nebulaGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = nebulaGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const constellationGroups = new Map<string, any[]>();
    stars.forEach(star => {
      const rotatedX = star.x * Math.cos(rotationY) - star.z * Math.sin(rotationY);
      const rotatedZ = star.x * Math.sin(rotationY) + star.z * Math.cos(rotationY);
      const rotatedY = star.y * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
      const finalZ = star.y * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);

      if (finalZ > -400) {
        const screenX = centerX + (rotatedX * fov) / (finalZ + fov);
        const screenY = centerY + (rotatedY * fov) / (finalZ + fov);

        const starWithScreen = {
          ...star,
          screenX,
          screenY,
          finalZ,
          distance: Math.abs(finalZ)
        };

        if (!constellationGroups.has(star.constellation)) {
          constellationGroups.set(star.constellation, []);
        }
        constellationGroups.get(star.constellation)?.push(starWithScreen);
      }
    });

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    constellationGroups.forEach((starsInConstellation) => {
      if (starsInConstellation.length >= 3) {
        const visibleStars = starsInConstellation.filter(s =>
          s.screenX > 0 && s.screenX < canvas.width && s.screenY > 0 && s.screenY < canvas.height
        );

        if (visibleStars.length >= 2) {
          const sortedStars = visibleStars.sort((a, b) => a.screenX - b.screenX);
          ctx.beginPath();
          ctx.moveTo(sortedStars[0].screenX, sortedStars[0].screenY);

          for (let i = 1; i < Math.min(5, sortedStars.length); i++) {
            const distance = Math.sqrt(
              Math.pow(sortedStars[i].screenX - sortedStars[i - 1].screenX, 2) +
              Math.pow(sortedStars[i].screenY - sortedStars[i - 1].screenY, 2)
            );

            if (distance < 150) {
              ctx.lineTo(sortedStars[i].screenX, sortedStars[i].screenY);
            } else {
              ctx.moveTo(sortedStars[i].screenX, sortedStars[i].screenY);
            }
          }
          ctx.stroke();
        }
      }
    });

    stars.forEach(star => {
      const rotatedX = star.x * Math.cos(rotationY) - star.z * Math.sin(rotationY);
      const rotatedZ = star.x * Math.sin(rotationY) + star.z * Math.cos(rotationY);
      const rotatedY = star.y * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
      const finalZ = star.y * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);

      if (finalZ > -500) {
        const screenX = centerX + (rotatedX * fov) / (finalZ + fov);
        const screenY = centerY + (rotatedY * fov) / (finalZ + fov);
        const distance = Math.abs(finalZ);
        const size = Math.max(1, (star.brightness * 4) / (1 + distance / 600));

        if (size > 0.8 && screenX > -100 && screenX < canvas.width + 100 && screenY > -100 && screenY < canvas.height + 100) {
          const glowSize = size * 6;
          const glowGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowSize);
          glowGradient.addColorStop(0, star.color + 'CC');
          glowGradient.addColorStop(0.3, star.color + '80');
          glowGradient.addColorStop(0.7, star.color + '40');
          glowGradient.addColorStop(1, 'transparent');

          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.min(1, star.brightness * (1 - distance / 1000));
          ctx.fill();

          if (star.brightness > 0.6) {
            const time = Date.now() * 0.002;
            const twinkle = Math.sin(time + finalZ * 0.01) * 0.4 + 0.8;
            ctx.globalAlpha = twinkle * 0.6;
            ctx.beginPath();
            ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = 1;
        }
      }
    });

    planets.forEach((planet, planetIndex) => {
      const rotatedX = planet.x * Math.cos(rotationY) - planet.z * Math.sin(rotationY);
      const rotatedZ = planet.x * Math.sin(rotationY) + planet.z * Math.cos(rotationY);
      const rotatedY = planet.y * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
      const finalZ = planet.y * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);

      if (finalZ > -700) {
        const screenX = centerX + (rotatedX * fov) / (finalZ + fov);
        const screenY = centerY + (rotatedY * fov) / (finalZ + fov);
        const distance = Math.abs(finalZ);
        const size = Math.max(5, (planet.size * 3) / (1 + distance / 400));

        const isSelected = selectedPlanet === planet.name;

        if (size > 3) {
          const orbitRadius = Math.sqrt(rotatedX * rotatedX + rotatedZ * rotatedZ) * fov / (finalZ + fov);
          if (orbitRadius > 15 && orbitRadius < canvas.width * 0.8) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = planet.color + (isSelected ? '60' : '20');
            ctx.lineWidth = isSelected ? 3 : 1.5;
            ctx.setLineDash(isSelected ? [] : [5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          const auraSize = isSelected ? size * 8 : size * 5;
          const auraGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, auraSize);
          auraGradient.addColorStop(0, planet.color + (isSelected ? 'AA' : '60'));
          auraGradient.addColorStop(0.4, planet.color + (isSelected ? '60' : '30'));
          auraGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = auraGradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, auraSize, 0, Math.PI * 2);
          ctx.fill();

          const bodyGradient = ctx.createRadialGradient(
            screenX - size * 0.4,
            screenY - size * 0.4,
            0,
            screenX,
            screenY,
            size * 1.2
          );
          bodyGradient.addColorStop(0, planet.color);
          bodyGradient.addColorStop(0.5, planet.color + 'EE');
          bodyGradient.addColorStop(0.8, planet.color + 'BB');
          bodyGradient.addColorStop(1, planet.color + '77');

          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = bodyGradient;
          ctx.fill();

          const highlightGradient = ctx.createRadialGradient(
            screenX - size * 0.3,
            screenY - size * 0.3,
            0,
            screenX - size * 0.3,
            screenY - size * 0.3,
            size * 0.8
          );
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
          highlightGradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(screenX - size * 0.3, screenY - size * 0.3, size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = highlightGradient;
          ctx.fill();

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, size + 4, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            const time = Date.now() * 0.003;
            for (let i = 0; i < 3; i++) {
              const pulseSize = size + 10 + i * 5 + Math.sin(time + i) * 4;
              ctx.beginPath();
              ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
              ctx.strokeStyle = planet.color + Math.floor(60 / (i + 1)).toString(16);
              ctx.lineWidth = 2 - i * 0.5;
              ctx.stroke();
            }
          }

          if (size > 6) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.min(20, size + 8)}px Be Vietnam Pro`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            const labelY = screenY + size + 30;
            ctx.fillText(planet.name, screenX, labelY);

            ctx.fillStyle = '#dddddd';
            ctx.font = `${Math.min(16, size + 4)}px Be Vietnam Pro`;
            ctx.fillText(`${planet.sign}`, screenX, labelY + 22);

            ctx.fillStyle = '#cccccc';
            ctx.font = `${Math.min(14, size + 2)}px Be Vietnam Pro`;
            ctx.fillText(`${planet.degree}°`, screenX, labelY + 40);

            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
        }
      }
    });

    ctx.globalAlpha = 1;
  };

  const animate = () => {
    if (autoRotate && !mouseRef.current.isDown) {
      setRotationY(prev => prev + 0.003);
    }
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return;

    const deltaX = e.clientX - mouseRef.current.x;
    const deltaY = e.clientY - mouseRef.current.y;

    setRotationY(prev => prev + deltaX * 0.008);
    setRotationX(prev => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev + deltaY * 0.008)));

    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
    setTimeout(() => setAutoRotate(true), 3000);
  };

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(selectedPlanet === planetName ? null : planetName);
  };

  const resetView = () => {
    setRotationX(-0.3);
    setRotationY(0);
    setSelectedPlanet(null);
    setAutoRotate(true);
  };

  useEffect(() => {
    if (mounted) {
      generateStarMap();
    }
  }, [birthDate, birthTime, birthPlace, userZodiac, mounted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    if (stars.length > 0 || planets.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, planets, rotationX, rotationY, autoRotate, selectedPlanet, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="bg-[#0a0a2e] rounded-2xl p-6 border border-gray-700/40 backdrop-blur-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <h3 className=" text-md md:text-xl font-bold text-white flex items-center min-w-0">
            <Star className="w-5 h-5 mr-2 text-yellow-400 shrink-0" />
            <span className="truncate">Bản đồ sao 3D - {birthPlace}</span>
          </h3>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Nút đặt lại góc nhìn */}
            <button onClick={resetView} className="p-2 sm:px-3 sm:py-2 bg-gray-800/80 rounded-lg border border-gray-600/50 text-white transition-all">
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline ml-2 text-sm">Đặt lại</span>
            </button>

            {/* Nút xoay */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg border transition-all ${autoRotate ? 'bg-blue-600/80 border-blue-500' : 'bg-gray-800/80 border-gray-600'
                }`}
            >
              <Zap className={`w-4 h-4 ${autoRotate ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline ml-2 text-sm">
                {autoRotate ? 'Tự động' : 'Thủ công'}
              </span>
            </button>
          </div>
        </div>

        {/* Bản đồ sao 3D */}
        <div className="relative rounded-xl overflow-hidden border border-gray-600/40 bg-[#0a0a2e]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto cursor-grab active:cursor-grabbing block"
            style={{
              width: '100%',
              // height: '800px',
              // minHeight: '800px'
              height: 'clamp(400px, 70vh, 800px)', 
              minHeight: '400px'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <Star className="w-20 h-20 text-yellow-400" />
                </motion.div>
                <p className="text-white font-bold text-xl mb-2">Đang tạo bản đồ sao...</p>
                <p className="text-gray-400 text-sm">Tính toán vị trí chính xác các hành tinh và chòm sao</p>
                <div className="mt-4 w-32 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-blue-500"
                    animate={{ x: ['100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-gray-800/95 backdrop-blur-md rounded-lg p-4 border border-gray-600/60">
            <p className="text-xs text-gray-200 font-semibold mb-3">🎮 Điều khiển bản đồ</p>
            <div className="space-y-1 text-xs text-gray-300">
              <p>• <span className="text-blue-300">Kéo chuột</span> để xoay góc nhìn</p>
              <p>• <span className="text-green-300">Click hành tinh</span> để chọn</p>
              <p>• <span className="text-yellow-300">Thả chuột</span> để tự động xoay</p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-gray-800/95 backdrop-blur-md rounded-lg px-4 py-2 border border-gray-600/60">
            <p className="text-sm text-gray-200 font-medium">
              ⭐ {planets.length} hành tinh • 🌟 {stars.length} vì sao • ✨ {Math.round(stars.length / 12)} chòm sao
            </p>
          </div>

          {selectedPlanet && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 left-4 bg-gray-800/95 backdrop-blur-md rounded-lg p-4 border border-gray-600/60 max-w-xs"
            >
              {(() => {
                const planet = planets.find(p => p.name === selectedPlanet);
                if (!planet) return null;

                return (
                  <div>
                    <div className="flex items-center mb-2">
                      <div
                        className="w-6 h-6 rounded-full mr-2 border"
                        style={{ backgroundColor: planet.color, borderColor: planet.color + 'AA' }}
                      />
                      <h4 className="text-sm font-bold text-white">{planet.name}</h4>
                    </div>
                    <div className="space-y-1 text-xs text-gray-300">
                      <p><span className="text-yellow-300">Cung:</span> {planet.sign}</p>
                      <p><span className="text-blue-300">Độ:</span> {planet.degree}°</p>
                      <p className="text-gray-400 mt-2">Click để bỏ chọn</p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>

        {/* Thông tin ngày sinh */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center mb-2">
              <Sun className="w-5 h-5 text-orange-400 mr-2" />
              <p className="text-gray-300 font-medium">Ngày sinh</p>
            </div>
            <p className="text-white font-bold text-sm md:text-lg">{formatBirthDate(birthDate)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center mb-2">
              <Moon className="w-5 h-5 text-blue-400 mr-2" />
              <p className="text-gray-300 font-medium">Giờ sinh</p>
            </div>
            <p className="text-white font-bold text-sm md:text-lg">{birthTime}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-purple-400 mr-2" />
              <p className="text-gray-300 font-medium">Vị trí</p>
            </div>
            <p className="text-white font-bold text-sm md:text-lg">{birthPlace}</p>
          </div>
        </div>

        {!isGenerating && planets.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Các Hành Tinh Trong Bản Đồ Sao
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {planets.map((planet, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePlanetClick(planet.name)}
                  className={`bg-gray-800/60 hover:bg-gray-700/60 rounded-lg p-3 border transition-all cursor-pointer ${selectedPlanet === planet.name
                    ? 'border-white shadow-lg'
                    : 'border-gray-600/30 hover:border-gray-500/50'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-5 h-5 rounded-full mb-2 border"
                      style={{
                        backgroundColor: planet.color,
                        borderColor: planet.color + 'CC',
                        boxShadow: selectedPlanet === planet.name ? `0 0 12px ${planet.color}80` : 'none'
                      }}
                    />
                    <span className="text-white font-medium text-sm mb-1">{planet.name}</span>
                    <div className="text-xs text-gray-400 text-center">
                      <p>{planet.sign}</p>
                      <p>{planet.degree}°</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
