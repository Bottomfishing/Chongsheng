const PORTRAIT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

/** 根据配置路径生成可尝试的立绘 URL 列表（自动匹配常见图片格式） */
export function getPortraitCandidates(portraitPath: string): string[] {
  const base = portraitPath.replace(/\.(png|jpe?g|webp)$/i, "");
  return PORTRAIT_EXTENSIONS.map((ext) => `${base}${ext}`);
}
