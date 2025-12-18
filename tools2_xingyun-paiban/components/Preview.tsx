
import React, { useMemo, useRef } from 'react';
import { Theme, GuideStyleId } from '../types';

interface PreviewProps {
  content: string;
  leadIn: string;
  outro: string;
  leadInStyle: GuideStyleId;
  outroStyle: GuideStyleId;
  theme: Theme;
}

const Preview: React.FC<PreviewProps> = ({ content, leadIn, outro, leadInStyle, outroStyle, theme }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const parsedHTML = useMemo(() => {
    let html = content;
    const { primaryColor, secondaryColor, bgColor, textColor, fontFamily, headerLayout, quoteLayout, listStyle } = theme;

    const renderGuide = (text: string, style: GuideStyleId, isLeadIn: boolean) => {
      if (!text) return '';
      const margin = isLeadIn ? 'margin-bottom: 40px;' : 'margin-top: 40px;';
      const baseStyle = `font-family: ${fontFamily}; font-size: 14px; line-height: 1.6; text-align: center; ${margin}`;

      switch (style) {
        case 'dashed':
          return `<section style="${baseStyle} border: 2px dashed ${primaryColor}44; padding: 20px; border-radius: 12px; background: ${primaryColor}08; color: ${primaryColor}; font-weight: bold;">${text}</section>`;
        case 'glass':
          return `<section style="${baseStyle} background: #ffffff; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); padding: 25px; border-radius: 20px; color: ${textColor}; position: relative; overflow: hidden;"><div style="position: absolute; top:0; left:0; width: 4px; height: 100%; background: ${primaryColor};"></div>${text}</section>`;
        case 'badge':
          return `<section style="${baseStyle} margin-top: 20px;"><span style="background: ${primaryColor}; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 900; letter-spacing: 1px; display: inline-block; margin-bottom: 10px;">PREMIUM CONTENT</span><div style="color: ${textColor}; font-weight: 500;">${text}</div></section>`;
        case 'modern-line':
          return `<section style="${baseStyle} display: flex; align-items: center; gap: 15px;"><div style="flex:1; height: 1px; background: ${primaryColor}33;"></div><div style="color: ${primaryColor}; font-weight: bold; letter-spacing: 1px;">${text}</div><div style="flex:1; height: 1px; background: ${primaryColor}33;"></div></section>`;
        case 'gradient-pill':
          return `<section style="${baseStyle} background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); color: #fff; padding: 15px 30px; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 12px ${primaryColor}33;">${text}</section>`;
        case 'brackets':
          return `<section style="${baseStyle} color: ${primaryColor}; font-weight: bold; font-size: 16px;">〔 ${text} 〕</section>`;
        case 'classic-double':
          return `<section style="${baseStyle} border-top: 1px solid ${primaryColor}; border-bottom: 1px solid ${primaryColor}; padding: 10px 0; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 2px;">${text}</section>`;
        case 'end-mark':
          return `<section style="${baseStyle} display: flex; flex-direction: column; align-items: center; gap: 10px;"><div style="width: 40px; height: 2px; background: ${primaryColor};"></div><div style="font-weight: 900; color: ${primaryColor}; letter-spacing: 4px;">THE END</div><div style="color: ${textColor}88;">${text}</div></section>`;
        case 'qr-card':
          return `<section style="${baseStyle} background: ${secondaryColor}33; border-radius: 16px; padding: 30px; display: flex; flex-direction: column; align-items: center;"><div style="width: 80px; height: 80px; border: 2px solid ${primaryColor}; border-radius: 8px; margin-bottom: 15px; display: flex; items-center; justify-center; color: ${primaryColor}; font-size: 8px;">QR CODE</div><div style="font-weight: bold; color: ${textColor};">${text}</div></section>`;
        case 'color-block':
          return `<section style="${baseStyle} background: ${primaryColor}; color: #fff; padding: 40px 20px; margin-left: -20px; margin-right: -20px; font-weight: bold;">${text}</section>`;
        case 'handwritten':
          return `<section style="${baseStyle} font-style: italic; color: ${primaryColor}; font-size: 18px; border-bottom: 1px solid ${primaryColor}33; padding-bottom: 15px; display: inline-block; width: 100%;">${text}</section>`;
        case 'pastel':
          return `<section style="${baseStyle} background: ${secondaryColor}; color: ${primaryColor}; padding: 12px 20px; border-radius: 12px 12px 0 12px; display: inline-block; font-weight: bold; box-shadow: 4px 4px 0 ${primaryColor}22;">${text}</section>`;
        case 'separator':
          return `<section style="${baseStyle} color: ${textColor}88; letter-spacing: 5px;">•••••<br>${text}<br>•••••</section>`;
        case 'simple':
        default:
          return `<section style="${baseStyle} color: ${textColor}88;">${text}</section>`;
      }
    };

    const getHeadingStyle = (level: number, text: string) => {
      let base = `margin: 30px 0 20px; font-weight: bold; font-family: ${fontFamily}; line-height: 1.4; `;
      if (level === 1) {
        if (headerLayout === 'pill') return `<section style="text-align: center; margin: 40px 0;"><span style="${base} font-size: 24px; background: ${primaryColor}; color: #fff; padding: 12px 30px; border-radius: 50px; display: inline-block; box-shadow: 4px 4px 0px ${secondaryColor}; border: 2px solid ${primaryColor};">${text}</span></section>`;
        if (headerLayout === 'double-line') return `<section style="border-top: 4px double ${primaryColor}; border-bottom: 1px solid ${primaryColor}; padding: 15px 0; text-align: center; margin: 30px 0;"><h1 style="${base} font-size: 26px; color: ${primaryColor}; margin:0; text-transform: uppercase; letter-spacing: 2px;">${text}</h1></section>`;
        if (headerLayout === 'terminal') return `<section style="${base} font-size: 18px; color: ${primaryColor}; border: 1px solid ${primaryColor}; padding: 15px; background: ${secondaryColor}22; border-radius: 4px;">$ root: ${text}_</section>`;
        return `<h1 style="${base} font-size: 24px; color: ${primaryColor}; border-bottom: 3px solid ${primaryColor}; display: inline-block; padding-bottom: 5px;">${text}</h1>`;
      }
      if (level === 2) {
        return `<section style="border-left: 8px solid ${primaryColor}; padding-left: 15px; background: ${primaryColor}11; padding-top: 10px; padding-bottom: 10px; margin: 25px 0;"><h2 style="${base} font-size: 20px; color: ${primaryColor}; margin: 0;">${text}</h2></section>`;
      }
      return `<h3 style="${base} font-size: 18px; color: ${primaryColor}; display: flex; align-items: center;"><span style="color: ${primaryColor}88; margin-right: 8px;">#</span>${text}</h3>`;
    };

    html = html.replace(/^# (.*$)/gim, (_, text) => getHeadingStyle(1, text));
    html = html.replace(/^## (.*$)/gim, (_, text) => getHeadingStyle(2, text));
    html = html.replace(/^### (.*$)/gim, (_, text) => getHeadingStyle(3, text));
    html = html.replace(/\*\*(.*?)\*\*/gim, `<strong style="color: ${primaryColor}; font-weight: bold;">$1</strong>`);
    html = html.replace(/^> (.*$)/gim, (_, text) => `<blockquote style="margin: 35px 0; padding: 25px; border-left: 4px solid ${primaryColor}66; background: ${primaryColor}08; color: ${textColor}cc;">${text}</blockquote>`);
    
    const parts = html.split('\n\n');
    html = parts.map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<section') || trimmed.startsWith('<blockquote')) return trimmed;
        return `<p style="margin: 1.8em 0; line-height: 1.8; color: ${textColor}; font-size: 16px; letter-spacing: 0.6px; text-align: justify; font-family: ${fontFamily};">${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    const leadInHTML = renderGuide(leadIn, leadInStyle, true);
    const outroHTML = renderGuide(outro, outroStyle, false);

    return `${leadInHTML}${html}${outroHTML}`;
  }, [content, leadIn, outro, leadInStyle, outroStyle, theme]);

  const outerWrapperStyle = useMemo(() => {
    let style = `background-color: ${theme.bgColor}; padding: 40px 20px; font-family: ${theme.fontFamily}; color: ${theme.textColor}; box-sizing: border-box; min-height: 100%;`;
    if (theme.containerStyle) style += theme.containerStyle;
    return style;
  }, [theme]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 border border-slate-200 rounded-xl shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 max-w-[450px] mx-auto w-full transition-all duration-300 bg-slate-300">
        <section id="wechat-copy-final-target" style={parseInlineStyle(outerWrapperStyle) as any}>
            <div ref={previewRef} className="wechat-editor-preview" dangerouslySetInnerHTML={{ __html: parsedHTML }} />
        </section>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-5 font-black uppercase tracking-[0.2em] shrink-0">一键复制 • 完美适配微信</p>
    </div>
  );
};

function parseInlineStyle(styleStr: string) {
    const obj: any = {};
    styleStr.split(';').forEach(style => {
        const [k, v] = style.split(':');
        if (k && v) {
            const camelK = k.trim().replace(/-./g, x => x[1].toUpperCase());
            obj[camelK] = v.trim();
        }
    });
    return obj;
}

export default Preview;
