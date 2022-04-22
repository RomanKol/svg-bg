import { useEffect, useState, useMemo } from "react";

function addToPoint(p1, p2) {
    return p1.map((v, i) => v + p2[i]);
}

function subtractFromPoint(p1, p2) {
    return p1.map((v, i) => v - p2[i]);
}

function rand(min = 0, max = 512) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomPositions(length = 4) {
    return Array.from({ length }).map(() => [
      rand(window.innerWidth * -0.1, window.innerWidth * 1.1),
      rand(window.innerHeight * -0.1, window.innerHeight * 1.1),
    ]);
  }

function useGenerateThingAttributes() {
    const size = useMemo(() => rand(0, 10), []);
    const [start, center, offset, end] = useMemo(generateRandomPositions, []);

    const d = useMemo(() => {
        return [
            'M', start,
            'C', start,
            subtractFromPoint(center, offset),
            center,
            addToPoint(center, offset),
            end,
            end,
        ].join(' ');
    }, []);

    return {size, start, center, offset, end, d};
}

function Thing() {
    const color = useMemo(() => `--c${rand(1, 6)}`, [])
    const {size, start, d} = useGenerateThingAttributes();
    const {size: size2, start: start2, d: d2} = useGenerateThingAttributes();

    return <>
        <path d={d} strokeWidth={0.5 * size} stroke={`var(${color})`} fill="none" />
        <circle cx={start[0]} cy={start[1]} r={1 * size} fill={`var(${color})`} />
    </>
}

export function App() {
    const [{ width, height }, setViewport] = useState({ width: 100, height: 100 });
    const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);
    const [length, setLength] = useState(10);

    useEffect(() => {
      function handleResize() {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });

        setLength(window.innerHeight * window.innerWidth / 100000)
      }

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);


  return <svg viewBox={viewBox} width={width} height={height} style={{backgroundColor: `var(--bg)`}}>
    {Array.from({length}, (_,i) => i).map((key) => <Thing key={key} />)}
  </svg>;
}