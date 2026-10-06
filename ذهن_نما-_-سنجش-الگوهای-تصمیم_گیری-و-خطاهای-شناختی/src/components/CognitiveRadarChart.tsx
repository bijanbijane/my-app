import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { UserProfile } from '../types';
import { Sparkles, Zap, Trophy } from 'lucide-react';

interface CognitiveRadarChartProps {
  profile: UserProfile;
}

interface RadarAxis {
  label: string;
  value: number; // 0 to 100
  color: string;
}

export const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({ profile }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Extract the 6 key dimensions for the mystical neon spiderweb
  const axes: RadarAxis[] = [
    {
      label: 'مکث طلایی',
      value: profile.constructs.cognitive_reflection?.trialsCount > 0 ? profile.constructs.cognitive_reflection.score : 50,
      color: '#f59e0b', // amber
    },
    {
      label: 'ردیاب منطق',
      value: profile.constructs.reasoning_accuracy?.trialsCount > 0 ? profile.constructs.reasoning_accuracy.score : 50,
      color: '#06b6d4', // cyan
    },
    {
      label: 'مدیریت ریسک',
      value: profile.constructs.decision_quality?.trialsCount > 0 ? profile.constructs.decision_quality.score : 50,
      color: '#10b981', // emerald
    },
    {
      label: 'انعطاف فکری',
      value: profile.constructs.cognitive_flexibility?.trialsCount > 0 ? profile.constructs.cognitive_flexibility.score : 50,
      color: '#a855f7', // purple
    },
    {
      label: 'تطابق ادعا',
      value: profile.constructs.metacognitive_calibration?.trialsCount > 0 ? profile.constructs.metacognitive_calibration.score : 50,
      color: '#ec4899', // pink
    },
    {
      label: 'هوش اجتماعی',
      value: profile.constructs.social_inference?.trialsCount > 0 ? profile.constructs.social_inference.score : 50,
      color: '#3b82f6', // blue
    },
  ];

  // Progression scaling based on level (1 to 6)
  const currentLevel = Math.max(1, Math.min(6, profile.level || 1));
  // Base radius expands as level increases:
  const levelRadiusMap = [82, 92, 104, 115, 126, 136];
  const dynamicRadius = levelRadiusMap[currentLevel - 1];

  // Neon glow parameters scale with level:
  const glowBlur = 4 + (currentLevel - 1) * 2.8;
  const glowOpacity = 0.25 + (currentLevel - 1) * 0.12;
  const strokeWidth = 2 + (currentLevel - 1) * 0.3;

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 380;
    const height = 350;
    const centerX = width / 2;
    const centerY = height / 2 - 4;
    const totalAxes = axes.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Clear previous drawings
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // SVG Filters for authentic multi-layered neon glow
    const defs = svg.append('defs');

    // 1. Neon Outer Glow filter
    const neonFilter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    neonFilter.append('feGaussianBlur').attr('stdDeviation', glowBlur).attr('result', 'coloredBlur');
    const feMerge = neonFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 2. High-intensity core glow
    const coreFilter = defs.append('filter').attr('id', 'neon-core').attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%');
    coreFilter.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'blur');
    const coreMerge = coreFilter.append('feMerge');
    coreMerge.append('feMergeNode').attr('in', 'blur');
    coreMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 3. Radial Gradient for Web Fill
    const radialGrad = defs
      .append('radialGradient')
      .attr('id', 'neon-web-grad')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    radialGrad.append('stop').attr('offset', '0%').attr('stop-color', '#38bdf8').attr('stop-opacity', glowOpacity * 1.1);
    radialGrad.append('stop').attr('offset', '65%').attr('stop-color', '#06b6d4').attr('stop-opacity', glowOpacity * 0.7);
    radialGrad.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', glowOpacity * 0.2);

    const g = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`);

    // Ambient background ring to emphasize level radiance
    g.append('circle')
      .attr('r', dynamicRadius + 8)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4')
      .attr('stroke-opacity', 0.08 * currentLevel)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '4,8')
      .style('filter', 'url(#neon-glow)');

    // Spiderweb Concentric Polygonal Levels (4 to 6 rings based on level)
    const webRings = 3 + Math.min(3, Math.floor(currentLevel / 2));
    for (let level = 1; level <= webRings; level++) {
      const levelRadius = (dynamicRadius / webRings) * level;
      const points: [number, number][] = [];

      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleSlice - Math.PI / 2;
        const x = levelRadius * Math.cos(angle);
        const y = levelRadius * Math.sin(angle);
        points.push([x, y]);
      }

      const isOutermost = level === webRings;
      g.append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', isOutermost ? '#38bdf8' : '#334155')
        .attr('stroke-opacity', isOutermost ? 0.6 : 0.35)
        .attr('stroke-width', isOutermost ? 1.5 : 0.8)
        .attr('stroke-dasharray', isOutermost ? 'none' : '4,4')
        .style('filter', isOutermost ? 'url(#neon-core)' : 'none');
    }

    // Radial Neon Spokes (from center to circumference)
    axes.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = dynamicRadius * Math.cos(angle);
      const y = dynamicRadius * Math.sin(angle);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#475569')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1);
    });

    // Calculate user cognitive score polygon
    const dataPoints: [number, number][] = axes.map((d, i) => {
      const r = (Math.max(15, d.value) / 100) * dynamicRadius;
      const angle = i * angleSlice - Math.PI / 2;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    // Outer Neon Shadow Area
    g.append('polygon')
      .attr('points', dataPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', 'url(#neon-web-grad)')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', strokeWidth + 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-opacity', glowOpacity)
      .style('filter', 'url(#neon-glow)');

    // Sharp Core Neon Polygon
    g.append('polygon')
      .attr('points', dataPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linejoin', 'round')
      .style('filter', 'url(#neon-core)');

    // Inner White Neon Fiber
    g.append('polygon')
      .attr('points', dataPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.8)
      .attr('stroke-linejoin', 'round');

    // Glowing Neon Vertex Nodes
    dataPoints.forEach(([x, y], i) => {
      const axis = axes[i];

      // Neon outer flare
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5 + currentLevel * 0.6)
        .attr('fill', axis.color)
        .attr('fill-opacity', 0.5)
        .style('filter', 'url(#neon-glow)');

      // Solid central neon bead
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 3)
        .attr('fill', '#ffffff')
        .attr('stroke', axis.color)
        .attr('stroke-width', 1.8);
    });

    // Axis Labels with Neon Highlights around circumference
    axes.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const labelRadius = dynamicRadius + 24;
      const x = labelRadius * Math.cos(angle);
      const y = labelRadius * Math.sin(angle);

      const labelGroup = g.append('g').attr('transform', `translate(${x}, ${y})`);

      labelGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10.5px')
        .attr('font-weight', '800')
        .attr('fill', '#e2e8f0')
        .text(d.label);

      labelGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', 14)
        .attr('font-size', '10px')
        .attr('font-weight', '900')
        .attr('fill', '#38bdf8')
        .text(`${d.value}٪`);
    });
  }, [profile, currentLevel, dynamicRadius, glowBlur, glowOpacity, strokeWidth]);

  return (
    <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/25 shadow-xl text-slate-100 relative overflow-hidden transition-all">
      {/* Dynamic Neon Ambient Glow that intensifies with level */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 blur-3xl"
        style={{
          width: `${dynamicRadius * 2.2}px`,
          height: `${dynamicRadius * 2.2}px`,
          backgroundColor: '#06b6d4',
          opacity: 0.04 * currentLevel,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1 relative z-10">
        <div>
          <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>شبکه تار عنکبوتی نئونی (D3.js)</span>
          </span>
          <h3 className="text-sm font-black text-slate-100 mt-0.5">
            میدان انرژی و توازن شناختی شما
          </h3>
        </div>

        {/* Level Progression Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-cyan-400" />
          <span>شعاع نئونی: سطح {currentLevel}</span>
        </div>
      </div>

      {/* D3 SVG Container */}
      <div className="flex items-center justify-center -my-2 relative z-10">
        <svg ref={svgRef} className="w-full max-w-[360px] h-auto overflow-visible select-none" />
      </div>

      {/* Footer Insight */}
      <div className="mt-2 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
        <span>با ارتقای سطح، این شبکه وسیع‌تر و درخشان‌تر می‌شود</span>
        <span className="text-cyan-400 font-bold tabular-nums">درخشش: {Math.round(currentLevel * 16.6)}٪</span>
      </div>
    </div>
  );
};
